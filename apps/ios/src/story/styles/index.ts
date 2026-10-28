import type { GenreKey } from "../../storyDraft";
import { billboard } from "./billboard";
import { score } from "./score";
import { sleeve } from "./sleeve";
import { system } from "./system";
import type { StyleDef } from "./types";

// ponytail: styles not built yet render as Billboard; this becomes a full Record once every layout lands.
const BUILT: Partial<Record<GenreKey, StyleDef>> = { billboard, sleeve, score, system };

export const styleFor = (k: GenreKey): StyleDef => BUILT[k] ?? billboard;
