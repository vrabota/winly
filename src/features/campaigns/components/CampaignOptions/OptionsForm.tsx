import React, { useEffect } from 'react';
import { z } from 'zod';
import omit from 'lodash/omit';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Stack, Group } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons';
import { useRouter } from 'next/router';

import { api } from '@utils/api';

import Accounts from './Accounts';
import Days from './Days';
import Timing from './Timing';
import StopOnReply from './StopOnReply';
import OpenTracking from './OpenTracking';
import DailyLimit from './DailyLimit';
import Schedule from './Schedule';

const OptionsForm = () => {
  const { query } = useRouter();
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
    schedule: z.array(z.date()),
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
  const { data: accountsData } = api.account.getAccounts.useQuery(undefined, {
    onSuccess: data => {
      const orgAccounts = data?.accounts?.map(item => ({ value: item.account, label: item.email as string })) || [];
      methods.setValue('accounts', [orgAccounts, []]);
    },
  });
  const { isLoading, data: campaignData } = api.campaign.getCampaignById.useQuery(
    { campaignId: query.campaignId as string },
    {
      onSuccess: data => {
        if (data) {
          methods.setValue('dailyLimit', data?.dailyLimit || undefined);
          methods.setValue('openTracking', data?.openTracking || undefined);
          data?.startDate && data?.endDate && methods.setValue('schedule', [data?.startDate, data?.endDate]);
          methods.setValue('days', data?.scheduleDays || []);
          methods.setValue('from', data?.time?.from);
          methods.setValue('to', data?.time?.to);
          methods.setValue('to', data?.time?.to);
          methods.setValue('timezone', data?.timezone || undefined);
        }
      },
    },
  );
  useEffect(() => {
    if (accountsData?.accounts && campaignData?.accountIds) {
      const selectedAccounts = campaignData?.accountIds || [];
      const allAccounts = accountsData?.accounts || [];
      const selectedAccountsFilter = allAccounts
        .filter(account => selectedAccounts.includes(account.account))
        .map(item => ({ value: item.account, label: item.email as string }));
      const allAccountsFilter = allAccounts
        .filter(account => !selectedAccounts.includes(account.account))
        .map(item => ({ value: item.account, label: item.email as string }));
      methods.setValue('accounts', [allAccountsFilter, selectedAccountsFilter]);
    }
  }, [campaignData?.accountIds, accountsData?.accounts, methods]);

  const { mutate: saveCampaign } = api.campaign.updateCampaign.useMutation();
  const { mutate: startCampaign } = api.campaign.startCampaign.useMutation();
  const onSubmit = async (data: ValidationSchema) => {
    const payload = {
      ...data,
      accountIds: data.accounts[1]?.map(item => item.value) || [],
      scheduleDays: data?.days,
      startDate: data.schedule[0] as Date,
      endDate: data.schedule[1] as Date,
      campaignId: query.campaignId as string,
      time: {
        from: data?.from,
        to: data?.to,
      },
    };
    saveCampaign(omit(payload, ['schedule', 'from', 'to', 'accounts']), {
      onSuccess: data => {
        showNotification({
          color: 'teal',
          title: 'Campaign update',
          message: `We updated ${data.name} campaign successfully.`,
          autoClose: 2000,
          icon: <IconCheck size={16} />,
        });
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <Accounts isLoading={isLoading} />
      <Schedule isLoading={isLoading} />
      <Days isLoading={isLoading} />
      <Timing isLoading={isLoading} />
      <StopOnReply />
      <OpenTracking />
      <DailyLimit />
      <Stack align="center">
        <Group position="right" w={800}>
          <Button onClick={methods.handleSubmit(onSubmit)}>Save</Button>
          <Button onClick={() => startCampaign({ campaignId: query.campaignId as string })}>Launch</Button>
        </Group>
      </Stack>
    </FormProvider>
  );
};

export default OptionsForm;
