import { z } from 'zod';

// Schema for UUID parameter validation
export const idParamSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid UUID format'),
  }),
});

// Schema for creating a user
export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name cannot exceed 50 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password cannot exceed 100 characters'),
    role: z.enum(['user', 'admin']).default('user'),
  }),
});

// Schema for updating a user
export const updateUserSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid UUID format'),
  }),
  body: z.object({
    name: z.string().min(2).max(50).optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).max(100).optional(),
    role: z.enum(['user', 'admin']).optional(),
  }),
});

// Combining schemas for reuse
export default {
  createUser: createUserSchema,
  updateUser: updateUserSchema,
  getUser: idParamSchema,
  deleteUser: idParamSchema,
};
