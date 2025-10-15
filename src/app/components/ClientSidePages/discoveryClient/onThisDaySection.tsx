"use client";
import { artist } from "../../mockdata/mockClients";
import YearButtonCycle from "../../YearButton";
import { OnThisDay } from "../../OnThisDay";
import { useTranslation } from "react-i18next";

export const OnThisDaySection = () => {
  const { t } = useTranslation("dashboard");

  return (
    <div className="bg-white flex flex-col border-black border-2 rounded-xl p-2 lg:p-6 h-[450px] w-full md:w-1/3">
      <div className="flex flex-col items-center overflow-y-auto">
        <h3 className="another-heading1 ">{t("title.on_this_day")}</h3>
        <div className="flex flex-row items-center">
          <h3 className="another-heading1 mr-2">{t("on_this_day.in")}</h3>
          <YearButtonCycle />
        </div>
        <OnThisDay artistImage={artist} artistName="Name" />
      </div>
    </div>
  );
};
