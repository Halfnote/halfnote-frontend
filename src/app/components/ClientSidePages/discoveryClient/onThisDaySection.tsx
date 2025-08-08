"use client";
import { artist } from "../../mockdata/mockClients";
import YearButtonCycle from "../../YearButton";
import { OnThisDay } from "../../OnThisDay";

export const OnThisDaySection = () => {
  return (
    <div className="bg-white flex flex-col border-black border-2 rounded-xl p-6 w-2/6 h-[450px]">
      <div className="flex flex-col items-center overflow-y-auto">
        <h3 className="another-heading1 ">On This Day</h3>
        <div className="flex flex-row items-center">
          <h3 className="another-heading1 mr-2">In</h3>
          <YearButtonCycle />
        </div>
        <OnThisDay artistImage={artist} artistName="Name" />
      </div>
    </div>
  );
};
