import React from 'react';
import { ActionIcon, Stack, Text, Title } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';

import { Delete } from '@assets/icons';

import type { ReactNode } from 'react';

interface ModalProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
}

const ModalContainer = ({ children, title, subtitle }: ModalProps) => {
  return (
    <Stack spacing={20} mb={-16}>
      <Stack spacing={0} px={40} sx={{ textAlign: 'center', position: 'relative' }}>
        {title && (
          <Title weight={500} size={20} order={4}>
            {title}
          </Title>
        )}

        {subtitle && (
          <Text size={14} sx={theme => ({ color: theme.colors.gray[7] })}>
            {subtitle}
          </Text>
        )}
        <ActionIcon
          onClick={() => closeAllModals()}
          radius="xl"
          size="lg"
          sx={{ ':hover': { transition: 'all 0.3s' }, position: 'absolute', top: 0, right: 0 }}
        >
          <Delete color="#404040" size={12} />
        </ActionIcon>
      </Stack>
      {children}
    </Stack>
  );
};

export default ModalContainer;
