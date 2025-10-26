'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { WithRoleAccess } from '@/components/auth/withRoleAccess'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sidebar } from '@/components/layout/Sidebar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  LayoutDashboard, 
  Video, 
  DollarSign, 
  Users, 
  Settings, 
  LogOut,
  Upload,
  Bell,
  HelpCircle,
  Share,
  Edit,
  CheckCircle,
  Clock,
  XCircle,
  ArrowRight,
  FileText
} from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

function ProfileContent() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('clipper')

  const navigationItems = [
    {
      name: 'Dashboard',
      href: user?.role === 'CREATOR' ? '/dashboard' : '/clipper',
      icon: LayoutDashboard,
      current: false
    },
    {
      name: 'My Videos',
      href: '/dashboard/videos',
      icon: Video,
      current: false
    },
    {
      name: 'Earnings',
      href: '/dashboard/earnings',
      icon: DollarSign,
      current: false
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: Users,
      current: true
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      current: false
    }
  ]

  return (
    <Sidebar>
      <div className="p-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-text-primary">My Profile</h1>
          <div className="flex items-center space-x-4">
            <Button className="bg-primary text-white hover:opacity-90">
              <Share className="h-4 w-4 mr-2" />
              Share Profile
            </Button>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face" 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">Chris Smith</h2>
                  <p className="text-text-secondary mb-3">@chrissmithcreates</p>
                  <div className="flex space-x-2 mb-3">
                    <Badge className="bg-primary text-white">Content Creator</Badge>
                    <Badge className="bg-secondary/20 text-secondary">Clipper</Badge>
                  </div>
                  <p className="text-text-secondary max-w-md">
                    Award-winning content creator focused on tech and gaming. Let's create amazing clips together! 🚀 Let's connect and make magic happen.
                  </p>
                </div>
              </div>
              <Button variant="outline" className="text-text-primary hover:bg-gray-50">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="creator">Creator Profile</TabsTrigger>
            <TabsTrigger value="clipper">Clipper Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="creator" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-bold">Creator Profile</CardTitle>
                <CardDescription>
                  Manage your creator settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary">Creator profile content goes here...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clipper" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Submitted Clips Portfolio */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-bold">Submitted Clips Portfolio</CardTitle>
                    <Link href="/clipper/portfolio" className="text-primary text-sm font-medium hover:underline">
                      View All
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                        <img 
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face" 
                          alt="Clip thumbnail" 
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary">Keynote Speech Highlight</p>
                          <p className="text-xs text-text-secondary">SaaS Growth Co.</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-100 text-green-800 text-xs flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approved
                          </Badge>
                          <span className="text-xs text-text-secondary">Jun 21, 2023</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                        <img 
                          src="https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=60&h=60&fit=crop&crop=center" 
                          alt="Clip thumbnail" 
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary">Epic Gaming Moment #3</p>
                          <p className="text-xs text-text-secondary">Gamer Pro</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-yellow-100 text-yellow-800 text-xs flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                          <span className="text-xs text-text-secondary">Jun 18, 2023</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                        <img 
                          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=60&h=60&fit=crop&crop=center" 
                          alt="Clip thumbnail" 
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary">React Hooks Tutorial Clip</p>
                          <p className="text-xs text-text-secondary">CodeWizard</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-red-100 text-red-800 text-xs flex items-center">
                            <XCircle className="h-3 w-3 mr-1" />
                            Rejected
                          </Badge>
                          <span className="text-xs text-text-secondary">Jun 15, 2023</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Earnings Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Earnings Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-primary/10 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-secondary">Pending</p>
                          <p className="text-2xl font-bold text-text-primary">$250.00</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-green-100 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-lg bg-green-200 flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text-secondary">Total Received</p>
                          <p className="text-2xl font-bold text-text-primary">$3,450.50</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Payments */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-bold">Recent Payments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary">From SaaS Growth Co.</p>
                          <p className="text-xs text-text-secondary">June 22, 2023</p>
                        </div>
                        <span className="text-sm font-medium text-green-600">+$150.00</span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary">From Gamer Pro</p>
                          <p className="text-xs text-text-secondary">June 12, 2023</p>
                        </div>
                        <span className="text-sm font-medium text-green-600">+$75.50</span>
                      </div>
                    </div>
                    <Link href="/clipper/payments" className="text-primary text-sm font-medium hover:underline mt-4 block">
                      View all payments
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Sidebar>
  )
}

export default function Profile() {
  return (
    <WithRoleAccess requireOnboarding={true}>
      <ProfileContent />
    </WithRoleAccess>
  )
}
