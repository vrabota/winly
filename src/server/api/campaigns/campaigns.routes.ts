import { createTRPCRouter, protectedProcedure } from '@server/api/trpc';
import {
  createCampaignHandler,
  getCampaignByIdHandler,
  getCampaignsHandler,
  updateCampaignHandler,
  updateCampaignSequenceHandler,
} from '@server/api/campaigns/controllers';

import {
  createCampaignSchema,
  getCampaignByIdSchema,
  updateCampaignSchema,
  updateCampaignSequenceSchema,
} from './data/dtos';

export const campaignRoutes = createTRPCRouter({
  createCampaign: protectedProcedure.input(createCampaignSchema).mutation(createCampaignHandler),
  updateCampaign: protectedProcedure.input(updateCampaignSchema).mutation(updateCampaignHandler),
  updateSequences: protectedProcedure.input(updateCampaignSequenceSchema).mutation(updateCampaignSequenceHandler),
  getAllCampaigns: protectedProcedure.query(getCampaignsHandler),
  getCampaignById: protectedProcedure.input(getCampaignByIdSchema).query(getCampaignByIdHandler),
});
