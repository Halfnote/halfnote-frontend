"use client";
import Image from "next/image";
import { useState } from "react";
import { Icons } from "@/app/icons/icons";
import { time } from "console";
import TimeButtonCycle from "./components/TimeButton";
import YearButtonCycle from "./components/YearButton";
export default function DiscoverPage() {
  return (
    <div className="flex w-full h-screen gap-4 box-border bg-white">
      <div className="flex flex-col items-center border-black border-2 rounded-xl p-6 w-[20%]">
        <h3 className="another-heading1">Members</h3>
      </div>
      <div className="flex flex-col flex-grow gap-4">
        <div className="flex gap-4 flex-grow">
          <div className="flex flex-col border-black rounded-xl border-2 p-6 w-[75%]">
            <div className="flex items-center justify-start mb-2">
              <h3 className="another-heading1 mr-2">Top Reviews</h3>
              <TimeButtonCycle />
            </div>
          </div>
          <div className="flex flex-col rounded-xl p-6 w-[30%] items-center border-black border-2">
            <div className="flex flex-col items-center mb-2">
              <h3 className="another-heading1">Top Rated</h3>
              <TimeButtonCycle />
            </div>
          </div>
        </div>
        <div className="flex gap-4 flex-grow">
          <div className="flex flex-col border-black border-2 rounded-xl p-6 w-[35%]">
            <div className="flex flex-col b-2 items-center">
              <h3 className="another-heading1">On This Day</h3>
              <span className="flex flex-row ml-10 mr-10 items-center">
                <h3 className="another-heading1 mr-2">In</h3>
                <YearButtonCycle />
              </span>
            </div>
          </div>
          <div className="flex flex-col border-2 border-black rounded-xl p-6 w-[75%] justify-start">
            <h3 className="another-heading1">New Releases</h3>
          </div>
        </div>
      </div>
      <div className="flex flex-col text-center items-center border-black border-2 rounded-xl p-6 w-[20%]">
        <h3 className="another-heading1">Most Recent Reviews</h3>
      </div>
    </div>
  );
}
