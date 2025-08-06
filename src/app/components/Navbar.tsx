"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Icons } from "../icons/icons";
import { AnotherNavButton } from "./AnotherNavButton";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { useSearch, useUser } from "@/app/hooks";
import Link from "next/link";

export const NavBar = () => {
  const router = useRouter();
  const { data: userData } = useUser();
  return (
    <nav className="rounded-full outline-solid outline-2 outline-black grid grid-cols-3 items-center bg-white p-4 scale-90">
      <Image
        className="w-[230px] h-[55px] ml-5 justify-self-start"
        priority
        src={Icons.halfnote}
        alt="Another"
      />
      <ul className="flex justify-center gap-7">
        <Link href={"/discovery"}>
          <AnotherNavButton label="Discover" />
        </Link>
        <Link href={"/activity"}>
          <AnotherNavButton label="Activity" />
        </Link>
        <Link href={`/profile/${userData?.username || ""}`}>
          <AnotherNavButton label="Profile" />
        </Link>
      </ul>
      <div className="justify-self-end mr-5">
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
