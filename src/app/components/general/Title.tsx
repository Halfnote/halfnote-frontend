"use client";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

type TitleProps = {
  src: string | StaticImport;
  alt: string;
  name: string;
};

export const Title = ({ src, alt, name }: TitleProps) => {
  return (
    <div className="flex row items-center gap-3">
      <Image
        src={src}
        alt={alt}
        width={40}
        height={40}
        className="object-contain"
      />
      <h1 className="another-heading1 text-[42px]">{name}</h1>
    </div>
  );
};
