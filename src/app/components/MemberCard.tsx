import React from "react";
import Image, { StaticImageData } from "next/image";
import { Vinyl } from "./general/Vinyl";

type MemberCardProps = {
  numRatings: number;
  profilePic: StaticImageData;
  topAlbums: Array<StaticImageData | string>;
  userName: string;
};

export const MemberCard = ({
  numRatings,
  profilePic,
  topAlbums,
  userName,
}: MemberCardProps) => {
  return (
    <div className="border-2 border-[#9A9A9A] rounded-xl p-4 mb-2 aspect-square w-full">
      {/* Inside of square */}
      <div className="flex flex-col h-full w-full">
        {/* Top row */}
        <div className="flex flex-row gap-2 items-center flex-shrink-0">
          {/* Profile */}
          <div className="flex flex-col items-center w-1/2">
            <Image
              src={profilePic}
              alt="Profile Picture"
              className="aspect-square w-full object-cover rounded-full ring-2"
            />
            <h1 className="another-heading3">{userName}</h1>
          </div>

          {/* Vinyl + ratings */}
          <div className="flex flex-col items-center justify-between w-1/2 overflow-hidden">
            <div className="w-3/4 overflow-hidden">
              <Vinyl numRatings={numRatings} />
            </div>
            <div className="flex flex-col items-center">
              <h1 className="another-heading4 -mb-1">{numRatings}</h1>
              <h3 className="another-body mt-0">reviews</h3>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Albums row */}
        <div className="flex flex-row gap-1 justify-start overflow-x-auto">
          {topAlbums.map((album, index) => (
            <Image
              key={index}
              src={album}
              alt="Top Album"
              className="aspect-square w-1/3 object-cover rounded-md flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
