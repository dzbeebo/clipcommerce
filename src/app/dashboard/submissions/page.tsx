'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { usePayments } from '@/hooks/usePayments'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle, XCircle, Clock, DollarSign, Eye, ThumbsUp, MessageCircle, ExternalLink, AlertTriangle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Submission {
  id: string
  youtubeVideoId: string
  videoTitle: string
  videoThumbnail: string
  videoUrl: string
  videoPublishedAt: string
  viewsAtSubmit: number
  viewsCurrent: number
  status: string
  submittedAt: string
  reviewedAt?: string
  paymentAmount?: number
  platformFee?: number
  clipperNet?: number
  rejectionReason?: string
  creator: {
    id: string
    displayName: string
    slug: string
    avatarUrl?: string
  }
  clipper: {
    id: string
    displayName: string
    avatarUrl?: string
  }
}

export default function SubmissionsPage() {
  const { user } = useAuth()
  const { processPayment, loading: paymentLoading } = usePayments()
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (user) {
      fetchSubmissions()
    }
  }, [user])

  const fetchSubmissions = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/submissions')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch submissions')
      }

      setSubmissions(data.submissions || [])

    } catch (err) {
      console.error('Error fetching submissions:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (submissionId: string) => {
    try {
      setActionLoading(true)

      const response = await fetch(`/api/submissions/${submissionId}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve submission')
      }

      // Update local state
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === submissionId 
            ? { ...sub, status: 'APPROVED', reviewedAt: new Date().toISOString() }
            : sub
        )
      )

    } catch (err) {
      console.error('Error approving submission:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!selectedSubmission || !rejectionReason.trim()) return

    try {
      setActionLoading(true)

      const response = await fetch(`/api/submissions/${selectedSubmission.id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rejectionReason: rejectionReason.trim() }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reject submission')
      }

      // Update local state
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === selectedSubmission.id 
            ? { 
                ...sub, 
                status: 'REJECTED', 
                reviewedAt: new Date().toISOString(),
                rejectionReason: rejectionReason.trim()
              }
            : sub
        )
      )

      setShowRejectDialog(false)
      setRejectionReason('')
      setSelectedSubmission(null)

    } catch (err) {
      console.error('Error rejecting submission:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setActionLoading(false)
    }
  }

  const handleProcessPayment = async (submissionId: string) => {
    try {
      setActionLoading(true)

      const result = await processPayment(submissionId)

      if (result.success) {
        // Update local state
        setSubmissions(prev => 
          prev.map(sub => 
            sub.id === submissionId 
              ? { ...sub, status: 'PAID' }
              : sub
          )
        )
      } else {
        setError(result.error || 'Failed to process payment')
      }

    } catch (err) {
      console.error('Error processing payment:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'PAID':
        return <DollarSign className="h-4 w-4 text-green-600" />
      case 'PAYMENT_FAILED':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'APPROVED':
        return 'bg-green-100 text-green-800'
      case 'REJECTED':
        return 'bg-red-100 text-red-800'
      case 'PAID':
        return 'bg-green-100 text-green-800'
      case 'PAYMENT_FAILED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading submissions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={fetchSubmissions}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Clip Submissions</h1>
              <p className="text-gray-600">Review and manage clip submissions from your clippers</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {submissions.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {submissions.map((submission) => (
              <Card key={submission.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={submission.videoThumbnail}
                    alt={submission.videoTitle}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className={getStatusColor(submission.status)}>
                      {getStatusIcon(submission.status)}
                      <span className="ml-1">{submission.status}</span>
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-medium text-lg line-clamp-2 mb-2">
                    {submission.videoTitle}
                  </h3>
                  
                  <div className="flex items-center space-x-2 mb-3">
                    {submission.clipper.avatarUrl ? (
                      <img
                        src={submission.clipper.avatarUrl}
                        alt={submission.clipper.displayName}
                        className="h-6 w-6 rounded-full"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                        <span className="text-green-600 font-bold text-xs">
                          {submission.clipper.displayName.charAt(0)}
                        </span>
                      </div>
                    )}
                    <span className="text-sm text-gray-600">
                      by {submission.clipper.displayName}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Views at submit:</span>
                      <span className="font-medium">{submission.viewsAtSubmit.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Current views:</span>
                      <span className="font-medium">{submission.viewsCurrent.toLocaleString()}</span>
                    </div>
                    {submission.paymentAmount && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Payment:</span>
                        <span className="font-medium text-green-600">
                          ${submission.paymentAmount.toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Submitted:</span>
                      <span className="font-medium">
                        {formatDistanceToNow(new Date(submission.submittedAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>

                  {submission.rejectionReason && (
                    <Alert className="mb-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription className="text-sm">
                        <strong>Rejection reason:</strong> {submission.rejectionReason}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="flex-1"
                    >
                      <a
                        href={submission.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Watch
                      </a>
                    </Button>
                    
                    {submission.status === 'PENDING' && (
                      <>
                        <Button
                          onClick={() => handleApprove(submission.id)}
                          disabled={actionLoading}
                          size="sm"
                          className="flex-1"
                        >
                          {actionLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            'Approve'
                          )}
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedSubmission(submission)
                            setShowRejectDialog(true)
                          }}
                          disabled={actionLoading}
                          variant="destructive"
                          size="sm"
                          className="flex-1"
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    
                    {submission.status === 'APPROVED' && (
                      <Button
                        onClick={() => handleProcessPayment(submission.id)}
                        disabled={actionLoading || paymentLoading}
                        size="sm"
                        className="flex-1"
                      >
                        {actionLoading || paymentLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <DollarSign className="h-4 w-4 mr-1" />
                            Pay
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
              <p className="text-gray-500">
                Submissions from your clippers will appear here for review
              </p>
            </CardContent>
          </Card>
        )}

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Submission</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this clip. This will help the clipper improve their future submissions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Rejection Reason</label>
                <Textarea
                  placeholder="Explain why this clip was rejected..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="mt-1"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectDialog(false)
                  setRejectionReason('')
                  setSelectedSubmission(null)
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleReject}
                disabled={actionLoading || !rejectionReason.trim()}
                variant="destructive"
              >
                {actionLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Reject Submission
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
