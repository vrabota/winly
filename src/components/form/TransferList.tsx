import { TransferList as MantineTransferList } from '@mantine/core';
import { useController } from 'react-hook-form';

import type { TransferListProps } from '@mantine/core';

export const TransferList = (props: Omit<TransferListProps, 'onChange' | 'value'> & { name: string }) => {
  const { name, ...rest } = props;
  const { field } = useController({ name });

  return <MantineTransferList id={name} {...rest} {...field} />;
};
