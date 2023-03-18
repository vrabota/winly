import React from 'react';
import { Button } from '@mantine/core';
import { IconPlus } from '@tabler/icons';

import { getProvidersModal } from './modals/getProvidersModal';

const ConnectAccount = () => {
  return (
    <Button radius="md" h={48} onClick={() => getProvidersModal()} leftIcon={<IconPlus size={18} />}>
      New Account
    </Button>
  );
};

export default ConnectAccount;
