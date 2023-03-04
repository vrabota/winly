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

const inter = Inter({ subsets: ['latin'] });

const MyApp: AppType = ({ Component, pageProps }) => {
  console.log(inter);
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
          primaryColor: 'purple',
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
        }}
      >
        <ModalsProvider
          modalProps={{
            centered: true,
            overlayColor: '#fff',
            overlayOpacity: 0.8,
            shadow: 'lg',
            withCloseButton: false,
            padding: 40,
          }}
        >
          <NotificationsProvider position="bottom-center">
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
