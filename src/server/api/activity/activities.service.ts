import { TRPCError } from '@trpc/server';

import { emailApi } from '@utils/emailApi';
import { logger } from '@utils/logger';

import { LeadsRepository } from '../leads/leads.repository';

export class ActivitiesService {
  static async getThreadMessages(accountId: string, threadId: string): Promise<any> {
    try {
      const messages = [];
      const { data: searchData } = await emailApi.post(
        `/account/${accountId}/search?documentStore=false&path=[Gmail]/All Mail`,
        {
          search: { threadId },
        },
      );
      for (const message of searchData?.messages) {
        const lead = await LeadsRepository.getLeadByEmail(message?.from?.address);
        const { data: textData } = await emailApi.get(`/account/${accountId}/text/${message.text.id}`);
        messages.push({ ...message, bodyText: textData, lead });
      }
      return messages;
    } catch (error) {
      logger.info(
        { error },
        `Can not get thread messages from Email Engine service for thread ${threadId} and account ${accountId}.`,
      );

      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Unfortunately can not get thread messages from service.`,
        cause: error,
      });
    }
  }
}
