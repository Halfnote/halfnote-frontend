import type { Dispatch, SetStateAction } from "react";
import { Pressable, View } from "react-native";
import { shadowMd, tw } from "./tw";

interface ToggleProps {
  enabled: boolean;
  setEnabled: Dispatch<SetStateAction<boolean>>;
}

export function Toggle({ enabled, setEnabled }: ToggleProps) {
  return (
    <Pressable
      role="switch"
      aria-checked={enabled}
      onPress={() => setEnabled(!enabled)}
      style={tw.style("w-12 h-6 flex-row items-center rounded-full p-1", enabled ? "bg-black" : "bg-gray-300")}
    >
      <View style={[tw.style("bg-white w-4 h-4 rounded-full", enabled && "translate-x-6"), shadowMd]} />
    </Pressable>
  );
}
