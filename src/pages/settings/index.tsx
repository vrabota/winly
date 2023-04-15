import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';

import type { NextPage } from 'next';

const Settings: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.replace('/settings/workspace');
  }, [router]);
  return null;
};

export default withPageAuthRequired(Settings);
