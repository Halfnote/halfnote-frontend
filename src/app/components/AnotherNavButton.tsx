"use client";
import React from "react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface AnotherNavButtonsProps {
  label: string;
  onClick?: () => void;
  /** new override flag */
  isSelected?: boolean;
}

export const AnotherNavButton = (props: AnotherNavButtonsProps) => {
  const { label, onClick, isSelected: override } = props;
  const pathname = usePathname();
  const [byPath, setByPath] = useState(false);

  useEffect(() => {
    let hit = false;
    if (label === "Discover")  hit = pathname === "/";
    if (label === "Activity")  hit = pathname === "/activity";
    if (label === "Profile")   hit = pathname === "/profile";
    setByPath(hit);
  }, [pathname, label]);

  // if they've passed in `isSelected`, use that;
  // otherwise fall back to the path check
  const active = override ?? byPath;

  return (
    <button
      onClick={onClick}
      className={`another-heading4 font-bold rounded-full 
                 border border-black flex items-center 
                 justify-center h-10 px-4 hover:cursor-pointer 
                 ${active ? "bg-black text-white" : "bg-white text-black"}`}
    >
      {label}
    </button>
  );
};
