import { p } from "framer-motion/client";
import { Suspense } from "react";
import Banner from "../../../public/sample_images/banner.png";
import Actor from "../../../public/sample_images/profilePic.png";
import ProfilePage from "../../components/ClientSidePages/ProfilePageClient";
import { getUser } from "../../actions/dal";

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const user = getUser();

  return (
    <Suspense fallback={<h1>loading...</h1>}>
      <ProfilePage user={user} />
    </Suspense>
  );
}
