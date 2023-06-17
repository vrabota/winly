import { z } from 'zod';
import { LeadStatus } from '@prisma/client';

import type { TypeOf } from 'zod';

export const createLeadsSchema = z.object({
  campaignId: z.string().optional(),
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  website: z.string().optional(),
  companyName: z.string().optional(),
  phone: z.string().optional(),
  status: z.nativeEnum(LeadStatus).optional(),
  customVariables: z.any().optional(),
});

export const batchCreateLeads = z.array(createLeadsSchema);

export const getLeadsSchema = z.object({
  campaignId: z.string(),
  organizationId: z.string(),
  search: z.string().trim().min(1).optional(),
  leadStatus: z.nativeEnum(LeadStatus).array().optional(),
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.string().nullish(),
});

export const getLeadIdSchema = z.object({
  leadId: z.string(),
});

export const batchDeleteLeadsSchema = z.object({
  leadIds: z.array(z.string()),
});

export const updateLeadSchema = createLeadsSchema.extend({
  leadId: z.string(),
});

export type CreateLeadsInput = TypeOf<typeof createLeadsSchema>;
export type GetLeadsInput = TypeOf<typeof getLeadsSchema>;
export type GetLeadIdInput = TypeOf<typeof getLeadIdSchema>;
export type UpdateLeadInput = TypeOf<typeof updateLeadSchema>;
export type BatchDeleteLeadInput = TypeOf<typeof batchDeleteLeadsSchema>;
