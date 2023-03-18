import React from 'react';
import { Modal as MantineModal, useMantineTheme, Stack, Title, Text, ActionIcon, Box } from '@mantine/core';

import { Delete } from '@assets/icons';

import type { ReactNode } from 'react';

interface ModalProps {
  opened: boolean;
  open: () => void;
  close: () => void;
  title?: string;
  subtitle?: string;
  footer?: ReactNode;
  children: ReactNode;
  size?: string | number;
}

const Modal = ({ opened, close, title, subtitle, children, footer, size }: ModalProps) => {
  const theme = useMantineTheme();
  return (
    <MantineModal
      size={size}
      padding="xl"
      opened={opened}
      onClose={close}
      overlayOpacity={0.8}
      overlayBlur={0.5}
      withCloseButton={false}
      overlayColor={theme.colors.gray[0]}
      centered
    >
      <Stack spacing={20}>
        <Stack spacing={0} px={40} sx={{ textAlign: 'center', position: 'relative' }}>
          {title && (
            <Title weight={500} size={20} order={4}>
              {title}
            </Title>
          )}
          {subtitle && (
            <Text size={14} color={theme.colors.gray[7]}>
              {subtitle}
            </Text>
          )}
          <ActionIcon
            onClick={close}
            radius="xl"
            size="lg"
            sx={{ ':hover': { transition: 'all 0.3s' }, position: 'absolute', top: 0, right: 0 }}
          >
            <Delete color={theme.colors.dark[9]} size={12} />
          </ActionIcon>
        </Stack>
        <Box my={10}>{children}</Box>
        {footer}
      </Stack>
    </MantineModal>
  );
};

export default Modal;
