"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { redirect, useRouter } from "next/navigation";
import { LoginUser } from "./actions/account_management_service";
import { Icons } from "../app/icons/icons";
import { verifySession } from "./actions/dal";

export default function LoginPage() {
  useEffect(() => {
    const checkUser = async () => {
      const session = await verifySession();
      if (session.access_token) {
        redirect("/discovery");
      }
    };
    checkUser();
  });
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Add your login logic here
      console.log(formData.username);
      console.log(formData.password);
      await LoginUser(formData.username, formData.password);
      router.push("/discovery"); // Redirect to home page after successful login
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-5">
      <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200 w-full max-w-[400px]">
        {/* <Link
          href="/discovery"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 font-medium mb-6"
        >
          ← Back to Home
        </Link> */}
        <div className="text-center mb-8">
          <Image
            src={Icons.halfnote}
            alt="Another Logo"
            width={230}
            height={55}
            className="mx-auto mb-2"
          />
          <p className="text-gray-500 text-base">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="username"
              className="font-medium text-gray-700 text-sm"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
              autoComplete="username"
              className="p-3 border border-gray-300 rounded-lg text-base outline-none 
                       transition-all focus:border-indigo-500 focus:ring-2 
                       focus:ring-indigo-100 placeholder:text-gray-400"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="font-medium text-gray-700 text-sm"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
              className="p-3 border border-gray-300 rounded-lg text-base outline-none 
                       transition-all focus:border-indigo-500 focus:ring-2 
                       focus:ring-indigo-100 placeholder:text-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 text-white py-3 px-4 rounded-lg text-base 
                     font-semibold mt-2 transition-colors hover:bg-gray-700 
                     disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="relative text-center my-6 text-gray-500 text-sm">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          {/* <span className="relative bg-white px-4">or</span> */}
        </div>
        {/* 
        <div className="text-center text-gray-500 text-sm">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-indigo-500 font-medium hover:underline"
          >
            Create one here
          </Link>
        </div> */}
      </div>
    </div>
  );
}
