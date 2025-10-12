import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com", "i.discogs.com", "st.discogs.com"],
  },
  serverActions: {
    bodySizeLimit: "10mb",
  },
};

export default nextConfig;
