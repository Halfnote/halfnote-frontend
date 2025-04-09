"use client";
import Image from "next/image";
import { Icons } from "@/app/icons/icons";
export default function Dashboard() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="another-heading1">Heading 1</h1>
        <p className="text-center another-heading2">
          This is the dashboard page.
        </p>
        <Image
          className="w-[20%] h-[20%]"
          priority
          src={Icons.classical}
          alt="Follow us on Twitter"
        />
      </main>
    </div>
  );
}
