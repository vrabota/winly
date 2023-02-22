import { DateRangePicker } from '@mantine/dates';
import { useController } from 'react-hook-form';
import { IconCalendar } from '@tabler/icons';

import ErrorMessage from './ErrorMessage';

import type { DateRangePickerProps } from '@mantine/dates';
import type { ReactNode } from 'react';

export const DateRangeField = (props: DateRangePickerProps & { label?: ReactNode; name: string }) => {
  const { label, name, ...rest } = props;
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name });

  const error = fieldError ? <ErrorMessage>{fieldError.message?.toString()}</ErrorMessage> : undefined;

  return (
    <DateRangePicker icon={<IconCalendar size={16} />} id={name} label={label} error={error} {...rest} {...field} />
  );
};
