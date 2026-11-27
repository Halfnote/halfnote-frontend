import { ApiError } from "@halfnote/data";
import { useDeleteMe } from "@halfnote/data/react";
import { Alert, Pressable, Text } from "react-native";
import { TabPlaceholder } from "../../Navbar";
import { logout } from "../../session";

export default function Profile() {
  const deleteMe = useDeleteMe();

  const remove = () =>
    deleteMe.mutate(undefined, {
      onSuccess: () => void logout(),
      onError: (e) => Alert.alert("Couldn't delete your account", e instanceof ApiError ? e.message : "Check your connection and try again."),
    });

  const confirm = () =>
    Alert.alert("Delete your account?", "Your profile, reviews, follows and favourite albums are deleted for good.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete account", style: "destructive", onPress: remove },
    ]);

  return (
    <TabPlaceholder title="Profile">
      <Pressable role="button" onPress={() => void logout()} hitSlop={8} style={{ marginTop: 16 }}>
        <Text style={{ fontSize: 16, color: "#111" }}>Log out</Text>
      </Pressable>
      <Pressable role="button" onPress={confirm} disabled={deleteMe.isPending} hitSlop={8} style={{ marginTop: 24 }}>
        <Text style={{ fontSize: 16, color: "#B3261E" }}>{deleteMe.isPending ? "Deleting…" : "Delete account"}</Text>
      </Pressable>
    </TabPlaceholder>
  );
}
