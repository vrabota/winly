import { openConfirmModal } from '@mantine/modals';
import { Divider, Title, Stack, Alert } from '@mantine/core';
import { IconBulb } from '@tabler/icons';
import React from 'react';

import AddManualLeadsForm from './AddManualLeadsForm';

export const addLeadsModal = () => {
  return openConfirmModal({
    size: 600,
    closeOnConfirm: false,
    confirmProps: {
      hidden: true,
    },
    cancelProps: {
      hidden: true,
    },
    children: (
      <>
        <Stack>
          <Title order={3}>Bulk Insert Manually</Title>
          <Alert
            icon={<IconBulb size={16} />}
            title="To add emails with name, you can use one of the following formats:"
            color="gray"
          >
            {`John Doe <john@doe.com>`}
            <br />
            {`John Doe john@doe.com`}
          </Alert>
        </Stack>

        <Divider my="lg" size={1} variant="solid" color="gray.1" />
        <AddManualLeadsForm />
      </>
    ),
  });
};
