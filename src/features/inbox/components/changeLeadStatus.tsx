import { closeAllModals, openConfirmModal } from '@mantine/modals';
import { Title, Text, Stack, ActionIcon } from '@mantine/core';
import React from 'react';

import { Delete } from '@assets/icons';

import ChangeLeadForm from './ChangeLeadForm';

import type { LeadStatus } from '@prisma/client';

export const changeLeadStatus = ({ email, status, leadId }: { email?: string; status: LeadStatus; leadId: string }) => {
  return openConfirmModal({
    size: 'md',
    closeOnConfirm: false,
    confirmProps: {
      hidden: true,
    },
    cancelProps: {
      hidden: true,
    },
    children: (
      <Stack spacing={20} mb={-16}>
        <Stack spacing={0} px={40} sx={{ textAlign: 'center', position: 'relative' }}>
          <Title weight={500} size={20} order={4}>
            Change lead status
          </Title>
          <Text size={14} sx={theme => ({ color: theme.colors.gray[7] })}>
            {`Please provide a new status for ${email || ''}`}
          </Text>
          <ActionIcon
            onClick={() => closeAllModals()}
            radius="xl"
            size="lg"
            sx={{ ':hover': { transition: 'all 0.3s' }, position: 'absolute', top: 0, right: 0 }}
          >
            <Delete color="#404040" size={12} />
          </ActionIcon>
        </Stack>
        <ChangeLeadForm status={status} leadId={leadId} email={email} />
      </Stack>
    ),
  });
};
