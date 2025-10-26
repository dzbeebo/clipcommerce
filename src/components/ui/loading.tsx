'use client'

import { Loader2 } from 'lucide-react'
import { useState, useEffect } from 'react'

interface LoadingProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

// Logo-inspired loading animation component
function LogoLoader({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  }

  return (
    <div className={`${sizeClasses[size]} relative`}>
      {/* Main logo shape with gradient animation */}
      <div className="absolute inset-0">
        <svg 
          fill="none" 
          viewBox="0 0 48 48" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full animate-pulse"
        >
          <path 
            clipRule="evenodd" 
            d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" 
            fill="url(#gradient)" 
            fillRule="evenodd"
            className="animate-pulse"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5b13ec" />
              <stop offset="50%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#ff6b00" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* Rotating accent elements */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 bg-secondary rounded-full animate-spin" style={{ animationDuration: '1s' }} />
      </div>
      
      {/* Pulsing border */}
      <div className="absolute inset-0 rounded-lg border-2 border-primary/20 animate-ping" />
    </div>
  )
}

// Skeleton loading components for better UX
export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 w-4 bg-gray-200 rounded"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  )
}

export function SkeletonTable() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function Loading({ message = 'Loading...', size = 'md', className = '' }: LoadingProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center space-y-3">
        <LogoLoader size={size} />
        <p className="text-sm text-gray-600 animate-pulse">{message}</p>
      </div>
    </div>
  )
}

export function PageLoading({ message = 'Loading page...' }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LogoLoader size="lg" />
        <p className="mt-4 text-lg text-gray-600 animate-pulse">{message}</p>
        <div className="mt-6 flex justify-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  )
}

export function InlineLoading({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <Loading message={message} size="md" />
    </div>
  )
}

// Dashboard-specific loading states
export function DashboardLoading() {
  return (
    <div className="p-6 space-y-6">
      {/* Welcome skeleton */}
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
      
      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      
      {/* Main content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  )
}

// Form loading state
export function FormLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      <div className="h-10 bg-gray-200 rounded"></div>
      <div className="h-10 bg-gray-200 rounded w-1/2"></div>
    </div>
  )
}
