import type { SearchResult } from "@halfnote/data";
import { Stack } from "expo-router";
import { useState } from "react";
import { emptyDraft, type Draft } from "../../reviewDraft";
import { WriteContext } from "../../write";

export default function WriteLayout() {
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [album, setAlbum] = useState<SearchResult | null>(null);
  return (
    <WriteContext value={{ draft, setDraft, album, setAlbum }}>
      <Stack screenOptions={{ headerShown: false }} />
    </WriteContext>
  );
}
