"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import { CreateList } from "@/app/actions/list_service";
import { Title } from "../general/Title";
import { Icons } from "@/app/icons/icons";
import { Toggle } from "../general/Toggle";
import { Button } from "../general/Button";

type ModalType = {
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const EditProfileModal = ({ setOpen }: ModalType) => {
  const [listName, setListName] = useState("");
  const [description, setDescription] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const [missing, setMissing] = useState({ name: false });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    const nameMissing = listName.trim() === "";

    if (nameMissing) {
      setMissing({ name: nameMissing });
      setLoading(false);
      return;
    }

    try {
      console.log("Calling CreateList...");
      await CreateList(listName, description, isPublic);
      setOpen(false);
    } catch (err: any) {
      setError("List creation failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-1/2 p-6 rounded-lg shadow-lg">
        <Title src={Icons.star} alt={"Favorite Icon"} name={"Edit Profile"} />

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">List Name *</label>
          <input
            type="text"
            value={listName}
            onChange={(e) => {
              setListName(e.target.value);
              if (missing.name && e.target.value.trim() !== "")
                setMissing((prev) => ({ ...prev, name: false }));
            }}
            className={`w-full border ${
              missing.name ? "border-red-500" : "border-gray-300"
            } p-2 rounded-md`}
            placeholder="Enter list name"
          />
          {missing.name && (
            <p className="text-red-500 text-sm mt-1">List name is required</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            className={`w-full border border-gray-300 p-2 rounded-md h-32`}
            placeholder="Enter list description"
          />
        </div>

        <label className="block text-sm font-medium mb-1">Public</label>
        <Toggle enabled={isPublic} setEnabled={setIsPublic} />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={() => {
              handleSubmit();
            }}
            disabled={loading}
            isSelected
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </div>
    </div>
  );
};
