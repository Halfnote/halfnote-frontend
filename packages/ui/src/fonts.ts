import { Platform } from "react-native";

// Web reads the next/font CSS variables set on <html>. iOS bundles the same families via the expo-font config plugin (apps/ios/app.json).
export const fonts = Platform.select({
  // body: react-native-web pins Text to its own system stack; inherit keeps the page's font like a plain <p>.
  web: { serif: "var(--font-eb-garamond), serif", sans: "var(--font-instrument-sans), sans-serif", body: "inherit" },
  // body: web's page font is Tailwind's system-ui stack, not EB Garamond, so iOS keeps the system font too.
  default: { serif: "EB Garamond", sans: "Instrument Sans", body: undefined },
});
