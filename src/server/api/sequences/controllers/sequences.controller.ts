import { TRPCError } from '@trpc/server';

import { createSequence } from '../data/repositories';

import type { CreateSequenceInput } from '../data/dtos';
import type { Context } from '@server/api/trpc';

export const createSequenceHandler = async ({ ctx, input }: { ctx: Context; input: CreateSequenceInput }) => {
  try {
    return createSequence({
      organizationId: ctx.organizationId,
      ...input,
    });
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Unfortunately can not create sequence for the campaign ${input.campaignId}.`,
      cause: error,
    });
  }
};
