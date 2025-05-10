import React from "react";

type MemberCardProps = {
  numRatings: number;
  profilePic: string;
  topAlbums: Array<string>;
  userName: string;
};

export const MemberCard = ({
  numRatings,
  profilePic,
  topAlbums,
  userName,
}: MemberCardProps) => {
  return (
    <div className="flex flex-col w-full border-2 border-[#9A9A9A] rounded-xl p-5 mb-4">
      <div className="flex flex-row gap-5 w-full">
        {/* {first} */}
        <div className="flex flex-col min-w-0">
          <h1>pic</h1>
          <h1 className="truncate">username</h1>
        </div>
        <div className="flex flex-col min-w-0">
          <h1>vinyl</h1>
          <h1>rating</h1>
          <h3>reviews</h3>
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full">
        <div>01</div>
        <div>02</div>
        <div>03</div>
      </div>
    </div>
  );
};
