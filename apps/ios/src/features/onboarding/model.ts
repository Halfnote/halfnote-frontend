import type { FavoriteAlbum, OnboardingAlbum, SearchResult } from "@halfnote/data";

/** An album in the picker, whichever list it came from. */
export interface AlbumPick {
  discogsId: string;
  title: string;
  artist: string;
  cover?: string;
}

export const MAX_PICKS = 4;

export const fromGrid = (a: OnboardingAlbum | FavoriteAlbum): AlbumPick => ({ discogsId: a.discogs_id, title: a.title, artist: a.artist, cover: a.cover_url ?? undefined });
export const fromSearch = (a: SearchResult): AlbumPick => ({ discogsId: String(a.id), title: a.title, artist: a.artist, cover: a.cover_image });

export const spotOf = (picks: AlbumPick[], discogsId: string) => picks.findIndex((p) => p.discogsId === discogsId);

/** Adds the album, or removes it when it's already picked. A fifth pick changes nothing. */
export function togglePick(picks: AlbumPick[], album: AlbumPick): AlbumPick[] {
  if (spotOf(picks, album.discogsId) >= 0) return picks.filter((p) => p.discogsId !== album.discogsId);
  return picks.length < MAX_PICKS ? [...picks, album] : picks;
}

/** The server stores a set, so order doesn't count as a change. */
export const samePicks = (a: AlbumPick[], b: AlbumPick[]) => a.length === b.length && a.every((p) => spotOf(b, p.discogsId) >= 0);

export const suggestHandle = (name: string) =>
  name
    .normalize("NFD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 24);

export const cleanHandle = (typed: string) => typed.toLowerCase().replace(/\s/g, "");

export const validHandle = (handle: string) => /^[a-z0-9._]{2,24}$/.test(handle) && /[a-z0-9]/.test(handle);

/** New accounts get user + 20 hex characters until the name step replaces it. */
export const isPlaceholder = (username: string) => /^user[0-9a-f]{20}$/.test(username);
