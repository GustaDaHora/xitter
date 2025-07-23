import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '100')
  const offset = parseInt(searchParams.get('offset') || '0')

  try {
    const leaderboard = await prisma.user.findMany({
      where: {
        iqScore: {
          not: null, // Only include users who have taken the IQ test
        },
      },
      orderBy: {
        iqScore: 'desc',
      },
      take: limit,
      skip: offset,
      select: {
        id: true,
        name: true,
        username: true,
        iqScore: true,
        image: true,
      },
    })

    const totalUsers = await prisma.user.count({
      where: {
        iqScore: {
          not: null,
        },
      },
    })

    return NextResponse.json({
      leaderboard,
      totalUsers,
      limit,
      offset,
    })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}
