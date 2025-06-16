"use client";
import Image, { StaticImageData } from "next/image";
import { Icons } from "@/app/icons/icons";
import { PopBadge, ClassicalBadge, CountryBadge } from "@/app/icons/stamps";
import { div } from "framer-motion/client";
import { AlbumCard } from "../AlbumCard";
import Daft from "../../../../public/sample_images/daft.png";
import Charlie from "../../../../public/sample_images/charlie.png";
import Black from "../../../../public/sample_images/black.jpeg";
import Kid from "../../../../public/sample_images/kid.png";
import { User, Review } from "@/app/types/types";
import { use, useEffect, useState } from "react";
import { getVinylIcon } from "@/app/utils/calculations";
import ReviewCard from "../ReviewCard";

interface ProfilePageProps {
  user: Promise<User>;
  reviews: Promise<Review[]>;
}
export default function ProfilePage({ user, reviews }: ProfilePageProps) {
  const userData = use(user);
  const reviewData = use(reviews);
  console.log(userData);
  console.log(reviewData);
  const [id, setId] = useState<number>(userData.id);
  const [username, setUsername] = useState<string>(userData.username);
  const [email, setEmail] = useState<string | undefined>(userData.email);
  const [name, setName] = useState<string | undefined>(userData.name);
  const [displayName, setDisplayName] = useState<string>(userData.display_name);
  const [bio, setBio] = useState<string | undefined>(userData.bio);
  const [location, setLocation] = useState<string | undefined>(
    userData.location
  );
  const [avatar, setAvatar] = useState<string | undefined>(userData.avatar);
  const [followerCount, setFollowerCount] = useState<number>(
    userData.follower_count
  );
  const [followingCount, setFollowingCount] = useState<number>(
    userData.following_count
  );
  const [reviewCount, setReviewCount] = useState<number | undefined>(
    userData.review_count
  );
  const [isFollowing, setIsFollowing] = useState<boolean | undefined>(
    userData.is_following
  );
  const [favoriteGenres, setFavoriteGenres] = useState<
    Array<{ id: number; name: string }> | undefined
  >(userData.favorite_genres);
  const [userReviews, setReviews] = useState<Review[]>(reviewData);

  const pinnedReviews = userReviews.filter((filter) => filter.is_pinned);
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
              src={avatar || "/default-avatar.png"}
              alt="profile"
              width={144}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/default-avatar.png";
              }}
              height={144}
              className="object-none w-full h-full"
            />
          </div>

          <div className="flex flex-col items-center text-center mt-4 mb-10">
            <h1 className="another-heading1 text-[42px] -mb-2">{name}</h1>
            <p className="another-heading5 mb-3">@{displayName}</p>
            <p className="another-heading5 text-left mb-5 w-70">{bio}</p>
            <p className="another-heading5">📍{location}</p>
          </div>

          {/* Review and Followers */}
          <div className="flex flex-row gap-3 mb-3">
            <div className="w-30 h-35 rounded-md border-1 border-black flex-col flex justify-center items-center text-center">
              <Image
                src={getVinylIcon(reviewCount)}
                alt="Fifth vinyl"
                className="aspect-square w-[54px] object-cover rounded-full ring-2"
              />
              <div>
                <h1 className="another-heading4">{reviewCount}</h1>
                <h3 className="another-heading5">Reviews</h3>
              </div>
            </div>
            <div className="w-30 h-35 rounded-md border-1 border-black flex-col flex justify-center items-center text-center">
              <div>
                <h1 className="another-heading4">{followerCount}</h1>
                <h3 className="another-heading5">Followers</h3>
              </div>
              <div>
                <h1 className="another-heading4">{followingCount}</h1>
                <h3 className="another-heading5">Followers</h3>
              </div>
            </div>
          </div>
          {/* Most reviewed genres */}
          <div className="w-63 h-100 rounded-md border-1 border-black flex-col flex items-center text-center">
            <h1 className="another-heading2 mt-3 mb-2">Most Reviewed Genres</h1>
            {favoriteGenres?.map((genre) => (
              <div className="mb-3" key={id}>
                <PopBadge number={genre.name} key={genre.id} />
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
              {pinnedReviews?.map((review) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  setReviews={setReviews}
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

{
}
