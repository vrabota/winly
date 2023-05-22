import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Group, Text, Paper } from '@mantine/core';
import { CampaignStatus } from '@prisma/client';

import { api } from '@utils/api';
import { Table } from '@components/data';
import { useCampaignColDef } from '@features/campaigns/col.def';
import { Play, StopIcon, Pencil } from '@assets/icons';
import { OrganizationContext } from '@context/OrganizationContext';
import { useStartCampaign } from '@features/campaigns/hooks/useStartCampaign';
import { useStopCampaign } from '@features/campaigns/hooks/useStopCampaign';

const CampaignsStats = () => {
  const { selectedOrganization } = useContext(OrganizationContext);
  const { push } = useRouter();
  const { columns } = useCampaignColDef({ nameWidth: 300 });
  const [activeActionButton, setActiveActionButton] = useState('');
  const { data, isLoading, isFetching } = api.campaign.getAllCampaigns.useQuery({
    withStats: true,
    organizationId: selectedOrganization?.id as string,
  });
  const { mutate: startCampaign, isLoading: isLoadingStartCampaign } = useStartCampaign();
  const { mutate: stopCampaign, isLoading: isLoadingStopCampaign } = useStopCampaign();
  return (
    <Paper shadow="sm" radius="md" p="xl">
      <Text weight="500" mb={20}>
        Campaign Performance
      </Text>
      <Table
        columns={columns}
        data={data}
        isFetching={isFetching}
        isLoading={isLoading}
        isEmpty={Array.isArray(data) && data?.length === 0 && !isFetching}
        mantineTableBodyRowProps={({ row }: any) => ({
          onClick: () => push(`/campaigns/${row.original.id}/analytics`),
          sx: { cursor: 'pointer' },
        })}
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
            </Group>
          );
        }}
      />
    </Paper>
  );
};

export default CampaignsStats;
