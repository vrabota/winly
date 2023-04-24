import React, { useContext } from 'react';
import { Divider, Group, Paper, Skeleton, Stack, Text } from '@mantine/core';
import { ActivityStatus } from '@prisma/client';
import { useRouter } from 'next/router';

import { BookOpen, Contacted, MailReply, PartyIcon } from '@assets/icons';
import { api } from '@utils/api';
import { calcRate } from '@utils/calcRate';
import { statusCount } from '@utils/statusCount';
import { OrganizationContext } from '@context/OrganizationContext';

const CampaignStatsData = () => {
  const { query } = useRouter();
  const { selectedOrganization } = useContext(OrganizationContext);
  const { data: activityStats, isLoading: isLoadingStats } = api.activity.getActivitiesStats.useQuery({
    campaignId: query.campaignId as string,
    organizationId: selectedOrganization?.id as string,
  });
  const contacted = statusCount(activityStats)?.[ActivityStatus.CONTACTED] || 0;
  const opened = statusCount(activityStats)?.[ActivityStatus.OPENED] || 0;
  const replied = statusCount(activityStats)?.[ActivityStatus.REPLIED] || 0;
  return (
    <Paper shadow="sm" radius="md" h={239.5} px="xl">
      <Group grow align="center" h="100%">
        <Stack align="center" justify="center">
          <Contacted />
          <Text weight={500} size="sm" color="purple.5">
            {isLoadingStats ? <Skeleton h={10} w={40} /> : contacted}
          </Text>
          <Text weight={500} size="sm">
            Contacted
          </Text>
        </Stack>
        <Stack align="center">
          <BookOpen />
          <Group>
            <Text weight={500} size="sm" color="purple.5">
              {isLoadingStats ? <Skeleton h={10} w={40} /> : opened}
            </Text>
            <Divider orientation="vertical" />
            <Text weight={500} size="sm">
              {calcRate(opened, contacted)}
            </Text>
          </Group>
          <Text weight={500} size="sm">
            Opened
          </Text>
        </Stack>
        <Stack align="center">
          <MailReply />
          <Group>
            <Text weight={500} size="sm" color="purple.5">
              {isLoadingStats ? <Skeleton h={10} w={40} /> : replied}
            </Text>
            <Divider orientation="vertical" />
            <Text weight={500} size="sm">
              {calcRate(replied, contacted)}
            </Text>
          </Group>
          <Text weight={500} size="sm">
            Replied
          </Text>
        </Stack>
        <Stack align="center">
          <PartyIcon />
          <Group>
            <Text weight={500} size="sm" color="purple.5">
              0
            </Text>
            <Divider orientation="vertical" />
            <Text weight={500} size="sm">
              $ 0
            </Text>
          </Group>
          <Text weight={500} size="sm">
            Opportunities
          </Text>
        </Stack>
      </Group>
    </Paper>
  );
};

export default CampaignStatsData;
