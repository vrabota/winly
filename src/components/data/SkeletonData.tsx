import React from 'react';
import { Skeleton, Stack } from '@mantine/core';

import type { SkeletonProps } from '@mantine/core';
import type { ReactNode } from 'react';

interface SkeletonDataProps {
  children: ReactNode;
  isLoading: boolean;
  skeletonProps?: SkeletonProps;
  count?: number;
}

const SkeletonData = ({ children, isLoading, skeletonProps, count = 1 }: SkeletonDataProps) => {
  if (isLoading)
    return (
      <Stack>
        {Array.from({ length: count }).map((_, index) => (
          <Skeleton key={index} {...skeletonProps} />
        ))}
      </Stack>
    );
  return <>{children}</>;
};

export default SkeletonData;
