import { TransferList as MantineTransferList } from '@mantine/core';
import { useController } from 'react-hook-form';

import ErrorMessage from './ErrorMessage';

import type { TransferListProps } from '@mantine/core';

export const TransferList = (props: Omit<TransferListProps, 'onChange' | 'value'> & { name: string }) => {
  const { name, ...rest } = props;
  const {
    field,
    fieldState: { error: fieldError },
  } = useController({ name });

  const error = fieldError ? <ErrorMessage>{fieldError.message?.toString()}</ErrorMessage> : undefined;

  return <MantineTransferList id={name} {...rest} {...field} />;
};
