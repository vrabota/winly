import 'reflect-metadata';
import { type AppType } from 'next/app';
import Head from 'next/head';
import { Inter } from '@next/font/google';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

import { api } from '@utils/api';
import { MainLayout } from '@components/layouts';
import { OrganizationProvider } from '@context/OrganizationContext';

import type { MantineTheme, ButtonStylesParams } from '@mantine/core';

const inter = Inter({ subsets: ['latin'] });

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Page title</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          white: '#fff',
          primaryColor: 'purple',
          primaryShade: 6,
          colors: {
            purple: [
              '#F8F2FD',
              '#F3E9FC',
              '#DDBBF8',
              '#C88FF0',
              '#AD64E8',
              '#9537E1',
              '#711EC8',
              '#621AAD',
              '#541694',
              '#45127A',
            ],
            pink: [
              '#FDEDF2',
              '#F8C4D5',
              '#F290B1',
              '#EE6493',
              '#EA447B',
              '#E72565',
              '#D62162',
              '#C01E5C',
              '#AB1A58',
              '#87134F',
            ],
            green: [
              '#F1F8EA',
              '#DDEDCA',
              '#C6E0A8',
              '#AFD485',
              '#9DCB6B',
              '#8DC252',
              '#7EB24A',
              '#6A9E3F',
              '#578A35',
              '#356823',
            ],
            amber: [
              '#FFF8E2',
              '#FFEBB6',
              '#FEDF88',
              '#FED45B',
              '#FEC93E',
              '#FEC02F',
              '#FDB22B',
              '#FD9F28',
              '#FD8F25',
              '#FD6F22',
            ],
            gray: [
              '#F7F7F8',
              '#EDEDED',
              '#E3E3E3',
              '#C9C9C9',
              '#B0B0B0',
              '#A6A6A6',
              '#8C8C8C',
              '#737373',
              '#595959',
              '#404040',
            ],
          },
          colorScheme: 'light',
          fontFamily: inter.style.fontFamily,
          cursorType: 'pointer',
          globalStyles: () => ({
            '.mantine-RichTextEditor-linkEditorSave': { marginTop: 5, height: 42 },
            '.mantine-TransferList-transferList .mantine-Input-wrapper': { margin: 0 },
          }),
          components: {
            Menu: {
              defaultProps: {
                styles: (theme: MantineTheme) => ({
                  dropdown: {
                    borderRadius: theme.radius.md,
                    boxShadow: theme.shadows.md,
                  },
                }),
              },
            },
            Table: {
              styles: (theme: MantineTheme) => ({
                root: {
                  '&[data-hover] tbody tr:hover': {
                    background: '#fcfcfc',
                  },
                  '&[data-hover] tbody tr:hover td': {
                    background: '#fcfcfc',
                  },
                  'tbody tr, thead tr td': {
                    background: theme.white,
                    transition: 'all 0.2s',
                  },
                  'tbody tr td, thead tr th': {
                    borderColor: theme.colors.gray[0],
                    borderWidth: 2,
                  },
                  'thead tr th': {
                    color: theme.colors.gray[4],
                    fontSize: 11,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  },
                  'tbody tr:last-of-type td': {
                    border: 'none',
                  },
                  'thead tr': {
                    boxShadow: 'none',
                  },
                },
              }),
            },
            RadioGroup: {
              defaultProps: {
                styles: (theme: MantineTheme) => ({
                  root: {
                    ':hover': {
                      cursor: 'pointer',
                    },
                    '.mantine-Radio-root': {
                      backgroundColor: theme.colors.gray[0],
                      borderRadius: theme.radius.md,
                      transition: 'all 0.3s',
                      ':hover': {
                        backgroundColor: theme.colors.purple?.[1],
                      },
                    },
                    '.mantine-Radio-labelWrapper': {
                      width: '100%',
                    },
                    '.mantine-Radio-label': {
                      padding: `${theme.spacing.md}px 0`,
                      fontWeight: 500,
                    },
                    '.mantine-Radio-inner': {
                      padding: `${theme.spacing.md}px`,
                    },
                  },
                }),
              },
            },
            TextInput: {
              defaultProps: {
                size: 'md',
                radius: 'md',
                styles: (theme: MantineTheme) => ({
                  wrapper: {
                    marginTop: 5,
                  },
                  input: {
                    fontSize: 14,
                    borderColor: theme.colors.gray[2],
                    ':hover': {
                      borderColor: theme.colors.gray[3],
                    },
                    ':focus': {
                      borderColor: theme.colors.purple?.[5],
                    },
                  },
                  label: {
                    fontSize: 14,
                    color: theme.colors.gray[7],
                  },
                  description: {
                    fontSize: 12,
                  },
                }),
              },
            },
            Textarea: {
              defaultProps: {
                size: 'md',
                radius: 'md',
                styles: (theme: MantineTheme) => ({
                  input: {
                    fontSize: 14,
                    borderColor: theme.colors.gray[2],
                    ':hover': {
                      borderColor: theme.colors.gray[3],
                    },
                    ':focus': {
                      borderColor: theme.colors.purple?.[5],
                    },
                  },
                  description: {
                    marginBottom: 10,
                  },
                }),
              },
            },
            Button: {
              styles: (theme: MantineTheme, params: ButtonStylesParams) => ({
                root: {
                  transition: 'background 0.3s',
                  ':hover': {
                    backgroundColor: params.variant === 'light' ? theme.colors.purple?.[1] : undefined,
                  },
                },
              }),
            },
          },
        }}
      >
        <ModalsProvider
          modalProps={{
            centered: true,
            overlayColor: '#F7F7F8',
            overlayOpacity: 0.8,
            overlayBlur: 0.5,
            withCloseButton: false,
            padding: 'xl',
          }}
        >
          <NotificationsProvider position="top-center" style={{ marginTop: 15 }}>
            <UserProvider>
              <OrganizationProvider>
                <MainLayout>
                  <Component {...pageProps} />
                </MainLayout>
              </OrganizationProvider>
            </UserProvider>
          </NotificationsProvider>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
