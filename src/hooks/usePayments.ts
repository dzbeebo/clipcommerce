import { useState } from 'react'

interface Transaction {
  id: string
  amount: number
  platformFee: number
  clipperNet: number
  status: string
  currency: string
  createdAt: string
  completedAt?: string
  failureReason?: string
  submission: {
    id: string
    videoTitle: string
    videoThumbnail: string
    viewsCurrent: number
    creator: {
      displayName: string
      slug: string
    }
    clipper: {
      displayName: string
    }
  }
}

interface PaymentHistoryResponse {
  transactions: Transaction[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
  summary: {
    totalTransactions: number
    totalAmount: number
    totalPlatformFee: number
    totalClipperNet: number
  }
}

interface ProcessPaymentResponse {
  success: boolean
  transaction?: {
    id: string
    amount: number
    platformFee: number
    clipperNet: number
    status: string
    stripeTransferId: string
  }
  error?: string
}

export function usePayments() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processPayment = async (submissionId: string): Promise<ProcessPaymentResponse> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/payments/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ submissionId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process payment')
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

  const getPaymentHistory = async (params?: {
    page?: number
    limit?: number
    status?: string
  }): Promise<PaymentHistoryResponse | null> => {
    try {
      setLoading(true)
      setError(null)

      const searchParams = new URLSearchParams()
      if (params?.page) searchParams.set('page', params.page.toString())
      if (params?.limit) searchParams.set('limit', params.limit.toString())
      if (params?.status) searchParams.set('status', params.status)

      const response = await fetch(`/api/payments/history?${searchParams.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch payment history')
      }

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    processPayment,
    getPaymentHistory,
    loading,
    error
  }
}
