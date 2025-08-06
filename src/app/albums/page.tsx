import { verifySession } from "@/app/actions/dal";
import { redirect } from "next/navigation";
import AlbumDetailsClient from "@/app/components/ClientSidePages/albumDetailsClient";
import { Suspense } from "react";
export default async function Page() {
  try {
    const session = await verifySession();
    if (session.username) {
      return (
        <AlbumDetailsClient
          user={{
            username: session.username ?? "",
            access_token: session.access_token,
          }}
        />
      );
    }
  } catch {
    redirect("/");
  }
}
