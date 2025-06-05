import { Suspense } from "react";
import DiscoverPage from "./components/ClientSidePages/DiscoveryPageClient";
import { getUserReview } from "./services/reviews_service";
export default function Page() {
  const user = "viv360";

  try {
    const userReviews = getUserReview(user);
    if (!userReviews) {
      //redirect would happen here
      throw new Error("Unable to get user data");
    }
    return (
      <Suspense fallback={<h1>loading...</h1>}>
        <DiscoverPage userReviews={userReviews} />
      </Suspense>
    );
  } catch (error) {
    console.error(error);
  }
}
