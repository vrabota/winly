import { TRPCError } from '@trpc/server';

import { getLeads, createLead, batchCreateLeads } from '../data/repositories';

import type { withOrgId } from '@server/types/withUserOrgIds';
import type { GetLeadsInput, CreateLeadsInput } from '../data/dtos';
import type { Context } from '@server/api/trpc';

export const getLeadsHandler = async ({ ctx, input }: { ctx: Context; input: GetLeadsInput }) => {
  try {
    return getLeads({
      organizationId: ctx.organizationId,
      campaignId: input.campaignId,
    });
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Unfortunately can not receive any leads for campaign ${input.campaignId}.`,
      cause: error,
    });
  }
};

export const createLeadHandler = async ({ ctx, input }: { ctx: Context; input: CreateLeadsInput }) => {
  try {
    return createLead({
      organizationId: ctx.organizationId,
      ...input,
    });
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Unfortunately can not create ${input.email} lead for the campaign ${input.campaignId}.`,
      cause: error,
    });
  }
};

export const batchCreateLeadsHandler = async ({ ctx, input }: { ctx: Context; input: CreateLeadsInput[] }) => {
  try {
    const payload: withOrgId<CreateLeadsInput>[] = input.map(item => ({
      ...item,
      organizationId: ctx.organizationId,
    }));
    return batchCreateLeads(payload);
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Unfortunately can not batch create leads for the campaign.`,
      cause: error,
    });
  }
};
