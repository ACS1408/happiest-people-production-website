import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAuthToken, authCookieOptions } from "@/lib/auth";
import Container from "@/components/Container";
import AdminHeader from "@/components/AdminHeader";
import GlobalContextProvider from "@/components/GlobalContextProvider/globalContextProvider";
import AdminDashboardCard from "@/components/AdminDashboardCard";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminHomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(authCookieOptions().name)?.value;
  if (!token) redirect("/admin/login");
  try {
    await verifyAuthToken(token);
  } catch {
    redirect("/admin/login");
  }

  return (
    <GlobalContextProvider contextType="admin">
      <AdminHeader />
      <main className="min-h-screen bg-white py-8">
        <Container>
          <div className="flex flex-col gap-10">
            <header className="flex flex-col gap-3">
              <h1 className="ff-figtree text-4xl font-light">
                Admin <span className="font-medium">Dashboard</span>
              </h1>
              <p className="text-neutral-500 max-w-prose text-sm">
                Internal tools for managing site content. Choose a section
                below.
              </p>
            </header>
            <nav className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <AdminDashboardCard
                href="/admin/works"
                label="Works"
                description="Create, edit, reorder and publish work entries."
              />
              <AdminDashboardCard
                href="/admin/career-applications"
                label="Career Applications"
                description="Browse and download submitted career applications."
              />
            </nav>
          </div>
        </Container>
      </main>
    </GlobalContextProvider>
  );
}
