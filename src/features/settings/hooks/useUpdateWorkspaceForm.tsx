import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { showNotification } from '@mantine/notifications';
import { IconCheck } from '@tabler/icons';
import React, { useContext, useEffect } from 'react';

import { api } from '@utils/api';
import { OrganizationContext } from '@context/OrganizationContext';

export const useUpdateWorkspaceForm = () => {
  const utils = api.useContext();
  const { selectedOrganization } = useContext(OrganizationContext);
  const { mutate, isLoading } = api.organization.updateOrganization.useMutation();
  const validationSchema = z.object({
    workspaceName: z.string(),
  });
  type ValidationSchema = z.infer<typeof validationSchema>;
  const methods = useForm<ValidationSchema>({
    defaultValues: {
      workspaceName: selectedOrganization?.name || '',
    },
    resolver: zodResolver(validationSchema),
  });

  useEffect(() => {
    methods.setValue('workspaceName', selectedOrganization?.name || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrganization?.name]);

  const onSubmit = (data: ValidationSchema) => {
    mutate(
      { name: data.workspaceName },
      {
        onSuccess: async () => {
          showNotification({
            color: 'teal',
            title: 'Organization updated',
            message: 'We updated organization name successfully',
            autoClose: 2000,
            icon: <IconCheck size={16} />,
          });
          await utils.organization.getOrganizations.invalidate();
          await utils.info.init.invalidate();
        },
      },
    );
  };
  return { methods, onSubmit, isLoading };
};
