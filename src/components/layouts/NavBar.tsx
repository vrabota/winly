import { Navbar, Text, Stack, Indicator } from '@mantine/core';

import { MailInbox, ContentChart, MailSend, MailSign, SettingCog } from '@assets/icons';
import NavLink from '@components/layouts/NavLink';

import { useStyles } from './styles';

const data = [
  { link: '/', label: 'Accounts', icon: MailSign },
  { link: '/campaigns', label: 'Campaigns', icon: MailSend },
  { link: '/analytics', label: 'Analytics', icon: ContentChart },
  { link: '/inbox', label: 'Inbox', icon: MailInbox, disabled: false },
];

const NavBarBox = () => {
  const { classes, cx } = useStyles();
  const links = data.map(item => (
    <NavLink
      activeClassName={classes.linkActive}
      className={cx(classes.link, { [classes.linkDisabled]: item.disabled })}
      href={item.link}
      key={item.label}
    >
      <Stack align="center" justify="center">
        <Indicator
          inline
          disabled={!item.disabled}
          label="SOON"
          size={16}
          sx={{ '.mantine-Indicator-indicator': { top: -5, right: -20, fontSize: 10, fontWeight: 700 } }}
        >
          <item.icon className={classes.linkIcon} size={20} />
        </Indicator>
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
        <NavLink activeClassName={classes.linkActive} href="/settings" className={classes.link} key="Settings">
          <Stack align="center" justify="center">
            <SettingCog className={classes.linkIcon} size={20} />
            <Text>Settings</Text>
          </Stack>
        </NavLink>
      </Navbar.Section>
    </Navbar>
  );
};

export default NavBarBox;
