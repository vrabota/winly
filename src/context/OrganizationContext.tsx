import React, { createContext } from 'react';
import { useLocalStorage } from '@mantine/hooks';
import { Loader, Center } from '@mantine/core';

import { api } from '@utils/api';
import { LOCAL_STORAGE_KEYS } from '@utils/localStorageKeys';

import type { Organization } from '@prisma/client';
import type { ReactNode } from 'react';

export interface OrganizationContextInterface {
  selectedOrganization: Organization;
  organizations: Organization[];
  setSelectedOrganizationId: (val: string) => void;
}

export const OrganizationContext = createContext<Partial<OrganizationContextInterface>>({});

export const OrganizationProvider = ({ children }: { children: ReactNode }) => {
  const [organizationId, setSelectedOrganizationId] = useLocalStorage<string>({
    key: LOCAL_STORAGE_KEYS.ORGANIZATION_ID,
  });
  const { data: organizations = [], isLoading } = api.organization.getOrganizations.useQuery(undefined, {
    onSuccess: data => {
      if (data?.length && !organizationId) {
        setSelectedOrganizationId(data?.[0]?.id || '');
      }
    },
    retry: false,
  });
  const selectedOrganization = organizations.filter(organization => organization.id === organizationId)[0];

  if (isLoading) {
    return (
      <Center h="98vh">
        <Loader />
      </Center>
    );
  }

  return (
    <OrganizationContext.Provider
      value={{ selectedOrganization: selectedOrganization, organizations, setSelectedOrganizationId }}
    >
      {children}
    </OrganizationContext.Provider>
  );
};
