"use client";
import Image from "next/image";
import { Icons } from "@/app/icons/icons";
export default function Dashboard() {
  return (
    <div className="flex justify-center items-center flex-col gap-4 min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1 className="another-heading1 text-center">Heading 1</h1>
      <p className="text-center another-heading2 mb-12">
        This is the dashboard page.
      </p>
      <div className="">
        <div className="grid grid-cols-3 gap-4 justify-center content-center">
          <Image
            className="w-[50%] h-[50%] justify-center"
            priority
            src={Icons.electronic}
            alt="Electronic Icon"
          />
          <Image
            className="w-[50%] h-[50%]"
            priority
            src={Icons.jazz}
            alt="Electronic Icon"
          />
          <Image
            className="w-[50%] h-[50%]"
            priority
            src={Icons.folk}
            alt="Electronic Icon"
          />
          <Image
            className="w-[50%] h-[50%]"
            priority
            src={Icons.jazz}
            alt="Electronic Icon"
          />
          <Image
            className="w-[50%] h-[50%]"
            priority
            src={Icons.country}
            alt="Electronic Icon"
          />
          <Image
            className="w-[50%] h-[50%]"
            priority
            src={Icons.hiphop}
            alt="Electronic Icon"
          />
        </div>
      </div>
    </div>
  );
}
