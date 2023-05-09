import React, { createContext, useState } from 'react';

import { DateRanges } from '@features/campaigns/utils';

import type { DateRangePickerValue } from '@mantine/dates';
import type { ReactNode, Dispatch, SetStateAction } from 'react';

interface DatePeriodContextProps {
  datePeriod: string | null;
  setDatePeriod?: (value: string | null) => void;
  setCustomDateRange?: Dispatch<SetStateAction<DateRangePickerValue | undefined>>;
  customDateRange?: DateRangePickerValue;
}

export const DatePeriodContext = createContext<DatePeriodContextProps>({ datePeriod: DateRanges.Week });

export const DatePeriodProvider = ({ children }: { children: ReactNode }) => {
  const [datePeriod, setDatePeriod] = useState<string | null>('week');
  const [customDateRange, setCustomDateRange] = useState<DateRangePickerValue>();

  return (
    <DatePeriodContext.Provider value={{ datePeriod, setDatePeriod, customDateRange, setCustomDateRange }}>
      {children}
    </DatePeriodContext.Provider>
  );
};
