"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { X, MapPin, Pencil } from "lucide-react";
import Image from "next/image";
import { useUser, useEditProfile } from "@/app/hooks";
import { AlbumCard } from "../AlbumCard";
import { Formik } from "formik";

type ModalType = {
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const EditProfileModal = ({ setOpen }: ModalType) => {
  const { data: userData } = useUser();
  const { editProfileMutation, isPending } = useEditProfile();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Formik
        initialValues={{
          name: userData?.name || "",
          bio: userData?.bio || "",
          location: userData?.location || "",
          avatar: userData?.avatar || undefined,
          banner: undefined,
        }}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            await editProfileMutation.mutateAsync({
              name: values.name,
              bio: values.bio,
              location: values.location,
              avatar: avatarFile || undefined,
              banner: bannerFile || undefined,
            });
            setOpen(false);
          } catch (err) {
            console.error(err);
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ values, handleChange, handleSubmit }) => (
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 flex flex-col items-center shadow-xl overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="w-full flex items-center justify-between mb-6">
              <button
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-gray-700 font-medium hover:opacity-70"
              >
                <X size={20} />
                Close
              </button>
              <h2 className="text-xl font-semibold text-gray-800">
                Edit Profile
              </h2>
              <div className="w-[64px]" />
            </div>

            {/* Profile Image */}
            <div className="relative mb-3 rounded-full">
              <div className="w-[150px] h-[150px] overflow-hidden flex-shrink-0 relative">
                <Image
                  src={
                    avatarPreview || userData?.avatar || "/default-avatar.png"
                  }
                  alt="Profile"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <input
                type="file"
                id="avatar-upload"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => {
                  console.log("clicked");
                  document.getElementById("avatar-upload")?.click();
                }}
                className="absolute bottom-0 right-4 bg-white border rounded-full p-1 shadow-sm hover:bg-gray-50 cursor-pointer"
              >
                <Pencil size={16} />
              </button>
            </div>

            {/* Display Name */}
            <div className="text-center">
              <h3 className="text-4xl font-semibold another-heading1">
                {userData?.name}
              </h3>
              <p className="text-gray-500 another-heading5">Display Name</p>
            </div>

            <hr className="w-full border-gray-200 my-4" />

            {/* Description */}
            <div className="w-full mb-4">
              <label className=" font-bold text-gray-800 mb-2 another-heading5">
                Description
              </label>
              <textarea
                name="bio"
                value={values.bio}
                onChange={handleChange}
                placeholder="Describe yourself"
                className="w-full border border-gray-300 rounded-md p-2 text-sm resize-none h-24 focus:ring-2 focus:ring-gray-300"
              />
            </div>

            {/* Location */}
            <div className="w-full flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-gray-700 text-sm">
                <MapPin className="text-red-500" size={18} />
                <input
                  type="text"
                  name="location"
                  value={values.location}
                  onChange={handleChange}
                  placeholder="Add location"
                  className="another-heading2 bg-transparent border-none outline-none"
                />
              </div>
            </div>

            {/* Favorite Albums */}
            <div className="w-full mb-4">
              <label className=" font-bold text-gray-800 mb-2 another-heading5">
                Favorite Albums
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4">
                {userData?.favorite_albums.slice(0, 3).map((fav) => (
                  <AlbumCard
                    key={fav.id}
                    albumCover={fav.cover_url || "/default-album.png"}
                    albumName={fav.title}
                    artistName={fav.artist}
                    size={100}
                  />
                ))}
              </div>
            </div>

            {/* Banner Photo */}
            <div className="w-full mb-4">
              <label className=" font-bold text-gray-800 mb-2 another-heading5">
                Banner Photo
              </label>
              <div className="w-full h-24 rounded-md bg-gradient-to-r from-orange-400 to-yellow-300 mb-2 relative overflow-hidden">
                {bannerPreview && (
                  <Image
                    src={bannerPreview}
                    alt="Banner"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <input
                type="file"
                id="banner-upload"
                accept="image/*"
                onChange={handleBannerChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() =>
                  document.getElementById("banner-upload")?.click()
                }
                className="border border-gray-300 px-4 py-1.5 rounded-full text-sm font-medium hover:bg-gray-50"
              >
                Upload a new banner photo
              </button>
            </div>

            <hr className="w-full border-gray-200 my-4" />

            {/* Buttons */}
            <div className="w-full flex flex-col gap-3">
              <button
                type="button"
                onClick={() => handleSubmit()}
                disabled={isPending}
                className="w-full bg-black text-white py-2.5 rounded-full font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isPending ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={isPending}
                className="w-full border border-gray-400 py-2.5 rounded-full font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
};
