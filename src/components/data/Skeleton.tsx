import React from 'react';
import { Skeleton as SkeletonMantine, Stack } from '@mantine/core';

import type { ReactNode } from 'react';

export const Skeleton = ({ children, isLoading }: { children: ReactNode; isLoading: boolean }) => {
  if (isLoading)
    return (
      <Stack>
        <SkeletonMantine h={10} />
        <SkeletonMantine h={10} w="80%" />
        <SkeletonMantine h={10} w="60%" />
      </Stack>
    );
  return <>{children}</>;
};
