"use client";
import Image, { StaticImageData } from "next/image";
import { Icons } from "@/app/icons/icons";
import { PopBadge, ClassicalBadge, CountryBadge } from "@/app/icons/stamps";
import { div } from "framer-motion/client";
import { AlbumCard } from "../AlbumCard";
import Daft from "../../../../public/sample_images/daft.png";
import Charlie from "../../../../public/sample_images/charlie.png";
import Kid from "../../../../public/sample_images/kid.png";

interface ProfilePageProps {
  userName: string;
  name: string;
  bio: string;
  userMetrics?: any;
  banner: StaticImageData;
  location: string;
  pfp: StaticImageData;
  numfollowers: number;
  numfollowing: number;
  numReviews: number;
  mostReviewedGenres: string[];
}
export default function ProfilePage({
  userName,
  name,
  bio,
  userMetrics,
  banner,
  pfp,
  location,
  numfollowers,
  numfollowing,
  numReviews,
  mostReviewedGenres,
}: ProfilePageProps) {
  return (
    <div className="flex flex-col border-black border-2 bg-white w-full rounded-xl overflow-hidden">
      {/* Banner */}
      <div className="w-full h-60 relative z-0">
        <Image
          src={banner}
          alt="banner-image"
          className="w-full h-full object-fit"
        />
      </div>

      {/* Content */}
      <div className="grid grid-cols-7 flex-grow relative">
        {/* First col: bio stuff */}
        <div className="col-span-2 flex flex-col items-center">
          {/* Profile picture pulled up and layered */}
          <div className="w-45 h-45  rounded-full overflow-hidden -mt-35 z-10">
            <Image
              src={pfp}
              alt="profile"
              width={144}
              height={144}
              className="object-none w-full h-full"
            />
          </div>

          <div className="flex flex-col items-center text-center mt-4 mb-10">
            <h1 className="another-heading1 text-[42px] -mb-2">{name}</h1>
            <p className="another-heading5 mb-3">@{userName}</p>
            <p className="another-heading5  text-center mb-5 w-70">{bio}</p>
            <p className="another-heading5">📍{location}</p>
          </div>

          {/* Review and Followers */}
          <div className="flex flex-row gap-3 mb-3">
            <div className="w-30 h-35 rounded-md border-1 border-black flex-col flex justify-center items-center text-center">
              <Image
                src={Icons.fifthVinyl}
                alt="Fifth vinyl"
                className="aspect-square w-[54px] object-cover rounded-full ring-2"
              />
              <div>
                <h1 className="another-heading4">{numReviews}</h1>
                <h3 className="another-heading5">Reviews</h3>
              </div>
            </div>
            <div className="w-30 h-35 rounded-md border-1 border-black flex-col flex justify-center items-center text-center">
              <div>
                <h1 className="another-heading4">{numfollowers}</h1>
                <h3 className="another-heading5">Followers</h3>
              </div>
              <div>
                <h1 className="another-heading4">{numfollowing}</h1>
                <h3 className="another-heading5">Followers</h3>
              </div>
            </div>
          </div>
          {/* Most reviewed genres */}
          <div className="w-63 h-max rounded-md border-1 border-black flex-col flex items-center text-center">
            <h1 className="another-heading2 mt-3 mb-2">Most Reviewed Genres</h1>
            {mostReviewedGenres.map((genre) => (
              <div className="mb-3" key={genre}>
                <PopBadge number={genre} key={genre} />
              </div>
            ))}
          </div>
        </div>

        {/* Second col: the rest */}
        <div className="col-span-5 50 mt-3">
          <div className="mb-5">
            <div className="flex items-center gap-3 mb-2">
              <Image
                src={Icons.star}
                alt="Favorite Icon"
                width={40}
                height={40}
                className="object-contain"
              />
              <h1 className="another-heading1 text-[42px]">Favorite Albums</h1>
            </div>
            <div className="flex flex-row gap-10">
              <AlbumCard
                albumCover={Daft}
                albumName="Homework"
                artistName="Daft Punk"
              />
              <AlbumCard
                albumCover={Kid}
                albumName="Kid A"
                artistName="Radiohead"
              />
              <AlbumCard
                albumCover={Charlie}
                albumName="how i'm feeling now"
                artistName="Charli xcx"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Image
                src={Icons.pin}
                alt="Favorite Icon"
                width={40}
                height={40}
                className="object-contain"
              />
              <h1 className="another-heading1 text-[42px]">Pinned Reviews</h1>
            </div>
            <div className="flex flex-row gap-10">
              <AlbumCard
                albumCover={Daft}
                albumName="Homework"
                artistName="Daft Punk"
              />
              <AlbumCard
                albumCover={Kid}
                albumName="Kid A"
                artistName="Radiohead"
              />
              <AlbumCard
                albumCover={Charlie}
                albumName="how i'm feeling now"
                artistName="Charli xcx"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

{
}
