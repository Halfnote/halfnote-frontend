"use client";
import { EyeClosed, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginUser } from "@/app/actions/account_management_service";
import Image from "next/image";
import { Icons } from "@/app/icons/icons";
import { useQueryClient } from "@tanstack/react-query";

export default function LoginForm() {
  const qc = useQueryClient();
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

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
      await qc.invalidateQueries({ queryKey: ["user"] });
      router.replace("/discovery");
      router.refresh();
    } catch (err: unknown) {
      setError("Login failed. Please check your credentials.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <div className="h-[800px] flex items-center justify-center px-5">
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
          <div className="w-full h-px bg-gray-200 mt-4"></div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <form
          method="post"
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          <input
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
            className="p-3 border border-gray-300 rounded-lg"
          />
          <div className="flex items-center border border-gray-300 rounded-lg">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
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
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-900 text-white py-3 px-4 rounded-lg font-semibold cursor-pointer"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <button
            type="button"
            onClick={handleRegister}
            className="bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
}
