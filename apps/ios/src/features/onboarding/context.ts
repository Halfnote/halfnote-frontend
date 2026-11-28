import type { AvatarPreset } from "@halfnote/data";
import { createContext } from "react";
import type { AlbumPick } from "./model";

export interface Answers {
  name: string;
  handle: string;
  /** Once the user edits the username, the name stops suggesting it. */
  handleTouched: boolean;
  picks: AlbumPick[];
  /** What the server has, so an unchanged set isn't sent again. */
  savedPicks: AlbumPick[];
  face: AvatarPreset;
}

export const OnboardingContext = createContext<{
  answers: Answers;
  update: (change: Partial<Answers>) => void;
}>(null!);
