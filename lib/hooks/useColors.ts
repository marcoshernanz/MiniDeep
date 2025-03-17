import { useColorScheme } from "./useColorScheme";

const rgbToColor = (r: number, g: number, b: number) => `rgb(${r}, ${g}, ${b})`;

const colors = {
  light: {
    background: rgbToColor(255, 255, 255),
    foreground: rgbToColor(2, 8, 23),
    card: rgbToColor(255, 255, 255),
    cardForeground: rgbToColor(2, 8, 23),
    popover: rgbToColor(255, 255, 255),
    popoverForeground: rgbToColor(2, 8, 23),
    primary: rgbToColor(234, 88, 12),
    primaryForeground: rgbToColor(248, 250, 252),
    secondary: rgbToColor(241, 245, 249),
    secondaryForeground: rgbToColor(15, 23, 42),
    muted: rgbToColor(241, 245, 249),
    mutedForeground: rgbToColor(100, 116, 139),
    accent: rgbToColor(241, 245, 249),
    accentForeground: rgbToColor(15, 23, 42),
    destructive: rgbToColor(239, 68, 68),
    destructiveForeground: rgbToColor(248, 250, 252),
    success: rgbToColor(34, 197, 94),
    successForeground: rgbToColor(248, 250, 252),
    link: rgbToColor(37, 99, 235),
    border: rgbToColor(226, 232, 240),
    input: rgbToColor(226, 232, 240),
    ring: rgbToColor(234, 88, 12),
  },
  dark: {
    background: rgbToColor(2, 8, 23),
    foreground: rgbToColor(248, 250, 252),
    card: rgbToColor(2, 8, 23),
    cardForeground: rgbToColor(248, 250, 252),
    popover: rgbToColor(2, 8, 23),
    popoverForeground: rgbToColor(248, 250, 252),
    primary: rgbToColor(249, 115, 22),
    primaryForeground: rgbToColor(15, 23, 42),
    secondary: rgbToColor(30, 41, 59),
    secondaryForeground: rgbToColor(248, 250, 252),
    muted: rgbToColor(30, 41, 59),
    mutedForeground: rgbToColor(148, 163, 184),
    accent: rgbToColor(30, 41, 59),
    accentForeground: rgbToColor(248, 250, 252),
    destructive: rgbToColor(127, 29, 29),
    destructiveForeground: rgbToColor(248, 250, 252),
    success: rgbToColor(20, 83, 45),
    successForeground: rgbToColor(248, 250, 252),
    link: rgbToColor(59, 130, 246),
    border: rgbToColor(30, 41, 59),
    input: rgbToColor(30, 41, 59),
    ring: rgbToColor(194, 65, 12),
  },
};

export default function useColors() {
  const { isDarkColorScheme } = useColorScheme();
  return isDarkColorScheme ? colors.dark : colors.light;
}
