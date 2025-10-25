import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ClipCommerce - Connect Creators with Clippers',
  description: 'A two-sided marketplace platform that connects content creators with clippers for automated clip submission, verification, approval, and payment processing.',
  keywords: ['content creation', 'clippers', 'youtube', 'payments', 'marketplace'],
  authors: [{ name: 'ClipCommerce Team' }],
  openGraph: {
    title: 'ClipCommerce - Connect Creators with Clippers',
    description: 'A two-sided marketplace platform that connects content creators with clippers for automated clip submission, verification, approval, and payment processing.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClipCommerce - Connect Creators with Clippers',
    description: 'A two-sided marketplace platform that connects content creators with clippers for automated clip submission, verification, approval, and payment processing.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}