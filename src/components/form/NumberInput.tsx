import { NumberInput as MantineNumberInput } from '@mantine/core';
import { useController } from 'react-hook-form';

import ErrorMessage from './ErrorMessage';

import type { ReactNode } from 'react';
import type { NumberInputProps } from '@mantine/core';

export const NumberInput = (props: NumberInputProps & { label?: ReactNode; name: string }) => {
  const { label, name, ...rest } = props;
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name });

  const error = fieldError ? <ErrorMessage>{fieldError.message?.toString()}</ErrorMessage> : undefined;

  return <MantineNumberInput id={name} label={label} error={error} {...rest} {...field} />;
};
