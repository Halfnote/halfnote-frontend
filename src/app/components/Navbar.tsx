import React from "react";
import Image from "next/image";
import { Icons } from "../icons/icons";
import { AnotherButton } from "./Another_Button";
import Form from "next/form";

export const Navbar = () => {
  return (
    <nav className=" rounded-full outline-solid outline-2 outline-black flex justify-between items-center p-4 max-w-7xl mx-auto mb-[50px]">
      <Image
        className="w-[230px] h-[55px] ml-5"
        priority
        src={Icons.another}
        alt="Electronic Icon"
      />
      <ul className="flex w-full justify-center ml-20 gap-10">
        <li>
          <AnotherButton label="Discover" />
        </li>
        <li>
          <AnotherButton label="Activity" />
        </li>
        <li>
          <AnotherButton label="Profile" />
        </li>
      </ul>
      <Form
        action="search"
        className="flex flex-row justify-between border bg-gray-200 border-black rounded-full p-2 pl-6 mr-5 w-52 focus:outline-none"
      >
        <Image
          className="mr-3 "
          src={Icons.search}
          alt="Search Icon"
          width={20}
          height={20}
        />
        <input
          type="text"
          placeholder="Search"
          className="w-full border-gray-300 focus:outline-none"
        />
      </Form>
    </nav>
  );
};
