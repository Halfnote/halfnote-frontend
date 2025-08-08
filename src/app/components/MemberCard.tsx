import React from "react";
import Image, { StaticImageData } from "next/image";

import { Icons } from "../icons/icons";
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
    <div className="flex flex-col border-2 border-[#9A9A9A] rounded-xl w-full aspect-square p-4 mb-2">
      <div className="flex flex-row gap-10 w-full items-center">
        {/* {first} */}
        <div className="flex flex-col min-w-0 items-center">
          <Image
            src={profilePic}
            alt="Profile Picture"
            className="aspect-square w-[75px] object-cover rounded-full ring-2"
          />

          <h1 className="truncate another-heading3">{userName}</h1>
        </div>
        <div className="flex flex-col min-w-0 items-center gap-0">
          {numRatings === 0 ? (
            <Image
              src={Icons.firstVinyl}
              alt="First vinyl"
              className="aspect-square w-[54px] object-cover rounded-full ring-2"
            />
          ) : numRatings >= 1 && numRatings <= 99 ? (
            <Image
              src={Icons.secondVinyl}
              alt="Second vinyl"
              className="aspect-square w-[54px] object-cover rounded-full ring-2"
            />
          ) : numRatings >= 100 && numRatings <= 499 ? (
            <Image
              src={Icons.thirdVinyl}
              alt="Third vinyl"
              className="aspect-square w-[54px] object-cover rounded-full ring-2"
            />
          ) : numRatings >= 500 && numRatings <= 1499 ? (
            <Image
              src={Icons.fourthVinyl}
              alt="Forth vinyl"
              className="aspect-square w-[54px] object-cover rounded-full ring-2"
            />
          ) : (
            <Image
              src={Icons.fifthVinyl}
              alt="Fifth vinyl"
              className="aspect-square w-[54px] object-cover rounded-full ring-2"
            />
          )}
          <h1 className="another-heading4 -mb-1">{numRatings}</h1>
          <h3 className="another-body mt-0">reviews</h3>
        </div>
      </div>
      <div className="flex flex-row gap-1 justify-center mt-3">
        <Image
          src={topAlbums[0]}
          alt="Top Album"
          className="w-[60px] h-[60px] object-cover rounded-md object-center"
        />
        <Image
          src={topAlbums[1]}
          alt="Top Album"
          className="w-[60px] h-[60px] object-cover rounded-md object-center"
        />
        <Image
          src={topAlbums[2]}
          alt="Top Album"
          className="w-[60px] h-[60px] object-cover rounded-md object-center"
        />
      </div>
    </div>
  );
};
