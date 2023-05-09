import { showNotification, updateNotification } from '@mantine/notifications';
import { IconCheck, IconFaceIdError } from '@tabler/icons';
import React from 'react';

import { NOTIFICATION } from '@utils/notificationIds';
import { api } from '@utils/api';

export const useStopCampaign = () => {
  const utils = api.useContext();
  return api.campaign.stopCampaign.useMutation({
    onMutate: () => {
      showNotification({
        id: NOTIFICATION.CAMPAIGN_STOP,
        loading: true,
        title: 'Stopping campaign...',
        message: 'We are trying to stop campaign',
        disallowClose: true,
        autoClose: false,
      });
    },
    onSuccess: async () => {
      updateNotification({
        id: NOTIFICATION.CAMPAIGN_STOP,
        color: 'teal',
        title: 'Campaign stopped',
        message: 'Your campaign is currently off',
        autoClose: 2000,
        icon: <IconCheck size={16} />,
      });
      utils.campaign.getAllCampaigns.invalidate();
      utils.campaign.getCampaignById.invalidate();
    },
    onError: async () => {
      updateNotification({
        id: NOTIFICATION.CAMPAIGN_STOP,
        color: 'red',
        title: 'Ooops! Something went wrong',
        message: 'We are not able to stop campaign',
        autoClose: 2000,
        icon: <IconFaceIdError size={16} />,
      });
    },
  });
};
