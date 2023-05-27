import {
  Grid,
  Group,
  Paper,
  Title,
  Text,
  Stack,
  createStyles,
  Avatar,
  Divider,
  TypographyStylesProvider,
  Badge,
} from '@mantine/core';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { AccountState } from '@prisma/client';
import truncate from 'lodash/truncate';

import { Filters } from '@components/data';

import type { NextPage } from 'next';

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

const Inbox: NextPage = () => {
  return (
    <>
      <Title mb={20} order={2}>
        Inbox
      </Title>
      <Stack>
        <Filters
          searchProps={{ placeholder: 'Search by lead email' }}
          applyFilters={() => null}
          items={[
            {
              key: 'leadStatus',
              label: 'Lead status',
              title: 'Lead status filters',
              options: [
                { value: AccountState.CONNECTING, label: 'Connecting' },
                { value: AccountState.CONNECTED, label: 'Connected' },
                { value: AccountState.ERROR, label: 'Has errors' },
                { value: AccountState.DISCONNECTED, label: 'Disconnected' },
              ],
            },
            {
              key: 'campaign',
              label: 'Campaign',
              title: 'Filter leads by campaign',
              options: [
                { value: AccountState.CONNECTING, label: 'Connecting' },
                { value: AccountState.CONNECTED, label: 'Connected' },
                { value: AccountState.ERROR, label: 'Has errors' },
                { value: AccountState.DISCONNECTED, label: 'Disconnected' },
              ],
            },
            {
              key: 'account',
              label: 'Account',
              title: 'Filter leads by sent account',
              options: [
                { value: AccountState.CONNECTING, label: 'Connecting' },
                { value: AccountState.CONNECTED, label: 'Connected' },
                { value: AccountState.ERROR, label: 'Has errors' },
                { value: AccountState.DISCONNECTED, label: 'Disconnected' },
              ],
            },
          ]}
        />
        <Grid gutter={20}>
          <Grid.Col span={4}>
            <Paper p={20} bg="white" radius="md" shadow="xs">
              {Array.from({ length: 5 }).map((_, index) => (
                <ActivityItem key={index} />
              ))}
            </Paper>
          </Grid.Col>
          <Grid.Col span="auto">
            <Paper bg="white" radius="md" shadow="xs">
              <EmailMessage />
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>
    </>
  );
};

const EmailMessage = () => {
  return (
    <Stack p={25}>
      <Group align="flex-start">
        <Avatar color="purple" radius="xl" size={45}>
          <Text sx={{ textTransform: 'uppercase' }}>SR</Text>
        </Avatar>
        <Stack spacing={3} sx={{ flex: 1 }}>
          <Group position="apart" align="flex-start">
            <Group my={5}>
              <Text weight={600}>b.lindner@lindner-und-mueller.de</Text>
              <Badge>Lead</Badge>
            </Group>
            <Text size="xs" color="gray.7">
              May 23, 2023 at 12:04 pm
            </Text>
          </Group>
          <Text weight={500}>Automatische Antwort: Bernhard , looking for Remote Developers?</Text>
          <Text>to: gabrielle.k@askindex.com</Text>
        </Stack>
      </Group>
      <Divider color="gray.1" />
      <TypographyStylesProvider>
        <div
          dangerouslySetInnerHTML={{
            __html:
              '<p>Hi Bernhard ,</p><p>Get access to the Index platform with 8000+ remote candidates on it. Our experts have already checked the level of English, references about previous work, cultural fit, ID check</p><p>Since our Sourcing & Talent Recruiting teams cannot rely on typical signals that would allow them to determine if someone is good enough for the clients, Index has developed an effective hand-picking method.</p><p>Therefore, I am thrilled to introduce Index, a hiring platform that can assist you in this regard, offering access to over 8000 high-performing developers who have been verified and vetted.</p>',
          }}
        />
      </TypographyStylesProvider>
    </Stack>
  );
};

const ActivityItem = () => {
  const { classes } = useStyles();
  const message =
    'If this email is construction related, please email construction@meridiacm.com. If this email is construction related, please email construction@meridiacm.com.';
  return (
    <Stack px={25} py={20} className={classes.activity}>
      <Group position="apart">
        <Text weight={600} maw={220} truncate>
          slavic.rabota@gmail.com
        </Text>
        <Text size="xs" color="gray.7">
          May 25, 2023
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

export default withPageAuthRequired(Inbox);
