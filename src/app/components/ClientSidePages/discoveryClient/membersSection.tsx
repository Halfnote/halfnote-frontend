"use client";
import React from "react";
import { members } from "../../mockdata/mockClients";
import { MemberCard } from "../../MemberCard";
import { useTranslation } from "react-i18next";

export const MembersSection = () => {
  const { t } = useTranslation("dashboard");

  return (
    <div className="flex flex-col items-center border-black border-2 rounded-xl p-2 lg:p-4 w-full bg-white h-[916px] overflow-hidden">
      <h3 className="another-heading1">{t("title.members")}</h3>
      <div className="flex-grow flex flex-wrap justify-center gap-2 overflow-auto w-full">
        {members.map((member, index) => (
          <MemberCard
            key={member.userName + index}
            userName={member.userName}
            numRatings={member.numRatings}
            profilePic={member.profilePic}
            topAlbums={member.topAlbums}
          />
        ))}
      </div>
    </div>
  );
};
