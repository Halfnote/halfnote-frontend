"use client";
import React from "react";

interface ButtonsProps {
  children: string
  onClick?: () => void;
  /** new override flag */
  isSelected?: boolean;
  /** disable the button */
  disabled?: boolean;
}

export const Button = (props: ButtonsProps) => {
  const { children, onClick, isSelected: override, disabled } = props;

  const active = override;

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`another-heading4 font-bold rounded-full 
                 border border-black flex items-center 
                 justify-center h-10 px-4 hover:cursor-pointer hover:bg-gray-200
                 ${
                   active
                     ? "bg-black text-white hover:bg-black"
                     : "bg-white text-black"
                 } 
                 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {children}
    </button>
  );
};
