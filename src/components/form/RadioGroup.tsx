import { Radio as MantineRadio } from '@mantine/core';
import { useController } from 'react-hook-form';

import ErrorMessage from './ErrorMessage';

import type { ReactNode } from 'react';
import type { RadioGroupProps } from '@mantine/core';

export const RadioGroup = (
  props: Omit<RadioGroupProps, 'onChange' | 'value'> & { name: string; children: ReactNode },
) => {
  const { name, ...rest } = props;
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name });

  const error = fieldError ? <ErrorMessage>{fieldError.message?.toString()}</ErrorMessage> : undefined;

  return (
    <MantineRadio.Group id={name} {...rest} error={error} {...field}>
      {props.children}
    </MantineRadio.Group>
  );
};
