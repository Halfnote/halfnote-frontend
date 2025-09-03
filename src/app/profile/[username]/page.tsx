// app/discovery/page.tsx
import { verifySession } from "@/app/actions/dal";
import { redirect } from "next/navigation";
import ProfilePage from "@/app/components/ClientSidePages/profileClient";

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
