import { verifySession } from "@/app/actions/dal";
import { redirect } from "next/navigation";
import { SearchResultPage } from "../components/ClientSidePages/searchResultClient";
export default async function Page() {
  try {
    const session = await verifySession();
    return <SearchResultPage />;
  } catch {
    redirect("/");
  }
}
