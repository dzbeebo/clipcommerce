import Link from 'next/link'
import { Video, Mail, Twitter, Github, Linkedin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 text-primary">
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path clipRule="evenodd" d="M24 4H42V17.3333V30.6667H24V44H6V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
              </svg>
            </div>
            <h2 className="text-text-primary text-xl font-bold">ClippingMarket</h2>
          </div>
          <div className="flex gap-6">
            <a className="text-text-secondary hover:text-primary" href="#">Terms</a>
            <a className="text-text-secondary hover:text-primary" href="#">Privacy</a>
            <a className="text-text-secondary hover:text-primary" href="#">Contact</a>
          </div>
          <p className="text-sm text-text-secondary">© 2024 ClippingMarket. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
