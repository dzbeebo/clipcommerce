'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useDashboard } from '@/hooks/useDashboard'
import { WithRoleAccess } from '@/components/auth/withRoleAccess'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sidebar } from '@/components/layout/Sidebar'
import { Breadcrumbs, breadcrumbConfigs } from '@/components/layout/Breadcrumbs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/checkbox'
import { DashboardLoading } from '@/components/ui/loading'
import { toast } from 'sonner'
import { 
  Settings, 
  Save,
  User,
  DollarSign,
  Video,
  Bell,
  Shield,
  Mail,
  MapPin,
  Globe,
  Twitter,
  Youtube,
  Instagram,
  Link as LinkIcon
} from 'lucide-react'

function CreatorSettingsContent() {
  const { user } = useAuth()
  const { data, loading } = useDashboard()

  const [formData, setFormData] = useState({
    displayName: '',
    description: '',
    email: user?.email || '',
    location: '',
    website: '',
    twitter: '',
    youtube: '',
    instagram: '',
    
    // Financial settings
    rateAmount: '',
    rateViews: '',
    minPayout: '',
    payoutMode: 'IMMEDIATE',
    autoApprove: false,
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: true,
    newSubmissionAlerts: true,
    paymentAlerts: true,
    
    // Privacy settings
    profilePublic: true,
    showEarnings: false,
  })

  const [saving, setSaving] = useState(false)

  // Populate form data when dashboard data loads
  useState(() => {
    if (data?.profile) {
      const profile = data.profile as any
      setFormData({
        displayName: profile.displayName || '',
        description: profile.description || '',
        email: user?.email || '',
        rateAmount: profile.rateAmount?.toString() || '',
        rateViews: profile.rateViews?.toString() || '',
        minPayout: '50',
        payoutMode: 'IMMEDIATE',
        autoApprove: false,
        emailNotifications: true,
        pushNotifications: true,
        newSubmissionAlerts: true,
        paymentAlerts: true,
        profilePublic: true,
        showEarnings: false,
        location: '',
        website: '',
        twitter: '',
        youtube: '',
        instagram: '',
      })
    }
  }, [data, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // TODO: Implement API call to update creator settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Settings saved successfully')
    } catch (error) {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Sidebar>
        <div className="p-6">
          <Breadcrumbs items={breadcrumbConfigs['/creator/settings']} />
          <DashboardLoading />
        </div>
      </Sidebar>
    )
  }

  return (
    <Sidebar>
      <div className="p-6">
        <Breadcrumbs items={breadcrumbConfigs['/creator/settings']} />
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-text-primary mb-2">Creator Settings</h2>
          <p className="text-text-secondary">Manage your creator account settings and preferences</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Profile Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Profile Settings
              </CardTitle>
              <CardDescription>
                Manage your public profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    placeholder="Your display name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-text-secondary mt-1">Email cannot be changed</p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Bio / Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Tell creators about yourself and your content..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="City, Country"
                />
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <LinkIcon className="h-5 w-5 mr-2" />
                Social Links
              </CardTitle>
              <CardDescription>
                Connect your social media profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website" className="flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter" className="flex items-center">
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                  </Label>
                  <Input
                    id="twitter"
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    placeholder="@username"
                  />
                </div>
                <div>
                  <Label htmlFor="youtube" className="flex items-center">
                    <Youtube className="h-4 w-4 mr-2" />
                    YouTube
                  </Label>
                  <Input
                    id="youtube"
                    value={formData.youtube}
                    onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
                    placeholder="Channel name or URL"
                  />
                </div>
                <div>
                  <Label htmlFor="instagram" className="flex items-center">
                    <Instagram className="h-4 w-4 mr-2" />
                    Instagram
                  </Label>
                  <Input
                    id="instagram"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    placeholder="@username"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Pricing Settings
              </CardTitle>
              <CardDescription>
                Configure your pricing model for clippers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rateAmount">Rate per Milestone</Label>
                  <Input
                    id="rateAmount"
                    type="number"
                    value={formData.rateAmount}
                    onChange={(e) => setFormData({ ...formData, rateAmount: e.target.value })}
                    placeholder="50"
                  />
                  <p className="text-xs text-text-secondary mt-1">Amount in dollars</p>
                </div>
                <div>
                  <Label htmlFor="rateViews">Views Milestone</Label>
                  <Input
                    id="rateViews"
                    type="number"
                    value={formData.rateViews}
                    onChange={(e) => setFormData({ ...formData, rateViews: e.target.value })}
                    placeholder="10000"
                  />
                  <p className="text-xs text-text-secondary mt-1">Views required</p>
                </div>
              </div>

              <div>
                <Label htmlFor="minPayout">Minimum Payout</Label>
                <Input
                  id="minPayout"
                  type="number"
                  value={formData.minPayout}
                  onChange={(e) => setFormData({ ...formData, minPayout: e.target.value })}
                  placeholder="50"
                />
                <p className="text-xs text-text-secondary mt-1">Minimum amount before payout is processed</p>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Control when and how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-text-secondary">Receive notifications via email</p>
                </div>
                <Switch
                  checked={formData.emailNotifications}
                  onCheckedChange={(checked) => setFormData({ ...formData, emailNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-text-secondary">Receive push notifications</p>
                </div>
                <Switch
                  checked={formData.pushNotifications}
                  onCheckedChange={(checked) => setFormData({ ...formData, pushNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Submission Alerts</Label>
                  <p className="text-sm text-text-secondary">Get notified when new submissions arrive</p>
                </div>
                <Switch
                  checked={formData.newSubmissionAlerts}
                  onCheckedChange={(checked) => setFormData({ ...formData, newSubmissionAlerts: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Payment Alerts</Label>
                  <p className="text-sm text-text-secondary">Get notified when payments are processed</p>
                </div>
                <Switch
                  checked={formData.paymentAlerts}
                  onCheckedChange={(checked) => setFormData({ ...formData, paymentAlerts: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Control your profile visibility and data sharing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Public Profile</Label>
                  <p className="text-sm text-text-secondary">Allow others to view your profile</p>
                </div>
                <Switch
                  checked={formData.profilePublic}
                  onCheckedChange={(checked) => setFormData({ ...formData, profilePublic: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Show Earnings</Label>
                  <p className="text-sm text-text-secondary">Display total earnings on profile</p>
                </div>
                <Switch
                  checked={formData.showEarnings}
                  onCheckedChange={(checked) => setFormData({ ...formData, showEarnings: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </div>
    </Sidebar>
  )
}

export default function CreatorSettings() {
  return (
    <WithRoleAccess requiredRole="CREATOR" requireOnboarding={true}>
      <CreatorSettingsContent />
    </WithRoleAccess>
  )
}
