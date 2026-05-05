import { getSafeSession } from "@/app/actions/dal";
import { redirect } from "next/navigation";
import ArtistDetailsClient from "@/app/components/ClientSidePages/artistDetailsClient";
export default async function Page() {
  const session = await getSafeSession();

  if (!session.isAuth) {
    redirect("/");
  }

  return <ArtistDetailsClient />;
}
