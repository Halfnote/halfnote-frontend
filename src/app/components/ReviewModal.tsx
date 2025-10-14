import React, { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { generateRatingStamp } from "../utils/calculations";
import { Icons } from "../icons/icons";
import { AlbumData, Review } from "../types/types";
import { useRouter } from "next/navigation";
import { useCreateReview, useEditReview } from "../hooks";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";

type reviewModalProps = {
  data: AlbumData;
  username: string;
  userReview?: Review | undefined;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function WriteReview({
  data,
  username,
  userReview,
  setOpen,
}: reviewModalProps) {
  const router = useRouter();
  const {
    createReviewMutation,
    isPending: isCreating,
    isSuccess: isCreateSuccess,
  } = useCreateReview(username);
  const { editReviewMutation, isPending: isEditing } = useEditReview(username);

  // Validation schema
  const reviewValidationSchema = Yup.object({
    content: Yup.string()
      .trim()
      .max(2000, "Review cannot exceed 2000 characters")
      .matches(
        /^[a-zA-Z0-9\s.,!?'"()\-_@#$%&*+=/:;[\]{}|\\~`]*$/,
        "Review contains invalid characters"
      ),
    rating: Yup.number()
      .min(1, "Please select a rating")
      .max(10, "Rating cannot exceed 10")
      .required("Rating is required"),
  });

  // Helper function to check if form is complete
  const isFormComplete = (rating: number | undefined) => {
    return rating !== undefined && rating >= 1 && rating <= 10;
  };

  const handleSubmit = async (values: { content: string; rating: number }) => {
    const reviewData = {
      discogsId: data.discogs_id,
      ratingNumber: values.rating,
      description: values.content.trim(),
      genres: data.discogs_genres || [],
    };

    if (userReview) {
      console.log("Editing existing review");
      editReviewMutation.mutate(
        {
          ...reviewData,
          reviewId: userReview.id,
        },
        {
          onSettled: () => {
            router.back();
          },
        }
      );
    } else {
      console.log("Creating new review");
      createReviewMutation.mutate(reviewData);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center p-4 z-50 border-black">
      <div className="bg-white rounded-2xl shadow-2xl p-5 flex flex-col">
        {/* Header with Close Button */}
        <div className="flex justify-start items-start mb-4">
          <button
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <div className="w-6 h-6 border-2 border-black rounded flex items-center justify-center cursor-pointer">
              X
            </div>
            <span className="text-sm font-medium">Close</span>
          </button>
        </div>

        {/* Title */}
        <div className="flex items-center justify-center mb-6 relative flex-col">
          {!isCreateSuccess && (
            <Image
              src={Icons.fifthVinyl}
              alt="Vinyl Icon"
              width={40}
              height={40}
            />
          )}
          <h1 className="text-[42px] leading-tight another-heading1">
            {isCreateSuccess ? "" : "Write Review"}
          </h1>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col">
          {isCreateSuccess ? (
            // Centered congratulations message
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h1 className="another-heading1 text-5xl">Congratulations,</h1>
                <h1 className="another-heading1 text-5xl">
                  You are now an author!
                </h1>
                <button
                  onClick={() => setOpen(false)}
                  className="bg-black text-white mt-4 px-12 py-3 rounded-full another-heading3 w-[95%] font-medium transition-colors shadow-lg cursor-pointer hover:bg-white hover:text-black"
                >
                  <p>Yes Ma&apos;am </p>
                </button>
              </div>
            </div>
          ) : (
            // Review editing form with Formik
            <Formik
              initialValues={{
                content: userReview?.content || "",
                rating: userReview?.rating || 0,
              }}
              validationSchema={reviewValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue, errors, touched }) => {
                const formIsComplete = isFormComplete(values.rating);

                return (
                  <Form className="flex-1 flex flex-col">
                    <div className="flex gap-6 flex-1">
                      {/* Left Side - Album Info */}
                      <div className="flex flex-col items-center w-[220px]">
                        <Image
                          src={
                            data.cover_url ??
                            (data.cover_image || "/default-album.png")
                          }
                          alt="Album Cover"
                          width={220}
                          height={220}
                          className="border border-black mb-3"
                        />

                        <div className="text-center">
                          <h1 className="another-heading1 text-[42px] font-bold leading-tight truncate max-w-[200px]">
                            {data.title}
                          </h1>
                          <p className="another-heading5 mt-[-10px]">
                            {data.artist}
                          </p>
                          <p className="another-heading6 mt-0 text-gray-500">
                            {data.year}
                          </p>
                        </div>
                      </div>

                      {/* Right Side - Review Text Area */}
                      <div className="flex-1 flex flex-col">
                        <Field
                          as="textarea"
                          name="content"
                          placeholder="Add a review..."
                          className="w-full flex-1 p-4 border border-black rounded-lg resize-none focus:outline-none focus:border-blue-400 text-gray-700 placeholder-gray-400"
                          maxLength={2000}
                        />
                        {touched.content && errors.content && (
                          <div className="text-red-500 text-sm mt-1">
                            {errors.content}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Rating Section */}
                    <div className="flex flex-col items-center justify-center gap-3 mt-6">
                      <h1 className="another-heading1 text-[42px] leading-tight">
                        Rating
                      </h1>
                      <div className="flex justify-center w-full overflow-x-auto">
                        <div className="relative flex items-center gap-1 px-4">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setFieldValue("rating", num)}
                              className={`cursor-pointer relative z-1 w-15 h-15 group flex-shrink-0 ${
                                values.rating === num
                                  ? "opacity-100"
                                  : "opacity-70"
                              }`}
                            >
                              <Image
                                width={32}
                                height={32}
                                src={generateRatingStamp(num, {
                                  empty: values.rating !== num,
                                })}
                                alt={`Rating ${num}`}
                                className="absolute inset-0 w-full h-full object-contain group-hover:opacity-0 transition-opacity duration-200"
                              />
                              <Image
                                width={32}
                                height={32}
                                src={generateRatingStamp(num, { empty: false })}
                                alt={`Hover Rating ${num}`}
                                className="absolute inset-0 w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {touched.rating && errors.rating && (
                        <div className="text-red-500 text-sm">
                          {errors.rating}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isCreating || isEditing || !formIsComplete}
                        className={`mt-4 px-12 py-3 rounded-full another-heading3 w-[95%] font-medium transition-colors shadow-lg ${
                          isCreating || isEditing || !formIsComplete
                            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                            : "bg-black text-white hover:bg-gray-800 cursor-pointer"
                        }`}
                      >
                        {isCreating || isEditing ? (
                          <span className="flex flex-row items-center justify-center gap-2">
                            <h1>Publishing</h1>
                            <svg
                              className="size-5 animate-spin text-white"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              />
                            </svg>
                          </span>
                        ) : (
                          <h1>Publish</h1>
                        )}
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          )}
        </div>
      </div>
    </div>
  );
}
