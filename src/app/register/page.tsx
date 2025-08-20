// app/page.tsx (or wherever your login/register entry page is)
import { redirect } from "next/navigation";
import { verifySession } from "@/app/actions/dal";
import RegisterForm from "../components/ClientSidePages/discoveryClient/registerClient";

export default async function RegisterPage() {
  const session = await verifySession();
  if (session?.access_token) {
    redirect("/discovery");
  }
  return <RegisterForm />;
}
