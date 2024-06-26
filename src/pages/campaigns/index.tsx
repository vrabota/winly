import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { ActionIcon, Button, Menu, Stack, Text, Title, Group, TextInput, Tooltip } from '@mantine/core';
import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { IconCheck, IconDots, IconPlus } from '@tabler/icons';
import { useDisclosure } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { CampaignStatus } from '@prisma/client';

import { api } from '@utils/api';
import { Cell, Filters, Table } from '@components/data';
import { Pencil, Play, Trash, StopIcon, Sync } from '@assets/icons';
import noDataImage from '@assets/images/no-data.png';
import { useCampaignColDef } from '@features/campaigns/col.def';
import { createCampaign } from '@features/campaigns/components/CampaignBar/createCampaign';
import { Modal } from '@components/overlays';
import { OrganizationContext } from '@context/OrganizationContext';
import { useStartCampaign } from '@features/campaigns/hooks/useStartCampaign';
import { useStopCampaign } from '@features/campaigns/hooks/useStopCampaign';

import type { NextPage } from 'next';
import type { MouseEvent } from 'react';

const Campaigns: NextPage = () => {
  const { push } = useRouter();
  const [filters, applyFilters] = useState<{ search?: string; campaignStatus?: CampaignStatus[] }>();
  const { selectedOrganization } = useContext(OrganizationContext);
  const { data, isFetching, isLoading, refetch } = api.campaign.getAllCampaigns.useQuery({
    withStats: true,
    organizationId: selectedOrganization?.id as string,
    search: filters?.search && filters?.search?.length > 0 ? filters?.search : undefined,
    campaignStatus:
      filters?.campaignStatus && filters?.campaignStatus?.length > 0 ? filters?.campaignStatus : undefined,
  });
  const { columns } = useCampaignColDef({ nameWidth: 250 });
  const [renameValue, setRenameValue] = useState('');
  const [campaignId, setCampaignId] = useState('');
  const [activeActionButton, setActiveActionButton] = useState('');
  const utils = api.useContext();
  const [renameOpened, { open: renameOpen, close: renameClose }] = useDisclosure(false);
  const [deleteOpened, { open: deleteOpen, close: deleteClose }] = useDisclosure(false);
  const { isLoading: isLoadingRename, mutate: mutateRename } = api.campaign.renameCampaign.useMutation();
  const { isLoading: isLoadingDelete, mutate: mutateDelete } = api.campaign.deleteCampaign.useMutation();
  const { mutate: startCampaign, isLoading: isLoadingStartCampaign } = useStartCampaign();
  const { mutate: stopCampaign, isLoading: isLoadingStopCampaign } = useStopCampaign();
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
        columns={columns}
        data={data}
        isFetching={isFetching}
        isLoading={isLoading}
        isEmpty={Array.isArray(data) && data?.length === 0 && !isFetching}
        renderTopToolbarCustomActions={() => {
          return (
            <Stack
              bg="#fcfcfc"
              py="md"
              px="xl"
              mih={68}
              justify="center"
              mb={2}
              w="100%"
              sx={theme => ({
                borderTopLeftRadius: theme.radius.md,
                borderTopRightRadius: theme.radius.md,
              })}
            >
              <Group position="apart" align="center">
                <Text size={15} color="gray.8">
                  {`Total of ${data?.length || 0} campaigns`}
                </Text>
                <Tooltip label="Refetch campaigns data" withArrow>
                  <ActionIcon loading={isFetching} color="purple" variant="light" size="lg" onClick={() => refetch()}>
                    <Sync size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Stack>
          );
        }}
        filters={
          <Filters
            applyFilters={applyFilters}
            items={[
              {
                key: 'campaignStatus',
                label: 'Campaign status',
                title: 'Campaign status filters',
                options: [
                  { value: CampaignStatus.ACTIVE, label: 'Active' },
                  { value: CampaignStatus.PAUSE, label: 'Stopped' },
                  { value: CampaignStatus.DRAFT, label: 'Draft' },
                ],
              },
            ]}
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
              {row?.original?.status === CampaignStatus.ACTIVE && (
                <Button
                  onClick={e => {
                    e.stopPropagation();
                    setActiveActionButton(row.original.id);
                    stopCampaign({
                      campaignId: row.original.id as string,
                      organizationId: selectedOrganization?.id as string,
                    });
                  }}
                  loading={isLoadingStopCampaign && activeActionButton === row.original.id}
                  variant="light"
                  radius="md"
                  leftIcon={<StopIcon size={14} />}
                >
                  Stop Campaign
                </Button>
              )}
              {row?.original?.status === CampaignStatus.PAUSE && (
                <Button
                  onClick={e => {
                    e.stopPropagation();
                    startCampaign({
                      campaignId: row.original.id as string,
                      organizationId: selectedOrganization?.id as string,
                    });
                  }}
                  variant="light"
                  radius="md"
                  loading={isLoadingStartCampaign}
                  leftIcon={<Play size={14} />}
                >
                  Start Campaign
                </Button>
              )}
              {row?.original?.status === CampaignStatus.DRAFT && (
                <Button
                  onClick={e => {
                    e.stopPropagation();
                    push(`/campaigns/${row.original.id}/leads`);
                  }}
                  variant="light"
                  radius="md"
                  leftIcon={<Pencil size={14} />}
                >
                  Edit Campaign
                </Button>
              )}

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
        localization={{
          noRecordsToDisplay: (
            <Stack align="center" justify="center">
              <Image height={200} src={noDataImage} alt="No data iamge" />
              <Text mt={20} size="lg" weight="500" sx={{ fontStyle: 'normal' }}>
                There is no data for your request.
              </Text>
              <Text size="lg" weight="500" mb={30} sx={{ fontStyle: 'normal' }}>
                Add a campaign to get started.
              </Text>
              <Button radius="md" h={48} onClick={createCampaign} leftIcon={<IconPlus size={18} />}>
                New Campaign
              </Button>
            </Stack>
          ),
        }}
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
