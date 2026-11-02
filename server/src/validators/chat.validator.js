import { z } from 'zod';
import { randomUUID } from 'crypto';

export const chatSchema = z.object({
  conversationId: z.string().uuid('Invalid conversation UUID format.').nullable().optional(),
  message: z.string()
    .trim()
    .min(1, 'Message cannot be empty.')
    .max(10000, 'Message is too long (maximum 10,000 characters).'),
  requestId: z.string().uuid('Invalid requestId format.').optional().default(() => randomUUID())
}).strict();

export const suggestedQuestionsSchema = z.object({
  topic: z.string().trim().max(100).optional()
}).strict();

