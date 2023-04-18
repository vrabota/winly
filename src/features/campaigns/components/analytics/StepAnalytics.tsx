import React from 'react';
import { Text, Paper, Accordion, createStyles, Stack, Group, Divider } from '@mantine/core';
import { useRouter } from 'next/router';
import { ActivityStatus } from '@prisma/client';

import { Contacted, BookOpen, MailReply } from '@assets/icons';
import { api } from '@utils/api';
import { calcRate } from '@utils/calcRate';

const useStyles = createStyles(theme => ({
  root: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    borderRadius: theme.radius.md,
  },

  item: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    border: '1px solid transparent',
    position: 'relative',
    zIndex: 0,
    transition: 'transform 150ms ease',

    '&[data-active]': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
      boxShadow: theme.shadows.md,
      borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],
      borderRadius: theme.radius.md,
      zIndex: 1,
    },
  },

  chevron: {
    '&[data-rotate]': {
      transform: 'rotate(-90deg)',
    },
  },
}));

const StepData = ({ step }: { step: any }) => {
  const contacted = step?.[ActivityStatus.CONTACTED]?.count || 0;
  const opened = step?.[ActivityStatus.OPENED]?.count || 0;
  const replied = step?.[ActivityStatus.REPLIED]?.count || 0;
  return (
    <Stack spacing={25}>
      <Group align="center" position="apart">
        <Group>
          <Contacted size={18} />
          <Text weight={500} size="sm">
            Contacted
          </Text>
        </Group>
        <Group>
          <Text weight={500} size="sm" color="purple.5">
            {contacted}
          </Text>
          <Divider orientation="vertical" color="white" />
          <Text w="45px" weight={500} size="sm"></Text>
        </Group>
      </Group>
      <Group align="center" position="apart">
        <Group>
          <BookOpen size={18} />
          <Text weight={500} size="sm">
            Opened
          </Text>
        </Group>
        <Group>
          <Text weight={500} size="sm" color="purple.5">
            {opened}
          </Text>
          <Divider orientation="vertical" />
          <Text w="45px" weight={500} size="sm">
            {calcRate(opened, contacted)}
          </Text>
        </Group>
      </Group>
      <Group align="center" position="apart">
        <Group>
          <MailReply size={18} />
          <Text ml={-5} weight={500} size="sm">
            Replied
          </Text>
        </Group>
        <Group>
          <Text weight={500} size="sm" color="purple.5">
            {replied}
          </Text>
          <Divider orientation="vertical" />
          <Text w="45px" weight={500} size="sm">
            {calcRate(replied, contacted)}
          </Text>
        </Group>
      </Group>
    </Stack>
  );
};

const StepAnalytics = () => {
  const { classes } = useStyles();
  const { query } = useRouter();
  const { data } = api.activity.getActivitiesByStep.useQuery({
    campaignId: query.campaignId as string,
  });
  return (
    <Paper shadow="sm" radius="md" p="xl">
      <Text weight="500" mb={20}>
        Step Analytics
      </Text>
      <Accordion variant="filled" defaultValue="step-1" radius="md" classNames={classes} className={classes.root}>
        {data?.map((step: any, index: number) => (
          <Accordion.Item key={`step-${index + 1}`} value={`step-${index + 1}`}>
            <Accordion.Control>{`Step ${index + 1}`}</Accordion.Control>
            <Accordion.Panel>
              <StepData step={step} />
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Paper>
  );
};

export default StepAnalytics;
