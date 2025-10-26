'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { SubmissionForm } from '@/components/SubmissionForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Sidebar } from '@/components/layout/Sidebar'
import { PageLoading } from '@/components/ui/loading'
import { Loader2, CheckCircle, Clock, XCircle, DollarSign, Eye } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Creator {
  id: string
  displayName: string
  slug: string
  avatarUrl?: string
  rateAmount: number
  rateViews: number
}

interface Submission {
  id: string
  videoTitle: string
  videoThumbnail: string
  videoUrl: string
  viewsAtSubmit: number
  viewsCurrent: number
  status: string
  submittedAt: string
  reviewedAt?: string
  paymentAmount?: number
  rejectionReason?: string
  creator: {
    id: string
    displayName: string
    slug: string
    avatarUrl?: string
  }
}

function SubmitClipContent() {
  const { user } = useAuth()
  const [creators, setCreators] = useState<Creator[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch creators and submissions in parallel
      const [creatorsRes, submissionsRes] = await Promise.all([
        fetch('/api/creators'),
        fetch('/api/submissions')
      ])

      if (!creatorsRes.ok || !submissionsRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const [creatorsData, submissionsData] = await Promise.all([
        creatorsRes.json(),
        submissionsRes.json()
      ])

      setCreators(creatorsData.creators || [])
      setSubmissions(submissionsData.submissions || [])

    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmissionCreated = (submission: Submission) => {
    setSubmissions(prev => [submission, ...prev])
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

  if (loading) {
    return (
      <Sidebar>
        <div className="flex items-center justify-center h-full">
          <PageLoading message="Loading submission page..." />
        </div>
      </Sidebar>
    )
  }

  if (error) {
    return (
      <Sidebar>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">Error: {error}</p>
            <Button onClick={fetchData}>Try Again</Button>
          </div>
        </div>
      </Sidebar>
    )
  }

  return (
    <Sidebar>
      <div className="p-6">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Submit Clips</h1>
          <p className="text-text-secondary text-lg">Submit your YouTube videos to creators for payment</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submission Form */}
          <div className="lg:col-span-2">
            <SubmissionForm 
              creators={creators} 
              onSubmissionCreated={handleSubmissionCreated}
            />
          </div>

          {/* Recent Submissions */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Recent Submissions</CardTitle>
                <CardDescription>
                  Your latest clip submissions and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submissions.length > 0 ? (
                  <div className="space-y-4">
                    {submissions.slice(0, 5).map((submission) => (
                      <div key={submission.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                        <img
                          src={submission.videoThumbnail}
                          alt={submission.videoTitle}
                          className="w-12 h-8 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">
                            {submission.videoTitle}
                          </p>
                          <p className="text-xs text-text-secondary">
                            to {submission.creator.displayName}
                          </p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className={getStatusColor(submission.status)}>
                              {getStatusIcon(submission.status)}
                              <span className="ml-1">{submission.status}</span>
                            </Badge>
                            {submission.paymentAmount && (
                              <span className="text-xs text-green-600 font-medium">
                                ${submission.paymentAmount.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-text-secondary">
                            {formatDistanceToNow(new Date(submission.submittedAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-text-secondary">
                    <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No submissions yet</p>
                    <p className="text-sm">Submit your first clip above</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Available Creators */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Available Creators</CardTitle>
                <CardDescription>
                  Creators you can submit clips to
                </CardDescription>
              </CardHeader>
              <CardContent>
                {creators.length > 0 ? (
                  <div className="space-y-3">
                    {creators.map((creator) => (
                      <div key={creator.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                        {creator.avatarUrl ? (
                          <img
                            src={creator.avatarUrl}
                            alt={creator.displayName}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
                            <span className="text-secondary font-bold text-sm">
                              {creator.displayName.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary">{creator.displayName}</p>
                          <p className="text-xs text-text-secondary">
                            ${creator.rateAmount} per {creator.rateViews.toLocaleString()} views
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-text-secondary">
                    <p className="text-sm">No creators available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Sidebar>
  )
}

export default function SubmitClipPage() {
  return <SubmitClipContent />
}
