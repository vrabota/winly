import { openConfirmModal } from '@mantine/modals';
import React from 'react';

import { ModalContainer } from '@components/overlays';
import DeleteLead from '@features/leads/components/DeleteLead';

export const deleteLeadModal = ({ leadId, email }: { leadId: string; email: string }) => {
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
      <ModalContainer title={`Delete lead from campaign?`} subtitle={`This can't be undone`}>
        <DeleteLead leadId={leadId} email={email} />
      </ModalContainer>
    ),
  });
};
