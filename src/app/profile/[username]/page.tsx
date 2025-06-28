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
import { useParams } from "next/navigation";
import Daft from "../../../../public/sample_images/daft.png";
import Charlie from "../../../../public/sample_images/charlie.png";
import Black from "../../../../public/sample_images/black.jpeg";
import Kid from "../../../../public/sample_images/kid.png";
import { getVinylIcon } from "@/app/utils/calculations";
import ReviewCard from "@/app/components/ReviewCard";
import { useUser } from "@/app/hooks";
import { useUserReviews } from "@/app/hooks";
import { Genre, Review } from "@/app/types/types";
import { generateBadge } from "@/app/utils/calculations";
import { useState } from "react";

export default function ProfilePage() {
  const params = useParams<{ username: string }>();
  const { data: userData } = useUser();
  const {
    data: userReviews = [],
    refetch,
    isLoading,
  } = useUserReviews(params.username);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (userReviews.length > 0) {
      setReviews(userReviews);
    }
  }, [userReviews]);

  if (!userData || !userReviews) return <div>Loading...</div>;

  const pinnedReviews = reviews.filter((review: Review) => review.is_pinned);

  console.log(userData);

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
          <div className="w-[200px] h-[200px] rounded-full overflow-hidden -mt-30 border-2 border-black bg-white shrink-0">
            <Image
              src={userData.avatar || "/default-avatar.png"}
              alt="profile"
              width={200}
              height={200}
              className="w-full h-full object-cover"
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
            <p className="another-heading5 text-center mb-5 w-70">
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
          <div className="w-63 h-full rounded-md border-1 border-black flex-col flex items-center text-center">
            <h1 className="another-heading2 mt-3 mb-2">Most Reviewed Genres</h1>
            {userData.most_reviewed_genres?.map((genre: Genre) => (
              <div className="mb-3" key={genre.id}>
                <Image
                  width={100}
                  height={100}
                  src={generateBadge(genre.name)}
                  alt={`${genre.name} badge`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Second col: the rest */}
        <div className="col-span-6 50 mt-3 px-10">
          <div className="mb-8">
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
            <div className="flex flex-row gap-x-10 overflow-x-auto items-start">
              {userData.favorite_albums?.map((fav) => (
                <AlbumCard
                  key={fav.id}
                  albumCover={fav.cover_url || "/default-album.png"}
                  albumName={fav.title}
                  artistName={fav.artist}
                />
              ))}
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
            <div className="flex flex-row gap-10 mb-10">
              {pinnedReviews.map((review: Review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  setReviews={setReviews}
                  avatar={userData.avatar || "/default-avatar.png"}
                  username={params.username}
                />
              ))}
            </div>
            <div className="w-full h-[1000px] border-black border rounded-xl px-20 py-10">
              <h1 className="another-heading1 text-[42px] -mb-2">
                Halfnote feed
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
