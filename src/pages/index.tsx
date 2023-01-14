import { type NextPage } from 'next';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';

import { MainLayout } from '@components/layouts';
import { api } from '@utils/api';

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: 'from tRPC' });
  const userProtected = api.example.protected.useQuery();
  const { mutate } = api.example.emailEngine.useMutation();
  const test = api.example.getAll.useQuery();
  const { query } = useRouter();
  console.log('query', query);
  console.log('bd connected', test);
  console.log('auth0 protected endpoint', userProtected.data);
  const { user, error, isLoading } = useUser();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <MainLayout>
      <main className="flex flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">NextJS App</h1>
          <p className="text-2xl text-white">{hello.data ? hello.data.greeting : 'Loading tRPC query...'}</p>
          <button onClick={() => mutate()}>Connect Account</button>
          {user && (
            <div>
              <img src={user.picture || ''} alt={user.name || ''} />
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
          )}
        </div>
      </main>
    </MainLayout>
  );
};

export default Home;
