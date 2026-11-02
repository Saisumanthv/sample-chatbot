import { z } from 'zod';

export const createConversationSchema = z.object({
  title: z.string()
    .trim()
    .min(1, 'Title cannot be empty.')
    .max(100, 'Title must not exceed 100 characters.')
    .optional()
}).strict();

export const renameConversationSchema = z.object({
  title: z.string()
    .trim()
    .min(1, 'Title is required.')
    .max(100, 'Title must not exceed 100 characters.')
}).strict();

export const conversationIdParamSchema = z.object({
  conversationId: z.string().uuid('Invalid conversation UUID format.')
});

export const profileSchema = z.object({
  full_name: z.string()
    .trim()
    .min(2, 'Full name must have at least 2 characters.')
    .max(100, 'Full name must not exceed 100 characters.')
    .optional()
}).strict();

