import { create } from "twrnc";
import { fonts } from "./fonts";
import { colors } from "./tokens";

// The web app's .another-* classes (globals.css). RN letterSpacing is px, so -0.03em is computed per size.
const another = (fontFamily: string, fontSize?: number, rest: { fontWeight?: string; textAlign?: "center" } = {}) => ({
  fontFamily,
  ...(fontSize && { fontSize, letterSpacing: Math.round(-3 * fontSize) / 100 }),
  ...rest,
});

export const tw = create({
  theme: {
    extend: {
      // twrnc ships the Tailwind v3 palette; these are the web app's Tailwind v4 grays (oklch converted to hex).
      colors: { ...colors, gray: { 200: "#e5e7eb", 300: "#d1d5dc", 500: "#6a7282", 600: "#4a5565" } },
    },
  },
  plugins: [
    {
      handler: ({ addUtilities }) =>
        addUtilities({
          // Web heading1 inherits its size, so native gets no size or tracking; pair it with text-* and tracking-[-Npx].
          "another-heading1": another(fonts.serif, undefined, { fontWeight: "400" }),
          "another-heading2": another(fonts.serif, 28, { fontWeight: "400" }),
          "another-heading3": another(fonts.sans, 24),
          "another-heading4": another(fonts.sans, 20, { fontWeight: "400" }),
          "another-heading5": another(fonts.sans, 16),
          "another-heading6": another(fonts.sans, 14, { fontWeight: "400" }),
          "another-body": another(fonts.sans, 14, { fontWeight: "400" }),
          "another-label": another(fonts.sans, 10, { fontWeight: "400" }),
          "another-top-rated-album": another(fonts.sans, 28, { fontWeight: "700", textAlign: "center" }),
        }),
    },
  ],
});

// Tailwind v4 shadow-md. RN 0.76+ and react-native-web both accept a CSS boxShadow string.
export const shadowMd = { boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)" };
