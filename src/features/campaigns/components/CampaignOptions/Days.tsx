import React from 'react';
import { Group, Paper, Stack, ThemeIcon, Title, Checkbox } from '@mantine/core';
import { IconSun } from '@tabler/icons';

import { Skeleton } from '@components/data';
import { DayOfWeek } from '@server/types/DayOfWeek';
import { CheckboxGroup } from '@components/form';

const Days = ({ isLoading }: { isLoading: boolean }) => {
  return (
    <Stack align="center" spacing={20}>
      <Paper shadow="sm" p="xl" radius="md" w={800} withBorder>
        <Stack spacing={30}>
          <Stack spacing={20}>
            <Group>
              <ThemeIcon radius="xl" size="xl">
                <IconSun />
              </ThemeIcon>
              <Title order={4}>Days</Title>
            </Group>
          </Stack>
          <Skeleton isLoading={isLoading}>
            <CheckboxGroup name="days">
              {Object.values(DayOfWeek).map((day, index) => (
                <Checkbox key={day} value={`${index + 1}`} label={day} />
              ))}
            </CheckboxGroup>
          </Skeleton>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default Days;
