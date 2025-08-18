import React from "react";
import Image from "next/image";
import { Icons } from "../../icons/icons";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

interface VinylProps {
  numRatings: number;
}

const vinyls: Record<
  "first" | "second" | "third" | "fourth" | "fifth",
  string | StaticImport
> = {
  first: Icons.firstVinyl,
  second: Icons.secondVinyl,
  third: Icons.thirdVinyl,
  fourth: Icons.fourthVinyl,
  fifth: Icons.fifthVinyl,
};

export const Vinyl = ({ numRatings }: VinylProps) => {
  let level: keyof typeof vinyls;

  if (numRatings === 0) {
    level = "first";
  } else if (numRatings >= 1 && numRatings <= 99) {
    level = "second";
  } else if (numRatings >= 100 && numRatings <= 499) {
    level = "third";
  } else if (numRatings >= 500 && numRatings <= 1499) {
    level = "fourth";
  } else {
    level = "fifth";
  }

  return (
    <Image
      src={vinyls[level]}
      alt={`${level} vinyl`}
      className="aspect-square object-cover rounded-full ring-2"
    />
  );
};
