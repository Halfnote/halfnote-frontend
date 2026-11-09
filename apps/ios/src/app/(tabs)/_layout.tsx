import { Tabs } from "expo-router/js-tabs";
import { ActivityIcon, DiscoverIcon, Navbar, ProfileIcon, WholenoteIcon } from "../../Navbar";

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <Navbar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Discover", tabBarIcon: DiscoverIcon }} />
      <Tabs.Screen name="activity" options={{ title: "Activity", tabBarIcon: ActivityIcon }} />
      <Tabs.Screen name="wholenote" options={{ title: "wholenote", tabBarIcon: WholenoteIcon }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ProfileIcon }} />
    </Tabs>
  );
}
