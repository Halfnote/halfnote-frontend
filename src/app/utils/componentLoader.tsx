import { verifySession } from "@/app/actions/dal";
import { redirect } from "next/navigation";
import React from "react";

type User = {
  username: string;
};

type ComponentLoaderProps = {
  Component: React.ComponentType<{ user: User }>;
};

export async function ComponentLoader({ Component }: ComponentLoaderProps) {
  const session = await verifySession().catch(() => null);

  if (!session || !session.username) {
    redirect("/");
  }

  return <Component user={{ username: session.username }} />;
}
