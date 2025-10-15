"use client";
import { useState } from "react";
import TimeButtonCycle from "../../TimeButton";
import { useTranslation } from "react-i18next";

export const TopReviewsSection = () => {
  const { t } = useTranslation("dashboard");

  const [reviewTime, setReviewTime] = useState<string>("today");

  return (
    <div className="bg-white flex flex-col border-black rounded-xl border-2 p-2 lg:p-6 h-[450px] w-full md:w-2/3">
      <div className="flex flex-wrap items-center justify-start">
        <h3 className="another-heading1 mr-2">{t("title.top_reviews")}</h3>
        <TimeButtonCycle time={reviewTime} setTime={setReviewTime} />
      </div>
      <div className="overflow-auto">
        {/* Add dynamic review content using user.username or access_token */}
      </div>
    </div>
  );
};
