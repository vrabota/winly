import React from 'react';
import { Group, Paper, Stack, ThemeIcon, Text } from '@mantine/core';
import { IconMaximize } from '@tabler/icons';

import { NumberInput } from '@components/form';

const DailyLimit = () => {
  return (
    <Stack align="center" spacing={20}>
      <Paper shadow="md" p="xl" radius="md" w={800}>
        <Stack spacing={30}>
          <Stack spacing={20}>
            <Group>
              <ThemeIcon radius="xl" size="xl">
                <IconMaximize />
              </ThemeIcon>
              <Text weight={500}>Daily sending limit</Text>
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
