import { p } from "framer-motion/client";
import { Suspense } from "react";
import Banner from "../../../public/sample_images/banner.png";
import Actor from "../../../public/sample_images/profilePic.png";
import ProfilePage from "../components/ClientSidePages/ProfilePageClient";

export default function Page() {
  return (
    <Suspense fallback={<h1>loading...</h1>}>
      <ProfilePage
        pfp={Actor}
        userName="username"
        bio="Probably on my way to return some video tapes, listening to killer tunes"
        name="Patrick Bateman"
        banner={Banner}
        location={"New York, NY"}
        numReviews={2301}
        numfollowers={526}
        numfollowing={489}
        mostReviewedGenres={["Pop", "Classical", "Country"]}
      />
    </Suspense>
  );
}
