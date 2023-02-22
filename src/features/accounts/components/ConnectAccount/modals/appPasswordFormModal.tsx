import { openConfirmModal } from '@mantine/modals';
import React from 'react';

import AppPasswordForm from '@features/accounts/components/ConnectAccount/AppPasswordForm';

import { MODAL_IDS } from '../constants';

export const appPasswordFormModal = () =>
  openConfirmModal({
    modalId: MODAL_IDS.GOOGLE_APP_PASSWORD_FORM_MODAL,
    size: 500,
    closeOnConfirm: false,
    confirmProps: {
      hidden: true,
    },
    closeOnClickOutside: false,
    cancelProps: {
      hidden: true,
    },
    children: <AppPasswordForm />,
  });
