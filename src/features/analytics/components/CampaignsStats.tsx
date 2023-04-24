import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { Button, Group, Text, Paper } from '@mantine/core';

import { api } from '@utils/api';
import { Table } from '@components/data';
import { useCampaignColDef } from '@features/campaigns/col.def';
import { Play } from '@assets/icons';
import { OrganizationContext } from '@context/OrganizationContext';

const CampaignsStats = () => {
  const { selectedOrganization } = useContext(OrganizationContext);
  const { push } = useRouter();
  const { columns } = useCampaignColDef({ nameWidth: 300 });
  const { data, isLoading, isFetching } = api.campaign.getAllCampaigns.useQuery({
    withStats: true,
    organizationId: selectedOrganization?.id as string,
  });
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
        renderRowActions={() => {
          return (
            <Group position="right" spacing="xl" align="center">
              <Button onClick={e => e.stopPropagation()} variant="light" radius="md" leftIcon={<Play size={14} />}>
                Start Campaign
              </Button>
            </Group>
          );
        }}
      />
    </Paper>
  );
};

export default CampaignsStats;
