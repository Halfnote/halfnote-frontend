"use client";
import React from "react";
import { useState } from "react";

interface AnotherButtonProps {
  onClick?: () => void | undefined;
  label: string;
}

export const AnotherButton = (props: AnotherButtonProps) => {
  const [isClicked, setIsClicked] = useState<boolean>(false);

  return (
    <button
      className={`w-30 another-heading4 font-bold rounded-full border border-black flex items-center justify-center h-10 px-4 hover:cursor-pointer ${
        isClicked ? "bg-black text-white" : "bg-white text-black"
      }`}
      onClick={() => {
        setIsClicked(!isClicked);
        props.onClick?.();
      }}
    >
      {props.label}
    </button>
  );
};
