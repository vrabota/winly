import React from 'react';
import { Button, Group, Stack, Text } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons';

import { api } from '@utils/api';
import { Cell } from '@components/data';

const DeleteBatchLeads = ({ leadIds }: { leadIds: any }) => {
  const utils = api.useContext();
  const { mutate, isLoading: isDeleteLoading } = api.leads.batchDeleteLeads.useMutation({
    onSuccess: async () => {
      await utils.leads.getLeads.invalidate();
      closeAllModals();
      showNotification({
        color: 'teal',
        title: 'Leads deleted',
        message: `Selected leads successfully deleted.`,
        autoClose: 2000,
        icon: <IconCheck size={16} />,
      });
    },
  });
  return (
    <>
      <Cell>
        <Stack>
          {leadIds.map((lead: any) => (
            <Text size="sm" key={lead.id}>
              {lead.original.email}
            </Text>
          ))}
        </Stack>
      </Cell>
      <Group position="right">
        <Button onClick={() => closeAllModals()} variant="light">
          No, Keep It
        </Button>
        <Button
          loading={isDeleteLoading}
          onClick={() => mutate({ leadIds: leadIds.map((lead: any) => lead.id) })}
          color="red.8"
        >
          Yes, Delete
        </Button>
      </Group>
    </>
  );
};

export default DeleteBatchLeads;
