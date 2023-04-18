import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { ActionIcon, Button, Menu, Stack, Text, Title, Group, TextInput } from '@mantine/core';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { IconCheck, IconDots, IconPlus } from '@tabler/icons';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';

import { api } from '@utils/api';
import { Cell, Filters, Table } from '@components/data';
import { Pencil, Play, Trash } from '@assets/icons';
import noDataImage from '@assets/images/no-data.png';
import { useCampaignColDef } from '@features/campaigns/col.def';
import { createCampaign } from '@features/campaigns/components/CampaignBar/createCampaign';
import { Modal } from '@components/overlays';

import type { NextPage } from 'next';
import type { MouseEvent } from 'react';

const Campaigns: NextPage = () => {
  const { push } = useRouter();
  const { data, isFetching, isLoading } = api.campaign.getAllCampaigns.useQuery({ withStats: true });
  const { columns } = useCampaignColDef({ nameWidth: 250 });
  const [renameValue, setRenameValue] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const utils = api.useContext();
  const [renameOpened, { open: renameOpen, close: renameClose }] = useDisclosure(false);
  const [deleteOpened, { open: deleteOpen, close: deleteClose }] = useDisclosure(false);
  const { isLoading: isLoadingRename, mutate: mutateRename } = api.campaign.renameCampaign.useMutation();
  const { isLoading: isLoadingDelete, mutate: mutateDelete } = api.campaign.deleteCampaign.useMutation();
  const handleRenameModal = ({
    event,
    campaignId,
    campaignName,
  }: {
    event: MouseEvent<HTMLButtonElement>;
    campaignId: string;
    campaignName: string;
  }) => {
    event.stopPropagation();
    setRenameValue(campaignName);
    setCampaignId(campaignId);
    renameOpen();
  };
  const handleDeleteModal = ({
    event,
    campaignId,
    campaignName,
  }: {
    event: MouseEvent<HTMLButtonElement>;
    campaignId: string;
    campaignName: string;
  }) => {
    event.stopPropagation();
    setRenameValue(campaignName);
    setCampaignId(campaignId);
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
          deleteClose();
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
    <>
      <Title mb={20} order={2}>
        Campaigns
      </Title>
      <Table
        total={`Total of ${data?.length || 0} campaigns`}
        columns={columns}
        data={data}
        isFetching={isFetching}
        isLoading={isLoading}
        isEmpty={Array.isArray(data) && data?.length === 0 && !isFetching}
        filters={
          <Filters
            actionBox={
              <Button radius="md" h={48} onClick={createCampaign} leftIcon={<IconPlus size={18} />}>
                New Campaign
              </Button>
            }
          />
        }
        renderRowActions={({ row }) => {
          return (
            <Group position="right" spacing="xl" align="center">
              <Button onClick={e => e.stopPropagation()} variant="light" radius="md" leftIcon={<Play size={14} />}>
                Start Campaign
              </Button>
              <Menu position="bottom-end" width={200} arrowOffset={30} withArrow>
                <Menu.Target>
                  <ActionIcon onClick={e => e.stopPropagation()} radius="md" size="lg">
                    <IconDots size={26} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown py={10}>
                  <Menu.Item
                    onClick={e =>
                      handleRenameModal({ event: e, campaignId: row?.original?.id, campaignName: row?.original?.name })
                    }
                    icon={<Pencil size={14} />}
                  >
                    Rename Campaign
                  </Menu.Item>
                  <Menu.Item
                    onClick={e =>
                      handleDeleteModal({ event: e, campaignId: row?.original?.id, campaignName: row?.original?.name })
                    }
                    color="red"
                    icon={<Trash size={14} />}
                  >
                    Delete Campaign
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          );
        }}
        noData={
          <Stack align="center" justify="center" my={100}>
            <Image width={337.5} height={300} src={noDataImage} alt="No data iamge" />
            <Text mt={20} size="lg" weight="500">
              There is no data for your request.
            </Text>
            <Text size="lg" weight="500" mb={30}>
              Add an account to get started.
            </Text>
            <Button radius="md" h={48} onClick={createCampaign} leftIcon={<IconPlus size={18} />}>
              New Campaign
            </Button>
          </Stack>
        }
        mantineTableBodyRowProps={({ row }: any) => ({
          onClick: () => push(`/campaigns/${row.original.id}/analytics`),
          sx: { cursor: 'pointer' },
        })}
      />
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
        <TextInput
          label="Name"
          placeholder="Campaign name"
          defaultValue={renameValue}
          onChange={e => setRenameValue(e.target.value)}
        />
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
        <Cell>{renameValue}</Cell>
      </Modal>
    </>
  );
};

export default withPageAuthRequired(Campaigns);
