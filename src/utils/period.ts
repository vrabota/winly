import dayjs from 'dayjs';

import { DateRanges } from '@features/campaigns/utils';

export const getPeriodDates = (period: DateRanges, customPeriod?: (Date | null)[]) => {
  const dateMapping: Record<DateRanges, string[]> = {
    [DateRanges.Week]: [dayjs().subtract(7, 'days').toISOString(), dayjs().toISOString()],
    [DateRanges.Month]: [dayjs().subtract(1, 'months').toISOString(), dayjs().toISOString()],
    [DateRanges.ThreeMonths]: [dayjs().subtract(3, 'months').toISOString(), dayjs().toISOString()],
    [DateRanges.SixMonths]: [dayjs().subtract(6, 'months').toISOString(), dayjs().toISOString()],
    [DateRanges.Year]: [dayjs().subtract(1, 'y').toISOString(), dayjs().toISOString()],
    [DateRanges.CustomRange]: [dayjs(customPeriod?.[0]).toISOString(), dayjs(customPeriod?.[1]).toISOString()],
  };
  return dateMapping[period];
};
