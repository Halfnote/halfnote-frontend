import { verifySession } from "@/app/actions/dal";
import { redirect } from "next/navigation";
import DiscoverPage from "@/app/components/ClientSidePages/discoveryClient";

export default async function Page() {
  try {
    const session = await verifySession();
    return (
      <DiscoverPage
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
