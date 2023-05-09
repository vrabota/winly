import { showNotification, updateNotification } from '@mantine/notifications';
import { IconCheck, IconFaceIdError } from '@tabler/icons';
import React from 'react';

import { NOTIFICATION } from '@utils/notificationIds';
import { api } from '@utils/api';

export const useStartCampaign = () => {
  const utils = api.useContext();
  return api.campaign.startCampaign.useMutation({
    onMutate: () => {
      showNotification({
        id: NOTIFICATION.CAMPAIGN_START,
        loading: true,
        title: 'Starting campaign...',
        message: 'We are trying to start campaign',
        disallowClose: true,
        autoClose: false,
      });
    },
    onSuccess: async () => {
      updateNotification({
        id: NOTIFICATION.CAMPAIGN_START,
        color: 'teal',
        title: 'Campaign started',
        message: 'Your campaign is currently live',
        autoClose: 2000,
        icon: <IconCheck size={16} />,
      });
      utils.campaign.getAllCampaigns.invalidate();
      utils.campaign.getCampaignById.invalidate();
    },
    onError: async () => {
      updateNotification({
        id: NOTIFICATION.CAMPAIGN_START,
        color: 'red',
        title: 'Ooops! Something went wrong',
        message: 'We are not able to start campaign',
        autoClose: 2000,
        icon: <IconFaceIdError size={16} />,
      });
    },
  });
};
