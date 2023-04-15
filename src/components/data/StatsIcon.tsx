import React, { forwardRef } from 'react';
import { Stack, Text } from '@mantine/core';

import type { ReactNode } from 'react';

// eslint-disable-next-line react/display-name
const StatsIcon = forwardRef<HTMLDivElement, { icon: ReactNode; count: number }>(({ icon, count }, ref) => {
  return (
    <Stack
      ref={ref}
      sx={theme => ({ borderRadius: theme.radius.md })}
      bg="gray.0"
      px={15}
      h={55}
      align="center"
      justify="center"
      spacing={5}
    >
      {icon}
      <Text weight={500} size={14} color="purple.6">
        {count}
      </Text>
    </Stack>
  );
});

export default StatsIcon;
