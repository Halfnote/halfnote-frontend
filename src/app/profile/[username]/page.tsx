// app/discovery/page.tsx
import { getSafeSession } from "@/app/actions/dal";
import { redirect } from "next/navigation";
import ProfilePage from "@/app/components/ClientSidePages/profileClient";

async function UserLoader() {
  const session = await getSafeSession();

  if (!session.isAuth || !session.username) {
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
