// app/discovery/page.tsx
import { Suspense } from "react";
import { verifySession } from "@/app/actions/dal";
import DiscoverPage from "@/app/components/ClientSidePages/discoveryClient";
import { redirect } from "next/navigation";

async function UserLoader() {
  const session = await verifySession().catch(() => null);

  if (!session || !session.username) {
    redirect("/");
  }
  const username = session.username;

  return (
    <DiscoverPage
      user={{
        username,
      }}
    />
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={<div className="p-6 text-lg">Loading your profile...</div>}
    >
      <UserLoader />
    </Suspense>
  );
}
