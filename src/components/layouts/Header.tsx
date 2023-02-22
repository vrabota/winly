import React, { useContext, useState } from 'react';
import {
  Header as HeaderMantine,
  Group,
  Button,
  Box,
  Avatar,
  UnstyledButton,
  Menu,
  Text,
  Divider,
} from '@mantine/core';
import { MantineLogo } from '@mantine/ds';
import { IconSettings, IconChevronDown, IconCirclePlus, IconLogout } from '@tabler/icons';
import { useUser } from '@auth0/nextjs-auth0/client';

import { OrganizationContext } from '@context/OrganizationContext';

import { useStyles } from './styles';

const Header = () => {
  const { classes, cx } = useStyles();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const [organizationMenuOpened, setOrganizationMenuOpened] = useState(false);
  const { user } = useUser();
  const { organizations = [], setSelectedOrganizationId, selectedOrganization } = useContext(OrganizationContext);
  return (
    <Box>
      <HeaderMantine height={60} px="md">
        <Group position="apart" sx={{ height: '100%' }}>
          <MantineLogo size={30} />

          {!user && (
            <Group>
              <Button variant="default" component="a" href="/api/auth/login">
                Log in
              </Button>
              <Button component="a" href="/api/auth/logout">
                Logout
              </Button>
            </Group>
          )}

          <Group h="100%" spacing={0}>
            <Menu
              width={260}
              position="bottom-end"
              transition="pop-top-right"
              onClose={() => setOrganizationMenuOpened(false)}
              onOpen={() => setOrganizationMenuOpened(true)}
            >
              <Menu.Target>
                <UnstyledButton
                  className={cx(classes.user, {
                    [classes.userActive]: organizationMenuOpened,
                  })}
                >
                  <Group spacing={7} h="100%">
                    <Avatar color="cyan" radius="xl" size={28}>
                      <Text sx={{ textTransform: 'uppercase' }}>{selectedOrganization?.name?.substring(0, 2)}</Text>
                    </Avatar>
                    <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                      {selectedOrganization?.name}
                    </Text>
                    <IconChevronDown size={12} stroke={1.5} />
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Organizations</Menu.Label>
                {organizations.map(organization => (
                  <Menu.Item
                    key={organization.id}
                    data-id={organization.id}
                    bg={organization.id === selectedOrganization?.id ? 'blue.0' : undefined}
                    onClick={event => setSelectedOrganizationId?.(event.currentTarget.getAttribute('data-id') || '')}
                  >
                    {organization.name}
                  </Menu.Item>
                ))}
                <Menu.Divider />
                <Menu.Item icon={<IconCirclePlus size={14} stroke={1.5} />}>Create Organization</Menu.Item>
              </Menu.Dropdown>
            </Menu>

            <Divider size="sm" orientation="vertical" color="gray.1" />

            {user && (
              <Menu
                width={260}
                position="bottom-end"
                transition="pop-top-right"
                onClose={() => setUserMenuOpened(false)}
                onOpen={() => setUserMenuOpened(true)}
              >
                <Menu.Target>
                  <UnstyledButton
                    className={cx(classes.user, {
                      [classes.userActive]: userMenuOpened,
                    })}
                  >
                    <Group spacing={7}>
                      <Avatar src={user.picture || ''} alt={user.name || ''} radius="xl" size={28} />
                      <Text weight={500} size="sm" sx={{ lineHeight: 1 }} mr={3}>
                        {user?.name}
                      </Text>
                      <IconChevronDown size={12} stroke={1.5} />
                    </Group>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Label>Settings</Menu.Label>
                  <Menu.Item icon={<IconSettings size={14} stroke={1.5} />}>Account settings</Menu.Item>
                  <Menu.Item icon={<IconLogout size={14} stroke={1.5} />} component="a" href="/api/auth/logout">
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
        </Group>
      </HeaderMantine>
    </Box>
  );
};

export default Header;
