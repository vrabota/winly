import { TRPCError } from '@trpc/server';
import { CampaignStatus } from '.prisma/client';

import { logger } from '@utils/logger';
import { AccountsRepository } from '@server/api/accounts/accounts.repository';
import { LeadsRepository } from '@server/api/leads/leads.repository';
import startCampaign from 'defer/startCampaign';

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

export class CampaignsController {
  static async createCampaignHandler({ ctx, input }: { ctx: Context; input: CreateCampaignInput }) {
    logger.info({ input }, `Creating campaign ${input.name}`);

    const createdCampaign = await CampaignsRepository.createCampaign({
      userId: ctx.user.id,
      organizationId: ctx.organizationId,
      ...input,
    });

    logger.info({ createdCampaign }, `Successfully created campaign ${createdCampaign.name}`);

    return createdCampaign;
  }

  static async getCampaignsHandler({ ctx, input }: { ctx: Context; input: GetAllCampaignsInput }) {
    logger.info({ input }, `Getting all campaigns for user ${ctx.user.id} and organization ${input.organizationId}`);

    const campaigns = await CampaignsRepository.getCampaigns({
      userId: ctx.user.id,
      organizationId: ctx.organizationId,
      withStats: input.withStats,
      search: input.search,
      campaignStatus: input.campaignStatus,
      limit: input.limit,
      cursor: input.cursor,
    });

    logger.info({ campaigns }, `Successfully returned list of all campaigns for organization ${input.organizationId}`);

    return campaigns;
  }

  static async getCampaignByIdHandler({ ctx, input }: { ctx: Context; input: GetCampaignByIdInput }) {
    logger.info({ input }, `Getting campaign with id ${input.campaignId}`);

    const campaign = await CampaignsRepository.getCampaignById({
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

  static async updateCampaignHandler({ ctx, input }: { ctx: Context; input: UpdateCampaignInput }) {
    logger.info({ input }, `Updating campaign ${input.campaignId}`);

    const updatedCampaign = await CampaignsRepository.updateCampaign({ userId: ctx.user.id, ...input });

    logger.info({ updatedCampaign }, `Successfully updated campaign ${updatedCampaign.id}`);

    return updatedCampaign;
  }

  static async updateCampaignSequenceHandler({ ctx, input }: { ctx: Context; input: UpdateCampaignSequenceInput }) {
    logger.info({ input }, `Updating campaign sequences.`);

    const campaign = await CampaignsRepository.updateCampaignSequences({ userId: ctx.user.id, ...input });

    logger.info({ campaign }, `Successfully updated campaign sequences ${campaign.id}`);

    return campaign;
  }

  static async renameCampaignHandler({ input }: { input: RenameCampaignInput }) {
    logger.info({ input }, `Updating campaign name ${input.name}`);

    const campaign = await CampaignsRepository.renameCampaign(input);

    logger.info({ campaign }, `Successfully updated campaign name ${campaign.name}`);

    return campaign;
  }

  static async deleteCampaignHandler({ input }: { input: GetCampaignByIdInput }) {
    logger.info({ input }, `Deleting campaign ${input.campaignId}`);

    const campaign = await CampaignsRepository.deleteCampaign(input);

    logger.info({ campaign }, `Successfully deleted campaign ${campaign.id}`);

    return campaign;
  }

  static async startCampaignHandler({ ctx, input }: { ctx: Context; input: GetCampaignByIdInput }) {
    logger.info({ input }, `Starting campaign ${input.campaignId}`);

    const campaign = await CampaignsRepository.getCampaignById({
      ...input,
      userId: ctx.user.id,
      organizationId: input?.organizationId || ctx.organizationId,
    });
    const { items: leads } = await LeadsRepository.getLeads({
      campaignId: input.campaignId,
      organizationId: ctx.organizationId,
    });
    const accounts = await AccountsRepository.getAccountsByIds(campaign?.accountIds as string[]);

    await ctx.prisma.campaign.update({ where: { id: campaign?.id }, data: { status: CampaignStatus.ACTIVE } });

    if (!campaign) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Unfortunately can not find campaign with id ${input.campaignId}.`,
      });
    }

    await startCampaign({ campaign, leads, accounts, organizationId: ctx.organizationId });

    logger.info({ campaign }, `Successfully started campaign ${input.campaignId}`);

    return campaign;
  }
  static async stopCampaignHandler({ input }: { ctx: Context; input: GetCampaignByIdInput }) {
    logger.info({ input }, `Stopping campaign ${input.campaignId}`);

    const response = await CampaignsRepository.stopCampaign(input);

    logger.info({ input }, response?.message);
  }
}
