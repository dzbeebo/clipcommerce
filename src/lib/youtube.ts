import { google } from 'googleapis'

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
})

// Get video metadata
export async function getVideoMetadata(videoId: string) {
  try {
    const response = await youtube.videos.list({
      part: ['snippet', 'statistics'],
      id: [videoId],
    })

    const video = response.data.items?.[0]
    if (!video) {
      throw new Error('Video not found')
    }

    return {
      id: video.id!,
      title: video.snippet?.title!,
      description: video.snippet?.description,
      thumbnail: video.snippet?.thumbnails?.high?.url!,
      channelId: video.snippet?.channelId!,
      channelTitle: video.snippet?.channelTitle!,
      publishedAt: video.snippet?.publishedAt!,
      viewCount: parseInt(video.statistics?.viewCount || '0'),
      likeCount: parseInt(video.statistics?.likeCount || '0'),
      commentCount: parseInt(video.statistics?.commentCount || '0'),
    }
  } catch (error) {
    console.error('Error fetching video metadata:', error)
    throw new Error('Failed to fetch video metadata')
  }
}

// Get channel information
export async function getChannelInfo(channelId: string) {
  try {
    const response = await youtube.channels.list({
      part: ['snippet', 'statistics'],
      id: [channelId],
    })

    const channel = response.data.items?.[0]
    if (!channel) {
      throw new Error('Channel not found')
    }

    return {
      id: channel.id!,
      title: channel.snippet?.title!,
      description: channel.snippet?.description,
      thumbnail: channel.snippet?.thumbnails?.default?.url!,
      subscriberCount: parseInt(channel.statistics?.subscriberCount || '0'),
      videoCount: parseInt(channel.statistics?.videoCount || '0'),
      viewCount: parseInt(channel.statistics?.viewCount || '0'),
    }
  } catch (error) {
    console.error('Error fetching channel info:', error)
    throw new Error('Failed to fetch channel information')
  }
}

// Verify video ownership
export async function verifyVideoOwnership(videoId: string, expectedChannelId: string) {
  try {
    const videoMetadata = await getVideoMetadata(videoId)
    return videoMetadata.channelId === expectedChannelId
  } catch (error) {
    console.error('Error verifying video ownership:', error)
    return false
  }
}

// Extract video ID from YouTube URL
export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return null
}
