import React from 'react';
import { showNotification, updateNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons';

import { api } from '@utils/api';
import { NOTIFICATION } from '@utils/notificationIds';

export const useDeleteAccount = () => {
  const utils = api.useContext();
  const { mutate: mutateDeleteAccount } = api.account.deleteAccount.useMutation({
    onMutate: () => {
      showNotification({
        id: NOTIFICATION.DELETE_ACCOUNT,
        loading: true,
        title: 'Deleting account...',
        message: 'We are deleting your account',
        disallowClose: true,
        autoClose: false,
      });
    },
    onSuccess: async () => {
      updateNotification({
        id: NOTIFICATION.DELETE_ACCOUNT,
        color: 'teal',
        title: 'Account deleted',
        message: 'Your account is successfully deleted',
        autoClose: 2000,
        icon: <IconCheck size={16} />,
      });
      await utils.account.getAccounts.invalidate();
    },
  });
  return { mutateDeleteAccount };
};
