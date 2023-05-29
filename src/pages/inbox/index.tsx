import { Grid, Paper, Title, Stack } from '@mantine/core';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { LeadStatus } from '@prisma/client';
import { useContext, useState } from 'react';
import capitalize from 'lodash/capitalize';

import { Filters, SkeletonData } from '@components/data';
import RepliedList from '@features/inbox/components/RepliedList';
import RepliedThread from '@features/inbox/components/RepliedThread';
import { OrganizationContext } from '@context/OrganizationContext';
import { api } from '@utils/api';

import type { NextPage } from 'next';

const Inbox: NextPage = () => {
  const [filters, applyFilters] = useState<{
    account?: string[];
    campaign?: string[];
    leadStatus?: LeadStatus[];
    search?: string;
  }>();
  const { selectedOrganization } = useContext(OrganizationContext);
  const { data: campaignData, isLoading: isLoadingCampaigns } = api.campaign.getAllCampaigns.useQuery({
    organizationId: selectedOrganization?.id as string,
  });
  const { data: accountsData, isLoading: isLoadingAccounts } = api.account.getAccounts.useQuery({
    organizationId: selectedOrganization?.id as string,
  });

  return (
    <>
      <Title mb={20} order={2}>
        Inbox
      </Title>
      <Stack>
        <SkeletonData isLoading={isLoadingCampaigns || isLoadingAccounts} skeletonProps={{ h: 60, w: '100%' }}>
          <Filters
            searchProps={{ placeholder: 'Search by lead email' }}
            applyFilters={applyFilters}
            items={[
              {
                key: 'leadStatus',
                label: 'Lead status',
                title: 'Lead status filters',
                options: Object.keys(LeadStatus).map(status => ({
                  value: status,
                  label: capitalize(status.replaceAll('_', ' ')),
                })),
              },
              {
                key: 'campaign',
                label: 'Campaign',
                title: 'Filter leads by campaign',
                options: campaignData?.map(campaign => ({ value: campaign.id, label: campaign.name })),
              },
              {
                key: 'account',
                label: 'Account',
                title: 'Filter leads by sent account',
                options: accountsData?.items.map(account => ({ value: account.id, label: account.email })),
              },
            ]}
          />
        </SkeletonData>

        <Grid gutter={20}>
          <Grid.Col span={4}>
            <Paper p={20} bg="white" radius="md" shadow="xs">
              <RepliedList filters={filters} />
            </Paper>
          </Grid.Col>
          <Grid.Col span="auto">
            <Paper bg="white" radius="md" shadow="xs">
              <RepliedThread />
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>
    </>
  );
};

export default withPageAuthRequired(Inbox);
