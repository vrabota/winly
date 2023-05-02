import React, { useContext, useEffect } from 'react';
import { z } from 'zod';
import omit from 'lodash/omit';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Stack, Group, ActionIcon, Menu, Text } from '@mantine/core';
import { showNotification, updateNotification } from '@mantine/notifications';
import { IconCheck, IconChevronUp } from '@tabler/icons';
import { useRouter } from 'next/router';

import { Play } from '@assets/icons';
import { api } from '@utils/api';
import { NOTIFICATION } from '@utils/notificationIds';
import { OrganizationContext } from '@context/OrganizationContext';

import Accounts from './Accounts';
import Days from './Days';
import Timing from './Timing';
import StopOnReply from './StopOnReply';
import OpenTracking from './OpenTracking';
import DailyLimit from './DailyLimit';

const OptionsForm = () => {
  const { query, push } = useRouter();
  const transferItemSchema = z.object({
    value: z.string(),
    label: z.string(),
    group: z.string().optional(),
  });
  const validationSchema = z.object({
    accounts: z.array(z.array(transferItemSchema), z.array(transferItemSchema).min(1)),
    days: z.array(z.string()),
    from: z.string().optional(),
    to: z.string().optional(),
    // schedule: z.array(z.date()),
    timezone: z.string().optional(),
    sendOnReply: z.boolean().optional(),
    openTracking: z.boolean().optional(),
    dailyLimit: z.number().optional(),
  });
  type ValidationSchema = z.infer<typeof validationSchema>;
  const methods = useForm<ValidationSchema>({
    defaultValues: {
      accounts: [[], []], // TODO validation for selected accounts min 1
      days: ['1', '2', '3', '4', '5'],
      from: '9:00 AM',
      to: '6:00 PM',
      sendOnReply: true,
      openTracking: true,
    },
    resolver: zodResolver(validationSchema),
  });

  const { selectedOrganization } = useContext(OrganizationContext);
  const { data: accountsData } = api.account.getAccounts.useQuery({
    organizationId: selectedOrganization?.id as string,
  });
  const { isLoading, data: campaignData } = api.campaign.getCampaignById.useQuery(
    { campaignId: query.campaignId as string, organizationId: selectedOrganization?.id as string },
    {
      onSuccess: data => {
        if (data) {
          data?.dailyLimit && methods.setValue('dailyLimit', data?.dailyLimit || undefined);
          data?.openTracking && methods.setValue('openTracking', data?.openTracking || undefined);
          // data?.startDate && data?.endDate && methods.setValue('schedule', [data?.startDate, data?.endDate]);
          data?.scheduleDays && methods.setValue('days', data?.scheduleDays || []);
          data?.time?.from && methods.setValue('from', data?.time?.from);
          data?.time?.to && methods.setValue('to', data?.time?.to);
          data?.timezone && methods.setValue('timezone', data?.timezone || undefined);
        }
      },
    },
  );
  useEffect(() => {
    const selectedAccounts = campaignData?.accountIds || [];
    const allAccounts = accountsData?.items || [];
    const selectedAccountsFilter = allAccounts
      .filter(account => selectedAccounts.includes(account.id))
      .map(item => ({ value: item.id, label: item.email as string }));
    const allAccountsFilter = allAccounts
      .filter(account => !selectedAccounts.includes(account.id))
      .map(item => ({ value: item.id, label: item.email as string }));

    methods.setValue('accounts', [allAccountsFilter, selectedAccountsFilter]);
  }, [campaignData?.accountIds, accountsData, methods]);

  const { mutate: saveCampaign, isLoading: isLoadingSave } = api.campaign.updateCampaign.useMutation();
  const { mutate: startCampaign } = api.campaign.startCampaign.useMutation({
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
      await push('/campaigns');
    },
  });
  const onSubmit = async (data: ValidationSchema, isStartEnabled?: boolean) => {
    const payload = {
      ...data,
      accountIds: data.accounts[1]?.map(item => item.value) || [],
      scheduleDays: data?.days,
      // startDate: data.schedule[0] as Date,
      // endDate: data.schedule[1] as Date,
      campaignId: query.campaignId as string,
      time: {
        from: data?.from,
        to: data?.to,
      },
    };
    await saveCampaign(omit(payload, ['from', 'to', 'accounts']), {
      onSuccess: () => {
        !isStartEnabled &&
          showNotification({
            color: 'teal',
            title: 'Campaign updated',
            message: `We updated your campaign successfully.`,
            autoClose: 2000,
            icon: <IconCheck size={16} />,
          });
      },
    });
    if (isStartEnabled) {
      await startCampaign({
        campaignId: query.campaignId as string,
        organizationId: selectedOrganization?.id as string,
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <Accounts isLoading={isLoading} />
      <Days isLoading={isLoading} />
      <Timing isLoading={isLoading} />
      <StopOnReply />
      <OpenTracking />
      <DailyLimit />
      <Stack align="center">
        <Group spacing={0} position="right" w={800}>
          <Button
            loading={isLoadingSave}
            w={150}
            radius="md"
            sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
            size="md"
            onClick={methods.handleSubmit(data => onSubmit(data, false))}
          >
            Save
          </Button>
          <Menu position="top-end">
            <Menu.Target>
              <ActionIcon
                radius="md"
                variant="filled"
                sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                w={40}
                h={42}
                color="purple.4"
              >
                <IconChevronUp />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item onClick={methods.handleSubmit(data => onSubmit(data, true))} icon={<Play size={14} />}>
                <Text weight={500}>Save & Start Campaign</Text>
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Stack>
    </FormProvider>
  );
};

export default OptionsForm;
