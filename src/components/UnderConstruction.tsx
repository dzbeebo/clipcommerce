'use client'

import { Sparkles, Lock, Eye, Zap, Scissors } from 'lucide-react'

export function UnderConstruction() {
  return (
    <div className="min-h-screen bg-background-light font-display text-text-primary flex items-center justify-center relative overflow-hidden py-20 md:py-32">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10 max-w-4xl">
        {/* Icon with animation */}
        <div className="mb-12 md:mb-16 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-ping"></div>
            <div className="relative bg-gradient-to-br from-primary to-secondary p-6 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform">
              <Lock className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl md:text-7xl font-black text-text-primary leading-tight tracking-tighter mb-8 md:mb-10">
          Something <span className="text-primary">Extraordinary</span>
          <br />
          Is Being <span className="text-secondary">Forged</span>
        </h1>

        {/* Mysterious subtitle */}
        <p className="text-xl md:text-2xl text-text-secondary mb-6 font-medium">
          Behind these digital walls, magic is happening
        </p>
        <p className="text-lg md:text-xl text-text-secondary/80 mb-16 md:mb-20 max-w-2xl mx-auto">
          We're crafting something that will transform how creators and clippers connect. 
          The future is being clipped, edited, and polished as we speak.
        </p>

        {/* Feature hints */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-16 md:mb-20">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-200 shadow-lg transform hover:-translate-y-2 transition-transform">
            <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary mb-4 mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Innovation in Progress</h3>
            <p className="text-sm text-text-secondary">Revolutionary features are being woven into existence</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-200 shadow-lg transform hover:-translate-y-2 transition-transform">
            <div className="flex items-center justify-center size-12 rounded-xl bg-secondary/10 text-secondary mb-4 mx-auto">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Power Being Unleashed</h3>
            <p className="text-sm text-text-secondary">The platform is being supercharged for your success</p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-200 shadow-lg transform hover:-translate-y-2 transition-transform">
            <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary mb-4 mx-auto">
              <Scissors className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary mb-2">Excellence Being Refined</h3>
            <p className="text-sm text-text-secondary">Every detail is being perfected for the ultimate experience</p>
          </div>
        </div>

        {/* Mysterious countdown/status */}
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-10 border border-primary/20 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Eye className="w-6 h-6 text-primary animate-pulse" />
            <p className="text-lg font-bold text-text-primary">The Vision Is Taking Shape</p>
            <Eye className="w-6 h-6 text-secondary animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
          <p className="text-text-secondary max-w-xl mx-auto">
            Soon, you'll witness a platform that redefines what's possible. 
            Until then, know that greatness is being built, one line of code at a time.
          </p>
        </div>
      </div>
    </div>
  )
}

