import { z } from 'zod';
import { LeadStatus } from '@prisma/client';

import type { TypeOf } from 'zod';

export const createLeadsSchema = z.object({
  campaignId: z.string(),
  email: z.string().email(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  status: z.nativeEnum(LeadStatus).optional(),
  details: z.any().optional(),
});

export const batchCreateLeads = z.array(createLeadsSchema);

export const getLeadsSchema = z.object({
  campaignId: z.string(),
});

export type CreateLeadsInput = TypeOf<typeof createLeadsSchema>;
export type GetLeadsInput = TypeOf<typeof getLeadsSchema>;
