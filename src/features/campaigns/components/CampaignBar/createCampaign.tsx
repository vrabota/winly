import { openConfirmModal } from '@mantine/modals';
import { Divider, Title, Text } from '@mantine/core';
import React from 'react';

import CreateCampaignForm from './CreateCampaignForm';

export const createCampaign = () => {
  return openConfirmModal({
    size: 500,
    closeOnConfirm: false,
    confirmProps: {
      hidden: true,
    },
    cancelProps: {
      hidden: true,
    },
    children: (
      <>
        <Title order={3}>Create a new campaign</Title>
        <Text>What would you like to name it?</Text>
        <Divider my="lg" size={1} variant="solid" color="gray.1" />
        <CreateCampaignForm />
      </>
    ),
  });
};
