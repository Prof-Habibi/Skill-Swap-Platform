const { z } = require('zod');

const createSwapSchema = z.object({
  requester_id: z.string().uuid('requester_id must be a valid UUID'),
  recipient_id: z.string().uuid('recipient_id must be a valid UUID'),
  requester_skill_id: z.string().uuid('requester_skill_id must be a valid UUID'),
  recipient_skill_id: z.string().uuid('recipient_skill_id must be a valid UUID'),
}).refine((data) => data.requester_id !== data.recipient_id, {
  message: 'requester_id and recipient_id must be different',
  path: ['recipient_id'],
});

const createProjectSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional().default(''),
  owner_id: z.string().uuid('owner_id must be a valid UUID'),
  status: z.enum(['DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED']).optional().default('DRAFT'),
  visibility: z.enum(['PUBLIC', 'PRIVATE']).optional().default('PUBLIC'),
});

module.exports = { createSwapSchema, createProjectSchema };
