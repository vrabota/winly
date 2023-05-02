import React, { useContext } from 'react';
import { Group, Paper, Skeleton, Stack, Text } from '@mantine/core';
import { useRouter } from 'next/router';
import { ActivityStatus } from '@prisma/client';

import { CheckMark, Leads, LinkBroken, SadFace } from '@assets/icons';
import { api } from '@utils/api';
import { statusCount } from '@utils/statusCount';
import { OrganizationContext } from '@context/OrganizationContext';

const CampaignStats = () => {
  const { query } = useRouter();
  const { selectedOrganization } = useContext(OrganizationContext);
  const { data, isLoading: isLoadingLeads } = api.leads.getLeads.useQuery({
    campaignId: query.campaignId as string,
    organizationId: selectedOrganization?.id as string,
  });
  const { data: activityStats, isLoading: isLoadingStats } = api.activity.getActivitiesStats.useQuery({
    campaignId: query.campaignId as string,
    organizationId: selectedOrganization?.id as string,
  });
  const completed = statusCount(activityStats)?.[ActivityStatus.COMPLETED];
  const bounced = statusCount(activityStats)?.[ActivityStatus.BOUNCED];
  const error = statusCount(activityStats)?.[ActivityStatus.ERROR];
  return (
    <Paper shadow="sm" radius="md" p="xl">
      <Text weight="500" mb={20}>
        Campaign stats
      </Text>
      <Stack spacing={20}>
        <Group position="apart">
          <Group>
            <Leads size={18} />
            <Text weight={500} size="sm">
              Leads
            </Text>
          </Group>
          <Text weight={500} size="sm" color="purple.5">
            {isLoadingLeads ? <Skeleton h={10} w={40} /> : data?.items?.length}
          </Text>
        </Group>
        <Group position="apart">
          <Group>
            <CheckMark size={18} />
            <Text weight={500} size="sm">
              Completed
            </Text>
          </Group>
          <Text weight={500} size="sm" color="purple.5">
            {isLoadingStats ? <Skeleton h={10} w={40} /> : completed || 0}
          </Text>
        </Group>
        <Group position="apart">
          <Group>
            <SadFace size={18} />
            <Text weight={500} size="sm">
              Bounced
            </Text>
          </Group>
          <Text weight={500} size="sm" color="purple.5">
            {isLoadingStats ? <Skeleton h={10} w={40} /> : bounced || 0}
          </Text>
        </Group>
        <Group position="apart">
          <Group>
            <LinkBroken size={18} />
            <Text weight={500} size="sm">
              Errors
            </Text>
          </Group>
          <Text weight={500} size="sm" color="purple.5">
            {isLoadingStats ? <Skeleton h={10} w={40} /> : error || 0}
          </Text>
        </Group>
      </Stack>
    </Paper>
  );
};

export default CampaignStats;
