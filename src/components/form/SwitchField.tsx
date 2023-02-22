import { Switch } from '@mantine/core';
import { useController } from 'react-hook-form';

import ErrorMessage from './ErrorMessage';

import type { ReactNode } from 'react';
import type { SwitchProps } from '@mantine/core';

export const SwitchField = (props: SwitchProps & { label?: ReactNode; name: string }) => {
  const { label, name, ...rest } = props;
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name });

  const error = fieldError ? <ErrorMessage>{fieldError.message?.toString()}</ErrorMessage> : undefined;

  return <Switch id={name} label={label} error={error} {...rest} checked={field.value} {...field} />;
};
