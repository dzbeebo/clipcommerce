import { NextRequest } from 'next/server'
import { GET } from '../route'
import { createClient } from '@/lib/supabase'
import { prisma } from '@/lib/prisma'

// Mock the dependencies
jest.mock('@/lib/supabase')
jest.mock('@/lib/prisma', () => ({
  prisma: {
    creatorProfile: {
      findUnique: jest.fn(),
    },
  },
}))

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>
const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe('/api/analytics/creator', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return analytics data for authenticated creator', async () => {
    const mockUser = {
      id: 'user123',
      email: 'creator@example.com',
    }

    const mockCreatorProfile = {
      id: 'creator123',
      userId: 'user123',
      displayName: 'Test Creator',
      clippers: [
        {
          status: 'ACTIVE',
          clipper: {
            id: 'clipper1',
            displayName: 'Clipper 1',
          },
        },
        {
          status: 'ACTIVE',
          clipper: {
            id: 'clipper2',
            displayName: 'Clipper 2',
          },
        },
      ],
      submissions: [
        {
          id: 'sub1',
          status: 'PAID',
          paymentAmount: 25.50,
          submittedAt: new Date('2024-01-01'),
          paidAt: new Date('2024-01-02'),
          clipper: {
            displayName: 'Clipper 1',
          },
        },
        {
          id: 'sub2',
          status: 'PENDING',
          paymentAmount: null,
          submittedAt: new Date('2024-01-15'),
          paidAt: null,
          clipper: {
            displayName: 'Clipper 2',
          },
        },
      ],
    }

    mockCreateClient.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
    } as any)

    mockPrisma.creatorProfile.findUnique.mockResolvedValue(mockCreatorProfile as any)

    const request = new NextRequest('http://localhost:3000/api/analytics/creator')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.overview.totalClippers).toBe(2)
    expect(data.overview.totalSubmissions).toBe(2)
    expect(data.overview.totalPaidOut).toBe(25.50)
    expect(data.submissionStatusBreakdown.pending).toBe(1)
    expect(data.submissionStatusBreakdown.paid).toBe(1)
  })

  it('should return 401 for unauthenticated user', async () => {
    mockCreateClient.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: null },
          error: new Error('Unauthorized'),
        }),
      },
    } as any)

    const request = new NextRequest('http://localhost:3000/api/analytics/creator')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Unauthorized')
  })

  it('should return 404 when creator profile not found', async () => {
    const mockUser = {
      id: 'user123',
      email: 'creator@example.com',
    }

    mockCreateClient.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
    } as any)

    mockPrisma.creatorProfile.findUnique.mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/analytics/creator')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Creator profile not found')
  })

  it('should handle database errors', async () => {
    const mockUser = {
      id: 'user123',
      email: 'creator@example.com',
    }

    mockCreateClient.mockReturnValue({
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: mockUser },
          error: null,
        }),
      },
    } as any)

    mockPrisma.creatorProfile.findUnique.mockRejectedValue(new Error('Database error'))

    const request = new NextRequest('http://localhost:3000/api/analytics/creator')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to fetch analytics')
  })
})
