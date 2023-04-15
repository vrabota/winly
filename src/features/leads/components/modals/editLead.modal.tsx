import { openConfirmModal } from '@mantine/modals';
import React from 'react';

import { ModalContainer } from '@components/overlays';
import EditLeadForm from '@features/leads/components/EditLeadForm';

export const editLeadModal = ({ leadId, email }: { leadId: string; email: string }) => {
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
      <ModalContainer title={`Edit lead data`} subtitle={`Edit data for ${email} lead.`}>
        <EditLeadForm leadId={leadId} />
      </ModalContainer>
    ),
  });
};
