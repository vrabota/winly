import { z } from 'zod';

import type { TypeOf } from 'zod';

export const createCampaignSchema = z.object({ name: z.string() });
export const updateCampaignSchema = z.object({
  accountIds: z.array(z.string()).min(1),
  scheduleDays: z.array(z.string()).optional(),
  startDate: z.date(),
  endDate: z.date(),
  time: z.object({ from: z.string().default('9:00 AM'), to: z.string().default('6:00 PM') }).optional(),
  timezone: z.string().optional(),
  dailyLimit: z.number().optional(),
  campaignId: z.string(),
  sendOnReply: z.boolean().default(true),
  openTracking: z.boolean().default(true),
});
export const getCampaignByIdSchema = z.object({ campaignId: z.string() });

export type CreateCampaignInput = TypeOf<typeof createCampaignSchema>;
export type UpdateCampaignInput = TypeOf<typeof updateCampaignSchema>;
export type GetCampaignByIdInput = TypeOf<typeof getCampaignByIdSchema>;
