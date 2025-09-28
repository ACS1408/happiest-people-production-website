import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAuthToken, authCookieOptions } from "@/lib/auth";
import AdminWorksDashboard from "@/components/AdminWorksDashboard";

export default async function AdminWorksPage() {
  // Server-side guard (defense-in-depth alongside middleware)
  const cookieStore = await cookies();
  const cookieName = authCookieOptions().name;
  const token = cookieStore.get(cookieName)?.value;
  if (!token) redirect("/admin/login");
  try {
    await verifyAuthToken(token);
  } catch {
    redirect("/admin/login");
  }
  return <AdminWorksDashboard />;
}
