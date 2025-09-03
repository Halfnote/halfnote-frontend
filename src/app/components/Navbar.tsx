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
import { QueryClient, useQueryClient } from "@tanstack/react-query";
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
  if (isUserLoading) return <SkeletonNavBar />;

  return (
    <nav className="rounded-full outline-solid outline-2 outline-black grid grid-cols-3 items-center bg-white p-4 w-full">
      {/* Logo */}
      <Image
        className="w-[200px] h-[55px] justify-self-start"
        priority
        src={Icons.halfnote}
        alt="Another"
      />

      {/* Center nav links */}
      <ul className="flex justify-center gap-7">
        <Link href="/discovery">
          <AnotherNavButton label="Discover" />
        </Link>
        <Link href="/activity">
          <AnotherNavButton label="Activity" />
        </Link>
        <Link href={`/profile/${userData.username}`}>
          <AnotherNavButton label="Profile" />
        </Link>
        <Image
          src={Icons.firstVinyl}
          alt={"Add Album List"}
          width={40}
          height={40}
          className="object-contain cursor-pointer"
          onClick={handleLogout}
        />
      </ul>

      {/* Search bar */}
      <div className="justify-self-end mr-2">
        <Form
          action={(formData: FormData) => {
            const query = formData.get("search") as string;
            if (!query || query.length === 0) return;
            const encodedQuery = encodeURIComponent(query);
            router.push(`/search?query=${encodedQuery}`);
          }}
          className="flex flex-row justify-between border bg-[var(--color-bg-gray)] border-black rounded-full p-3 w-40 focus-within:w-80 transition-all duration-300 ease-in-out focus:outline-none"
        >
          <button type="submit">
            <Image
              src={Icons.search}
              alt="Search Icon"
              width={24}
              height={24}
            />
          </button>
          <input
            name="search"
            type="text"
            placeholder="Search"
            className="w-full focus:outline-none another-heading4 text-black ml-5 placeholder:text-black bg-transparent"
          />
        </Form>
      </div>
    </nav>
  );
};
