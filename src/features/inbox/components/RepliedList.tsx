import { Group, Text, Stack, createStyles, Alert, ScrollArea } from '@mantine/core';
import truncate from 'lodash/truncate';
import React, { useCallback, useContext, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { IconAlertCircle } from '@tabler/icons';

import { api } from '@utils/api';
import { OrganizationContext } from '@context/OrganizationContext';
import { SkeletonData } from '@components/data';

import type { LeadStatus } from '@prisma/client';

const SCROLL_OFFSET = 1600;

const useStyles = createStyles(theme => ({
  activity: {
    cursor: 'pointer',
    transition: 'all 0.3s',
    borderBottom: `1px solid ${theme.colors.gray[1]}`,
    borderLeft: '3px solid transparent',
    ':hover': {
      background: theme.colors.gray[0],
    },
    ':last-child': {
      borderBottom: 'none',
    },
  },
  active: {
    borderLeft: `3px solid ${theme.colors.purple?.[5]}`,
    background: theme.colors.gray[0],
  },
}));

const RepliedList = ({
  filters,
  setActiveThread,
  activeThread,
}: {
  filters?: {
    account?: string[];
    campaign?: string[];
    leadStatus?: LeadStatus[];
    search?: string;
  };
  setActiveThread: any;
  activeThread: any;
}) => {
  const [yOffset, setYOffset] = useState(0);
  const { selectedOrganization } = useContext(OrganizationContext);
  const {
    data: repliedActivities,
    isLoading,
    isFetching,
    fetchNextPage,
  } = api.activity.getRepliedActivities.useInfiniteQuery(
    {
      organizationId: selectedOrganization?.id as string,
      leadEmail: filters?.search,
      campaignIds: filters?.campaign,
      accountIds: filters?.account,
      leadStatus: filters?.leadStatus,
      limit: 10,
    },
    {
      getNextPageParam: lastPage => lastPage.nextCursor,
    },
  );
  const data = useMemo(() => repliedActivities?.pages.flatMap(page => page.items) ?? [], [repliedActivities]);

  const fetchMoreOnBottomReached = useCallback(
    (position?: { x: number; y: number }) => {
      console.log({ position: position?.y, yOffset });
      if (position?.y) {
        if (position.y - yOffset >= SCROLL_OFFSET && !isFetching) {
          setYOffset(offset => offset + SCROLL_OFFSET);
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, yOffset],
  );

  if (!isLoading && (!data || data?.length === 0)) {
    return (
      <Alert icon={<IconAlertCircle size="1rem" />} title="There is no data for your request" color="gray">
        Can not find any replied messages.
      </Alert>
    );
  }

  return (
    <SkeletonData isLoading={isLoading} count={10} skeletonProps={{ h: 40, w: '100%', mt: 5 }}>
      <ScrollArea h={720} onScrollPositionChange={fetchMoreOnBottomReached}>
        {data?.map(activity => (
          <ActivityItem
            key={activity.id}
            activeThread={activeThread}
            activity={activity}
            onClick={() => setActiveThread(activity)}
          />
        ))}
      </ScrollArea>
    </SkeletonData>
  );
};

const ActivityItem = ({ activity, onClick, activeThread }: { activity: any; onClick: any; activeThread: any }) => {
  const { classes, cx } = useStyles();
  return (
    <Stack
      px={25}
      py={20}
      className={cx(classes.activity, { [classes.active]: activity?.accountId === activeThread?.accountId })}
      onClick={onClick}
    >
      <Group position="apart">
        <Text weight={600} maw={220} truncate>
          {activity?.leadEmail}
        </Text>
        <Text size="xs" color="gray.7">
          {dayjs(activity?.createdAt).format('MMM DD, YYYY, HH:mm')}
        </Text>
      </Group>
      <Text color="gray.9" weight={500} size="sm">
        {activity?.subject}
      </Text>
      <Text color="gray.7" size="sm">
        {truncate(activity?.body, { length: 100 })}
      </Text>
    </Stack>
  );
};

export default RepliedList;
