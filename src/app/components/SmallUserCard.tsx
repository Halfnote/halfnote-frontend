import React from "react";
import Image from "next/image";
import { UserResult } from "@/app/types/types";

interface SmallUserCardProps {
  user: UserResult;
}
export const SmallUserCard = ({ user }: SmallUserCardProps) => {
  return (
    <div className="w-full h-20 flex flex-row items-center border border-black shrink-0 overflow-hidden rounded-lg">
      <div className="relative ml-2 size-16 shrink-0">
        <Image
          src={
            user.avatar ||
            "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          }
          alt={`${user.username}'s avatar`}
          fill
          className="rounded-full ring-2 ring-white outline -outline-offset-1 outline-black/5 object-cover"
        />
      </div>
      <div className="flex flex-1 px-3 items-center justify-between">
        <span className="another-heading5 truncate">{user.username}</span>

        <button className="another-heading6 border border-[#8c8c8c] text-[#8c8c8c] rounded-full px-5 py-2 leading-none">
          Follow
        </button>
      </div>
    </div>
  );
};
