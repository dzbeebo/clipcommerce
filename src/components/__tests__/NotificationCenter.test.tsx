import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { NotificationCenter } from '../NotificationCenter'

// Mock the useNotifications hook
const mockUseNotifications = {
  notifications: [
    {
      id: '1',
      type: 'SUBMISSION_APPROVED',
      title: 'Submission Approved!',
      message: 'Your submission has been approved and you\'ve earned $25.50.',
      actionUrl: '/dashboard/submissions/1',
      read: false,
      createdAt: new Date('2024-01-01T10:00:00Z'),
    },
    {
      id: '2',
      type: 'PAYMENT_RECEIVED',
      title: 'Payment Received!',
      message: 'You\'ve received a payment of $50.00.',
      actionUrl: '/dashboard/earnings',
      read: true,
      createdAt: new Date('2024-01-01T09:00:00Z'),
    },
  ],
  unreadCount: 1,
  markAsRead: jest.fn(),
  markAllAsRead: jest.fn(),
  isLoading: false,
  error: null,
}

jest.mock('@/hooks/useNotifications', () => ({
  useNotifications: () => mockUseNotifications,
}))

// Mock date-fns
jest.mock('date-fns', () => ({
  formatDistanceToNow: jest.fn(() => '2 hours ago'),
}))

describe('NotificationCenter', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders notification bell icon', () => {
    render(<NotificationCenter userId="123" />)
    
    const bellIcon = screen.getByRole('button', { name: /notifications/i })
    expect(bellIcon).toBeInTheDocument()
  })

  it('shows unread count badge', () => {
    render(<NotificationCenter userId="123" />)
    
    const badge = screen.getByText('1')
    expect(badge).toBeInTheDocument()
  })

  it('opens notification panel when clicked', () => {
    render(<NotificationCenter userId="123" />)
    
    const button = screen.getByRole('button', { name: /notifications/i })
    fireEvent.click(button)
    
    expect(screen.getByText('Notifications')).toBeInTheDocument()
  })

  it('displays notifications when panel is open', () => {
    render(<NotificationCenter userId="123" />)
    
    const button = screen.getByRole('button', { name: /notifications/i })
    fireEvent.click(button)
    
    expect(screen.getByText('Submission Approved!')).toBeInTheDocument()
    expect(screen.getByText('Payment Received!')).toBeInTheDocument()
  })

  it('shows mark all as read button when there are unread notifications', () => {
    render(<NotificationCenter userId="123" />)
    
    const button = screen.getByRole('button', { name: /notifications/i })
    fireEvent.click(button)
    
    const markAllButton = screen.getByText('Mark all read')
    expect(markAllButton).toBeInTheDocument()
  })

  it('calls markAllAsRead when mark all button is clicked', () => {
    render(<NotificationCenter userId="123" />)
    
    const button = screen.getByRole('button', { name: /notifications/i })
    fireEvent.click(button)
    
    const markAllButton = screen.getByText('Mark all read')
    fireEvent.click(markAllButton)
    
    expect(mockUseNotifications.markAllAsRead).toHaveBeenCalled()
  })

  it('calls markAsRead when notification is clicked', () => {
    render(<NotificationCenter userId="123" />)
    
    const button = screen.getByRole('button', { name: /notifications/i })
    fireEvent.click(button)
    
    const notification = screen.getByText('Submission Approved!')
    fireEvent.click(notification)
    
    expect(mockUseNotifications.markAsRead).toHaveBeenCalledWith('1')
  })

  it('shows loading state', () => {
    const loadingMock = {
      ...mockUseNotifications,
      isLoading: true,
      notifications: [],
    }

    jest.doMock('@/hooks/useNotifications', () => ({
      useNotifications: () => loadingMock,
    }))

    render(<NotificationCenter userId="123" />)
    
    const button = screen.getByRole('button', { name: /notifications/i })
    fireEvent.click(button)
    
    expect(screen.getByText('Loading analytics...')).toBeInTheDocument()
  })

  it('shows empty state when no notifications', () => {
    const emptyMock = {
      ...mockUseNotifications,
      notifications: [],
      unreadCount: 0,
    }

    jest.doMock('@/hooks/useNotifications', () => ({
      useNotifications: () => emptyMock,
    }))

    render(<NotificationCenter userId="123" />)
    
    const button = screen.getByRole('button', { name: /notifications/i })
    fireEvent.click(button)
    
    expect(screen.getByText('No notifications yet')).toBeInTheDocument()
  })

  it('closes panel when clicking outside', () => {
    render(<NotificationCenter userId="123" />)
    
    const button = screen.getByRole('button', { name: /notifications/i })
    fireEvent.click(button)
    
    expect(screen.getByText('Notifications')).toBeInTheDocument()
    
    // Click outside
    const overlay = document.querySelector('.fixed.inset-0')
    if (overlay) {
      fireEvent.click(overlay)
    }
    
    // Panel should be closed (not visible)
    expect(screen.queryByText('Notifications')).not.toBeInTheDocument()
  })
})
