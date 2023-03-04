import { prisma } from '@server/db';

import type { CreateActivityInput } from '@server/api/activity/data/dtos';
import type { Prisma } from '@prisma/client';

export const createActivitiesRepository = async (payload: CreateActivityInput[]): Promise<Prisma.BatchPayload> => {
  return prisma.activity.createMany({ data: payload });
};
