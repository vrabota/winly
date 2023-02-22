import { z } from 'zod';

import type { components } from '@schema/api';
import type { TypeOf } from 'zod';

export const oauth2AccountSchema = z.object({ code: z.string() });
export const appPasswordAccountSchema = z.object({
  appPassword: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email(),
});

export type Oauth2AccountInput = TypeOf<typeof oauth2AccountSchema>;
export type AppPasswordAccountInput = TypeOf<typeof appPasswordAccountSchema>;

export type AccountsListOutput = components['schemas']['AccountsFilterResponse'];
