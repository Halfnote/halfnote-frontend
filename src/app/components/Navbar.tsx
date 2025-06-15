"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Icons } from "../icons/icons";
import { AnotherNavButton } from "./AnotherNavButton";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { verifySession } from "../actions/dal";

export const NavBar = () => {
  const [username, setUsername] = useState<string>("");
  useEffect(() => {
    const fetchSession = async () => {
      const session = await verifySession();
      if (session) {
        setUsername(session.username ?? "");
      }
    };
    fetchSession();
  }, []);
  const router = useRouter();
  return (
    <nav className="rounded-full outline-solid outline-2 outline-black flex justify-between items-center bg-white p-4 mb-[25px]">
      <Image
        className="w-[230px] h-[55px] ml-5"
        priority
        src={Icons.halfnote}
        alt="Another"
      />
      <ul className="flex w-full justify-center ml-20 gap-7">
        <li>
          <AnotherNavButton
            onClick={() => {
              router.push("/discovery");
            }}
            label="Discover"
          />
        </li>
        <li>
          <AnotherNavButton
            label="Activity"
            onClick={() => {
              router.push("/activity");
            }}
          />
        </li>
        <li>
          <AnotherNavButton
            label="Profile"
            onClick={() => {
              if (username) {
                router.push(`/profile/${username}`);
              }
            }}
          />
        </li>
      </ul>
      <Form
        action="search"
        className="flex flex-row justify-between border bg-[var(--color-bg-gray)] border-black rounded-full p-3 mr-5 w-60 focus:outline-none"
      >
        <Image
          className=""
          src={Icons.search}
          alt="Search Icon"
          width={24}
          height={24}
        />
        <input
          type="text"
          placeholder="Search"
          className="w-full focus:outline-none another-heading4 text-black ml-5 placeholder:text-black"
        />
      </Form>
    </nav>
  );
};
