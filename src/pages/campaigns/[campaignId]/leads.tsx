import React, { useContext, useState, useMemo, useRef, useCallback } from 'react';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { IconDots, IconPlus } from '@tabler/icons';
import { ActionIcon, Button, Group, Menu, Stack, Text, Tooltip } from '@mantine/core';
import { useRouter } from 'next/router';
import { useDisclosure } from '@mantine/hooks';
import Image from 'next/image';
import { LeadStatus } from '@prisma/client';

import { CampaignTabs } from '@features/campaigns';
import { Filters, Table } from '@components/data';
import { api } from '@utils/api';
import { Modal } from '@components/overlays';
import AddLeadsForm from '@features/leads/components/AddLeadsForm';
import { Pencil, Trash, ViewDetails, Sync } from '@assets/icons';
import noDataImage from '@assets/images/no-data.png';
import { useLeadsColDef } from '@features/leads/col.def';
import { editLeadModal } from '@features/leads/components/modals/editLead.modal';
import { deleteBatchLeadsModal } from '@features/leads/components/modals/deleteBatchLeads.modal';
import { deleteLeadModal } from '@features/leads/components/modals/deleteLead.modal';
import { viewActivityModal } from '@features/leads/components/modals/viewActivity.modal';
import { OrganizationContext } from '@context/OrganizationContext';

import type { UIEvent } from 'react';
import type { NextPage } from 'next';

const Leads: NextPage = () => {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const { query } = useRouter();
  const [filters, applyFilters] = useState<{ search?: string; leadStatus?: LeadStatus[] }>();
  const { selectedOrganization } = useContext(OrganizationContext);
  const [leadsOpened, { open: leadsOpen, close: leadsClose }] = useDisclosure(false);
  const {
    data: leadsData,
    isLoading,
    isFetching,
    fetchNextPage,
    refetch,
  } = api.leads.getLeads.useInfiniteQuery(
    {
      limit: 10,
      campaignId: query.campaignId as string,
      organizationId: selectedOrganization?.id as string,
      search: filters?.search && filters?.search?.length > 0 ? filters?.search : undefined,
      leadStatus: filters?.leadStatus && filters?.leadStatus?.length > 0 ? filters?.leadStatus : undefined,
    },
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
    },
  );
  const data = useMemo(() => leadsData?.pages.flatMap(page => page.items) ?? [], [leadsData]);
  const { columns } = useLeadsColDef();

  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 400px of the bottom of the table, fetch more data if we can
        if (scrollHeight - scrollTop - clientHeight < 400 && !isFetching) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching],
  );

  return (
    <>
      <CampaignTabs />
      <Table
        getRowId={row => row.id}
        enableRowSelection={true}
        mantineTableContainerProps={{
          ref: tableContainerRef,
          sx: { maxHeight: '600px' },
          onScroll: (event: UIEvent<HTMLDivElement>) => fetchMoreOnBottomReached(event.target as HTMLDivElement),
        }}
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
                <Group spacing={20}>
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
                  <Tooltip label="Refetch leads data" withArrow>
                    <ActionIcon loading={isFetching} color="purple" variant="light" size="lg" onClick={() => refetch()}>
                      <Sync size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
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
            applyFilters={applyFilters}
            items={[
              {
                key: 'leadStatus',
                label: 'Lead status',
                title: 'Lead status filters',
                options: [
                  { value: LeadStatus.LEAD, label: 'Lead' },
                  { value: LeadStatus.CLOSED, label: 'Closed' },
                  { value: LeadStatus.INTERESTED, label: 'Interested' },
                  { value: LeadStatus.NOT_INTERESTED, label: 'Not Interested' },
                  { value: LeadStatus.MEETING_BOOKED, label: 'Meeting Booked' },
                  { value: LeadStatus.MEETING_COMPLETED, label: 'Meeting Completed' },
                  { value: LeadStatus.OUT_OF_OFFICE, label: 'Out of Office' },
                  { value: LeadStatus.WRONG_PERSON, label: 'Wrong Person' },
                ],
              },
            ]}
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
                        organizationId: selectedOrganization?.id as string,
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
        localization={{
          noRecordsToDisplay: (
            <Stack align="center" justify="center">
              <Image height={200} src={noDataImage} alt="No data iamge" />
              <Text mt={20} size="lg" weight="500" sx={{ fontStyle: 'normal' }}>
                There is no data for your request.
              </Text>
              <Text size="lg" weight="500" mb={30} sx={{ fontStyle: 'normal' }}>
                Import a few leads to create a campaign.
              </Text>
              <Button radius="md" h={48} onClick={leadsOpen} leftIcon={<IconPlus size={18} />}>
                Import leads
              </Button>
            </Stack>
          ),
        }}
        mantineTableBodyRowProps={({ row }: any) => ({
          onClick: () =>
            viewActivityModal({
              leadId: row.original.id,
              email: row.original.email,
              organizationId: selectedOrganization?.id as string,
            }),
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
