import React from "react";
interface AnotherButtonProps {
  onClick?: () => void | undefined;
  label: string;
}

export const AnotherButton = (props: AnotherButtonProps) => {
  return (
    <button
      className="bg-[#FF6B00] text-white font-bold py-2 px-4 rounded-full"
      onClick={props.onClick}
    >
      {props.label}
    </button>
  );
};
