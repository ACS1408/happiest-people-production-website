import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { authCookieOptions, verifyAuthToken } from '@/lib/auth';
import GlobalContextProvider from '@/components/GlobalContextProvider/globalContextProvider';
import AdminHeader from '@/components/AdminHeader';
import Container from '@/components/Container';
import SearchableApplications from './searchableApplications';

export const metadata = { title: 'Career Applications' };

export default async function CareerApplicationsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(authCookieOptions().name)?.value;
  if (!token) redirect('/admin/login');
  try { await verifyAuthToken(token); } catch { redirect('/admin/login'); }

  return (
    <GlobalContextProvider contextType="admin">
      <AdminHeader />
      <main className="min-h-screen bg-white py-8" data-admin-page="career-applications">
        <Container>
          <SearchableApplications />
        </Container>
      </main>
    </GlobalContextProvider>
  );
}
