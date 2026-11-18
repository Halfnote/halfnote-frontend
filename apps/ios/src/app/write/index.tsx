import { Redirect, router, useLocalSearchParams } from "expo-router";
import { use } from "react";
import { Picker, WriteContext } from "../../write";

export default function Pick() {
  const { discogsId } = useLocalSearchParams<{ discogsId?: string }>();
  const { album, setAlbum, setDraft } = use(WriteContext);
  if (discogsId) return <Redirect href={{ pathname: "/write/compose", params: { discogsId } }} />;
  return (
    <Picker
      onPick={(picked) => {
        if (picked.id !== album?.id) setDraft((d) => ({ ...d, favoriteSongId: null }));
        setAlbum(picked);
        router.push("/write/compose");
      }}
    />
  );
}
