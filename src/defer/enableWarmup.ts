import { defer } from '@defer/client';

import { WarmupService } from '@server/api/warmup/warmup.service';

import type { Account } from '@prisma/client';

async function enableWarmup(accounts: Account[], organizationId?: string) {
  const accountIds = accounts.map(account => account.id);
  console.log(`Enabling warmup in defer mode for accounts`, { accountIds });

  await WarmupService.enableWarmupService(accounts, organizationId);

  console.log(`Successfully enabled warmup in defer mode for accounts`, { accountIds });
}

export default defer(enableWarmup, { retry: 5 });
