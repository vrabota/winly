import { Container } from 'typedi';

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

const campaignsController = Container.get(CampaignsController);

export const campaignRoutes = createTRPCRouter({
  createCampaign: protectedProcedure.input(createCampaignSchema).mutation(campaignsController.createCampaignHandler),
  renameCampaign: protectedProcedure.input(renameCampaignSchema).mutation(campaignsController.renameCampaignHandler),
  updateCampaign: protectedProcedure.input(updateCampaignSchema).mutation(campaignsController.updateCampaignHandler),
  deleteCampaign: protectedProcedure.input(getCampaignByIdSchema).mutation(campaignsController.deleteCampaignHandler),
  startCampaign: protectedProcedure.input(getCampaignByIdSchema).mutation(campaignsController.startCampaignHandler),
  updateSequences: protectedProcedure
    .input(updateCampaignSequenceSchema)
    .mutation(campaignsController.updateCampaignSequenceHandler),
  getAllCampaigns: protectedProcedure.input(getAllCampaignsSchema).query(campaignsController.getCampaignsHandler),
  getCampaignById: protectedProcedure.input(getCampaignByIdSchema).query(campaignsController.getCampaignByIdHandler),
});
