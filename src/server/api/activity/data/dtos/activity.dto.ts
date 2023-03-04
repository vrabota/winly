import { z } from 'zod';
import { ActivityStatus } from '@prisma/client';

import type { components } from '@schema/api';
import type { TypeOf } from 'zod';

export const createActivitySchema = z.object({
  campaignId: z.string(),
  leadEmail: z.string(),
  messageId: z.string(),
  accountId: z.string(),
  step: z.number(),
  queueId: z.string().optional(),
  status: z.nativeEnum(ActivityStatus).optional(),
});

export const createActivityBatchSchema = z.array(createActivitySchema);

export type CreateActivityInput = TypeOf<typeof createActivitySchema>;

export type ActivityMailMergeOutput = components['schemas']['BulkResponseEntry'];
export type AccountActivityMailMerge = ActivityMailMergeOutput & { accountId: string; step: number };
