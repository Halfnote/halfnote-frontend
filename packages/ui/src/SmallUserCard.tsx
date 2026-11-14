import { Text, View } from "react-native";
import { Image } from "./Image";
import { tw } from "./tw";

interface SmallUserCardProps {
  username: string;
  avatar: string;
}

const avatarRing = { boxShadow: "0 0 0 2px #fff", outlineWidth: 1, outlineOffset: -1, outlineStyle: "solid", outlineColor: "rgb(0 0 0 / 0.05)" } as const;

export function SmallUserCard({ username, avatar }: SmallUserCardProps) {
  return (
    <View style={tw`w-full h-20 flex-row items-center border border-black overflow-hidden rounded-lg`}>
      {/* Tailwind ring-2 ring-white outline -outline-offset-1 outline-black/5; twrnc has no ring or outline utilities. */}
      <View style={[tw`ml-2 w-16 h-16 rounded-full overflow-hidden`, avatarRing]}>
        <Image source={avatar} alt={`${username}'s avatar`} width={64} height={64} fit="cover" stretch />
      </View>
      <View style={tw`flex-1 flex-row px-3 items-center justify-between`}>
        <Text numberOfLines={1} style={tw`another-heading5 leading-[24px] text-black shrink`}>
          {username}
        </Text>
        {/* Follow has no handler yet, same as the web original. */}
        <View role="button" style={tw`border border-[#8c8c8c] rounded-full px-5 py-2`}>
          <Text style={tw`another-heading6 leading-[14px] text-[#8c8c8c]`}>Follow</Text>
        </View>
      </View>
    </View>
  );
}
