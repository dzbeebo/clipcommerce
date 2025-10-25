'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useAuthContext } from '@/contexts/AuthContext'
import { useNotifications } from '@/hooks/useNotifications'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Menu, 
  X, 
  Home, 
  BarChart3, 
  Bell, 
  Settings, 
  LogOut, 
  User,
  Video,
  DollarSign,
  FileText
} from 'lucide-react'
import { NotificationCenter } from '@/components/NotificationCenter'

export function Header() {
  const { user, logout } = useAuth()
  const { isAuthenticated, forceSessionCheck } = useAuthContext()
  const { unreadCount } = useNotifications(user?.id)
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

  const userRole = user?.role as 'CREATOR' | 'CLIPPER' | undefined

  // Force session check when component mounts to ensure fresh state
  useEffect(() => {
    forceSessionCheck()
  }, [forceSessionCheck])

  // Close mobile menu and notifications when route changes (e.g., due to session expiration redirect)
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setShowNotifications(false)
  }, [pathname])

  // Close mobile menu and notifications when authentication state changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setShowNotifications(false)
  }, [isAuthenticated])

  // Listen for session expired events
  useEffect(() => {
    const handleSessionExpired = () => {
      toast.error('Your session has expired. Please log in again.')
    }

    window.addEventListener('session-expired', handleSessionExpired)
    return () => window.removeEventListener('session-expired', handleSessionExpired)
  }, [])

  const navigationItems = isAuthenticated ? [
    {
      name: 'Dashboard',
      href: userRole === 'CREATOR' ? '/dashboard' : '/clipper',
      icon: Home,
      current: pathname === '/dashboard' || pathname === '/clipper'
    },
    ...(userRole === 'CREATOR' ? [
      {
        name: 'Submissions',
        href: '/dashboard/submissions',
        icon: FileText,
        current: pathname === '/dashboard/submissions'
      },
      {
        name: 'Analytics',
        href: '/dashboard/analytics',
        icon: BarChart3,
        current: pathname.startsWith('/dashboard/analytics')
      }
    ] : [
      {
        name: 'Submit Clips',
        href: '/clipper/submit',
        icon: Video,
        current: pathname === '/clipper/submit'
      }
    ])
  ] : []

  const publicNavigationItems = [
    {
      name: 'How It Works',
      href: '/how-it-works',
      current: pathname === '/how-it-works'
    },
    {
      name: 'API Docs',
      href: '/api-docs',
      current: pathname === '/api-docs'
    }
  ]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href={isAuthenticated ? (userRole === 'CREATOR' ? '/dashboard' : '/clipper') : '/'} className="flex items-center">
              <div className="h-8 w-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Video className="h-5 w-5 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">ClipCommerce</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {isAuthenticated ? (
              <>
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        item.current
                          ? 'bg-green-100 text-green-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </Link>
                  )
                })}
              </>
            ) : (
              <>
                {publicNavigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      item.current
                        ? 'bg-green-100 text-green-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative"
                  >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </Badge>
                    )}
                  </Button>
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80">
                      <NotificationCenter userId={user?.id || ''} />
                    </div>
                  )}
                </div>

                {/* User menu */}
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-700">
                    <User className="h-4 w-4" />
                    <span>{user?.email}</span>
                    <Badge variant="outline" className="text-xs">
                      {userRole}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <nav className="space-y-2">
              {isAuthenticated ? (
                <>
                  {navigationItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                          item.current
                            ? 'bg-green-100 text-green-700'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {item.name}
                      </Link>
                    )
                  })}
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex items-center px-3 py-2 text-sm text-gray-700">
                      <User className="h-4 w-4 mr-2" />
                      <span>{user?.email}</span>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {userRole}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-3 py-2 text-base text-gray-600 hover:text-gray-900"
                      onClick={() => {
                        logout()
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  {publicNavigationItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        item.current
                          ? 'bg-green-100 text-green-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                    <Link
                      href="/login"
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      className="block px-3 py-2 rounded-md text-base font-medium bg-green-600 text-white hover:bg-green-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
