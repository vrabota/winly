import React, { useState } from 'react';
import { ActionIcon, Group, Paper, Stack, Text, Menu, Button, TextInput } from '@mantine/core';
import { IconCheck, IconDots, IconSettings } from '@tabler/icons';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';

import { Pencil, Trash } from '@assets/icons';
import { Modal } from '@components/overlays';
import { Cell } from '@components/data';
import { api } from '@utils/api';

import { useStyles } from './styles';

import type { MouseEvent } from 'react';

const CampaignItem = ({ name, onClick, campaignId }: { name?: string; onClick?: () => void; campaignId: string }) => {
  const { classes } = useStyles();

  const [renameValue, setRenameValue] = useState(name || '');
  const utils = api.useContext();
  const [renameOpened, { open: renameOpen, close: renameClose }] = useDisclosure(false);
  const [deleteOpened, { open: deleteOpen, close: deleteClose }] = useDisclosure(false);
  const { isLoading: isLoadingRename, mutate: mutateRename } = api.campaign.renameCampaign.useMutation();
  const { isLoading: isLoadingDelete, mutate: mutateDelete } = api.campaign.deleteCampaign.useMutation();
  const handleRenameModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    renameOpen();
  };
  const handleDeleteModal = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    deleteOpen();
  };
  const handleRenameRequest = () => {
    mutateRename(
      { name: renameValue, campaignId },
      {
        onSuccess: async () => {
          renameClose();
          showNotification({
            color: 'teal',
            message: `Campaign name updated successfully.`,
            icon: <IconCheck size={16} />,
          });
          await utils.campaign.getAllCampaigns.invalidate();
        },
      },
    );
  };
  const handleDeleteRequest = () => {
    mutateDelete(
      { campaignId },
      {
        onSuccess: async () => {
          renameClose();
          showNotification({
            color: 'teal',
            message: `Campaign was deleted successfully.`,
            icon: <IconCheck size={16} />,
          });
          await utils.campaign.getAllCampaigns.invalidate();
        },
      },
    );
  };
  return (
    <Stack my={20} onClick={onClick}>
      <Paper shadow="sm" p="lg" radius="md" className={classes.campaign}>
        <Group position="apart">
          <Text weight="bolder">{name}</Text>
          <Group>
            <ActionIcon>
              <IconSettings size={22} />
            </ActionIcon>
            <Menu position="bottom-end" width={200} arrowOffset={30} withArrow>
              <Menu.Target>
                <ActionIcon onClick={e => e.stopPropagation()}>
                  <IconDots size={22} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown py={10}>
                <Menu.Item onClick={handleRenameModal} icon={<Pencil size={14} />}>
                  Rename Campaign
                </Menu.Item>
                <Menu.Item onClick={handleDeleteModal} color="red" icon={<Trash size={14} />}>
                  Delete Campaign
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
        <Modal
          title={`Rename campaign`}
          subtitle={`Change campaign name.`}
          opened={renameOpened}
          open={renameOpen}
          close={renameClose}
          footer={
            <Group position="right">
              <Button onClick={renameClose} variant="light">
                Cancel
              </Button>
              <Button onClick={handleRenameRequest} loading={isLoadingRename}>
                Rename
              </Button>
            </Group>
          }
        >
          <TextInput placeholder="Campaign name" defaultValue={name} onChange={e => setRenameValue(e.target.value)} />
        </Modal>
        <Modal
          title={`Delete this campaign?`}
          subtitle={`This can't be undone.`}
          opened={deleteOpened}
          open={deleteOpen}
          close={deleteClose}
          footer={
            <Group position="right">
              <Button onClick={deleteClose} variant="light">
                No, Keep It
              </Button>
              <Button loading={isLoadingDelete} onClick={handleDeleteRequest} color="red.8">
                Yes, Delete
              </Button>
            </Group>
          }
        >
          <Cell>{name}</Cell>
        </Modal>
      </Paper>
    </Stack>
  );
};

export default CampaignItem;
