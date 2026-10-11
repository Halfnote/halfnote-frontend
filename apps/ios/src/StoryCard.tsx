import type { Album, Review } from "@halfnote/data";
import { RatingBadge, tw } from "@halfnote/ui";
import { useEffect, useState, type Ref } from "react";
import { Image, Text, View } from "react-native";

const WIDTH = 320;

/** An album with its rounded average rating, or one review of it. */
export type StoryContent = { album: Album; rating?: number } | { album: Album; review: Review };

interface StoryCardProps {
  content: StoryContent;
  /** Fires once the cover is drawn (or replaced by a placeholder), so a capture never catches an empty square. */
  onReady: () => void;
  ref?: Ref<View>;
}

/** The sticker shared to Instagram Stories. */
export function StoryCard({ content, onReady, ref }: StoryCardProps) {
  const { album } = content;
  const review = "review" in content ? content.review : undefined;
  const rating = review ? review.rating : "rating" in content ? content.rating : undefined;
  const coverSize = review ? 96 : WIDTH - 48;
  const [coverFailed, setCoverFailed] = useState(false);
  const showCover = !!album.cover_url && !coverFailed;

  // A placeholder has nothing to wait for.
  useEffect(() => {
    if (!showCover) onReady();
  }, [showCover, onReady]);

  const coverStyle = [tw`rounded-[12px] border border-gray-300`, { width: coverSize, height: coverSize }];
  const cover = showCover ? (
    <Image source={{ uri: album.cover_url }} onLoad={onReady} onError={() => setCoverFailed(true)} style={coverStyle} />
  ) : (
    <View style={[coverStyle, tw`bg-bg-gray`]} />
  );
  const titles = (
    <View style={tw`flex-1`}>
      <Text numberOfLines={2} style={tw`another-heading5 font-semibold text-black`}>
        {album.title}
      </Text>
      <Text numberOfLines={1} style={tw`another-body text-gray-600`}>
        {album.artist}
        {album.year ? ` · ${album.year}` : ""}
      </Text>
    </View>
  );

  return (
    <View ref={ref} collapsable={false} style={[tw`bg-white rounded-[24px] p-6 gap-4`, { width: WIDTH }]}>
      {review ? (
        <>
          <View style={tw`flex-row items-center gap-4`}>
            {cover}
            {titles}
          </View>
          <View style={tw`gap-1`}>
            <Text style={tw`another-heading6 font-semibold text-black`}>@{review.username}</Text>
            {!!review.content && (
              <Text numberOfLines={8} style={tw`another-body text-black`}>
                {review.content}
              </Text>
            )}
          </View>
        </>
      ) : (
        <>
          {cover}
          {titles}
        </>
      )}
      <View style={tw`flex-row items-center justify-between`}>
        {rating != null ? <RatingBadge rating={rating} /> : <View />}
        {/* Family registered in app/_layout.tsx. */}
        <Text style={[tw`text-[28px] text-black`, { fontFamily: "InstrumentSerifItalic" }]}>halfnote.</Text>
      </View>
    </View>
  );
}
