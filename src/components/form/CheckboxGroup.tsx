import { Checkbox as MantineCheckbox } from '@mantine/core';
import { useController } from 'react-hook-form';

import ErrorMessage from './ErrorMessage';

import type { ReactNode } from 'react';
import type { CheckboxGroupProps } from '@mantine/core';

export const CheckboxGroup = (
  props: Omit<CheckboxGroupProps, 'onChange' | 'value'> & { name: string; children: ReactNode },
) => {
  const { name, ...rest } = props;
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name });

  const error = fieldError ? <ErrorMessage>{fieldError.message?.toString()}</ErrorMessage> : undefined;

  return (
    <MantineCheckbox.Group id={name} {...rest} error={error} {...field}>
      {props.children}
    </MantineCheckbox.Group>
  );
};
