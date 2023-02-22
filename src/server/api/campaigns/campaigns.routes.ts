import { createTRPCRouter, protectedProcedure } from '@server/api/trpc';
import {
  createCampaignHandler,
  getCampaignByIdHandler,
  getCampaignsHandler,
  updateCampaignHandler,
} from '@server/api/campaigns/controllers';

import { createCampaignSchema, getCampaignByIdSchema, updateCampaignSchema } from './data/dtos';

export const campaignRoutes = createTRPCRouter({
  createCampaign: protectedProcedure.input(createCampaignSchema).mutation(createCampaignHandler),
  updateCampaign: protectedProcedure.input(updateCampaignSchema).mutation(updateCampaignHandler),
  getAllCampaigns: protectedProcedure.query(getCampaignsHandler),
  getCampaignById: protectedProcedure.input(getCampaignByIdSchema).query(getCampaignByIdHandler),
});
