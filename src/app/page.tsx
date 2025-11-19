import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Upload, Scissors, CheckCircle, DollarSign, Users, Wallet, BarChart3, Play } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="bg-background-light font-display text-text-primary">
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <Badge className="bg-secondary/20 text-secondary text-sm font-bold py-1 px-3 rounded-full mb-4">
            Now in Public Beta!
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black text-text-primary leading-tight tracking-tighter mb-6">
            Turn Your Best Moments into<br className="hidden md:block"/> Viral <span className="text-primary">Clips</span> and <span className="text-secondary">Cash</span>
          </h1>
          <p className="max-w-3xl mx-auto text-text-secondary text-lg md:text-xl mb-10">
            ClippingMarket connects content creators with talented clippers to produce shareable, viral-ready video clips. More views, more engagement, more earnings.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/signup">
              <Button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-primary text-white text-base font-bold leading-normal tracking-[0.015em] gap-2 transform hover:scale-105 transition-transform">
                <ArrowRight className="text-xl" />
                <span>Get Started for Free</span>
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button variant="outline" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-white text-text-primary text-base font-bold leading-normal tracking-[0.015em] gap-2 border border-gray-200 hover:bg-gray-100 transition-colors">
                <Play className="text-xl" />
                <span>Watch Demo</span>
              </Button>
            </Link>
          </div>
          <div className="mt-16 relative">
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"></div>
            <img 
              alt="Dashboard preview" 
              className="rounded-2xl shadow-2xl mx-auto border-4 border-white relative z-10" 
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop&crop=center"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white" id="how-it-works">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-text-primary mb-3">How It Works</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">Getting started is simple. Four easy steps to amplify your content's reach.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center p-6">
              <div className="flex items-center justify-center size-16 rounded-2xl bg-primary/10 text-primary mb-4">
                <Upload className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">1. Upload Video</h3>
              <p className="text-text-secondary">Creators upload their long-form video content and set their clipping requirements.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="flex items-center justify-center size-16 rounded-2xl bg-secondary/10 text-secondary mb-4">
                <Scissors className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">2. Clippers Work</h3>
              <p className="text-text-secondary">Skilled clippers find your project and start creating amazing, shareable clips.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="flex items-center justify-center size-16 rounded-2xl bg-primary/10 text-primary mb-4">
                <CheckCircle className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">3. Review & Approve</h3>
              <p className="text-text-secondary">You review the clips, provide feedback, and approve your favorites for publishing.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
              <div className="flex items-center justify-center size-16 rounded-2xl bg-secondary/10 text-secondary mb-4">
                <DollarSign className="text-3xl" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">4. Share & Earn</h3>
              <p className="text-text-secondary">Share the clips, watch your views skyrocket, and pay clippers through our secure platform.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20" id="features">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-text-primary mb-3">Powerful Features for Growth</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">Everything you need to scale your content creation and clipping business.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary mb-4">
                <Users className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Creator & Clipper Marketplace</h3>
              <p className="text-text-secondary">A dedicated space for creators to find talented clippers and for clippers to find exciting new projects.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-center size-12 rounded-xl bg-secondary/10 text-secondary mb-4">
                <Wallet className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Secure & Easy Payments</h3>
              <p className="text-text-secondary">Integrated payment system ensures clippers get paid on time and creators can manage budgets easily.</p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary mb-4">
                <BarChart3 className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">Performance Analytics</h3>
              <p className="text-text-secondary">Track clip views, engagement, and earnings with our intuitive and powerful analytics dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-primary/5" id="testimonials">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-text-primary mb-3">Loved by Creators and Clippers</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">Don't just take our word for it. Here's what our users are saying.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:-translate-y-2 transition-transform">
              <p className="text-text-secondary mb-6">"ClippingMarket has been a game-changer for my channel. I can focus on creating content while the clippers handle making it shareable. My engagement has doubled!"</p>
              <div className="flex items-center gap-4">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 bg-gradient-to-br from-blue-400 to-purple-500"></div>
                <div>
                  <h4 className="font-bold text-text-primary">GamerPro</h4>
                  <p className="text-sm text-primary font-medium">Content Creator</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:-translate-y-2 transition-transform">
              <p className="text-text-secondary mb-6">"As a clipper, finding consistent work was tough. ClippingMarket's marketplace is amazing. I have a steady stream of projects and get paid securely. Highly recommend."</p>
              <div className="flex items-center gap-4">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 bg-gradient-to-br from-green-400 to-blue-500"></div>
                <div>
                  <h4 className="font-bold text-text-primary">ClipMasterJane</h4>
                  <p className="text-sm text-secondary font-medium">Pro Clipper</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:-translate-y-2 transition-transform">
              <p className="text-text-secondary mb-6">"The analytics are so insightful! I can see which clips perform best and which clippers deliver the most views. It's essential for optimizing my content strategy."</p>
              <div className="flex items-center gap-4">
                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 bg-gradient-to-br from-purple-400 to-pink-500"></div>
                <div>
                  <h4 className="font-bold text-text-primary">TechTalks</h4>
                  <p className="text-sm text-primary font-medium">Content Creator</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="bg-primary rounded-2xl p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute -bottom-16 -left-16 size-48 bg-white/10 rounded-full"></div>
            <div className="absolute -top-16 -right-16 size-48 bg-white/10 rounded-full"></div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4 relative z-10">Ready to Amplify Your Content?</h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8 relative z-10">Join ClippingMarket today and start turning your videos into viral masterpieces. It's free to get started!</p>
            <Link href="/signup">
              <Button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-8 bg-white text-primary text-base font-bold leading-normal tracking-[0.015em] gap-2 mx-auto relative z-10 transform hover:scale-105 transition-transform">
                <span>Sign Up Now</span>
                <ArrowRight className="text-xl" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}