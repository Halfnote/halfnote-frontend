"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Icons } from "../icons/icons";
import { AnotherNavButton } from "./AnotherNavButton";
import Form from "next/form";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@/app/hooks";
import Link from "next/link";
import { SkeletonNavBar } from "./skeletons/SkeletonNavBar";
import { AnimatePresence, motion } from "framer-motion";
import { SearchDropdown } from "./SearchDropdown";
import { useRecentSearches } from "@/app/hooks/useRecentSearches";
export const NavBar = () => {
  const router = useRouter();
  const path = usePathname();
  const { data: userData, isLoading: isUserLoading } = useUser();
  const [onSearch, setOnSearch] = useState<boolean>(false);
  const [onAlbum, setOnAlbum] = useState<boolean>(false);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const { addSearch } = useRecentSearches();
  const [searchQuery, setSearchQuery] = useState<string>("");
  // const [onWholeNote, setOnWholeNote] = useState<boolean>(false);
  const isWholeNote = path.startsWith("/wholenote");
  useEffect(() => {
    if (path.startsWith("/search")) {
      setOnSearch(true);
      setOnAlbum(false);
    } else if (path.startsWith("/albums")) {
      setOnAlbum(true);
      setOnSearch(false);
    } else {
      setOnSearch(false);
      setOnAlbum(false);
    }
  }, [path]);

  const getActivityButtonLabel = () => {
    if (onSearch) return "Go back";
    if (onAlbum) return "Go back to search";
    return "Activity";
  };

  const shouldMerge = onSearch || onAlbum;

  // Hide navbar on landing/register
  if (path === "/register" || path === "/") return null;

  // For wholenote page, skip authentication check
  if (!isWholeNote && (isUserLoading || !userData)) return <SkeletonNavBar />;
  return (
    <nav className="flex rounded-full outline-solid outline-2 outline-black bg-white p-4 w-full relative items-center mb-4">
      {!isWholeNote && (
        <>
          <motion.div
            className="relative w-[200px] h-[55px] hover:cursor-pointer z-10"
            initial="initial"
            whileHover="hover"
          >
            <motion.div
              className="absolute inset-0"
              variants={{
                hover: { opacity: 0 },
                initial: { opacity: 1 },
              }}
              onClick={() => router.push("/wholenote")}
            >
              <Image
                src={Icons.halfnote}
                alt="Halfnote"
                fill
                className="object-contain"
              />
            </motion.div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              variants={{
                hover: { opacity: 1 },
                initial: { opacity: 0 },
              }}
              onClick={() => router.push("/wholenote")}
            >
              <Image
                src={Icons.wholenote}
                alt="Wholenote"
                width={300}
                height={200}
              />
            </motion.div>
          </motion.div>

          {/* Absolutely centered navigation buttons */}
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            animate={{
              opacity: isSearchFocused ? 0 : 1,
              pointerEvents: isSearchFocused ? "none" : "auto",
            }}
          >
            <ul className="flex gap-7 relative">
              <AnimatePresence mode="popLayout">
                <motion.div
                  key="discover"
                  layout
                  initial={
                    shouldMerge ? { x: 85, opacity: 0 } : { x: 0, opacity: 1 }
                  }
                  animate={{ x: 0, opacity: shouldMerge ? 0 : 1 }}
                  exit={{ x: 85, opacity: 0 }}
                  transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 400,
                    mass: 0.5,
                  }}
                  style={{
                    position: shouldMerge ? "absolute" : "relative",
                    pointerEvents: shouldMerge ? "none" : "auto",
                  }}
                >
                  <Link href="/discovery">
                    <AnotherNavButton label="Discover" />
                  </Link>
                </motion.div>

                <motion.div
                  key="activity"
                  layout
                  transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 400,
                    mass: 0.5,
                  }}
                >
                  <AnotherNavButton
                    label={getActivityButtonLabel()}
                    onClick={() => {
                      if (shouldMerge) {
                        router.back();
                      } else {
                        router.replace("/activity");
                      }
                    }}
                  />
                </motion.div>

                <motion.div
                  key="profile"
                  layout
                  initial={
                    shouldMerge ? { x: -85, opacity: 0 } : { x: 0, opacity: 1 }
                  }
                  animate={{ x: 0, opacity: shouldMerge ? 0 : 1 }}
                  exit={{ x: -85, opacity: 0 }}
                  transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 400,
                    mass: 0.5,
                  }}
                  style={{
                    position: shouldMerge ? "absolute" : "relative",
                    pointerEvents: shouldMerge ? "none" : "auto",
                  }}
                >
                  <Link href={`/profile/${userData?.username || ""}`}>
                    <AnotherNavButton label="Profile" />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </ul>
          </motion.div>
        </>
      )}
      {isWholeNote && (
        <>
          <div className="relative z-10">
            <AnotherNavButton
              label="Back"
              isSelected={true}
              disabled={false}
              onClick={() => router.back()}
            />
          </div>

          <div className="flex-1"></div>
          <div
            className="absolute left-1/2 top-1/2 
                    -translate-x-1/2 -translate-y-1/2
                    overflow-visible pointer-events-none"
          >
            <Image
              className="hover:cursor-pointer pointer-events-auto h-auto w-[200px]"
              src={Icons.wholenote}
              alt="Wholenote"
              onClick={() => router.back()}
            />
          </div>
        </>
      )}

      <motion.div
        layout
        className="mr-2 relative z-10 ml-auto flex flex-row overflow-visible"
        initial={{ width: "250px" }}
        animate={{
          width: isSearchFocused ? "calc(100% - 300px)" : "250px",
        }}
        transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
      >
        <div className="relative flex-1 overflow-visible">
          <Form
            action={(formData: FormData) => {
              const query = formData.get("search") as string;
              if (!query || query.length === 0) return;
              addSearch(query);
              const encodedQuery = encodeURIComponent(query);
              setIsSearchFocused(false);
              setSearchQuery("");
              router.push(`/search?query=${encodedQuery}`);
            }}
            className={`flex flex-row justify-between border bg-[var(--color-bg-gray)] border-black p-3 w-full focus:outline-none transition-all duration-300 ${
              isSearchFocused
                ? "rounded-t-4xl rounded-b-none border-b-0"
                : "rounded-full"
            }`}
          >
            <button type="submit">
              <Image
                src={Icons.search}
                alt="Search Icon"
                width={24}
                height={24}
              />
            </button>
            <input
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onChange={(e) => setSearchQuery(e.target.value)}
              value={searchQuery}
              name="search"
              type="text"
              placeholder="Search"
              className="w-full focus:outline-none another-heading4 text-black ml-5 placeholder:text-black bg-transparent justify-self-end"
            />
          </Form>
          <AnimatePresence>
            {isSearchFocused && (
              <SearchDropdown
                query={searchQuery}
                onClose={() => setIsSearchFocused(false)}
                setSearchQuery={setSearchQuery}
              />
            )}
          </AnimatePresence>
        </div>
        <Link
          href={`/profile/${userData?.username || ""}`}
          className="ml-4 justify-self-end align-self-end"
        >
          <div className="relative w-12 h-12 rounded-full overflow-hidden border border-black cursor-pointer">
            <Image
              src={userData?.avatar || "/default-avatar.png"}
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
        </Link>
      </motion.div>
    </nav>
  );
};

export default NavBar;
