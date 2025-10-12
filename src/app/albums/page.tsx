import { verifySession } from "@/app/actions/dal";
import { redirect } from "next/navigation";
import AlbumDetailsClient from "@/app/components/ClientSidePages/albumDetailsClient";
export default async function Page() {
  try {
    const session = await verifySession();
    if (session.username) {
      const username = session.username;

      return (
        <AlbumDetailsClient
          user={{
            username,
          }}
        />
      );
    }
  } catch {
    redirect("/");
  }
}
