import { CampaignStatus } from '@prisma/client';

export const CAMPAIGN_STATUS_MAPPING: Record<CampaignStatus, { text: string; color: string }> = {
  [CampaignStatus.ACTIVE]: {
    text: 'Active',
    color: 'blue',
  },
  [CampaignStatus.DRAFT]: {
    text: 'Draft',
    color: 'gray',
  },
  [CampaignStatus.PAUSE]: {
    text: 'Stopped',
    color: 'gray',
  },
};

export enum DateRanges {
  Week = 'week',
  Month = 'month',
  ThreeMonths = 'three-months',
  SixMonths = 'six-months',
  Year = 'year',
  CustomRange = 'custom-range',
}

export const CAMPAIGN_DATE_RANGE_LABELS: Record<DateRanges, string> = {
  [DateRanges.Week]: 'Last 7 days',
  [DateRanges.Month]: 'Last month',
  [DateRanges.ThreeMonths]: 'Last 3 months',
  [DateRanges.SixMonths]: 'Last 6 months',
  [DateRanges.Year]: 'Last year',
  [DateRanges.CustomRange]: 'Custom range',
};
