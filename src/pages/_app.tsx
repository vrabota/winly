import { type AppType } from 'next/app';
import Head from 'next/head';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import { ModalsProvider } from '@mantine/modals';

import { api } from '@utils/api';
import { MainLayout } from '@components/layouts';
import { OrganizationProvider } from '@context/OrganizationContext';

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
          colorScheme: 'light',
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
