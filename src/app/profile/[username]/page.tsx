// app/discovery/page.tsx
import { Suspense } from "react";
import { verifySession } from "@/app/actions/dal";
import DiscoverPage from "@/app/components/ClientSidePages/discoveryClient";
import { redirect } from "next/navigation";
import ProfilePage from "@/app/components/ClientSidePages/profileClient";
import { ProfilePageSkeleton } from "@/app/components/skeletons/SkeletonProfilePage";

async function UserLoader() {
  const session = await verifySession();

  if (!session || !session.username) {
    redirect("/");
  }

  return (
    <ProfilePage
      user={{
        username: session.username,
      }}
    />
  );
}

export default function Page() {
  return <UserLoader />;
}
