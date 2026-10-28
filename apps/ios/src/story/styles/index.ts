import type { GenreKey } from "../../storyDraft";
import { beer } from "./beer";
import { billboard } from "./billboard";
import { cassette } from "./cassette";
import { editorial } from "./editorial";
import { graffiti } from "./graffiti";
import { heatmap } from "./heatmap";
import { liner } from "./liner";
import { matchbook } from "./matchbook";
import { postcard } from "./postcard";
import { receipt } from "./receipt";
import { score } from "./score";
import { sleeve } from "./sleeve";
import { system } from "./system";
import { tattoo } from "./tattoo";
import { terminal } from "./terminal";
import { ticket } from "./ticket";
import type { StyleDef } from "./types";

/** Each style's look; names, fit and Plus live with the draft model in GENRES. */
export const STYLES: Record<GenreKey, StyleDef> = {
  billboard,
  sleeve,
  score,
  editorial,
  liner,
  system,
  matchbook,
  cassette,
  ticket,
  terminal,
  receipt,
  postcard,
  tattoo,
  graffiti,
  beer,
  heatmap,
};
