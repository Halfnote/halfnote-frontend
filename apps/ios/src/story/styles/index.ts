import type { GenreKey } from "../../storyDraft";
import { beer } from "./beer";
import { billboard } from "./billboard";
import { editorial } from "./editorial";
import { graffiti } from "./graffiti";
import { liner } from "./liner";
import { postcard } from "./postcard";
import { receipt } from "./receipt";
import { score } from "./score";
import { sleeve } from "./sleeve";
import { system } from "./system";
import { tattoo } from "./tattoo";
import { terminal } from "./terminal";
import type { StyleDef } from "./types";

// ponytail: styles not built yet render as Billboard; this becomes a full Record once every layout lands.
const BUILT: Partial<Record<GenreKey, StyleDef>> = {
  billboard,
  sleeve,
  score,
  system,
  editorial,
  liner,
  terminal,
  receipt,
  postcard,
  tattoo,
  graffiti,
  beer,
};

export const styleFor = (k: GenreKey): StyleDef => BUILT[k] ?? billboard;
