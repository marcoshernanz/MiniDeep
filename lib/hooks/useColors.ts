import { useColorScheme } from "./useColorScheme";

const hslToColor = (h: number, s: number, l: number) => `hsl(${h} ${s}% ${l}%)`;

const colors = {
  light: {
    background: hslToColor(0, 0, 100),
    foreground: hslToColor(240, 10, 3.9),
    card: hslToColor(0, 0, 100),
    cardForeground: hslToColor(240, 10, 3.9),
    popover: hslToColor(0, 0, 100),
    popoverForeground: hslToColor(240, 10, 3.9),
    primary: hslToColor(240, 5.9, 10),
    primaryForeground: hslToColor(0, 0, 98),
    secondary: hslToColor(240, 4.8, 95.9),
    secondaryForeground: hslToColor(240, 5.9, 10),
    muted: hslToColor(240, 4.8, 95.9),
    mutedForeground: hslToColor(240, 3.8, 46.1),
    accent: hslToColor(240, 4.8, 95.9),
    accentForeground: hslToColor(240, 5.9, 10),
    destructive: hslToColor(0, 84.2, 60.2),
    destructiveForeground: hslToColor(0, 0, 98),
    border: hslToColor(240, 5.9, 90),
    input: hslToColor(240, 5.9, 90),
    ring: hslToColor(240, 5.9, 10),
  },
  dark: {
    background: hslToColor(240, 10, 3.9),
    foreground: hslToColor(0, 0, 98),
    card: hslToColor(240, 10, 3.9),
    cardForeground: hslToColor(0, 0, 98),
    popover: hslToColor(240, 10, 3.9),
    popoverForeground: hslToColor(0, 0, 98),
    primary: hslToColor(0, 0, 98),
    primaryForeground: hslToColor(240, 5.9, 10),
    secondary: hslToColor(240, 3.7, 15.9),
    secondaryForeground: hslToColor(0, 0, 98),
    muted: hslToColor(240, 3.7, 15.9),
    mutedForeground: hslToColor(240, 5, 64.9),
    accent: hslToColor(240, 3.7, 15.9),
    accentForeground: hslToColor(0, 0, 98),
    destructive: hslToColor(0, 72, 51),
    destructiveForeground: hslToColor(0, 0, 98),
    border: hslToColor(240, 3.7, 15.9),
    input: hslToColor(240, 3.7, 15.9),
    ring: hslToColor(240, 4.9, 83.9),
  },
};

export default function useColors() {
  const { isDarkColorScheme } = useColorScheme();
  return isDarkColorScheme ? colors.dark : colors.light;
}
