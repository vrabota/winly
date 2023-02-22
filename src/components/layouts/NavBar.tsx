import Link from 'next/link';
import { Navbar } from '@mantine/core';
import { IconSettings, IconLogout, IconMail, IconInbox, IconSend, IconChartDots3 } from '@tabler/icons';

import NavLink from '@components/layouts/NavLink';

import { useStyles } from './styles';

const data = [
  { link: '/', label: 'Email Accounts', icon: IconMail },
  { link: '/campaigns', label: 'Campaigns', icon: IconSend },
  { link: '/analytics', label: 'Analytics', icon: IconChartDots3 },
  { link: '/inbox', label: 'Inbox', icon: IconInbox },
  { link: '/settings', label: 'Settings', icon: IconSettings },
];

const NavBarBox = () => {
  const { classes } = useStyles();
  const links = data.map(item => (
    <NavLink activeClassName={classes.linkActive} className={classes.link} href={item.link} key={item.label}>
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </NavLink>
  ));

  return (
    <Navbar width={{ sm: 300 }} p="md">
      <Navbar.Section grow>{links}</Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <Link href="/api/auth/logout" className={classes.link}>
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </Link>
      </Navbar.Section>
    </Navbar>
  );
};

export default NavBarBox;
