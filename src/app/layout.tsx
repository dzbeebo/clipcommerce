import type { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AuthProvider } from '@/contexts/AuthContext'
import { MasqueradeProvider } from '@/contexts/MasqueradeContext'
import { UnderConstructionGate } from '@/components/UnderConstructionGate'
import { prisma } from '@/lib/prisma'

const beVietnamPro = Be_Vietnam_Pro({ 
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-display'
})

export const metadata: Metadata = {
  title: 'ClippingMarket - Monetize Your Content with Clips',
  description: 'Turn your best moments into viral clips and cash. ClippingMarket connects content creators with talented clippers to produce shareable, viral-ready video clips.',
  keywords: ['content creation', 'clippers', 'youtube', 'payments', 'marketplace', 'viral clips'],
  authors: [{ name: 'ClippingMarket Team' }],
  openGraph: {
    title: 'ClippingMarket - Monetize Your Content with Clips',
    description: 'Turn your best moments into viral clips and cash. ClippingMarket connects content creators with talented clippers to produce shareable, viral-ready video clips.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClippingMarket - Monetize Your Content with Clips',
    description: 'Turn your best moments into viral clips and cash. ClippingMarket connects content creators with talented clippers to produce shareable, viral-ready video clips.',
  },
}

async function getUnderConstructionStatus(): Promise<boolean> {
  try {
    // Check database first
    const setting = await prisma.platformSettings.findUnique({
      where: { key: 'underConstruction' },
    })
    
    if (setting?.value === 'true') {
      return true
    }
    
    // Fallback to environment variable
    const envValue = process.env.NEXT_PUBLIC_UNDER_CONSTRUCTION
    return (
      envValue === 'true' ||
      envValue === 'True' ||
      envValue === 'TRUE' ||
      envValue === '1'
    )
  } catch (error) {
    console.error('Error checking under construction status:', error)
    // Fallback to environment variable on error
    const envValue = process.env.NEXT_PUBLIC_UNDER_CONSTRUCTION
    return (
      envValue === 'true' ||
      envValue === 'True' ||
      envValue === 'TRUE' ||
      envValue === '1'
    )
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if under construction mode is enabled (server-side)
  const isUnderConstruction = await getUnderConstructionStatus()

  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Under Construction Mode:', {
      isEnabled: isUnderConstruction
    })
  }

  return (
    <html lang="en">
      <body className={`${beVietnamPro.variable} font-display bg-background-light text-text-primary`}>
        <AuthProvider>
          <MasqueradeProvider>
            <UnderConstructionGate isUnderConstruction={isUnderConstruction}>
              {children}
            </UnderConstructionGate>
          </MasqueradeProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}