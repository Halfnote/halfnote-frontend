import { tw } from "@halfnote/ui";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Placeholder for the review composer. */
export default function Write() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[tw`flex-1 bg-[#EEEEEE] px-5`, { paddingTop: insets.top + 12 }]}>
      <Pressable role="button" onPress={() => router.back()} hitSlop={8} style={tw`self-start`}>
        <Text style={tw`another-heading5 text-black`}>Cancel</Text>
      </Pressable>
    </View>
  );
}
