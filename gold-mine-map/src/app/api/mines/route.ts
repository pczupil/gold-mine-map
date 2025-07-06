import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/mines - Get all mines
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const country = searchParams.get('country')
    const status = searchParams.get('status')

    const where: any = {}
    
    if (type && type !== 'all') {
      where.type = type
    }
    if (country) {
      where.country = country
    }
    if (status) {
      where.status = status
    }

    const mines = await prisma.mine.findMany({
      where,
      include: {
        mineDetails: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(mines)
  } catch (error) {
    console.error("Error fetching mines:", error)
    return NextResponse.json(
      { error: "Failed to fetch mines" },
      { status: 500 }
    )
  }
}

// POST /api/mines - Create a new mine
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const userId = (session.user as any).id
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const {
      name,
      type,
      latitude,
      longitude,
      country,
      region,
      production,
      status,
      description,
      website
    } = await request.json()

    if (!name || !type || !latitude || !longitude || !country) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const mine = await prisma.mine.create({
      data: {
        name,
        type,
        latitude,
        longitude,
        country,
        region,
        production,
        status: status || 'Active',
        description,
        website,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(mine, { status: 201 })
  } catch (error) {
    console.error("Error creating mine:", error)
    return NextResponse.json(
      { error: "Failed to create mine" },
      { status: 500 }
    )
  }
} 