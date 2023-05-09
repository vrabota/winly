import { createTRPCRouter, protectedProcedure } from '@server/api/trpc';

import {
  renameCampaignSchema,
  createCampaignSchema,
  getCampaignByIdSchema,
  updateCampaignSchema,
  updateCampaignSequenceSchema,
  getAllCampaignsSchema,
} from './campaigns.dto';
import { CampaignsController } from './campaigns.controller';

export const campaignRoutes = createTRPCRouter({
  createCampaign: protectedProcedure.input(createCampaignSchema).mutation(CampaignsController.createCampaignHandler),
  renameCampaign: protectedProcedure.input(renameCampaignSchema).mutation(CampaignsController.renameCampaignHandler),
  updateCampaign: protectedProcedure.input(updateCampaignSchema).mutation(CampaignsController.updateCampaignHandler),
  deleteCampaign: protectedProcedure.input(getCampaignByIdSchema).mutation(CampaignsController.deleteCampaignHandler),
  startCampaign: protectedProcedure.input(getCampaignByIdSchema).mutation(CampaignsController.startCampaignHandler),
  stopCampaign: protectedProcedure.input(getCampaignByIdSchema).mutation(CampaignsController.stopCampaignHandler),
  updateSequences: protectedProcedure
    .input(updateCampaignSequenceSchema)
    .mutation(CampaignsController.updateCampaignSequenceHandler),
  getAllCampaigns: protectedProcedure.input(getAllCampaignsSchema).query(CampaignsController.getCampaignsHandler),
  getCampaignById: protectedProcedure.input(getCampaignByIdSchema).query(CampaignsController.getCampaignByIdHandler),
});
