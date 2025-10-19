'use client'

import { useState } from 'react'
import { useYouTube } from '@/hooks/useYouTube'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, XCircle, ExternalLink, Eye, ThumbsUp, MessageCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface VideoVerificationProps {
  onVideoVerified?: (video: any) => void
  onError?: (error: string) => void
}

export function VideoVerification({ onVideoVerified, onError }: VideoVerificationProps) {
  const [videoUrl, setVideoUrl] = useState('')
  const [verifiedVideo, setVerifiedVideo] = useState<any>(null)
  const { verifyVideo, loading, error } = useYouTube()

  const handleVerify = async () => {
    if (!videoUrl.trim()) return

    const result = await verifyVideo(videoUrl)
    
    if (result.success && result.video) {
      setVerifiedVideo(result)
      onVideoVerified?.(result.video)
    } else {
      onError?.(result.error || 'Failed to verify video')
    }
  }

  const handleReset = () => {
    setVideoUrl('')
    setVerifiedVideo(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Verify YouTube Video</CardTitle>
          <CardDescription>
            Enter the YouTube URL of the video you want to submit. Only videos from your connected YouTube channel are allowed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              disabled={loading}
            />
            <Button 
              onClick={handleVerify} 
              disabled={loading || !videoUrl.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify'
              )}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {verifiedVideo && verifiedVideo.alreadySubmitted && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                This video has already been submitted to {verifiedVideo.submittedTo.creatorName} 
                ({verifiedVideo.submittedTo.status}) {formatDistanceToNow(new Date(verifiedVideo.submittedTo.submittedAt), { addSuffix: true })}.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {verifiedVideo && verifiedVideo.video && !verifiedVideo.alreadySubmitted && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Video Verified</span>
            </CardTitle>
            <CardDescription>
              This video is ready for submission
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex space-x-4">
                <img
                  src={verifiedVideo.video.thumbnail}
                  alt={verifiedVideo.video.title}
                  className="w-32 h-20 object-cover rounded-lg"
                />
                <div className="flex-1 space-y-2">
                  <h3 className="font-medium text-lg line-clamp-2">
                    {verifiedVideo.video.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {verifiedVideo.video.channelTitle}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{verifiedVideo.video.viewCount.toLocaleString()} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{verifiedVideo.video.likeCount.toLocaleString()} likes</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4" />
                      <span>{verifiedVideo.video.commentCount.toLocaleString()} comments</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">
                      Published {formatDistanceToNow(new Date(verifiedVideo.video.publishedAt), { addSuffix: true })}
                    </Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <a
                        href={`https://youtube.com/watch?v=${verifiedVideo.video.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Watch on YouTube
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={handleReset} variant="outline">
                  Verify Another Video
                </Button>
                <Button>
                  Continue with Submission
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
