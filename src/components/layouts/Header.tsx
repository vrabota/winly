import { useState } from 'react';
import { createStyles, Header as HeaderMantine, Group, Button, Box, Avatar, UnstyledButton, Menu, Text } from '@mantine/core';
import { MantineLogo } from '@mantine/ds';
import { IconSettings, IconChevronDown, IconLogout } from '@tabler/icons';
import { useUser } from '@auth0/nextjs-auth0/client';

const useStyles = createStyles(theme => ({
  user: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.sm,
    transition: 'background-color 100ms ease',

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
    },

    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  userActive: {
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
  },
}));

const Header = () => {
  const { classes, cx } = useStyles();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { user } = useUser();
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
                    <Avatar src={user.picture || ''} alt={user.name || ''} radius="xl" size={20} />
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
      </HeaderMantine>
    </Box>
  );
};

export default Header;
