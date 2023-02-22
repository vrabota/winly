import React from 'react';
import { Group, Paper, Stack, ThemeIcon, Title, Text } from '@mantine/core';
import { IconMaximize } from '@tabler/icons';

import { NumberInput } from '@components/form';

const DailyLimit = () => {
  return (
    <Stack align="center" spacing={20}>
      <Paper shadow="sm" p="xl" radius="md" w={800} withBorder>
        <Stack spacing={30}>
          <Stack spacing={20}>
            <Group>
              <ThemeIcon radius="xl" size="xl">
                <IconMaximize />
              </ThemeIcon>
              <Title order={4}>Daily sending limit</Title>
            </Group>
            <Text>Max number of emails to send per day for this campaign</Text>
          </Stack>
          <NumberInput w={300} name="dailyLimit" />
        </Stack>
      </Paper>
    </Stack>
  );
};

export default DailyLimit;
