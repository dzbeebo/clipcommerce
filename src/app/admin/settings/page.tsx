'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useMasquerade } from '@/contexts/MasqueradeContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Settings, 
  Users, 
  UserCog, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  Loader2,
  Save,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Shield,
  Globe
} from 'lucide-react'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface User {
  id: string
  email: string
  role: 'CREATOR' | 'CLIPPER' | 'ADMIN'
  onboardingComplete: boolean
  createdAt: string
  creatorProfile?: {
    displayName: string
    slug: string
  }
  clipperProfile?: {
    displayName: string
    youtubeChannelName: string
  }
}

interface PlatformSettings {
  underConstruction?: string
  [key: string]: string | undefined
}

export default function AdminSettingsPage() {
  const { user } = useAuth()
  const { isMasquerading, stopMasquerade, originalUser } = useMasquerade()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>({})
  const [savingSettings, setSavingSettings] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<User | null>(null)
  const [masqueradeTarget, setMasqueradeTarget] = useState<string | null>(null)

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchUsers()
      fetchPlatformSettings()
    }
  }, [user])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (roleFilter !== 'all') params.append('role', roleFilter)
      if (searchTerm) params.append('search', searchTerm)
      
      const response = await fetch(`/api/admin/users?${params}`)
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users')
      }
      
      setUsers(data.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const fetchPlatformSettings = async () => {
    try {
      const response = await fetch('/api/admin/platform-settings')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch settings')
      }
      
      setPlatformSettings(data.settings || {})
    } catch (error) {
      console.error('Error fetching platform settings:', error)
    }
  }

  const savePlatformSettings = async () => {
    try {
      setSavingSettings(true)
      
      const response = await fetch('/api/admin/platform-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: platformSettings }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save settings')
      }
      
      toast.success('Settings saved successfully')
      
      // Reload page to apply under construction changes
      if (platformSettings.underConstruction !== undefined) {
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      toast.error('Failed to save settings')
    } finally {
      setSavingSettings(false)
    }
  }

  const updateUser = async (userId: string, updates: Partial<User>) => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, updates }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user')
      }
      
      toast.success('User updated successfully')
      setEditingUser(null)
      fetchUsers()
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Failed to update user')
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete user')
      }
      
      toast.success('User deleted successfully')
      setDeleteConfirm(null)
      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Failed to delete user')
    }
  }

  const handleMasquerade = async (userId: string) => {
    try {
      setMasqueradeTarget(userId)
      const response = await fetch('/api/admin/masquerade/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to start masquerade')
      }
      
      toast.success('Masquerade started')
      window.location.href = data.redirectUrl || '/'
    } catch (error) {
      console.error('Error starting masquerade:', error)
      toast.error('Failed to start masquerade')
      setMasqueradeTarget(null)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [roleFilter, searchTerm])

  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    )
  }

  const effectiveUser = isMasquerading ? originalUser : user

  return (
    <div className="min-h-screen bg-background-light">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-text-primary">Master Admin Settings</h1>
                <p className="text-text-secondary">Configure platform and manage users</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isMasquerading && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  <Eye className="h-3 w-3 mr-1" />
                  Masquerading
                </Badge>
              )}
              <Badge variant="outline" className="text-primary border-primary">
                <Shield className="h-3 w-3 mr-1" />
                Admin
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isMasquerading && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <p className="text-sm text-yellow-800">
                  You are currently masquerading as another user. 
                  <span className="font-semibold"> Original admin: {effectiveUser?.email}</span>
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    await stopMasquerade()
                    toast.success('Stopped masquerading')
                  } catch (error) {
                    toast.error('Failed to stop masquerade')
                  }
                }}
              >
                Stop Masquerading
              </Button>
            </div>
          </div>
        )}

        <Tabs defaultValue="platform" className="space-y-6">
          <TabsList>
            <TabsTrigger value="platform">
              <Globe className="h-4 w-4 mr-2" />
              Platform Settings
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              User Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="platform" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Configuration</CardTitle>
                <CardDescription>
                  Configure global platform settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="under-construction">Under Construction Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Enable to show the under construction page to all users (except admins)
                    </p>
                  </div>
                  <Switch
                    id="under-construction"
                    checked={platformSettings.underConstruction === 'true'}
                    onCheckedChange={(checked) => {
                      setPlatformSettings({
                        ...platformSettings,
                        underConstruction: checked ? 'true' : 'false',
                      })
                    }}
                  />
                </div>

                <div className="pt-4 border-t">
                  <Button
                    onClick={savePlatformSettings}
                    disabled={savingSettings}
                    className="w-full sm:w-auto"
                  >
                    {savingSettings ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage all platform users, roles, and permissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      <SelectItem value="CREATOR">Creators</SelectItem>
                      <SelectItem value="CLIPPER">Clippers</SelectItem>
                      <SelectItem value="ADMIN">Admins</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Users Table */}
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No users found</p>
                  </div>
                ) : (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Profile</TableHead>
                          <TableHead>Onboarding</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((userItem) => (
                          <TableRow key={userItem.id}>
                            <TableCell className="font-medium">{userItem.email}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  userItem.role === 'ADMIN'
                                    ? 'default'
                                    : userItem.role === 'CREATOR'
                                    ? 'secondary'
                                    : 'outline'
                                }
                              >
                                {userItem.role}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {userItem.creatorProfile?.displayName ||
                                userItem.clipperProfile?.displayName ||
                                '-'}
                            </TableCell>
                            <TableCell>
                              {userItem.onboardingComplete ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-gray-400" />
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {new Date(userItem.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                {userItem.role !== 'ADMIN' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleMasquerade(userItem.id)}
                                    disabled={masqueradeTarget === userItem.id}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setEditingUser(userItem)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                {userItem.id !== user?.id && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDeleteConfirm(userItem)}
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit User Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user role and onboarding status
            </DialogDescription>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4 py-4">
              <div>
                <Label>Email</Label>
                <Input value={editingUser.email} disabled />
              </div>
              <div>
                <Label>Role</Label>
                <Select
                  value={editingUser.role}
                  onValueChange={(value) =>
                    setEditingUser({ ...editingUser, role: value as any })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CREATOR">Creator</SelectItem>
                    <SelectItem value="CLIPPER">Clipper</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="onboarding">Onboarding Complete</Label>
                <Switch
                  id="onboarding"
                  checked={editingUser.onboardingComplete}
                  onCheckedChange={(checked) =>
                    setEditingUser({ ...editingUser, onboardingComplete: checked })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (editingUser) {
                  updateUser(editingUser.id, {
                    role: editingUser.role,
                    onboardingComplete: editingUser.onboardingComplete,
                  })
                }
              }}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {deleteConfirm && (
            <div className="py-4">
              <p className="text-sm text-muted-foreground">
                User: <span className="font-medium">{deleteConfirm.email}</span>
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteConfirm) {
                  deleteUser(deleteConfirm.id)
                }
              }}
            >
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

