import * as SecureStore from "expo-secure-store";
import { useCallback, useEffect, useState } from "react";

const KEY = "halfnote.plus";

/** halfnote Plus entitlement. Stub until payments exist: unlocking just sets a local flag. */
export function usePlus() {
  const [plus, setPlus] = useState(false);
  useEffect(() => {
    void SecureStore.getItemAsync(KEY).then((v) => setPlus(v === "1"));
  }, []);
  const unlock = useCallback(async () => {
    setPlus(true);
    await SecureStore.setItemAsync(KEY, "1");
  }, []);
  return { plus, unlock };
}
