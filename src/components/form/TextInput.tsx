import { TextInput as MantineTextInput } from '@mantine/core';
import { useController } from 'react-hook-form';

import ErrorMessage from './ErrorMessage';

import type { ReactNode } from 'react';
import type { TextInputProps } from '@mantine/core';

export const TextInput = (props: TextInputProps & { label?: ReactNode; name: string }) => {
  const { label, name, ...rest } = props;
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name });

  const error = fieldError ? <ErrorMessage>{fieldError.message?.toString()}</ErrorMessage> : undefined;

  return <MantineTextInput id={name} label={label} error={error} {...rest} {...field} />;
};
