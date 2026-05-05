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
    const isActive = (() => {
      switch (label) {
        case "Discover":
          return pathname === "/discovery";
        case "Activity":
          return pathname === "/activity";
        case "Profile":
          return pathname.startsWith("/profile/");
        default:
          return false;
      }
    })();

    setByPath(isActive);
  }, [pathname, label]);

  const active = override ?? byPath;

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`another-heading4 font-bold rounded-full
                 border border-black flex items-center
                 justify-center h-10 px-4
                 ${
                   active
                     ? "bg-black text-white"
                     : "bg-white text-black"
                 }
                 ${
                   disabled
                     ? "opacity-50 cursor-not-allowed"
                     : active
                     ? "hover:cursor-pointer hover:bg-gray-800"
                     : "hover:cursor-pointer hover:bg-gray-200"
                 }`}
    >
      {label}
    </button>
  );
};
