"use client";
import { useState } from "react";

const yearCycle: string[] = ["1995", "2005", "2015", "2025"];

export default function YearButtonCycle() {
  const [index, setIndex] = useState<number>(0);

  const handleClick = () => {
    setIndex((prev) => (prev + 1) % yearCycle.length);
  };

  return (
    <button
      onClick={handleClick}
      className={`
        bg-[#f2f2f2] text-black border-[1.5px] border-black 
        rounded-full another-heading4 md:another-heading3
        flex flex-row items-center justify-center
        px-3 cursor-pointer
        `}
    >
      {yearCycle[index]}
    </button>
  );
}
