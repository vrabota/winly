import { TRPCError } from '@trpc/server';
import { Container, Service } from 'typedi';

import { OrganizationsRepository } from '@server/api/organizations/organizations.repository';
import { emailApi } from '@utils/emailApi';
import { prisma } from '@server/db';
import { logger } from '@utils/logger';

import type { Context } from '@server/api/trpc';

@Service()
export class InfoController {
  async getInitHandler({ ctx }: { ctx: Context }) {
    logger.info(`Trying to init the app for user ${ctx.user?.id}.`);

    const organizationsRepository = Container.get(OrganizationsRepository);

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

    const organizations = organizationsRepository.getUserOrganizations(ctx.user?.id);

    logger.info({ organizations }, `Successfully returned init list of organizations`);

    return organizations;
  }
}
