"use client";
import React from "react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface AnotherNavButtonsProps {
  label: string;
  onClick?: () => void;
  /** new override flag */
  isSelected?: boolean;
  /** disable the button */
  disabled?: boolean;
}

export const AnotherNavButton = (props: AnotherNavButtonsProps) => {
  const { label, onClick, isSelected: override, disabled } = props;
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
                 border border-black flex items-center 
                 justify-center h-10 px-4 hover:cursor-pointer 
                 ${active ? "bg-black text-white" : "bg-white text-black"} 
                 ${disabled ? "opacity-50 cursor-pointer" : ""}`}
    >
      {label}
    </button>
  );
};
