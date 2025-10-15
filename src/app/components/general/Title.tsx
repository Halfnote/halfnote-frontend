"use client";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

type TitleProps = {
  src: string | StaticImport;
  alt: string;
  name: string;
  className?: string;
};

export const Title = ({ src, alt, name, className = "" }: TitleProps) => {
  return (
    <div className={`flex flex-row items-center gap-2 ${className}`}>
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
