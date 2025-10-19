import { NextRequest, NextResponse } from 'next/server'
import { getVideoMetadata } from '@/lib/youtube'
import { requireAuth } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    if (user.role !== 'CLIPPER') {
      return NextResponse.json({ error: 'Only clippers can get video stats' }, { status: 403 })
    }

    const { videoId } = await request.json()

    if (!videoId) {
      return NextResponse.json({ error: 'Video ID is required' }, { status: 400 })
    }

    // Get current video metadata including view count
    const videoMetadata = await getVideoMetadata(videoId)

    return NextResponse.json({
      success: true,
      stats: {
        viewCount: videoMetadata.viewCount,
        likeCount: videoMetadata.likeCount,
        commentCount: videoMetadata.commentCount,
        publishedAt: videoMetadata.publishedAt,
        title: videoMetadata.title,
        thumbnail: videoMetadata.thumbnail
      }
    })

  } catch (error) {
    console.error('Error getting video stats:', error)
    
    if (error instanceof Error) {
      if (error.message.includes('Video not found')) {
        return NextResponse.json({ error: 'Video not found or is private' }, { status: 404 })
      }
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
