import { z } from 'zod';

import type { TypeOf } from 'zod';

export const warmupAccount = z.object({ accountId: z.string() });

export type WarmupInput = TypeOf<typeof warmupAccount>;
