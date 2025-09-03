import Image from "next/image";
import { Icons } from "@/app/icons/icons";
export const SkeletonNavBar = () => (
  <nav className="rounded-full outline-solid outline-2 outline-black grid grid-cols-3 items-center bg-white p-4 w-full animate-pulse">
    {/* Logo skeleton */}
    {/* Logo */}
    <Image
      className="w-[200px] h-[55px] justify-self-start"
      priority
      src={Icons.halfnote}
      alt="Another"
    />

    {/* Center nav links skeleton */}
    <ul className="flex justify-center gap-7">
      <div className="w-20 h-8 bg-gray-200 rounded" />
      <div className="w-20 h-8 bg-gray-200 rounded" />
      <div className="w-20 h-8 bg-gray-200 rounded" />
      <div className="w-10 h-10 bg-gray-200 rounded-full" />
    </ul>

    {/* Search bar skeleton */}
    <div className="justify-self-end mr-2">
      <div className="w-40 h-10 bg-gray-200 rounded-full" />
    </div>
  </nav>
);
