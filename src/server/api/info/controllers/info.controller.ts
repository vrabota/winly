import { TRPCError } from '@trpc/server';

import { getUserOrganizations } from '@server/api/organizations/data/repositories';
import { emailApi } from '@utils/emailApi';
import { prisma } from '@server/db';
import { logger } from '@utils/logger';

import type { Context } from '@server/api/trpc';

export const getInitHandler = async ({ ctx }: { ctx: Context }) => {
  try {
    await emailApi.get('/license');
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Unfortunately can't init app`,
      cause: error,
    });
  }
  const { email, family_name, given_name, picture, sub: userId } = ctx.session.user;
  const payload = {
    auth0Id: userId,
    firstName: given_name,
    lastName: family_name,
    email,
    picture,
  };

  const userById = await prisma.user.findUnique({ where: { auth0Id: userId } });

  if (!userById) {
    const createdUser = await prisma.user.create({
      data: payload,
    });
    const createdOrganization = await prisma.organization.create({
      data: {
        users: { connect: { id: createdUser.id } },
        ownerId: createdUser.id,
      },
    });
    logger.info(
      { data: { createdUser, createdOrganization } },
      `Successfully created account with id ${userId} and email ${email}`,
    );
  }

  return getUserOrganizations(ctx.user?.id);
};
