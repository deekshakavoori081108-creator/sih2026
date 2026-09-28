import { z } from 'zod';

export const KycRegisterSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  guardianName: z.string().min(2, 'Guardian name must have at least 2 characters'),
  guardianIdType: z.enum(['AADHAAR', 'PASSPORT', 'NATIONAL_ID', 'DRIVERS_LICENSE']),
  guardianIdNumber: z.string().min(4, 'Government ID must be at least 4 digits'),
  guardianPhone: z.string().optional(),
  childName: z.string().min(2, 'Child name must have at least 2 characters'),
  childAge: z.number().min(5).max(18, 'Child age must be between 5 and 18'),
  gradeLevel: z.string().optional()
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

export const GameCompletionSchema = z.object({
  category: z.string(),
  gameType: z.enum(['TRIVIA', 'PUZZLE', 'WORD_CRYPT']),
  score: z.number().min(0),
  timeSpentSeconds: z.number().positive(),
  level: z.number().optional().default(1)
});

export const UserPreferencesSchema = z.object({
  preferredCategory: z.string(),
  secondaryCategories: z.array(z.string()).default([])
});

export const StoryGenerateSchema = z.object({
  topic: z.string(),
  chapterNumber: z.number().int().min(1),
  previousSummary: z.string().optional()
});

export const VaultUnlockSchema = z.object({
  moduleId: z.string(),
  moduleType: z.enum(['SPACE', 'LAWS', 'SCIENCE']),
  moduleTitle: z.string(),
  pointsCost: z.number().min(1)
});
