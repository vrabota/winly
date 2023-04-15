import React from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { IconDots, IconPlus } from '@tabler/icons';
import { ActionIcon, Button, Group, Menu, Stack, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import { useDisclosure } from '@mantine/hooks';
import Image from 'next/image';

import { CampaignTabs } from '@features/campaigns';
import { Filters, Table } from '@components/data';
import { api } from '@utils/api';
import { Modal } from '@components/overlays';
import AddLeadsForm from '@features/leads/components/AddLeadsForm';
import { Pencil, Trash, ViewDetails } from '@assets/icons';
import noDataImage from '@assets/images/no-data.png';
import { useLeadsColDef } from '@features/leads/col.def';
import { editLeadModal } from '@features/leads/components/modals/editLead.modal';
import { deleteBatchLeadsModal } from '@features/leads/components/modals/deleteBatchLeads.modal';
import { deleteLeadModal } from '@features/leads/components/modals/deleteLead.modal';
import { viewActivityModal } from '@features/leads/components/modals/viewActivity.modal';

import type { NextPage } from 'next';

const Leads: NextPage = () => {
  const { query } = useRouter();
  const [leadsOpened, { open: leadsOpen, close: leadsClose }] = useDisclosure(false);
  const { data = [], isLoading, isFetching } = api.leads.getLeads.useQuery({ campaignId: query.campaignId as string });
  const { columns } = useLeadsColDef();

  return (
    <>
      <CampaignTabs />
      <Table
        getRowId={row => row.id}
        enableRowSelection={true}
        renderTopToolbarCustomActions={({ table }) => {
          return (
            <Stack
              bg="#fcfcfc"
              py="md"
              px="xl"
              mih={68}
              justify="center"
              mb={2}
              w="100%"
              sx={theme => ({ borderTopLeftRadius: theme.radius.md, borderTopRightRadius: theme.radius.md })}
            >
              <Group position="apart" align="center">
                <Text size={15} color="gray.8">
                  {`Total of ${data?.length || 0} leads`}
                </Text>
                {table.getSelectedRowModel().flatRows.length && (
                  <Button
                    color="red"
                    onClick={() =>
                      deleteBatchLeadsModal({
                        leadIds: table.getSelectedRowModel().flatRows,
                      })
                    }
                    leftIcon={<Trash size={18} />}
                  >
                    Delete selected
                  </Button>
                )}
              </Group>
            </Stack>
          );
        }}
        positionToolbarAlertBanner="bottom"
        columns={columns}
        data={data}
        isFetching={isFetching}
        isLoading={isLoading}
        isEmpty={Array.isArray(data) && data?.length === 0 && !isFetching}
        filters={
          <Filters
            actionBox={
              <Button radius="md" h={48} onClick={leadsOpen} leftIcon={<IconPlus size={18} />}>
                Import leads
              </Button>
            }
          />
        }
        renderRowActions={({ row }) => {
          return (
            <Group position="right" spacing="xl" align="center">
              <Menu position="bottom-end" width={200} arrowOffset={30} withArrow>
                <Menu.Target>
                  <ActionIcon onClick={e => e.stopPropagation()} radius="md" size="lg">
                    <IconDots size={26} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown py={10}>
                  <Menu.Item
                    onClick={() =>
                      editLeadModal({
                        leadId: row.original.id,
                        email: row.original.email,
                      })
                    }
                    icon={<Pencil size={14} />}
                  >
                    Edit lead
                  </Menu.Item>
                  <Menu.Item
                    onClick={() =>
                      viewActivityModal({
                        leadId: row.original.id,
                        email: row.original.email,
                      })
                    }
                    icon={<ViewDetails size={14} />}
                  >
                    View activity
                  </Menu.Item>
                  <Menu.Item
                    onClick={() =>
                      deleteLeadModal({
                        leadId: row.original.id,
                        email: row.original.email,
                      })
                    }
                    color="red"
                    icon={<Trash size={14} />}
                  >
                    Delete lead
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
              Import a few leads to create a campaign
            </Text>
            <Button radius="md" h={48} onClick={leadsOpen} leftIcon={<IconPlus size={18} />}>
              Import leads
            </Button>
          </Stack>
        }
        mantineTableBodyRowProps={() => ({
          onClick: () => console.log(123),
          sx: { cursor: 'pointer' },
        })}
      />
      <Modal
        title={`Import leads`}
        subtitle={`Please select import method and import your contacts.`}
        size={700}
        opened={leadsOpened}
        open={leadsOpen}
        close={leadsClose}
      >
        <AddLeadsForm onClose={leadsClose} />
      </Modal>
    </>
  );
};

export default withPageAuthRequired(Leads);
