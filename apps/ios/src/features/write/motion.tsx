import { useEffect, type ReactNode } from "react";
import { AccessibilityInfo, Animated, Easing, useAnimatedValue } from "react-native";

// Read when an animation starts, so no component re-renders on the setting.
let reduceMotion = false;
void AccessibilityInfo.isReduceMotionEnabled().then((on) => (reduceMotion = on));
AccessibilityInfo.addEventListener("reduceMotionChanged", (on) => (reduceMotion = on));
export const ms = (duration: number) => (reduceMotion ? 0 : duration);
export const EASE_OUT = Easing.bezier(0.2, 0.8, 0.2, 1);
export const EASE_IN = Easing.bezier(0.4, 0, 1, 1);

/** Fades and lifts its child in on mount, `delay` ms late. */
export function Rise({ delay, style, children }: { delay: number; style?: object; children: ReactNode }) {
  const t = useAnimatedValue(0);
  useEffect(() => {
    Animated.timing(t, { toValue: 1, duration: ms(300), delay: ms(delay), easing: EASE_OUT, useNativeDriver: true }).start();
  }, [t, delay]);
  const lift = t.interpolate({ inputRange: [0, 1], outputRange: [10, 0] });
  return <Animated.View style={[style, { opacity: t, transform: [{ translateY: lift }] }]}>{children}</Animated.View>;
}

/** Grows its child in on mount, `delay` ms late. */
export function Pop({ delay = 0, style, children }: { delay?: number; style?: object; children: ReactNode }) {
  const t = useAnimatedValue(0);
  useEffect(() => {
    Animated.timing(t, { toValue: 1, duration: ms(240), delay: ms(delay), easing: EASE_OUT, useNativeDriver: true }).start();
  }, [t, delay]);
  const scale = t.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });
  return <Animated.View style={[style, { opacity: t, transform: [{ scale }] }]}>{children}</Animated.View>;
}

/** The rating stamp's arrival: pops past full size and settles. Remount (a new key) to replay. */
export function Pulse({ children }: { children: ReactNode }) {
  const t = useAnimatedValue(0);
  useEffect(() => {
    Animated.timing(t, { toValue: 1, duration: ms(420), easing: EASE_OUT, useNativeDriver: true }).start();
  }, [t]);
  const scale = t.interpolate({ inputRange: [0, 0.55, 1], outputRange: [0.6, 1.14, 1] });
  const opacity = t.interpolate({ inputRange: [0, 0.55, 1], outputRange: [0, 1, 1] });
  return <Animated.View style={{ opacity, transform: [{ scale }] }}>{children}</Animated.View>;
}
