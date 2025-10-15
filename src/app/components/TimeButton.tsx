"use client";
import { useMemo } from "react";

type CycleItem = {
  label: string;
  widthClass: string;
};

type TimeCycleProps = {
  time: string;
  setTime: (value: string) => void;
};

const timeCycle: CycleItem[] = [
  { label: "today", widthClass: "w-[118px]" },
  { label: "this week", widthClass: "w-[160px]" },
  { label: "this month", widthClass: "w-[166px]" },
  { label: "this year", widthClass: "w-[134px]" },
];

export default function TimeButtonCycle({ time, setTime }: TimeCycleProps) {
  const index = useMemo(() => {
    return timeCycle.findIndex((item) => item.label === time);
  }, [time]);

  const handleClick = () => {
    const nextIndex = (index + 1) % timeCycle.length;
    setTime(timeCycle[nextIndex].label);
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
      {time}
    </button>
  );
}
