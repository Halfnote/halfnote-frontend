import { NavBar } from "./components/Navbar";
import "./globals.css";
import { EB_Garamond } from "next/font/google";
import TranslationProvider from "./providers/TranslationProvider";
import ReactQueryProvider from "./providers/QueryProvider";

// const queryClient = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 5 * 60 * 1000, // 5 minutes
//       gcTime: 30 * 60 * 1000, // 30 minutes (was cacheTime in v4)
//       refetchOnWindowFocus: true,
//       refetchOnReconnect: true,
//       refetchOnMount: "always", // or true
//     },
//     mutations: {
//       gcTime: 5 * 60 * 1000, // 5 minutes for mutation cache
//     },
//   },
// });

// Font imports
const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-eb-garamond",
  style: ["normal", "italic"],
  fallback: ["Georgia", "serif"],
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
      className={ebGaramond.variable}
    >
      <body className="items-center justify-center flex flex-col gap-2">
        <ReactQueryProvider>
          <TranslationProvider>
            <NavBar />
            {children}
          </TranslationProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
