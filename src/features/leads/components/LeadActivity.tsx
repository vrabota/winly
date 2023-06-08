import React from 'react';
import { Group, Timeline, Text, Box, Badge, Stack, Loader, Center, ScrollArea } from '@mantine/core';
import { useRouter } from 'next/router';
import capitalize from 'lodash/capitalize';
import dayjs, { extend } from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { ActivityStatus } from '@prisma/client';
import Image from 'next/image';

import { api } from '@utils/api';
import { ACTIVITY_STATUS_MAPPING } from '@features/leads/utils';
import noDataImage from '@assets/images/no-data.png';

extend(relativeTime);

const LeadActivity = ({ email, organizationId }: { leadId: string; email: string; organizationId: string }) => {
  const { query } = useRouter();
  const { data, isLoading } = api.activity.getActivities.useQuery({
    campaignId: query.campaignId as string,
    leadEmail: email,
    organizationId,
  });

  if (isLoading) {
    return (
      <Center>
        <Loader />
      </Center>
    );
  }

  if (data?.items?.length === 0) {
    return (
      <Stack align="center" justify="center" my={50}>
        <Image height={150} src={noDataImage} alt="No data iamge" />
        <Text mt={20} size="lg" weight="500" sx={{ fontStyle: 'normal' }}>
          There is no activity for your lead yet.
        </Text>
      </Stack>
    );
  }

  return (
    <ScrollArea h={600} type="auto">
      <Box maw={300} mx="auto" my={20} pl={100}>
        <Timeline active={0} bulletSize={32} lineWidth={2} align="left">
          {data?.items?.map(activity => (
            <Timeline.Item
              key={activity.id}
              sx={{ position: 'relative', '.mantine-Badge-root': { position: 'absolute', top: 5, left: -100 } }}
              bullet={ACTIVITY_STATUS_MAPPING[activity.status as ActivityStatus]?.icon}
              title={
                <Group align="center" position="left">
                  <Text>{capitalize(ACTIVITY_STATUS_MAPPING[activity.status as ActivityStatus]?.text)}</Text>
                  <Badge>{`Step ${activity.step}`}</Badge>
                </Group>
              }
            >
              <Stack mt={5} spacing={5}>
                {activity.status === ActivityStatus.CONTACTED && (
                  <Text weight={500} size="xs">
                    gabrielle.k@askindex.com
                  </Text>
                )}
                <Text size="xs">{dayjs(activity.createdAt).fromNow()}</Text>
              </Stack>
            </Timeline.Item>
          ))}
        </Timeline>
      </Box>
    </ScrollArea>
  );
};

export default LeadActivity;
