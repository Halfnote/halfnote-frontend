import type { GenreKey } from "../../storyDraft";
import { billboard } from "./billboard";
import { editorial } from "./editorial";
import { liner } from "./liner";
import { score } from "./score";
import { sleeve } from "./sleeve";
import { system } from "./system";
import type { StyleDef } from "./types";

// ponytail: styles not built yet render as Billboard; this becomes a full Record once every layout lands.
const BUILT: Partial<Record<GenreKey, StyleDef>> = { billboard, sleeve, score, system, editorial, liner };

export const styleFor = (k: GenreKey): StyleDef => BUILT[k] ?? billboard;
