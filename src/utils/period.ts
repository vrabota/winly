import dayjs from 'dayjs';

import { DateRanges } from '@features/campaigns/utils';

export const getPeriodDates = (period: DateRanges, customPeriod?: (Date | null)[]) => {
  const dateMapping: Record<DateRanges, string[]> = {
    [DateRanges.Week]: [dayjs().startOf('day').subtract(7, 'days').toISOString(), dayjs().startOf('day').toISOString()],
    [DateRanges.Month]: [
      dayjs().startOf('day').subtract(1, 'months').toISOString(),
      dayjs().startOf('day').toISOString(),
    ],
    [DateRanges.ThreeMonths]: [
      dayjs().startOf('day').subtract(3, 'months').toISOString(),
      dayjs().startOf('day').toISOString(),
    ],
    [DateRanges.SixMonths]: [
      dayjs().startOf('day').subtract(6, 'months').toISOString(),
      dayjs().startOf('day').toISOString(),
    ],
    [DateRanges.Year]: [dayjs().startOf('day').subtract(1, 'y').toISOString(), dayjs().startOf('day').toISOString()],
    [DateRanges.CustomRange]: [dayjs(customPeriod?.[0]).toISOString(), dayjs(customPeriod?.[1]).toISOString()],
  };
  return dateMapping[period];
};
