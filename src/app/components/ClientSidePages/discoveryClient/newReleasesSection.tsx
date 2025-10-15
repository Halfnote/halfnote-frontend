"use client";
import { useTranslation } from "react-i18next";
import { NewReleasesCarousel } from "../../NewReleaseCarousel";

export const NewReleasesSection = () => {
  const { t } = useTranslation("dashboard");

  return (
    <div className="bg-white flex flex-col justify-between border-2 border-black rounded-xl p-2 lg:p-6 h-[450px] w-full md:w-2/3">
      <h3 className="another-heading1 mb-4">{t("title.new_releases")}</h3>
      <NewReleasesCarousel items={[]} />
    </div>
  );
};
