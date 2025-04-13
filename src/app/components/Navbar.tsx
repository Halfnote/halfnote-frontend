import React from "react";
import Image from "next/image";
import { Icons } from "../icons/icons";
import { AnotherButton } from "./Another_Button";

export const Navbar = () => {
  return (
    <nav className=" rounded-full outline-solid outline-2 outline-black flex justify-between items-center p-4 max-w-7xl mx-auto mb-[50px]">
      <Image
        className="w-[230px] h-[55px]"
        priority
        src={Icons.another}
        alt="Electronic Icon"
      />
      <ul className="flex w-full justify-center gap-20">
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
    </nav>
  );
};
