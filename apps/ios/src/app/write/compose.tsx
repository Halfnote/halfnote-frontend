import type { Review } from "@halfnote/data";
import { useAlbumDetails } from "@halfnote/data/react";
import { Redirect, router, Stack, useLocalSearchParams } from "expo-router";
import { use, useState } from "react";
import { View } from "react-native";
import { BG } from "../../components";
import { Composer } from "../../features/write/Composer";
import { WriteContext } from "../../features/write/context";
import { Posted } from "../../features/write/Posted";

export default function Compose() {
  const { discogsId = "" } = useLocalSearchParams<{ discogsId?: string }>();
  const { album, draft, setDraft } = use(WriteContext);
  const preset = useAlbumDetails(album ? "" : discogsId);
  const [posted, setPosted] = useState<Review | null>(null);

  if (posted)
    return (
      <>
        <Stack.Screen options={{ gestureEnabled: false }} />
        <Posted review={posted} />
      </>
    );

  const p = preset.data?.album;
  const current = album ?? (p && { id: Number(discogsId), title: p.title, artist: p.artist, year: p.year, cover_image: p.cover_url, average_rating: null });
  if (!current) return preset.isError || !discogsId ? <Redirect href="/write" /> : <View style={{ flex: 1, backgroundColor: BG }} />;

  return (
    <Composer
      album={current}
      draft={draft}
      setDraft={setDraft}
      onRepick={() => (album ? router.back() : router.replace("/write"))}
      onPosted={setPosted}
    />
  );
}
