import { CampaignStatus } from '@prisma/client';

export const CAMPAIGN_STATUS_MAPPING: Record<CampaignStatus, { text: string; color: string }> = {
  [CampaignStatus.ACTIVE]: {
    text: 'Active',
    color: 'green',
  },
  [CampaignStatus.DRAFT]: {
    text: 'Draft',
    color: 'gray',
  },
  [CampaignStatus.PAUSE]: {
    text: 'Paused',
    color: 'blue',
  },
};
