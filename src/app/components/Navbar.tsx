"use client";

import React from "react";
import Image from "next/image";
import { Icons } from "../icons/icons";
import { AnotherNavButton } from "./AnotherNavButton";
import Form from "next/form";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/app/hooks";
import Link from "next/link";
import { logoutUser } from "../actions/account_management_service";
import { useQueryClient } from "@tanstack/react-query";
import { SkeletonNavBar } from "./skeletons/SkeletonNavBar";

export const NavBar = () => {
  const qc = useQueryClient();
  const router = useRouter();
  const path = usePathname();
  const { data: userData, isLoading: isUserLoading } = useUser();
  const handleLogout = async () => {
    await logoutUser();
    qc.clear();
    router.replace("/");
    router.refresh();
  };

  // Hide navbar on landing/register
  if (path === "/register" || path === "/") return null;
  if (isUserLoading || !userData) return <SkeletonNavBar />;

  return (
    <nav className="rounded-full outline-solid outline-2 outline-black grid grid-cols-7 items-center bg-white p-4 w-full">
      <Image
        className="w-[100px] justify-self-start col-span-2"
        priority
        src={Icons.halfnote}
        alt="Another"
      />
      <ul className="w-full flex justify-center col-span-3 gap-4">
        {/* <div className="w-full grid grid-cols-3"> */}
        <Link href={"/discovery"}>
          <AnotherNavButton label="Discover" icon={Icons.discover} />
        </Link>
        <Link href={"/activity"}>
          <AnotherNavButton label="Activity" icon={Icons.activity} />
        </Link>
        <Link href={`/profile/${userData?.username || ""}`}>
          <AnotherNavButton label="Profile" icon={Icons.profile} />
        </Link>
        {/* </div> */}
      </ul>
      <div className="justify-self-end mr-2 col-span-2">
        <Form
          action={(formData: FormData) => {
            const query = formData.get("search") as string;
            if (!query || query.length === 0) return;
            const encodedQuery = encodeURIComponent(query);
            router.push(`/search?query=${encodedQuery}`);
          }}
          className="flex flex-row justify-self-end border bg-[var(--color-bg-gray)] border-black rounded-full 
               w-2/3 focus-within:w-full transition-all duration-300 ease-in-out"
        >
          <button type="submit" className="m-2 flex items-center justify-center">
            <Image
              className="w-7 h-7 object-contain"
              src={Icons.search}
              alt="Search Icon"
            />
          </button>
          <input
            name="search"
            type="text"
            placeholder="Search"
            className="w-full focus:outline-none another-heading5 md:another-heading4 text-black placeholder:text-black bg-transparent"
          />
        </Form>
      </div>
    </nav>
  );
};
