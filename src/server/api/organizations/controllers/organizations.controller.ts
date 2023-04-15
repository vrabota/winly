import { TRPCError } from '@trpc/server';

import { getUserOrganizations, updateOrganization } from '../data/repositories';

import type { UpdateOrganizationInput } from '../data/dtos';
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

export const updateOrganizationHandler = async ({ ctx, input }: { ctx: Context; input: UpdateOrganizationInput }) => {
  return updateOrganization({ organizationId: ctx.organizationId, name: input.name });
};
