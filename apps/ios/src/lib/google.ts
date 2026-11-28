import { GoogleSignin, isSuccessResponse } from "@react-native-google-signin/google-signin";

// Public identifiers, not secrets. The iOS one is also in app.json, reversed, as the sign-in redirect's URL scheme.
GoogleSignin.configure({
  iosClientId: "158854524352-kjhfnal5rlcj13uun9kmupgr1ri5ee00.apps.googleusercontent.com",
  webClientId: "158854524352-bk2ohjrt32tvlvgd78bs6d9h5940m9dd.apps.googleusercontent.com",
});

/** null when the user backs out. */
export async function googleIdToken(): Promise<string | null> {
  const result = await GoogleSignin.signIn();
  if (!isSuccessResponse(result)) return null;
  if (!result.data.idToken) throw new Error("Google returned no ID token");
  return result.data.idToken;
}
