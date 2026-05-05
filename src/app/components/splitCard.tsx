import Image from "next/image";

interface SplitCardProps {
  image: string;
  albumName?: string;
  artistName?: string;
  size: "small" | "large";
}

const SplitCard = ({ image, albumName, artistName, size }: SplitCardProps) => {
  const isLarge = size === "large";

  return (
    <div
      className={`flex flex-row border border-black rounded-xl overflow-hidden bg-white ${
        isLarge ? "h-32" : "h-16"
      }`}
    >
      <div className={`relative flex-shrink-0 ${isLarge ? "w-32" : "w-16"}`}>
        <Image
          src={image}
          fill
          alt={albumName || "Album Art"}
          className="object-cover"
        />
      </div>
      <div
        className={`flex flex-col ${
          isLarge ? "justify-start" : "justify-center"
        } px-4 overflow-hidden`}
      >
        <h1
          className={`another-heading2 truncate ${
            isLarge ? "text-3xl leading-tight" : "text-[22px] leading-snug"
          } text-black`}
        >
          {albumName}
        </h1>
        <h3
          className={`another-heading3 font-bold truncate ${
            isLarge ? "text-xl" : "text-[14px]"
          } text-black mt-1`}
        >
          {artistName}
        </h3>
      </div>
    </div>
  );
};

export default SplitCard;
