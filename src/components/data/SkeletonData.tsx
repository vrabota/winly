import React from 'react';
import { Skeleton } from '@mantine/core';

import type { SkeletonProps } from '@mantine/core';
import type { ReactNode } from 'react';

interface SkeletonDataProps {
  children: ReactNode;
  isLoading: boolean;
  skeletonProps?: SkeletonProps;
}

const SkeletonData = ({ children, isLoading, skeletonProps }: SkeletonDataProps) => {
  if (isLoading) return <Skeleton {...skeletonProps} />;
  return <>{children}</>;
};

export default SkeletonData;
