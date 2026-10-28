import type { GenreKey } from "../../storyDraft";
import { billboard } from "./billboard";
import type { StyleDef } from "./types";

// ponytail: styles not built yet render as Billboard; this becomes a full Record once every layout lands.
const BUILT: Partial<Record<GenreKey, StyleDef>> = { billboard };

export const styleFor = (k: GenreKey): StyleDef => BUILT[k] ?? billboard;
