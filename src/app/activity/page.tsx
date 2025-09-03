// app/discovery/page.tsx
import { Suspense } from "react";
import { verifySession } from "@/app/actions/dal";
import DiscoverPage from "@/app/components/ClientSidePages/discoveryClient";
import { redirect } from "next/navigation";
import { ComponentLoader } from "../utils/componentLoader";
import ActivityPage from "../components/ClientSidePages/activityClient";

export default function Page() {
  return (
    <Suspense
      fallback={<div className="p-6 text-lg">Loading your activities...</div>}
    >
      <ComponentLoader Component={ActivityPage} />
    </Suspense>
  );
}
