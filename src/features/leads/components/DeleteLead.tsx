import React from 'react';
import { Button, Group } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons';

import { api } from '@utils/api';
import { Cell } from '@components/data';

const DeleteLead = ({ leadId, email }: { leadId: string; email: string }) => {
  const utils = api.useContext();
  const { mutate, isLoading: isDeleteLoading } = api.leads.deleteLead.useMutation({
    onSuccess: async () => {
      await utils.leads.getLeads.invalidate();
      closeAllModals();
      showNotification({
        color: 'teal',
        title: 'Lead deleted',
        message: `Lead successfully deleted.`,
        autoClose: 2000,
        icon: <IconCheck size={16} />,
      });
    },
  });
  return (
    <>
      <Cell>{email}</Cell>
      <Group position="right">
        <Button onClick={() => closeAllModals()} variant="light">
          No, Keep It
        </Button>
        <Button loading={isDeleteLoading} onClick={() => mutate({ leadId })} color="red.8">
          Yes, Delete
        </Button>
      </Group>
    </>
  );
};

export default DeleteLead;
