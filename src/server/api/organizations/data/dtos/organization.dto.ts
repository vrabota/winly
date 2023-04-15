import { z } from 'zod';

import type { TypeOf } from 'zod';

export const updateOrganizationSchema = z.object({ name: z.string() });

export type UpdateOrganizationInput = TypeOf<typeof updateOrganizationSchema>;
