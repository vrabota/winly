import React, { useContext } from 'react';
import { Group, Paper, Skeleton, Text, Stack, Grid } from '@mantine/core';
import { ActivityStatus } from '@prisma/client';

import { Contacted, BookOpen, MailReply, PartyIcon } from '@assets/icons';
import { api } from '@utils/api';
import { statusCount } from '@utils/statusCount';
import { calcRate } from '@utils/calcRate';
import { OrganizationContext } from '@context/OrganizationContext';
import { DatePeriodContext } from '@context/DatePeriodContext';

import type { DateRanges } from '@features/campaigns/utils';

const Stats = () => {
  const { selectedOrganization } = useContext(OrganizationContext);
  const { datePeriod, customDateRange } = useContext(DatePeriodContext);
  const { data, isLoading } = api.activity.getActivitiesStats.useQuery({
    campaignId: undefined,
    organizationId: selectedOrganization?.id as string,
    period: datePeriod as DateRanges,
    customPeriod: customDateRange,
  });
  const contacted = statusCount(data)?.[ActivityStatus.CONTACTED] || 0;
  const opened = statusCount(data)?.[ActivityStatus.OPENED] || 0;
  const replied = statusCount(data)?.[ActivityStatus.REPLIED] || 0;
  return (
    <Grid>
      <Grid.Col span={3}>
        <Paper shadow="sm" radius="md" h={120} px={40}>
          <Group h="100%" position="left" spacing={30}>
            <Contacted />
            <Stack spacing={5}>
              <Text weight={600} size="lg" color="purple.5">
                {isLoading ? <Skeleton h={10} w={40} /> : contacted}
              </Text>
              <Text weight={500} size="sm">
                Contacted
              </Text>
            </Stack>
          </Group>
        </Paper>
      </Grid.Col>
      <Grid.Col span={3}>
        <Paper shadow="sm" radius="md" h={120} px={40}>
          <Group h="100%" position="left" spacing={30}>
            <BookOpen />
            <Stack spacing={5}>
              <Text weight={600} size="lg" color="purple.5">
                {isLoading ? <Skeleton h={10} w={40} /> : calcRate(opened, contacted)}
              </Text>
              <Text weight={500} size="sm">
                Open rate
              </Text>
            </Stack>
          </Group>
        </Paper>
      </Grid.Col>
      <Grid.Col span={3}>
        <Paper shadow="sm" radius="md" h={120} px={40}>
          <Group h="100%" position="left" spacing={30}>
            <MailReply />
            <Stack spacing={5}>
              <Text weight={600} size="lg" color="purple.5">
                {isLoading ? <Skeleton h={10} w={40} /> : calcRate(replied, contacted)}
              </Text>
              <Text weight={500} size="sm">
                Reply rate
              </Text>
            </Stack>
          </Group>
        </Paper>
      </Grid.Col>
      <Grid.Col span={3}>
        <Paper shadow="sm" radius="md" h={120} px={40}>
          <Group h="100%" position="left" spacing={30}>
            <PartyIcon />
            <Stack spacing={5}>
              <Text weight={600} size="lg" color="purple.5">
                {isLoading ? <Skeleton h={10} w={40} /> : 0}
              </Text>
              <Text weight={500} size="sm">
                Opportunities
              </Text>
            </Stack>
          </Group>
        </Paper>
      </Grid.Col>
    </Grid>
  );
};

export default Stats;
