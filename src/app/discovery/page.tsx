import { Suspense } from "react";
import DiscoverPage from "../components/ClientSidePages/DiscoveryPageClient";
import { getUserReview } from "../actions/reviews_service";
import { getUser, verifySession } from "../actions/dal";
export default function Page() {
  try {
    const user = getUser();

    return (
      <Suspense fallback={<h1>loading...</h1>}>
        <DiscoverPage user={user} />
      </Suspense>
    );
  } catch (error: any) {
    throw new Error(error.message || "Could not retrieve user");
  }
}
