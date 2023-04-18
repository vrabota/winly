import { TRPCError } from '@trpc/server';

import {
  renameCampaign,
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  updateCampaignSequences,
  deleteCampaign,
} from '../data/repositories';

import type {
  CreateCampaignInput,
  GetCampaignByIdInput,
  UpdateCampaignInput,
  SequencesType,
  UpdateCampaignSequenceInput,
  RenameCampaignInput,
  GetAllCampaignsInput,
} from '../data/dtos';
import type { Context } from '@server/api/trpc';

export const createCampaignHandler = async ({ ctx, input }: { ctx: Context; input: CreateCampaignInput }) => {
  try {
    return createCampaign({ userId: ctx.user.id, organizationId: ctx.organizationId, ...input });
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Unfortunately can not create a new campaign for user ${ctx.user.id}.`,
      cause: error,
    });
  }
};

export const getCampaignsHandler = async ({ ctx, input }: { ctx: Context; input: GetAllCampaignsInput }) => {
  try {
    return getCampaigns({ userId: ctx.user.id, organizationId: ctx.organizationId, withStats: input.withStats });
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Unfortunately can not receive any campaign for user ${ctx.user.id}.`,
      cause: error,
    });
  }
};

export const getCampaignByIdHandler = async ({ ctx, input }: { ctx: Context; input: GetCampaignByIdInput }) => {
  try {
    const campaign = await getCampaignById({ userId: ctx.user.id, organizationId: ctx.organizationId, ...input });

    if (!campaign) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `Unfortunately can not find campaign with id ${input.campaignId}.`,
      });
    }
    const timing = campaign.time as { from: string; to: string };

    return {
      ...campaign,
      sequences: campaign.sequences as SequencesType[],
      scheduleDays: campaign.scheduleDays as string[],
      accountIds: campaign.accountIds as string[],
      time: { from: timing?.from, to: timing?.to },
    };
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Unfortunately can not get campaign for user ${ctx.user.id}.`,
      cause: error,
    });
  }
};

export const updateCampaignHandler = async ({ ctx, input }: { ctx: Context; input: UpdateCampaignInput }) => {
  try {
    return updateCampaign({ userId: ctx.user.id, ...input });
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Unfortunately can not update campaign ${input.campaignId} for user ${ctx.user.id}.`,
      cause: error,
    });
  }
};

export const updateCampaignSequenceHandler = async ({
  ctx,
  input,
}: {
  ctx: Context;
  input: UpdateCampaignSequenceInput;
}) => {
  try {
    return updateCampaignSequences({ userId: ctx.user.id, ...input });
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Unfortunately can not update ${input.campaignId} campaign sequences for user ${ctx.user.id}.`,
      cause: error,
    });
  }
};

export const renameCampaignHandler = async ({ input }: { input: RenameCampaignInput }) => {
  return renameCampaign(input);
};

export const deleteCampaignHandler = async ({ input }: { input: GetCampaignByIdInput }) => {
  return deleteCampaign(input);
};
