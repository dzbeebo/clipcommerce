'use client'

import { usePathname } from 'next/navigation'
import { useAuthContext } from '@/contexts/AuthContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const { isAuthenticated } = useAuthContext()
  const pathname = usePathname()

  // Routes that should use the sidebar layout
  const sidebarRoutes = [
    '/creator',
    '/dashboard', // Legacy support
    '/profile',
    '/settings',
    '/clipper'
  ]

  const shouldUseSidebar = isAuthenticated && sidebarRoutes.some(route => 
    pathname.startsWith(route)
  )

  if (shouldUseSidebar) {
    // For sidebar routes, just render the children (the sidebar is handled by individual pages)
    return <>{children}</>
  }

  // For public routes, use the header/footer layout
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
