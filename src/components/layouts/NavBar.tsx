import Link from 'next/link';
import { Navbar, Text, Stack } from '@mantine/core';

import { MailInbox, ContentChart, MailSend, MailSign, SettingCog } from '@assets/icons';
import NavLink from '@components/layouts/NavLink';

import { useStyles } from './styles';

const data = [
  { link: '/', label: 'Accounts', icon: MailSign },
  { link: '/campaigns', label: 'Campaigns', icon: MailSend },
  { link: '/analytics', label: 'Analytics', icon: ContentChart },
  { link: '/inbox', label: 'Inbox', icon: MailInbox },
];

const NavBarBox = () => {
  const { classes } = useStyles();
  const links = data.map(item => (
    <NavLink activeClassName={classes.linkActive} className={classes.link} href={item.link} key={item.label}>
      <Stack align="center" justify="center">
        <item.icon className={classes.linkIcon} size={20} />
        <Text>{item.label}</Text>
      </Stack>
    </NavLink>
  ));

  return (
    <Navbar width={{ sm: 130 }} p="md" withBorder={false} className={classes.navbar}>
      <Navbar.Section grow>
        <Stack spacing="xs">{links}</Stack>
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <Link href="/api/auth/logout" className={classes.link}>
          <Stack align="center" justify="center">
            <SettingCog className={classes.linkIcon} size={20} />
            <Text>Settings</Text>
          </Stack>
        </Link>
      </Navbar.Section>
    </Navbar>
  );
};

export default NavBarBox;
