import { TRPCError } from '@trpc/server';
import { CampaignStatus } from '.prisma/client';

import { createTRPCRouter, protectedProcedure } from '@server/api/trpc';
import {
  createCampaignHandler,
  getCampaignByIdHandler,
  getCampaignsHandler,
  updateCampaignHandler,
  updateCampaignSequenceHandler,
  renameCampaignHandler,
  deleteCampaignHandler,
} from '@server/api/campaigns/controllers';
import { startCampaignService } from '@server/api/campaigns/data/services';
import { getCampaignById } from '@server/api/campaigns/data/repositories';
import { getLeads } from '@server/api/leads/data/repositories';
import { getAccountsByIds } from '@server/api/accounts/data/repositories';
import { createActivitiesRepository } from '@server/api/activity/data/repositories';

import {
  renameCampaignSchema,
  createCampaignSchema,
  getCampaignByIdSchema,
  updateCampaignSchema,
  updateCampaignSequenceSchema,
} from './data/dtos';

export const campaignRoutes = createTRPCRouter({
  createCampaign: protectedProcedure.input(createCampaignSchema).mutation(createCampaignHandler),
  renameCampaign: protectedProcedure.input(renameCampaignSchema).mutation(renameCampaignHandler),
  updateCampaign: protectedProcedure.input(updateCampaignSchema).mutation(updateCampaignHandler),
  deleteCampaign: protectedProcedure.input(getCampaignByIdSchema).mutation(deleteCampaignHandler),
  startCampaign: protectedProcedure.input(getCampaignByIdSchema).mutation(async ({ input, ctx }) => {
    const campaign = await getCampaignById({ userId: ctx.user.id, organizationId: ctx.organizationId, ...input });
    const leads = await getLeads({ campaignId: input.campaignId });
    const accounts = await getAccountsByIds(campaign?.accountIds as string[]);

    await ctx.prisma.campaign.update({ where: { id: campaign?.id }, data: { status: CampaignStatus.ACTIVE } });

    if (!campaign) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Unfortunately can not find campaign with id ${input.campaignId}.`,
      });
    }

    const accountMessages = await startCampaignService({ campaign, leads, accounts });
    const messages = accountMessages.map(message => ({
      campaignId: campaign.id,
      messageId: message.messageId as string,
      leadEmail: message.to?.address as string,
      queueId: message.queueId,
      accountId: message.accountId,
      step: message.step,
    }));
    await createActivitiesRepository(messages);
  }),
  updateSequences: protectedProcedure.input(updateCampaignSequenceSchema).mutation(updateCampaignSequenceHandler),
  getAllCampaigns: protectedProcedure.query(getCampaignsHandler),
  getCampaignById: protectedProcedure.input(getCampaignByIdSchema).query(getCampaignByIdHandler),
});
