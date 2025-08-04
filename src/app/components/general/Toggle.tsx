"use client";
import React, { Dispatch, SetStateAction } from "react";

interface ToggleProps {
  enabled: boolean;
  setEnabled: Dispatch<SetStateAction<boolean>>;
}

export const Toggle = (props: ToggleProps) => {
  const { enabled, setEnabled } = props;

  return (
    <button
      onClick={() => setEnabled(!enabled)}
      className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ease-in-out
          ${enabled ? "bg-black" : "bg-gray-300"}`}
    >
      <div
        className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out
            ${enabled ? "translate-x-6" : "translate-x-0"}`}
      ></div>
    </button>
  );
};
