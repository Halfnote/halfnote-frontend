import { tw } from "@halfnote/ui";
import { router } from "expo-router";
import type { BottomTabBarProps } from "expo-router/js-tabs";
import type { ReactNode } from "react";
import { Pressable, Text, View, type ColorValue } from "react-native";
import Svg, { Circle, Ellipse, Path } from "react-native-svg";

const BOTTOM = 22;
const HEIGHT = 60;
/** Bottom padding a tab screen needs so its content clears the floating bar. */
export const NAVBAR_CLEARANCE = BOTTOM + HEIGHT + 16;

type IconProps = { focused: boolean; color: ColorValue };

function Icon({ focused, color, children, ...rest }: IconProps & { children: ReactNode; strokeLinejoin?: "round"; strokeLinecap?: "round" }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={focused ? 1.8 : 1.6} {...rest}>
      {children}
    </Svg>
  );
}

export const DiscoverIcon = (p: IconProps) => (
  <Icon {...p} strokeLinejoin="round">
    <Circle cx="12" cy="12" r="9" />
    <Path d="M15.2 8.8 L13.4 13.4 L8.8 15.2 L10.6 10.6 Z" />
  </Icon>
);

export const ActivityIcon = (p: IconProps) => (
  <Icon {...p}>
    <Circle cx="12" cy="12" r="9" />
    <Circle cx="12" cy="12" r="2.6" />
  </Icon>
);

export const WholenoteIcon = (p: IconProps) => (
  <Icon {...p}>
    <Ellipse cx="12" cy="12" rx="9.5" ry="6.4" />
    <Ellipse cx="12" cy="12" rx="2.4" ry="4.8" transform="rotate(-38 12 12)" />
  </Icon>
);

export const ProfileIcon = (p: IconProps) => (
  <Icon {...p} strokeLinecap="round">
    <Circle cx="12" cy="8.5" r="3.6" />
    <Path d="M5 19.5c1.5-3.2 4-4.8 7-4.8s5.5 1.6 7 4.8" />
  </Icon>
);

/** The floating tab pill plus the "Write a review" button, rendered as the Tabs `tabBar`. */
export function Navbar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={tw`absolute left-[14px] right-[14px] bottom-[${BOTTOM}px] flex-row items-center gap-[10px]`}>
      <View
        role="tablist"
        style={[
          tw`flex-1 h-[${HEIGHT}px] px-1 rounded-full bg-[#FAFAFA] flex-row items-center justify-around`,
          { boxShadow: "0 16px 30px -16px rgba(0,0,0,0.35)" },
        ]}
      >
        {state.routes.map((route, i) => {
          const { options } = descriptors[route.key];
          const focused = state.index === i;
          const color = focused ? "#111" : "#7A7A7A";
          return (
            <Pressable
              key={route.key}
              role="tab"
              aria-selected={focused}
              onPress={() => navigation.navigate(route.name, route.params)}
              style={tw`min-w-[62px] min-h-[48px] items-center justify-center gap-[3px]`}
            >
              {options.tabBarIcon?.({ focused, color, size: 22 })}
              <Text style={{ color, fontSize: 11, fontFamily: focused ? "InstrumentSans_600SemiBold" : "InstrumentSans_500Medium" }}>
                {options.title}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Pressable
        role="button"
        aria-label="Write a review"
        onPress={() => router.push("/write")}
        style={[
          tw`w-[60px] h-[60px] rounded-full bg-[#1d1d1d] items-center justify-center`,
          { boxShadow: "0 16px 28px -12px rgba(0,0,0,0.6)" },
        ]}
      >
        <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="#EEEEEE" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M4 20h4L19 9l-4-4L4 16z" />
          <Path d="M13.5 6.5l4 4" />
        </Svg>
      </Pressable>
    </View>
  );
}

/** An empty tab: just its title, padded so later content clears the floating bar. */
export function TabPlaceholder({ title }: { title: string }) {
  return (
    <View style={[tw`flex-1 bg-[#EEEEEE] px-5 pt-4`, { paddingBottom: NAVBAR_CLEARANCE }]}>
      <Text style={tw`another-heading2 text-black`}>{title}</Text>
    </View>
  );
}
