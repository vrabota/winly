import { TRPCError } from '@trpc/server';
import { Container, Service } from 'typedi';
import { CampaignStatus } from '.prisma/client';

import { logger } from '@utils/logger';
import { AccountsRepository } from '@server/api/accounts/accounts.repository';
import { ActivityRepository } from '@server/api/activity/activity.repository';
import { CampaignsService } from '@server/api/campaigns/campaigns.service';
import { LeadsRepository } from '@server/api/leads/leads.repository';

import { CampaignsRepository } from './campaigns.repository';

import type {
  CreateCampaignInput,
  GetCampaignByIdInput,
  UpdateCampaignInput,
  SequencesType,
  UpdateCampaignSequenceInput,
  RenameCampaignInput,
  GetAllCampaignsInput,
} from './campaigns.dto';
import type { Context } from '@server/api/trpc';

@Service()
export class CampaignsController {
  async createCampaignHandler({ ctx, input }: { ctx: Context; input: CreateCampaignInput }) {
    logger.info({ input }, `Creating campaign ${input.name}`);

    const campaignsRepository = Container.get(CampaignsRepository);
    const createdCampaign = await campaignsRepository.createCampaign({
      userId: ctx.user.id,
      organizationId: ctx.organizationId,
      ...input,
    });

    logger.info({ createdCampaign }, `Successfully created campaign ${createdCampaign.name}`);

    return createdCampaign;
  }

  async getCampaignsHandler({ ctx, input }: { ctx: Context; input: GetAllCampaignsInput }) {
    logger.info({ input }, `Getting all campaigns for user ${ctx.user.id} and organization ${input.organizationId}`);

    const campaignsRepository = Container.get(CampaignsRepository);
    const campaigns = await campaignsRepository.getCampaigns({
      userId: ctx.user.id,
      organizationId: ctx.organizationId,
      withStats: input.withStats,
    });

    logger.info({ campaigns }, `Successfully returned list of all campaigns for organization ${input.organizationId}`);

    return campaigns;
  }

  async getCampaignByIdHandler({ ctx, input }: { ctx: Context; input: GetCampaignByIdInput }) {
    logger.info({ input }, `Getting campaign with id ${input.campaignId}`);

    const campaignsRepository = Container.get(CampaignsRepository);
    const campaign = await campaignsRepository.getCampaignById({
      ...input,
      userId: ctx.user.id,
      organizationId: input?.organizationId || ctx.organizationId,
    });

    if (!campaign) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Unfortunately can not find campaign with id ${input.campaignId}.`,
      });
    }

    const timing = campaign.time as { from: string; to: string };

    const campaignResponse = {
      ...campaign,
      sequences: campaign.sequences as SequencesType[],
      scheduleDays: campaign.scheduleDays as string[],
      accountIds: campaign.accountIds as string[],
      time: { from: timing?.from, to: timing?.to },
    };

    logger.info({ campaignResponse }, `Successfully returned campaign with id ${campaignResponse.id}`);

    return campaignResponse;
  }

  async updateCampaignHandler({ ctx, input }: { ctx: Context; input: UpdateCampaignInput }) {
    logger.info({ input }, `Updating campaign ${input.campaignId}`);

    const campaignsRepository = Container.get(CampaignsRepository);
    const updatedCampaign = await campaignsRepository.updateCampaign({ userId: ctx.user.id, ...input });

    logger.info({ updatedCampaign }, `Successfully updated campaign ${updatedCampaign.id}`);

    return updatedCampaign;
  }

  async updateCampaignSequenceHandler({ ctx, input }: { ctx: Context; input: UpdateCampaignSequenceInput }) {
    logger.info({ input }, `Updating campaign sequences.`);

    const campaignsRepository = Container.get(CampaignsRepository);
    const campaign = await campaignsRepository.updateCampaignSequences({ userId: ctx.user.id, ...input });

    logger.info({ campaign }, `Successfully updated campaign sequences ${campaign.id}`);

    return campaign;
  }

  async renameCampaignHandler({ input }: { input: RenameCampaignInput }) {
    logger.info({ input }, `Updating campaign name ${input.name}`);

    const campaignsRepository = Container.get(CampaignsRepository);
    const campaign = await campaignsRepository.renameCampaign(input);

    logger.info({ campaign }, `Successfully updated campaign name ${campaign.name}`);

    return campaign;
  }

  async deleteCampaignHandler({ input }: { input: GetCampaignByIdInput }) {
    logger.info({ input }, `Deleting campaign ${input.campaignId}`);

    const campaignsRepository = Container.get(CampaignsRepository);
    const campaign = await campaignsRepository.deleteCampaign(input);

    logger.info({ campaign }, `Successfully deleted campaign ${campaign.id}`);

    return campaign;
  }

  async startCampaignHandler({ ctx, input }: { ctx: Context; input: GetCampaignByIdInput }) {
    logger.info({ input }, `Starting campaign ${input.campaignId}`);

    const accountsRepository = Container.get(AccountsRepository);
    const activityRepository = Container.get(ActivityRepository);
    const campaignsRepository = Container.get(CampaignsRepository);
    const campaignsService = Container.get(CampaignsService);
    const leadsRepository = Container.get(LeadsRepository);

    const campaign = await campaignsRepository.getCampaignById({
      ...input,
      userId: ctx.user.id,
      organizationId: input?.organizationId || ctx.organizationId,
    });
    const leads = await leadsRepository.getLeads({ campaignId: input.campaignId, organizationId: ctx.organizationId });
    const accounts = await accountsRepository.getAccountsByIds(campaign?.accountIds as string[]);

    await ctx.prisma.campaign.update({ where: { id: campaign?.id }, data: { status: CampaignStatus.ACTIVE } });

    if (!campaign) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Unfortunately can not find campaign with id ${input.campaignId}.`,
      });
    }

    const accountMessages = await campaignsService.startCampaign({ campaign, leads, accounts });
    const messages = accountMessages.map(message => ({
      campaignId: campaign.id,
      organizationId: ctx.organizationId,
      messageId: message.messageId as string,
      leadEmail: message.to?.address as string,
      queueId: message.queueId,
      accountId: message.accountId,
      step: message.step,
    }));

    await activityRepository.createActivitiesRepository(messages);

    logger.info({ campaign }, `Successfully started campaign ${input.campaignId}`);

    return campaign;
  }
}
