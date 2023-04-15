import { openConfirmModal } from '@mantine/modals';
import React from 'react';

import { ModalContainer } from '@components/overlays';
import DeleteBatchLeads from '@features/leads/components/DeleteBatchLeads';

export const deleteBatchLeadsModal = ({ leadIds }: { leadIds: any }) => {
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
      <ModalContainer title={`Delete selected leads?`} subtitle={`This can't be undone`}>
        <DeleteBatchLeads leadIds={leadIds} />
      </ModalContainer>
    ),
  });
};
