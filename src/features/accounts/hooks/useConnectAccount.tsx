import { useRouter } from 'next/router';
import { showNotification, updateNotification } from '@mantine/notifications';
import { useEffect } from 'react';
import { IconCheck } from '@tabler/icons';

import { NOTIFICATION } from '@utils/notificationIds';
import { api } from '@utils/api';

export const useConnectAccount = () => {
  const { query, replace } = useRouter();
  const utils = api.useContext();
  const { isFetching, isSuccess } = api.account.connectGoogleOauthAccount.useQuery(
    { code: query.code as string },
    {
      enabled: !!query?.code,
      onSuccess: async () => {
        await replace('/', undefined, { shallow: true });
        await utils.account.getAccounts.invalidate();
      },
    },
  );
  useEffect(() => {
    if (query?.code) {
      showNotification({
        id: NOTIFICATION.CONNECT_ACCOUNT,
        loading: true,
        title: 'Connecting account...',
        message: 'We are connecting you account to our system',
        disallowClose: true,
        autoClose: false,
      });
    }
    if (isSuccess) {
      updateNotification({
        id: NOTIFICATION.CONNECT_ACCOUNT,
        color: 'teal',
        title: 'Account connected',
        message: 'Your account is connected to our system',
        autoClose: 2000,
        icon: <IconCheck size={16} />,
      });
    }
  }, [isFetching, isSuccess, query?.code]);
};
