import { defer } from '@defer/client';

import { ActivityRepository } from '@server/api/activity/activity.repository';
import { CampaignsService } from '@server/api/campaigns/campaigns.service';

async function startCampaign({ campaign, leads, accounts, organizationId }: any) {
  console.log(`Starting camapign in defer mode ${campaign?.id}`);

  const accountMessages = await CampaignsService.startCampaign({ campaign, leads, accounts });
  const messages = accountMessages.map(message => ({
    campaignId: campaign.id,
    organizationId: organizationId,
    messageId: message.messageId as string,
    leadEmail: message.to?.address as string,
    queueId: message.queueId,
    accountId: message.accountId,
    step: message.step,
  }));

  await ActivityRepository.createActivitiesRepository(messages);

  console.log(`Successfully started campaign in defer mode ${campaign?.id}`);
}

export default defer(startCampaign);
