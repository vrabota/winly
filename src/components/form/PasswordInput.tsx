import { PasswordInput as MantinePasswordInput } from '@mantine/core';
import { useController } from 'react-hook-form';

import ErrorMessage from './ErrorMessage';

import type { ReactNode } from 'react';
import type { PasswordInputProps } from '@mantine/core';

export const PasswordInput = (props: PasswordInputProps & { label?: ReactNode; name: string }) => {
  const { label, name, ...rest } = props;
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name });

  const error = fieldError ? <ErrorMessage>{fieldError.message?.toString()}</ErrorMessage> : undefined;

  return <MantinePasswordInput id={name} label={label} error={error} {...rest} {...field} />;
};
