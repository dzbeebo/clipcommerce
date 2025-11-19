'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const pathname = usePathname()
  
  // Generate breadcrumbs from pathname if not provided
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    if (items) return items

    const pathSegments = pathname.split('/').filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/' }
    ]

    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      // Convert segment to readable label
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      // Don't add href for the last segment (current page)
      const href = index === pathSegments.length - 1 ? undefined : currentPath
      
      breadcrumbs.push({ label, href })
    })

    return breadcrumbs
  }

  const breadcrumbs = generateBreadcrumbs()

  if (breadcrumbs.length <= 1) {
    return null
  }

  return (
    <nav className={`flex items-center space-x-1 text-sm text-gray-500 ${className}`} aria-label="Breadcrumb">
      {breadcrumbs.map((item, index) => (
        <div key={index} className="flex items-center">
          {index === 0 ? (
            <Home className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4 mx-1" />
          )}
          
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-gray-700 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium" aria-current="page">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}

// Predefined breadcrumb configurations for common pages
export const breadcrumbConfigs = {
  '/clipper': [
    { label: 'Home', href: '/' },
    { label: 'Clipper Dashboard', href: '/clipper' }
  ],
  '/clipper/submit': [
    { label: 'Home', href: '/' },
    { label: 'Clipper Dashboard', href: '/clipper' },
    { label: 'Submit Clips', href: '/clipper/submit' }
  ],
  '/creator': [
    { label: 'Home', href: '/' },
    { label: 'Creator Dashboard', href: '/creator' }
  ],
  '/creator/submissions': [
    { label: 'Home', href: '/' },
    { label: 'Creator Dashboard', href: '/creator' },
    { label: 'Submissions', href: '/creator/submissions' }
  ],
  '/creator/analytics': [
    { label: 'Home', href: '/' },
    { label: 'Creator Dashboard', href: '/creator' },
    { label: 'Analytics', href: '/creator/analytics' }
  ],
  '/creator/settings': [
    { label: 'Home', href: '/' },
    { label: 'Creator Dashboard', href: '/creator' },
    { label: 'Settings', href: '/creator/settings' }
  ],
  // Legacy dashboard URLs for backward compatibility
  '/dashboard': [
    { label: 'Home', href: '/' },
    { label: 'Creator Dashboard', href: '/creator' }
  ],
  '/dashboard/submissions': [
    { label: 'Home', href: '/' },
    { label: 'Creator Dashboard', href: '/creator' },
    { label: 'Submissions', href: '/creator/submissions' }
  ],
  '/dashboard/analytics': [
    { label: 'Home', href: '/' },
    { label: 'Creator Dashboard', href: '/creator' },
    { label: 'Analytics', href: '/creator/analytics' }
  ],
  '/onboarding/clipper/step-1': [
    { label: 'Home', href: '/' },
    { label: 'Clipper Onboarding', href: '/onboarding/clipper/step-1' }
  ],
  '/onboarding/clipper/step-2': [
    { label: 'Home', href: '/' },
    { label: 'Clipper Onboarding', href: '/onboarding/clipper/step-1' },
    { label: 'Step 2', href: '/onboarding/clipper/step-2' }
  ],
  '/onboarding/clipper/step-3': [
    { label: 'Home', href: '/' },
    { label: 'Clipper Onboarding', href: '/onboarding/clipper/step-1' },
    { label: 'Step 3', href: '/onboarding/clipper/step-3' }
  ],
  '/onboarding/creator/step-1': [
    { label: 'Home', href: '/' },
    { label: 'Creator Onboarding', href: '/onboarding/creator/step-1' }
  ],
  '/onboarding/creator/step-2': [
    { label: 'Home', href: '/' },
    { label: 'Creator Onboarding', href: '/onboarding/creator/step-1' },
    { label: 'Step 2', href: '/onboarding/creator/step-2' }
  ],
  '/onboarding/creator/step-3': [
    { label: 'Home', href: '/' },
    { label: 'Creator Onboarding', href: '/onboarding/creator/step-1' },
    { label: 'Step 3', href: '/onboarding/creator/step-3' }
  ],
  '/login': [
    { label: 'Home', href: '/' },
    { label: 'Sign In', href: '/login' }
  ],
  '/signup': [
    { label: 'Home', href: '/' },
    { label: 'Sign Up', href: '/signup' }
  ],
  '/signup/clipper': [
    { label: 'Home', href: '/' },
    { label: 'Sign Up', href: '/signup' },
    { label: 'Clipper', href: '/signup/clipper' }
  ],
  '/signup/creator': [
    { label: 'Home', href: '/' },
    { label: 'Sign Up', href: '/signup' },
    { label: 'Creator', href: '/signup/creator' }
  ],
  '/how-it-works': [
    { label: 'Home', href: '/' },
    { label: 'How It Works', href: '/how-it-works' }
  ],
  '/api-docs': [
    { label: 'Home', href: '/' },
    { label: 'API Documentation', href: '/api-docs' }
  ],
  '/forgot-password': [
    { label: 'Home', href: '/' },
    { label: 'Forgot Password', href: '/forgot-password' }
  ]
}
