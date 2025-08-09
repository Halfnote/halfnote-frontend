"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginUser } from "@/app/actions/account_management_service";
import Image from "next/image";
import { Icons } from "@/app/icons/icons";

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await LoginUser(formData.username, formData.password);
      router.push("/discovery");
    } catch (err: any) {
      setError("Login failed. Please check your credentials.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200 w-full max-w-[400px]">
        <div className="text-center mb-8">
          <Image
            src={Icons.halfnote}
            alt="Logo"
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
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-lg"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-lg"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
