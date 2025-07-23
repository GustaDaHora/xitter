import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params
  const userId = session.user.id

  try {
    // Check if the user has already liked the post
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: id,
        },
      },
    })

    if (existingLike) {
      return NextResponse.json({ message: 'Post already liked' }, { status: 200 })
    }

    await prisma.like.create({
      data: {
        userId,
        postId: id,
      },
    })

    // Increment the likes count on the Post model
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        likes: {
          increment: 1,
        },
      },
    })

    return NextResponse.json({ message: 'Post liked successfully', likes: updatedPost.likes })
  } catch (error) {
    console.error('Error liking post:', error)
    return NextResponse.json(
      { error: 'Failed to like post' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = params
  const userId = session.user.id

  try {
    // Check if the user has liked the post
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId,
          postId: id,
        },
      },
    })

    if (!existingLike) {
      return NextResponse.json({ message: 'Post not liked' }, { status: 200 })
    }

    await prisma.like.delete({
      where: {
        userId_postId: {
          userId,
          postId: id,
        },
      },
    })

    // Decrement the likes count on the Post model
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        likes: {
          decrement: 1,
        },
      },
    })

    return NextResponse.json({ message: 'Post unliked successfully', likes: updatedPost.likes })
  } catch (error) {
    console.error('Error unliking post:', error)
    return NextResponse.json(
      { error: 'Failed to unlike post' },
      { status: 500 }
    )
  }
}
