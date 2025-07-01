import { verifySession } from "@/app/actions/dal";
import { redirect } from "next/navigation";
import ProfilePage from "@/app/components/ClientSidePages/profileClient";
export default async function Page() {
  try {
    const session = await verifySession();
    return (
      <ProfilePage
        user={{
          username: session.username ?? "",
          access_token: session.access_token,
        }}
      />
    );
  } catch {
    redirect("/");
  }
}
