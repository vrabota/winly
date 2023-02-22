import React from 'react';
import { Group, Paper, Stack, ThemeIcon, Title } from '@mantine/core';
import { IconCalendarTime } from '@tabler/icons';

import { DateRangeField } from '@components/form';
import { Skeleton } from '@components/data';

const Schedule = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <Stack align="center" spacing={20}>
      <Paper shadow="sm" p="xl" radius="md" w={800} withBorder>
        <Stack spacing={30}>
          <Stack spacing={20}>
            <Group>
              <ThemeIcon radius="xl" size="xl">
                <IconCalendarTime />
              </ThemeIcon>
              <Title order={4}>Schedule</Title>
            </Group>
          </Stack>
          <Skeleton isLoading={isLoading}>
            <DateRangeField placeholder="Pick date range" label="Schedule" name="schedule" />
          </Skeleton>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default Schedule;
