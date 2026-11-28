import type { FeedCard, OnThisDay } from "@halfnote/data";
import { useDiscover, useSetLike } from "@halfnote/data/react";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { BG, INK, SearchBar, SectionHeader, TOP_REVIEW_WIDTH, TopReviewCard, dotWindow } from "../../components";
import { NAVBAR_CLEARANCE } from "../../components/Navbar";
import { F, font } from "../../features/story/kit";

const GAP = 12;
const openAlbum = (discogsId: string | number) => router.push(`/album/${discogsId}`);

export default function Discover() {
  const discover = useDiscover();

  const [refreshing, setRefreshing] = useState(false);
  const pull = () => {
    setRefreshing(true);
    void discover.refetch().finally(() => setRefreshing(false));
  };

  let body;
  if (discover.isPending) body = <ActivityIndicator style={{ marginTop: 40 }} />;
  else if (discover.isError)
    body = (
      <View style={{ alignItems: "center", gap: 16, marginTop: 40 }}>
        <Text style={{ fontFamily: F.sans, fontSize: 15, color: INK }}>{"Couldn't load Discover."}</Text>
        <Pressable onPress={() => void discover.refetch()} style={{ paddingHorizontal: 18, minHeight: 40, borderRadius: 999, backgroundColor: INK, justifyContent: "center" }}>
          <Text style={{ fontFamily: F.sans500, fontSize: 14, color: BG }}>Retry</Text>
        </Pressable>
      </View>
    );
  else
    body = (
      <>
        <TopReviews cards={discover.data.top_reviews} />
        <OnThisDayCard day={discover.data.on_this_day} />
      </>
    );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: BG }}
      contentContainerStyle={{ paddingBottom: NAVBAR_CLEARANCE }}
      stickyHeaderIndices={[1]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={pull} />}
    >
      <View style={{ paddingTop: 18, paddingHorizontal: 20, gap: 14 }}>
        <Text accessibilityRole="header" style={[font(F.serif, 44, 0.95), { color: INK }]}>
          Discover
        </Text>
      </View>
      <Pressable onPress={() => router.push("/search")} accessibilityRole="search" style={{ paddingVertical: 12, paddingHorizontal: 20, backgroundColor: BG }}>
        <View pointerEvents="none">
          <SearchBar />
        </View>
      </Pressable>
      {body}
    </ScrollView>
  );
}

function TopReviews({ cards }: { cards: Omit<FeedCard, "latest_activity">[] }) {
  const [index, setIndex] = useState(0);
  const setLike = useSetLike();
  if (cards.length === 0) return null;
  return (
    <View style={{ paddingTop: 30 }}>
      <SectionHeader title="Top reviews" kicker="This week" style={{ paddingHorizontal: 20, paddingBottom: 12 }} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={TOP_REVIEW_WIDTH + GAP}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 20, gap: GAP }}
        scrollEventThrottle={16}
        onScroll={(e) => setIndex(Math.max(0, Math.min(cards.length - 1, Math.round(e.nativeEvent.contentOffset.x / (TOP_REVIEW_WIDTH + GAP)))))}
      >
        {cards.map((c) => (
          <TopReviewCard
            key={c.review.id}
            card={c}
            onPress={() => router.push(`/review/${c.review.id}`)}
            onAlbumPress={() => openAlbum(c.album.discogs_id)}
            onAuthorPress={() => router.push(`/user/${c.author.username}`)}
            onLike={() => setLike(c.review.id, !c.review.is_liked)}
          />
        ))}
      </ScrollView>
      <View style={{ paddingTop: 12, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 5, height: 16 }}>
        {dotWindow(cards.length, index).map((dot) => (
          <View key={dot.i} style={{ width: dot.width, height: dot.height, borderRadius: 999, backgroundColor: dot.i === index ? INK : "#C2C2C2" }} />
        ))}
      </View>
    </View>
  );
}

function OnThisDayCard({ day }: { day: OnThisDay | null }) {
  const now = new Date();
  const date = day ? new Date(day.year, day.month - 1, day.day) : now;
  const discogsId = day?.discogs_id;
  return (
    <Pressable
      onPress={discogsId ? () => openAlbum(discogsId) : undefined}
      disabled={!discogsId}
      accessibilityRole={discogsId ? "button" : undefined}
      style={({ pressed }) => ({ marginTop: 30, marginHorizontal: 20, padding: 18, borderRadius: 16, backgroundColor: "#1d1d1d", flexDirection: "row", gap: 16, transform: [{ scale: pressed ? 0.98 : 1 }] })}
    >
      <View style={{ width: 92, paddingRight: 16, borderRightWidth: 1, borderRightColor: "rgba(238,238,238,0.18)", justifyContent: "space-between", gap: 16 }}>
        <Text style={{ fontFamily: F.sans600, fontSize: 11, color: "#A6A6A6" }}>On this day</Text>
        <View>
          <Text style={[font(F.serif, 42, 0.85), { color: BG }]}>{date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</Text>
          {day ? <Text style={{ paddingTop: 4, fontFamily: F.sans, fontSize: 13, color: "#A6A6A6" }}>{day.year}</Text> : null}
        </View>
      </View>
      {day ? (
        <View style={{ flex: 1, minWidth: 0, gap: 8 }}>
          <Text style={[font(F.serif, 26, 1), { color: BG }]}>{day.headline}</Text>
          {day.body !== "" && <Text style={{ fontFamily: F.sans, fontSize: 13, lineHeight: 19, color: "#CFCFCF" }}>{day.body}</Text>}
          <Text style={{ marginTop: "auto", fontFamily: F.sans, fontSize: 12, color: "#A6A6A6" }}>
            {day.years_ago === 1 ? "1 year" : `${day.years_ago} years`} ago today
          </Text>
        </View>
      ) : null}
    </Pressable>
  );
}
