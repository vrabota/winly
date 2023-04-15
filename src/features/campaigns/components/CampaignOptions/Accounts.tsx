import React from 'react';
import { Group, Paper, Stack, Text, ThemeIcon } from '@mantine/core';

import { TransferList } from '@components/form';
import { Skeleton } from '@components/data';
import { Envelope } from '@assets/icons';

const Accounts = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <Stack align="center" spacing={20}>
      <Paper shadow="md" p="xl" radius="md" w={800}>
        <Stack spacing={30}>
          <Stack spacing={20}>
            <Group>
              <ThemeIcon radius="xl" size="xl">
                <Envelope size={18} />
              </ThemeIcon>
              <Text weight={500}>Accounts to use</Text>
            </Group>
            <Text size={14}>Select one or more accounts to send emails from.</Text>
          </Stack>
          <Skeleton isLoading={isLoading}>
            <TransferList
              sx={{ button: { height: 42 } }}
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
