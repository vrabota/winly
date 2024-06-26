import { z } from 'zod';
import { AccountState } from '@prisma/client';

import type { components } from '@schema/api';
import type { TypeOf } from 'zod';

export const oauth2AccountSchema = z.object({ code: z.string() });
export const appPasswordAccountSchema = z.object({
  appPassword: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email(),
});

export const accountsSchema = z.object({
  organizationId: z.string(),
  search: z.string().trim().min(1).optional(),
  accountState: z.nativeEnum(AccountState).array().optional(),
  limit: z.number().min(1).max(100).nullish(),
  cursor: z.string().nullish(),
  withStats: z.boolean().optional(),
});

export const accountIdSchema = z.object({
  accountId: z.string(),
});

export type Oauth2AccountInput = TypeOf<typeof oauth2AccountSchema>;
export type AccountsInput = TypeOf<typeof accountsSchema>;
export type AppPasswordAccountInput = TypeOf<typeof appPasswordAccountSchema>;
export type AccountIdInput = TypeOf<typeof accountIdSchema>;

export type AccountReconnectOutput = components['schemas']['RequestReconnectResponse'];
export type AccountDeleteOutput = components['schemas']['DeleteAppRequestResponse'];
