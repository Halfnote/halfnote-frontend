"use client";
import { EyeClosed, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { RegisterUser } from "@/app/actions/account_management_service";
import Image from "next/image";
import { Icons } from "@/app/icons/icons";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Only letters, numbers, and underscores allowed"
    )
    .min(3, "Must be at least 3 characters")
    .max(20, "Cannot exceed 20 characters")
    .required("Username is required"),

  email: Yup.string().email("Invalid email").required("Email is required"),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .matches(/[a-z]/, "Must contain a lowercase letter")
    .matches(/[A-Z]/, "Must contain an uppercase letter")
    .matches(/\d/, "Must contain a number")
    .matches(/[@$!%*?&]/, "Must contain a special character")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm Password is required"),

  bio: Yup.string().max(200, "Bio cannot exceed 200 characters"),
});

export default function RegisterForm() {
  const qc = useQueryClient();
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-8 w-full">
      <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200 w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Image
            src={Icons.halfnote}
            alt="Logo"
            width={230}
            height={55}
            className="mx-auto mb-2"
          />
          <p className="text-gray-500 text-base">Create your account</p>
        </div>

        {submitError && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm mb-4">
            {submitError}
          </div>
        )}

        <Formik
          initialValues={{
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            bio: "",
          }}
          validationSchema={RegisterSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitError(null);
            try {
              await RegisterUser(
                values.username,
                values.email,
                values.password,
                values.bio
              );
              await qc.invalidateQueries({ queryKey: ["user"] });
              router.replace("/discovery");
              router.refresh();
            } catch (err) {
              console.error(err);
              const errorMessage =
                err instanceof Error
                  ? err.message
                  : "Registration failed. Please try again.";
              setSubmitError(errorMessage);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, values }) => (
            <Form className="flex flex-col gap-5">
              {/* Username */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Username
                </label>
                <Field
                  name="username"
                  placeholder="Choose a unique username"
                  className="w-full p-3 border border-gray-300 rounded-lg placeholder-gray-400"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email
                </label>
                <Field
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full p-3 border border-gray-300 rounded-lg placeholder-gray-400"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <Field
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="flex-1 p-3 bg-transparent focus:outline-none placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="px-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <Field
                    name="confirmPassword"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm your password"
                    className="flex-1 p-3 bg-transparent focus:outline-none placeholder-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="px-3 text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    {showConfirm ? <EyeClosed size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <ErrorMessage
                  name="confirmPassword"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Bio (Optional)
                </label>
                <Field
                  as="textarea"
                  name="bio"
                  placeholder="Tell us a bit about yourself and your music taste..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg placeholder-gray-400 resize-none"
                />
                <div className="text-right text-sm text-gray-400 mt-1">
                  {values.bio.length}/200
                </div>
                <ErrorMessage
                  name="bio"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold cursor-pointer hover:bg-gray-800 transition-colors"
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>

              <div className="text-center text-gray-500 text-sm">or</div>

              {/* Sign In */}
              <button
                type="button"
                onClick={() => router.push("/")}
                className="bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Sign In
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
