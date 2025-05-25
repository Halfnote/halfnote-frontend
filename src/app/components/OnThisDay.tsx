import Image, { StaticImageData } from "next/image";

import React from "react";

type onThisDayProps = {
  artistName: string;
  artistImage: StaticImageData;
};
export const OnThisDay = ({ artistName, artistImage }: onThisDayProps) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <Image
        src={artistImage}
        alt={artistName}
        className="border-2 border-black w-[230px] h-[141px] mb-2"
      />
      <h1 className="another-heading4 wrap-normal text-center">
        <span className="font-bold">Coolio </span> featuring L.V.scored his
        first UK No.1 single with 'Gangsta's Paradise'.
      </h1>
    </div>
  );
};
