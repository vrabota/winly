import { Group, Text, Stack, createStyles, Alert } from '@mantine/core';
import truncate from 'lodash/truncate';
import React, { useContext } from 'react';
import dayjs from 'dayjs';
import { IconAlertCircle } from '@tabler/icons';

import { api } from '@utils/api';
import { OrganizationContext } from '@context/OrganizationContext';
import { SkeletonData } from '@components/data';

import type { LeadStatus } from '@prisma/client';

const useStyles = createStyles(theme => ({
  activity: {
    cursor: 'pointer',
    transition: 'all 0.3s',
    borderBottom: `1px solid ${theme.colors.gray[1]}`,
    ':hover': {
      background: theme.colors.gray[0],
    },
    ':last-child': {
      border: 'none',
    },
  },
}));

const RepliedList = ({
  filters,
}: {
  filters?: {
    account?: string[];
    campaign?: string[];
    leadStatus?: LeadStatus[];
    search?: string;
  };
}) => {
  const { selectedOrganization } = useContext(OrganizationContext);
  const { data, isLoading } = api.activity.getRepliedActivities.useQuery({
    organizationId: selectedOrganization?.id as string,
    leadEmail: filters?.search,
    campaignIds: filters?.campaign,
    accountIds: filters?.account,
  });

  if (!isLoading && (!data?.items || data?.items.length === 0)) {
    return (
      <Alert icon={<IconAlertCircle size="1rem" />} title="There is no data for your request" color="gray">
        Can not find any replied messages.
      </Alert>
    );
  }

  return (
    <SkeletonData isLoading={isLoading} count={5} skeletonProps={{ h: 80, w: '100%', mt: 5 }}>
      <>
        {data?.items?.map(activity => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </>
    </SkeletonData>
  );
};

const ActivityItem = ({ activity }: { activity: any }) => {
  const { classes } = useStyles();
  const message =
    'If this email is construction related, please email construction@meridiacm.com. If this email is construction related, please email construction@meridiacm.com.';
  return (
    <Stack px={25} py={20} className={classes.activity}>
      <Group position="apart">
        <Text weight={600} maw={220} truncate>
          {activity?.leadEmail}
        </Text>
        <Text size="xs" color="gray.7">
          {dayjs(activity?.createdAt).format('MMM DD, YYYY, HH:mm')}
        </Text>
      </Group>
      <Text color="gray.9" weight={500} size="sm">
        Automatic reply: Denise , get access to a global talent pool of tech talent
      </Text>
      <Text color="gray.7" size="sm">
        {truncate(message, { length: 100 })}
      </Text>
    </Stack>
  );
};

export default RepliedList;
