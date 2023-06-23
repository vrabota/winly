import axios from 'axios';

import { prisma } from '@server/db';
import { baseUrl } from '@utils/baseUrl';

import type { Account } from '@prisma/client';

export class WarmupService {
  static async enableWarmupService(accounts: Account[], organizationId: string): Promise<any> {
    for (const account of accounts) {
      const currentMaxLimit = typeof account?.currentMaxLimit === 'number' ? account?.currentMaxLimit : 0;
      const dailyMaxLimit = typeof account?.dailyMaxLimit === 'number' ? account?.dailyMaxLimit : 0;
      const stepLimit = typeof account?.stepLimit === 'number' ? account?.stepLimit : 0;

      console.log('wtf', currentMaxLimit, dailyMaxLimit);

      // We call this endpoint to generate an email for us using AI
      for (let i = 0; i <= Array.from({ length: currentMaxLimit }).length; i++) {
        const toAccount =
          await prisma.$queryRaw<any>`SELECT * FROM accounts WHERE id <> ${account.id} ORDER BY RAND() LIMIT 1`;
        const system = {
          role: 'system',
          content: `
          You are an email system that generate short random email messages between 2 different accounts.
          It's ok to have same recepient and sender name.
          You need to discuss on some random work topics.
          Please resond back with a short subject and body.
          Respond should be only in JSON format as example { "subject": "subject message", "body": "body message" } without any additional text`,
        };
        const user = {
          role: 'user',
          content: `Generate an email text for recepient ${toAccount[0]['first_name']}, email will be sent by ${account.firstName}.`,
        };

        // prepare instruction for AI to generate message
        // we need to generate subject and body with this data { from: { email, code, firstName, lastName } } to: { email, code, firstName, lastName }
        await axios.post(`${baseUrl}/api/email-ai`, {
          messages: [system, user],
          from: account,
          to: toAccount[0],
          organizationId,
        });
      }

      if (currentMaxLimit < dailyMaxLimit) {
        await prisma.account.update({
          where: { id: account.id },
          data: { currentMaxLimit: currentMaxLimit + stepLimit },
        });
      }
    }
  }
}
