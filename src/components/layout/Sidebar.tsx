'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { 
  LayoutDashboard, 
  Video, 
  DollarSign, 
  Users, 
  Settings, 
  LogOut,
  Upload,
  Bell,
  HelpCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface SidebarProps {
  children: React.ReactNode
}

export function Sidebar({ children }: SidebarProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const userRole = user?.role as 'CREATOR' | 'CLIPPER' | undefined

  const navigationItems = [
    {
      name: 'Dashboard',
      href: userRole === 'CREATOR' ? '/dashboard' : '/clipper',
      icon: LayoutDashboard,
      current: pathname === '/dashboard' || pathname === '/clipper'
    },
    ...(userRole === 'CREATOR' ? [
      {
        name: 'My Videos',
        href: '/dashboard/videos',
        icon: Video,
        current: pathname === '/dashboard/videos'
      },
      {
        name: 'Payments',
        href: '/dashboard/payments',
        icon: DollarSign,
        current: pathname === '/dashboard/payments'
      },
      {
        name: 'Clippers Hub',
        href: '/dashboard/clippers',
        icon: Users,
        current: pathname === '/dashboard/clippers'
      }
    ] : [
      {
        name: 'Submit Clips',
        href: '/clipper/submit',
        icon: Upload,
        current: pathname === '/clipper/submit'
      },
      {
        name: 'My Earnings',
        href: '/clipper/earnings',
        icon: DollarSign,
        current: pathname === '/clipper/earnings'
      }
    ]),
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      current: pathname === '/settings'
    }
  ]

  return (
    <div className="flex h-screen bg-background-light">
      {/* Sidebar */}
      <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link href={userRole === 'CREATOR' ? '/dashboard' : '/clipper'} className="flex items-center">
            <div className="h-8 w-8 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            {!isCollapsed && (
              <span className="ml-2 text-xl font-bold text-text-primary">ClipMarket</span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.current
                    ? 'bg-primary text-white'
                    : 'text-text-secondary hover:text-primary hover:bg-primary/10'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className="h-5 w-5" />
                {!isCollapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user?.email || 'User'}
                </p>
                <p className="text-xs text-text-secondary">
                  {userRole === 'CREATOR' ? 'Content Creator' : 'Clipper'}
                </p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="w-full justify-start mt-2 text-text-secondary hover:text-primary"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-text-secondary hover:text-primary"
              >
                <LayoutDashboard className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-text-primary">
                {userRole === 'CREATOR' ? 'Creator Dashboard' : 'Clipper Dashboard'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-text-secondary hover:text-primary">
                <Bell className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="text-text-secondary hover:text-primary">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-background-light">
          {children}
        </main>
      </div>
    </div>
  )
}
