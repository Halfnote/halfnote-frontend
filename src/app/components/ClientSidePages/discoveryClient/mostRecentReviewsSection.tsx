"use client";
import { useTranslation } from "react-i18next";
import { albums } from "../../mockdata/mockClients";
import { RecentReview } from "../../RecentReview";

export const MostRecentReviewsSection = () => {
  const { t } = useTranslation("dashboard");

  return (
    <div className="bg-white flex flex-col text-center items-center border-black border-2 rounded-xl p-2 lg:p-4 w-full h-[916px] overflow-hidden">
      <h3 className="another-heading1">{t("title.most_recent_reviews")}</h3>
      <RecentReview
        albumCover={albums[0]}
        rating={10}
        genre="Electronic"
        time={2}
      />
      <RecentReview albumCover={albums[1]} rating={8} genre="Pop" time={3} />
      <RecentReview albumCover={albums[2]} rating={7} genre="Rock" time={5} />
    </div>
  );
};
