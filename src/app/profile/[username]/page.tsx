"use client";
import { use, useEffect } from "react";
import Image from "next/image";
import { Icons } from "@/app/icons/icons";
import {
  ClassicalBadge,
  CountryBadge,
  PopBadge,
  RockBadge,
} from "@/app/icons/stamps";
import { AlbumCard } from "@/app/components/AlbumCard";
import Daft from "../../../../public/sample_images/daft.png";
import Charlie from "../../../../public/sample_images/charlie.png";
import Black from "../../../../public/sample_images/black.jpeg";
import Kid from "../../../../public/sample_images/kid.png";
import { getVinylIcon } from "@/app/utils/calculations";
import ReviewCard from "@/app/components/ReviewCard";
import { useUser } from "@/app/hooks";
import { useUserReviews } from "@/app/hooks";
import { Review } from "@/app/types/types";
import { GenreBadge } from "@/app/utils/calculations";

export default function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const { username } = params;
  const { data: userData } = useUser();
  const {
    data: userReviews = [],
    refetch,
    isLoading,
  } = useUserReviews(username);

  if (!userData) return <div>Loading...</div>;

  const pinnedReviews = userReviews.filter(
    (review: Review) => review.is_pinned
  );

  return (
    <div className="flex flex-col border-black border-2 bg-white w-full rounded-xl overflow-hidden pb-10">
      {/* Banner */}
      <div className="w-full h-60 relative z-0">
        <Image
          src={Black}
          alt="banner-image"
          className="w-full h-full object-fit"
        />
      </div>

      {/* Content */}
      <div className="grid grid-cols-8 flex-grow relative">
        {/* First col: bio stuff */}
        <div className="col-span-2 flex flex-col items-center px-50">
          {/* Profile picture pulled up and layered */}
          <div className="w-45 h-45  rounded-full overflow-hidden -mt-35 z-10">
            <Image
              src={userData.avatar || "/default-avatar.png"}
              alt="profile"
              width={144}
              height={144}
              className="object-none w-full h-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/default-avatar.png";
              }}
            />
          </div>

          <div className="flex flex-col items-center text-center mt-4 mb-10">
            <h1 className="another-heading1 text-[42px] -mb-2">
              {userData.name}
            </h1>
            <p className="another-heading5 mb-3">@{userData.display_name}</p>
            <p className="another-heading5 text-left mb-5 w-70">
              {userData.bio}
            </p>
            <p className="another-heading5">📍{userData.location}</p>
          </div>

          {/* Review and Followers */}
          <div className="flex flex-row gap-3 mb-3">
            <div className="w-30 h-35 rounded-md border-1 border-black flex-col flex justify-center items-center text-center">
              <Image
                src={getVinylIcon(userData.review_count)}
                alt="Fifth vinyl"
                className="aspect-square w-[54px] object-cover rounded-full ring-2"
              />
              <div>
                <h1 className="another-heading4">{userData.review_count}</h1>
                <h3 className="another-heading5">Reviews</h3>
              </div>
            </div>
            <div className="w-30 h-35 rounded-md border-1 border-black flex-col flex justify-center items-center text-center">
              <div>
                <h1 className="another-heading4">{userData.follower_count}</h1>
                <h3 className="another-heading5">Followers</h3>
              </div>
              <div>
                <h1 className="another-heading4">{userData.following_count}</h1>
                <h3 className="another-heading5">Followers</h3>
              </div>
            </div>
          </div>

          {/* Most reviewed genres */}
          <div className="w-63 h-100 rounded-md border-1 border-black flex-col flex items-center text-center">
            <h1 className="another-heading2 mt-3 mb-2">Most Reviewed Genres</h1>
            {userData.most_reviewed_genres?.map((genre: any) => (
              <div className="mb-3" key={genre.id}>
                <GenreBadge genre={genre.name} number={genre.name} />
              </div>
            ))}
          </div>
        </div>

        {/* Second col: the rest */}
        <div className="col-span-6 50 mt-3 px-10">
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
              {pinnedReviews.map((review: Review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  setReviews={() => {}}
                  avatar={userData.avatar || "/default-avatar.png"}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
