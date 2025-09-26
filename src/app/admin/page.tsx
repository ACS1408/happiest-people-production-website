import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAuthToken, authCookieOptions } from "@/lib/auth";
import Link from "next/link";
import Container from "@/components/Container";
import Icons from "@/utils/icons";
import Button from "@/components/Button/button";
import AdminHeader from "@/components/AdminHeader";

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
    <>
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
              <DashboardCard
                href="/admin/works"
                label="Works"
                description="Create, edit, reorder and publish work entries."
              />
            </nav>
          </div>
        </Container>
      </main>
    </>
  );
}

function DashboardCard({
  href,
  label,
  description,
}: {
  href: string;
  label: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl border border-neutral-200 hover:border-neutral-300 hover:shadow-sm p-6 bg-neutral-50/40 hover:bg-neutral-50 transition"
    >
      <div className="flex flex-col gap-3">
        <h2 className="ff-figtree text-xl font-medium group-hover:text-neutral-900 text-neutral-800">
          {label}
        </h2>
        <p className="text-sm text-neutral-500 leading-relaxed">
          {description}
        </p>
        <Button
          href={href}
          text={`Open ${label.toLowerCase()} dashboard`}
          icon={<Icons.ArrowRight className="h-3 pt-px" />}
          variant="link-with-icon"
          color="black"
          className="mt-4 w-max"
        />
      </div>
    </Link>
  );
}
