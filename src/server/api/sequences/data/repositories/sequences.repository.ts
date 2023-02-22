import { prisma } from '@server/db';
import { logger } from '@utils/logger';

import type { Sequence } from '@prisma/client';
import type { CreateSequenceInput } from '@server/api/sequences/data/dtos';
import type { withUserOrgIds } from '@server/types/withUserOrgIds';

export const createSequence = async (
  payload: Omit<withUserOrgIds<CreateSequenceInput>, 'userId'>,
): Promise<Sequence> => {
  logger.info({ payload }, `Creating a new sequence for campaign ${payload.campaignId}`);

  const sequence = await prisma.sequence.create({
    data: payload,
  });

  logger.info({ sequence }, `Successfully created sequence ${sequence.id} for campaign ${payload.campaignId}`);

  return sequence;
};
