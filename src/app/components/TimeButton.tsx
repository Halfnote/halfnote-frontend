"use client";
import { useState } from "react";

type CycleItem = {
  label: string;
  widthClass: string;
};

const timeCycle: CycleItem[] = [
  { label: "today", widthClass: "w-[118px]" },
  { label: "this week", widthClass: "w-[160px]" },
  { label: "this month", widthClass: "w-[166px]" },
  { label: "this year", widthClass: "w-[134px]" },
];

export default function TimeButtonCycle() {
  const [index, setIndex] = useState<number>(0);

  const handleClick = () => {
    setIndex((prev) => (prev + 1) % timeCycle.length);
  };

  return (
    <button
      onClick={handleClick}
      className={`h-[44px] ${timeCycle[index].widthClass} max-w-[166px] min-w-[118px]
        bg-var(--color-time-gray) text-black border-[1.5px] border-black 
        rounded-full another-heading3 
        flex flex-row items-center justify-center
        px-[19px] py-[6px] cursor-pointer
        `}
    >
      {timeCycle[index].label}
    </button>
  );
}
