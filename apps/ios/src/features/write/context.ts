import type { SearchResult } from "@halfnote/data";
import { createContext } from "react";
import type { Draft } from "./draft";

export const WriteContext = createContext<{
  draft: Draft;
  setDraft: (update: (d: Draft) => Draft) => void;
  album: SearchResult | null;
  setAlbum: (album: SearchResult) => void;
}>(null!);
