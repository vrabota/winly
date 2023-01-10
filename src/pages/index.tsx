import { type NextPage } from 'next';
import { useUser } from '@auth0/nextjs-auth0/client';

import { MainLayout } from '@components/layouts';

import { trpc } from '../utils/trpc';

const Home: NextPage = () => {
  const hello = trpc.example.hello.useQuery({ text: 'from tRPC' });
  const userProtected = trpc.example.protected.useQuery();
  console.log('auth0 protected endpoint', userProtected.data);
  const { user, error, isLoading } = useUser();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <MainLayout>
      <main className="flex flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
          </h1>
          <p className="text-2xl text-white">{hello.data ? hello.data.greeting : 'Loading tRPC query...'}</p>
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
