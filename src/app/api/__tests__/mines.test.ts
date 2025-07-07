import { NextRequest } from 'next/server'
import { GET, POST } from '../mines/route'
import { createMockMine } from '@/__tests__/utils/test-utils'

// Mock Prisma
const mockPrisma = {
  mine: {
    findMany: jest.fn(),
    create: jest.fn(),
  },
  user: {
    findUnique: jest.fn(),
  },
}

jest.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
}))

// Mock NextAuth
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}))

describe('Mines API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/mines', () => {
    it('returns all mines successfully', async () => {
      const mockMines = [
        createMockMine({ id: '1', name: 'Mine 1' }),
        createMockMine({ id: '2', name: 'Mine 2' }),
      ]

      mockPrisma.mine.findMany.mockResolvedValue(mockMines)

      const request = new NextRequest('http://localhost:3000/api/mines')
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockMines)
      expect(mockPrisma.mine.findMany).toHaveBeenCalledWith({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    })

    it('handles database errors gracefully', async () => {
      mockPrisma.mine.findMany.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/mines')
      const response = await GET(request)

      expect(response.status).toBe(500)
    })
  })

  describe('POST /api/mines', () => {
    const mockSession = {
      user: {
        id: '1',
        email: 'test@example.com',
      },
    }

    beforeEach(() => {
      const { getServerSession } = require('next-auth')
      getServerSession.mockResolvedValue(mockSession)
    })

    it('creates a new mine successfully', async () => {
      const mineData = {
        name: 'New Mine',
        type: 'Gold',
        latitude: 40.7128,
        longitude: -74.0060,
        country: 'USA',
        region: 'New York',
        production: '1000 oz/year',
        status: 'Active',
        description: 'A new gold mine',
        website: 'https://example.com',
        photoUrls: ['https://example.com/photo1.jpg'],
      }

      const createdMine = {
        id: '1',
        ...mineData,
        userId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrisma.mine.create.mockResolvedValue(createdMine)

      const request = new NextRequest('http://localhost:3000/api/mines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mineData),
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual(createdMine)
      expect(mockPrisma.mine.create).toHaveBeenCalledWith({
        data: {
          ...mineData,
          userId: '1',
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })
    })

    it('returns 401 when user is not authenticated', async () => {
      const { getServerSession } = require('next-auth')
      getServerSession.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/mines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'Test Mine' }),
      })

      const response = await POST(request)

      expect(response.status).toBe(401)
    })

    it('validates required fields', async () => {
      const invalidData = {
        type: 'Gold',
        // Missing required fields like name, latitude, longitude, country
      }

      const request = new NextRequest('http://localhost:3000/api/mines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invalidData),
      })

      const response = await POST(request)

      expect(response.status).toBe(400)
    })

    it('handles database errors during creation', async () => {
      mockPrisma.mine.create.mockRejectedValue(new Error('Database error'))

      const mineData = {
        name: 'New Mine',
        type: 'Gold',
        latitude: 40.7128,
        longitude: -74.0060,
        country: 'USA',
        status: 'Active',
      }

      const request = new NextRequest('http://localhost:3000/api/mines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mineData),
      })

      const response = await POST(request)

      expect(response.status).toBe(500)
    })
  })
}) 