import { p } from "framer-motion/client";
import { Suspense } from "react";
import Banner from "../../../public/sample_images/banner.png";
import Actor from "../../../public/sample_images/profilePic.png";
import ProfilePage from "../../components/ClientSidePages/ProfilePageClient";
import { getUser } from "../../actions/dal";
import { getUserReviews } from "@/app/actions/music_and_reviews_service";

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  console.log((await params).username);
  const userPromise = getUser();
  const reviewsPromise = getUserReviews((await params).username);

  return (
    <Suspense fallback={<h1>loading...</h1>}>
      <ProfilePage user={userPromise} reviews={reviewsPromise} />
    </Suspense>
  );
}
