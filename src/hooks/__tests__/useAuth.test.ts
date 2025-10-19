import { renderHook, act } from '@testing-library/react'
import { useAuth } from '../useAuth'

// Mock the Supabase client
const mockSupabase = {
  auth: {
    getUser: jest.fn(),
    signOut: jest.fn(),
  },
}

jest.mock('@/lib/supabase', () => ({
  createClient: () => mockSupabase,
}))

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return loading state initially', () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })

    const { result } = renderHook(() => useAuth())

    expect(result.current.isLoading).toBe(true)
    expect(result.current.user).toBeNull()
  })

  it('should return user when authenticated', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      role: 'CREATOR',
    }

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      // Wait for the effect to complete
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.user).toEqual(mockUser)
  })

  it('should return null user when not authenticated', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      // Wait for the effect to complete
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.user).toBeNull()
  })

  it('should handle logout', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      role: 'CREATOR',
    }

    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null,
    })

    mockSupabase.auth.signOut.mockResolvedValue({
      error: null,
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      // Wait for initial load
    })

    expect(result.current.user).toEqual(mockUser)

    await act(async () => {
      result.current.logout()
    })

    expect(mockSupabase.auth.signOut).toHaveBeenCalled()
  })

  it('should handle authentication errors', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: new Error('Authentication failed'),
    })

    const { result } = renderHook(() => useAuth())

    await act(async () => {
      // Wait for the effect to complete
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.user).toBeNull()
  })
})
