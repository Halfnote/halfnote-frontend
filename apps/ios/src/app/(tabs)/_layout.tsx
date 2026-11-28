import { Tabs } from "expo-router/js-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ActivityIcon, DiscoverIcon, Navbar, ProfileIcon, WholenoteIcon } from "../../components/Navbar";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs tabBar={(props) => <Navbar {...props} />} screenOptions={{ headerShown: false, sceneStyle: { paddingTop: insets.top, backgroundColor: "#EEEEEE" } }}>
      <Tabs.Screen name="index" options={{ title: "Discover", tabBarIcon: DiscoverIcon }} />
      <Tabs.Screen name="activity" options={{ title: "Activity", tabBarIcon: ActivityIcon }} />
      <Tabs.Screen name="wholenote" options={{ title: "wholenote", tabBarIcon: WholenoteIcon }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ProfileIcon }} />
    </Tabs>
  );
}
