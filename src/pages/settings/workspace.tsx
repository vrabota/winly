import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { Button, Paper, Text, Stack, Group } from '@mantine/core';
import { FormProvider } from 'react-hook-form';
import React from 'react';

import SettingsTabs from '@features/settings/components/SettingsTabs';
import { useUpdateWorkspaceForm } from '@features/settings/hooks/useUpdateWorkspaceForm';
import { TextInput } from '@components/form';

import type { NextPage } from 'next';

const Workspace: NextPage = () => {
  const { methods, onSubmit, isLoading } = useUpdateWorkspaceForm();
  return (
    <>
      <SettingsTabs />
      <Paper mt={20} shadow="md" p="xl" radius="md">
        <Text weight={500}>Workspace name</Text>
        <FormProvider {...methods}>
          <Stack mt={20}>
            <Group align="end">
              <TextInput w={300} label="Name" name="workspaceName" />
              <Button h={42} loading={isLoading} onClick={methods.handleSubmit(onSubmit)}>
                Update
              </Button>
            </Group>
          </Stack>
        </FormProvider>
      </Paper>
    </>
  );
};

export default withPageAuthRequired(Workspace);
