"use client";
import { useState } from "react";
import TimeButtonCycle from "../../TimeButton";
import { TopRatedCarousel } from "../../TopRatedCarousel";
import { useTranslation } from "react-i18next";

export const TopRatedAlbumsSection = () => {
  const { t } = useTranslation("dashboard");

  const [topRatedTime, setTopRatedTime] = useState<string>("today");

  return (
    <div className="bg-white flex flex-col rounded-xl p-2 lg:p-6 h-[450px] md:items-center border-black border-2 w-full md:w-1/3">
      <div className="flex flex-wrap justify-start md:flex-col md:items-center">
        <h3 className="another-heading1 mr-2 md:mr-0">{t("title.top_rated")}</h3>
        <TimeButtonCycle time={topRatedTime} setTime={setTopRatedTime} />
      </div>
      <TopRatedCarousel items={[]} />
    </div>
  );
};
