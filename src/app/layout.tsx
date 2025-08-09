"use client";
import { NavBar } from "./components/Navbar";
import "./globals.css";
import { Instrument_Sans, Instrument_Serif } from "next/font/google";
import TranslationProvider from "./providers/TranslationProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 30 * 60 * 1000, // 30 minutes (was cacheTime in v4)
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: "always", // or true
    },
    mutations: {
      gcTime: 5 * 60 * 1000, // 5 minutes for mutation cache
    },
  },
});

// Font imports
const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-sans",
  fallback: ["system-ui", "sans-serif"],
  preload: true,
  adjustFontFallback: true,
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-instrument-serif",
  weight: ["400"],
  fallback: ["system-ui", "sans-serif"],
  preload: true,
  adjustFontFallback: true,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${instrumentSerif.variable}`}
    >
      <QueryClientProvider client={queryClient}>
        <TranslationProvider>
          <body className="items-center justify-center max-h-screen">
            <NavBar />
            {children}
          </body>
        </TranslationProvider>
      </QueryClientProvider>
    </html>
  );
}
