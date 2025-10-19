'use client'

import { useState, useEffect } from 'react'
import { useYouTube } from '@/hooks/useYouTube'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, XCircle, ExternalLink, Eye, ThumbsUp, MessageCircle, DollarSign } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Creator {
  id: string
  displayName: string
  slug: string
  avatarUrl?: string
  rateAmount: number
  rateViews: number
}

interface SubmissionFormProps {
  creators: Creator[]
  onSubmissionCreated?: (submission: any) => void
}

export function SubmissionForm({ creators, onSubmissionCreated }: SubmissionFormProps) {
  const [selectedCreator, setSelectedCreator] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [verifiedVideo, setVerifiedVideo] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  
  const { verifyVideo, loading: verifying, error: verifyError } = useYouTube()

  const handleVerify = async () => {
    if (!videoUrl.trim()) return

    const result = await verifyVideo(videoUrl)
    
    if (result.success && result.video && !result.alreadySubmitted) {
      setVerifiedVideo(result)
    } else if (result.alreadySubmitted) {
      setSubmitError(`This video has already been submitted to ${result.submittedTo.creatorName}`)
    } else {
      setSubmitError(result.error || 'Failed to verify video')
    }
  }

  const handleSubmit = async () => {
    if (!selectedCreator || !verifiedVideo) return

    try {
      setSubmitting(true)
      setSubmitError(null)

      const response = await fetch('/api/submissions/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creatorId: selectedCreator,
          videoUrl: videoUrl,
          videoId: verifiedVideo.video.id
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit clip')
      }

      setSubmitSuccess(true)
      onSubmissionCreated?.(data.submission)
      
      // Reset form
      setTimeout(() => {
        setVideoUrl('')
        setVerifiedVideo(null)
        setSelectedCreator('')
        setSubmitSuccess(false)
      }, 3000)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setSubmitError(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setVideoUrl('')
    setVerifiedVideo(null)
    setSubmitError(null)
    setSubmitSuccess(false)
  }

  const selectedCreatorData = creators.find(c => c.id === selectedCreator)
  const estimatedPayment = selectedCreatorData && verifiedVideo 
    ? (verifiedVideo.video.viewCount / selectedCreatorData.rateViews) * selectedCreatorData.rateAmount
    : 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Submit a Clip</CardTitle>
          <CardDescription>
            Choose a creator and submit your YouTube video for review
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Creator Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Creator</label>
            <Select value={selectedCreator} onValueChange={setSelectedCreator}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a creator to submit to" />
              </SelectTrigger>
              <SelectContent>
                {creators.map((creator) => (
                  <SelectItem key={creator.id} value={creator.id}>
                    <div className="flex items-center space-x-2">
                      {creator.avatarUrl ? (
                        <img
                          src={creator.avatarUrl}
                          alt={creator.displayName}
                          className="h-6 w-6 rounded-full"
                        />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-xs">
                            {creator.displayName.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{creator.displayName}</div>
                        <div className="text-xs text-gray-500">
                          ${creator.rateAmount} per {creator.rateViews.toLocaleString()} views
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Video URL Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">YouTube Video URL</label>
            <div className="flex space-x-2">
              <Input
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                disabled={verifying || submitting}
              />
              <Button 
                onClick={handleVerify} 
                disabled={verifying || !videoUrl.trim() || !selectedCreator}
              >
                {verifying ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify'
                )}
              </Button>
            </div>
          </div>

          {/* Error Messages */}
          {(verifyError || submitError) && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{verifyError || submitError}</AlertDescription>
            </Alert>
          )}

          {/* Success Message */}
          {submitSuccess && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Clip submitted successfully! The creator will review it soon.
              </AlertDescription>
            </Alert>
          )}

          {/* Verified Video Display */}
          {verifiedVideo && verifiedVideo.video && !verifiedVideo.alreadySubmitted && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Video Verified</span>
                </CardTitle>
                <CardDescription>
                  Ready for submission to {selectedCreatorData?.displayName}
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
                        <span className="text-sm text-gray-500">
                          Published {formatDistanceToNow(new Date(verifiedVideo.video.publishedAt), { addSuffix: true })}
                        </span>
                        <Button variant="ghost" size="sm" asChild>
                          <a
                            href={`https://youtube.com/watch?v=${verifiedVideo.video.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Watch
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Payment Estimate */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Estimated Payment</p>
                        <p className="text-xs text-gray-500">
                          Based on current views and creator's rate
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          ${estimatedPayment.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {verifiedVideo.video.viewCount.toLocaleString()} views × ${selectedCreatorData?.rateAmount} per {selectedCreatorData?.rateViews.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button onClick={handleReset} variant="outline">
                      Start Over
                    </Button>
                    <Button 
                      onClick={handleSubmit} 
                      disabled={submitting}
                      className="flex-1"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <DollarSign className="h-4 w-4 mr-2" />
                          Submit for ${estimatedPayment.toFixed(2)}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
