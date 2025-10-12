import { getSafeSession } from "@/app/actions/dal";
import { redirect } from "next/navigation";
import AlbumDetailsClient from "@/app/components/ClientSidePages/albumDetailsClient";
export default async function Page() {
  const session = await getSafeSession();

  if (!session.isAuth || !session.username) {
    redirect("/");
  }

  return (
    <AlbumDetailsClient
      user={{
        username: session.username,
      }}
    />
  );
}
