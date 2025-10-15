"use client";
import React from "react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface AnotherNavButtonsProps {
  label: string;
  icon: string | StaticImport;
  onClick?: () => void;
  /** new override flag */
  isSelected?: boolean;
  /** disable the button */
  disabled?: boolean;
}

export const AnotherNavButton = (props: AnotherNavButtonsProps) => {
  const { label, icon, onClick, isSelected: override, disabled } = props;
  const pathname = usePathname();
  const [byPath, setByPath] = useState(false);

  useEffect(() => {
    let hit = false;
    if (label === "Discover") hit = pathname === "/discovery";
    if (label === "Activity") hit = pathname === "/activity";
    if (label === "Profile") hit = pathname.startsWith("/profile/");
    setByPath(hit);
  }, [pathname, label]);

  // if they've passed in `isSelected`, use that;
  // otherwise fall back to the path check
  const active = override ?? byPath;

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`another-heading4 font-bold rounded-full 
                 md:border border-black flex items-center 
                 justify-center md:px-4 hover:cursor-pointer hover:bg-gray-200
                 ${
                   active
                     ? "md:bg-black md:text-white md:hover:bg-black"
                     : "md:bg-white md:text-black"
                 } 
                 ${disabled ? "opacity-50 cursor-pointer" : ""}`}
    >
      {/* Show text on md+ */}
      <span className="hidden md:inline">{label}</span>
      {/* Show icon on small screens */}
      <Image
        className="w-full h-full justify-self-start md:hidden"
        priority
        src={icon}
        alt={label}
      />
    </button>
  );
};
