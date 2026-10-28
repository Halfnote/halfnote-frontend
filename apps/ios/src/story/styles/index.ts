import type { GenreKey } from "../../storyDraft";
import { billboard } from "./billboard";
import { sleeve } from "./sleeve";
import type { StyleDef } from "./types";

// ponytail: styles not built yet render as Billboard; this becomes a full Record once every layout lands.
const BUILT: Partial<Record<GenreKey, StyleDef>> = { billboard, sleeve };

export const styleFor = (k: GenreKey): StyleDef => BUILT[k] ?? billboard;
