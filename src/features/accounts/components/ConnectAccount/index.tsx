import React from 'react';
import { IconPlugConnected } from '@tabler/icons';
import { Button } from '@mantine/core';

import { getProvidersModal } from './modals/getProvidersModal';

const ConnectAccount = () => {
  return (
    <Button onClick={() => getProvidersModal()} leftIcon={<IconPlugConnected size={18} />}>
      Connect Account
    </Button>
  );
};

export default ConnectAccount;
