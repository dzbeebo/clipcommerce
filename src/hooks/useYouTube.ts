import { useState } from 'react'

interface VideoMetadata {
  id: string
  title: string
  description?: string
  thumbnail: string
  channelId: string
  channelTitle: string
  publishedAt: string
  viewCount: number
  likeCount: number
  commentCount: number
}

interface VideoStats {
  viewCount: number
  likeCount: number
  commentCount: number
  publishedAt: string
  title: string
  thumbnail: string
}

interface VerifyVideoResponse {
  success: boolean
  video?: VideoMetadata
  alreadySubmitted?: boolean
  submittedTo?: {
    creatorName: string
    creatorSlug: string
    status: string
    submittedAt: string
  }
  error?: string
}

interface VideoStatsResponse {
  success: boolean
  stats?: VideoStats
  error?: string
}

export function useYouTube() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const verifyVideo = async (videoUrl: string): Promise<VerifyVideoResponse> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/youtube/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify video')
      }

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const getVideoStats = async (videoId: string): Promise<VideoStatsResponse> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/youtube/stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get video stats')
      }

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  return {
    verifyVideo,
    getVideoStats,
    loading,
    error
  }
}
