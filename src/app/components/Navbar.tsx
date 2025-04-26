"use client";
import React from "react";
import Image from "next/image";
import { Icons } from "../icons/icons";
import { AnotherNavButton } from "./AnotherNavButton";
import Form from "next/form";
import { useRouter } from "next/navigation";

export const NavBar = () => {
  const router = useRouter();
  return (
    <nav className="rounded-full outline-solid outline-2 outline-black flex justify-between items-center p-4 max-w-8xl mx-auto mb-[25px] bg-white">
      <Image
        className="w-[230px] h-[55px] ml-5"
        priority
        src={Icons.another}
        alt="Another"
      />
      <ul className="flex w-full justify-center ml-20 gap-7">
        <li>
          <AnotherNavButton
            onClick={() => {
              router.push("/");
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
              router.push("/profile");
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
