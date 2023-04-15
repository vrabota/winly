import { z } from 'zod';

import type { TypeOf } from 'zod';

export const sequencesSchema = z.object({ subject: z.string(), body: z.string(), delay: z.string().optional() });

export const createCampaignSchema = z.object({ name: z.string() });
export const renameCampaignSchema = createCampaignSchema.extend({ campaignId: z.string() });
export const updateCampaignSchema = z.object({
  accountIds: z.array(z.string()).min(1),
  scheduleDays: z.array(z.string()).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  time: z.object({ from: z.string().default('9:00 AM'), to: z.string().default('6:00 PM') }).optional(),
  timezone: z.string().optional(),
  dailyLimit: z.number().optional(),
  campaignId: z.string(),
  sendOnReply: z.boolean().default(true),
  openTracking: z.boolean().default(true),
});
export const getCampaignByIdSchema = z.object({ campaignId: z.string() });

export const updateCampaignSequenceSchema = z.object({
  sequences: z.array(sequencesSchema),
  campaignId: z.string(),
});

export type CreateCampaignInput = TypeOf<typeof createCampaignSchema>;
export type RenameCampaignInput = TypeOf<typeof renameCampaignSchema>;
export type UpdateCampaignInput = TypeOf<typeof updateCampaignSchema>;
export type GetCampaignByIdInput = TypeOf<typeof getCampaignByIdSchema>;
export type UpdateCampaignSequenceInput = TypeOf<typeof updateCampaignSequenceSchema>;

export type SequencesType = TypeOf<typeof sequencesSchema>;
