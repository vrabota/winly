import React from 'react';
import { Box } from '@mantine/core';

import type { ReactNode } from 'react';

const Cell = ({ children }: { children: ReactNode }) => {
  return (
    <Box
      p={15}
      sx={theme => ({
        backgroundColor: theme.colors.gray[0],
        borderRadius: theme.radius.md,
      })}
    >
      {children}
    </Box>
  );
};

export default Cell;
