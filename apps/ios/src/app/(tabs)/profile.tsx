import { Pressable, Text } from "react-native";
import { TabPlaceholder } from "../../Navbar";
import { logout } from "../../session";

export default function Profile() {
  return (
    <TabPlaceholder title="Profile">
      <Pressable role="button" onPress={() => void logout()} hitSlop={8} style={{ marginTop: 16 }}>
        <Text style={{ fontSize: 16, color: "#111" }}>Log out</Text>
      </Pressable>
    </TabPlaceholder>
  );
}
