import { TRPCError } from '@trpc/server';

import { getLeads, createLead, batchCreateLeads } from '../data/repositories';

import type { GetLeadsInput, CreateLeadsInput } from '../data/dtos';
import type { Context } from '@server/api/trpc';

export const getLeadsHandler = async ({ input }: { input: GetLeadsInput }) => {
  try {
    return getLeads({
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

export const createLeadHandler = async ({ input }: { input: CreateLeadsInput }) => {
  try {
    return createLead(input);
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Unfortunately can not create ${input.email} lead for the campaign ${input.campaignId}.`,
      cause: error,
    });
  }
};

export const batchCreateLeadsHandler = async ({ input }: { ctx: Context; input: CreateLeadsInput[] }) => {
  try {
    return batchCreateLeads(input);
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Unfortunately can not batch create leads for the campaign.`,
      cause: error,
    });
  }
};
