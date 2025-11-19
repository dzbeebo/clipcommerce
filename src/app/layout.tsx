import type { Metadata } from 'next'
import { Be_Vietnam_Pro } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AuthProvider } from '@/contexts/AuthContext'
import { ConditionalLayout } from '@/components/layout/ConditionalLayout'
import { UnderConstruction } from '@/components/UnderConstruction'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if under construction mode is enabled
  // Handle both string "true" and boolean true, case-insensitive
  const underConstructionEnv = process.env.NEXT_PUBLIC_UNDER_CONSTRUCTION
  const isUnderConstruction = 
    underConstructionEnv === 'true' || 
    underConstructionEnv === 'True' || 
    underConstructionEnv === 'TRUE' ||
    underConstructionEnv === '1'

  // Debug logging (only in development)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔧 Under Construction Mode:', {
      envValue: underConstructionEnv,
      isEnabled: isUnderConstruction
    })
  }

  return (
    <html lang="en">
      <body className={`${beVietnamPro.variable} font-display bg-background-light text-text-primary`}>
        <AuthProvider>
          {isUnderConstruction ? (
            <UnderConstruction />
          ) : (
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          )}
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}