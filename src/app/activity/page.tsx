import { verifySession } from "@/app/actions/dal";
import { redirect } from "next/navigation";
import ActivityPage from "../components/ClientSidePages/activityClient";
export default async function Page() {
  try {
    const session = await verifySession();
    return (
      <ActivityPage
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
