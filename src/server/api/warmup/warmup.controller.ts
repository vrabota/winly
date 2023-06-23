import { logger } from '@utils/logger';

import { WarmupService } from './warmup.service';

import type { Context } from '@server/api/trpc';
import type { WarmupInput } from './warmup.dto';

export class WarmupController {
  static async enableWarmupHandler({ input, ctx }: { input: WarmupInput; ctx: Context }) {
    logger.info(`Enabling warmup service for account ${input.accountId}`);

    const account = await ctx.prisma.account.update({ where: { id: input.accountId }, data: { warmupState: true } });
    await WarmupService.enableWarmupService([account], ctx.organizationId);

    logger.info(`Successfully enabled warmup service for account ${input.accountId}`);

    return { message: 'Warmup enabled' };
  }
}
