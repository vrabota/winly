import React from 'react';
import { showNotification, updateNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons';

import { api } from '@utils/api';
import { NOTIFICATION } from '@utils/notificationIds';

export const useReconnectAccount = () => {
  const utils = api.useContext();
  const { mutate: mutateReconnect } = api.account.reconnectAccount.useMutation({
    onMutate: () => {
      showNotification({
        id: NOTIFICATION.RECONNECT_ACCOUNT,
        loading: true,
        title: 'Reconnecting account...',
        message: 'We are trying to reconnecting your account',
        disallowClose: true,
        autoClose: false,
      });
    },
    onSuccess: async () => {
      updateNotification({
        id: NOTIFICATION.RECONNECT_ACCOUNT,
        color: 'teal',
        title: 'Account connected',
        message: 'Your account is connected to our system',
        autoClose: 2000,
        icon: <IconCheck size={16} />,
      });
      await utils.account.getAccounts.invalidate();
    },
  });
  return { mutateReconnect };
};
