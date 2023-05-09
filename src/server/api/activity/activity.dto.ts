import { z } from 'zod';
import { ActivityStatus } from '@prisma/client';

import { DateRanges } from '@features/campaigns/utils';

import type { TypeOf } from 'zod';
import type { components } from '@schema/api';

export const createActivitySchema = z.object({
  campaignId: z.string(),
  organizationId: z.string(),
  leadEmail: z.string(),
  messageId: z.string(),
  accountId: z.string(),
  step: z.number(),
  queueId: z.string().optional(),
  status: z.nativeEnum(ActivityStatus).optional(),
});

export const getActivitiesSchema = z.object({
  organizationId: z.string(),
  campaignId: z.string().optional(),
  leadEmail: z.string().optional(),
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.string().nullish(),
  period: z.nativeEnum(DateRanges).optional().default(DateRanges.Week),
  customPeriod: z.array(z.date().nullable()).optional(),
});

export const createActivityBatchSchema = z.array(createActivitySchema);

export type CreateActivityInput = TypeOf<typeof createActivitySchema>;
export type GetActivitiesInput = TypeOf<typeof getActivitiesSchema>;

export type ActivityMailMergeOutput = components['schemas']['BulkResponseEntry'];
export type AccountActivityMailMerge = ActivityMailMergeOutput & { accountId: string; step: number };

export type ActivityGroupedByDateStatus = { date: Date; status: ActivityStatus; count: number; unique_opened?: number };
export type ActivityStats = { date: string; [ActivityStatus.REPLIED]?: number; [ActivityStatus.OPENED]?: number };
