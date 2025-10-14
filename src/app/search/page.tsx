import { getSafeSession } from "@/app/actions/dal";
import { redirect } from "next/navigation";
import { SearchResultPage } from "../components/ClientSidePages/searchResultClient";
export default async function Page() {
  const session = await getSafeSession();

  if (!session.isAuth) {
    redirect("/");
  }

  return <SearchResultPage />;
}
