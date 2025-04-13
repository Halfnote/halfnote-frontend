"use client";
import React from "react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

interface AnotherNavButtonsProps {
  onClick?: () => Promise<Boolean> | undefined;
  label: "Discover" | "Activity" | "Profile";
}

export const AnotherNavButton = (props: AnotherNavButtonsProps) => {
  const pathname = usePathname();
  const [isClicked, setIsClicked] = useState<boolean>(false);

  useEffect(() => {
    switch (props.label) {
      case "Discover":
        setIsClicked(pathname === "/");
        break;
      case "Activity":
        setIsClicked(pathname === "/activity");
        break;
      case "Profile":
        setIsClicked(pathname === "/profile");
        break;
      default:
        setIsClicked(false);
        break;
    }
  }, [pathname]);

  return (
    <button
      className={`w-30 another-heading4 font-bold rounded-full border border-black flex items-center justify-center h-10 px-4 hover:cursor-pointer ${
        isClicked ? "bg-black text-white" : "bg-white text-black"
      }`}
      onClick={() => {
        props.onClick?.();
      }}
    >
      {props.label}
    </button>
  );
};
