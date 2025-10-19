import { z } from 'zod'

// User signup schemas
export const creatorSignupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms of service'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const clipperSignupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms of service'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Login schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Creator profile schema
export const creatorProfileSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  slug: z.string().min(2, 'Slug must be at least 2 characters').regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  rateAmount: z.number().min(1, 'Rate amount must be at least $1').max(1000, 'Rate amount must be less than $1000'),
  rateViews: z.number().min(100, 'Rate views must be at least 100').max(1000000, 'Rate views must be less than 1,000,000'),
  minPayout: z.number().min(5, 'Minimum payout must be at least $5').max(100, 'Minimum payout must be less than $100'),
})

// Clipper profile schema
export const clipperProfileSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
})

// YouTube URL validation
export const youtubeUrlSchema = z.string().url('Invalid URL').refine(
  (url) => {
    const videoId = extractVideoId(url)
    return videoId !== null
  },
  'Invalid YouTube URL'
)

// Helper function to extract video ID (same as in youtube.ts)
function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }

  return null
}

// Submission creation schema
export const submissionCreateSchema = z.object({
  creatorId: z.string().min(1, 'Creator ID is required'),
  youtubeVideoId: z.string().min(1, 'Video ID is required'),
  videoTitle: z.string().min(1, 'Video title is required'),
  videoThumbnail: z.string().url('Invalid thumbnail URL'),
  videoPublishedAt: z.string().datetime('Invalid publish date'),
  videoUrl: z.string().url('Invalid video URL'),
  viewsAtSubmit: z.number().min(0, 'Views must be non-negative'),
})

// Platform settings schema
export const platformSettingsSchema = z.object({
  platformCommissionPercentage: z.number().min(0, 'Commission must be non-negative').max(100, 'Commission must be less than 100%'),
  maintenanceMode: z.boolean(),
  registrationsEnabled: z.boolean(),
})

// Type exports
export type CreatorSignupInput = z.infer<typeof creatorSignupSchema>
export type ClipperSignupInput = z.infer<typeof clipperSignupSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type CreatorProfileInput = z.infer<typeof creatorProfileSchema>
export type ClipperProfileInput = z.infer<typeof clipperProfileSchema>
export type SubmissionCreateInput = z.infer<typeof submissionCreateSchema>
export type PlatformSettingsInput = z.infer<typeof platformSettingsSchema>
