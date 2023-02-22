import { z } from 'zod';

import type { TypeOf } from 'zod';

export const createSequenceSchema = z.object({
  campaignId: z.string(),
  subject: z.string().optional(),
  body: z.string(),
  order: z.number(),
  delay: z.number().optional(),
});

export type CreateSequenceInput = TypeOf<typeof createSequenceSchema>;
