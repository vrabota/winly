import { openConfirmModal } from '@mantine/modals';
import React from 'react';

import { ModalContainer } from '@components/overlays';
import LeadActivity from '@features/leads/components/LeadActivity';

export const viewActivityModal = ({
  leadId,
  email,
  organizationId,
}: {
  leadId: string;
  email: string;
  organizationId: string;
}) => {
  return openConfirmModal({
    size: 'lg',
    closeOnConfirm: false,
    confirmProps: {
      hidden: true,
    },
    cancelProps: {
      hidden: true,
    },
    children: (
      <ModalContainer title={`Lead activity`} subtitle={`Find all activity events for ${email}.`}>
        <LeadActivity leadId={leadId} email={email} organizationId={organizationId} />
      </ModalContainer>
    ),
  });
};
