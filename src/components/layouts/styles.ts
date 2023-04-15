import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon');
  return {
    main: {
      background: theme.colors.gray[0],
    },
    user: {
      color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      height: '100%',
      transition: 'background-color 0.3s ease',

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
    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
    },
    link: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,
      transition: 'all 0.4s',

      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.white : theme.colors.gray[8],

        [`& .${icon}`]: {
          color: theme.colorScheme === 'dark' ? theme.white : theme.colors.gray[8],
        },
      },
    },
    linkDisabled: {
      pointerEvents: 'none',
    },
    linkIcon: {
      ref: icon,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
    },
    linkActive: {
      '&, &:hover': {
        backgroundColor: theme.colors.gray[0],
        boxShadow: 'inset 0px 1px 2px rgba(38, 38, 38, 0.1)',
        color: theme.black,
        [`& .${icon}`]: {
          color: theme.fn.variant({
            variant: 'light',
            color: theme.primaryColor,
          }).color,
        },
      },
    },
    navbar: {
      boxShadow: '1px 0px 1px rgba(37, 46, 50, 0.12)',
      marginTop: '1px',
    },
    header: {
      boxShadow: '0px 1px 1px rgba(37, 46, 50, 0.12)',
    },
  };
});
