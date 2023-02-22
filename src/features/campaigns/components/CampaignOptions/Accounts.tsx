import React from 'react';
import { Group, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { IconMail } from '@tabler/icons';

import { TransferList } from '@components/form';
import { Skeleton } from '@components/data';

const Accounts = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <Stack align="center" spacing={20}>
      <Paper shadow="sm" p="xl" radius="md" w={800} withBorder>
        <Stack spacing={30}>
          <Stack spacing={20}>
            <Group>
              <ThemeIcon radius="xl" size="xl">
                <IconMail />
              </ThemeIcon>
              <Title order={4}>Accounts to use</Title>
            </Group>
            <Text>Select one or more accounts to send emails from</Text>
          </Stack>
          <Skeleton isLoading={isLoading}>
            <TransferList
              name="accounts"
              searchPlaceholder="Search..."
              nothingFound="Nothing here"
              titles={['All accounts', 'Selected accounts']}
              breakpoint="sm"
            />
          </Skeleton>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default Accounts;
