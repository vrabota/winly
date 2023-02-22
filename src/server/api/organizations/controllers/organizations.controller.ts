import { TRPCError } from '@trpc/server';

import { getUserOrganizations } from '../data/repositories';

import type { Context } from '@server/api/trpc';

export const getOrganizationsHandler = async ({ ctx }: { ctx: Context }) => {
  try {
    return getUserOrganizations(ctx.user?.id);
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Unfortunately can not receive any organizations for user ${ctx.user?.id}.`,
      cause: error,
    });
  }
};
