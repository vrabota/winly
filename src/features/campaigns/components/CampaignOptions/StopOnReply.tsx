import React from 'react';
import { Group, Paper, Stack, ThemeIcon, Title, Text } from '@mantine/core';
import { IconClockStop } from '@tabler/icons';

import { SwitchField } from '@components/form';

const StopOnReply = () => {
  return (
    <Stack align="center" spacing={20}>
      <Paper shadow="sm" p="xl" radius="md" w={800} withBorder>
        <Stack spacing={30}>
          <Stack spacing={20}>
            <Group>
              <ThemeIcon radius="xl" size="xl">
                <IconClockStop />
              </ThemeIcon>
              <Title order={4}>Stop sending emails on reply</Title>
              <Text>Stop sending emails to a lead if a response has been received</Text>
            </Group>
          </Stack>
          <SwitchField size="xl" onLabel="ON" offLabel="OFF" name="sendOnReply" />
        </Stack>
      </Paper>
    </Stack>
  );
};

export default StopOnReply;
