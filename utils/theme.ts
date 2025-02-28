import { ColorSchemeName } from "react-native";

export type Theme = "light" | "dark" | "system";

export interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  success: string;
  successForeground: string;
  border: string;
  input: string;
  ring: string;
}

export const lightColors: ThemeColors = {
  background: "rgb(255, 255, 255)", // --background
  foreground: "rgb(2, 8, 23)", // --foreground
  primary: "rgb(234, 88, 12)", // --primary
  primaryForeground: "rgb(248, 250, 252)", // --primary-foreground
  secondary: "rgb(241, 245, 249)", // --secondary
  secondaryForeground: "rgb(15, 23, 42)", // --secondary-foreground
  muted: "rgb(241, 245, 249)", // --muted
  mutedForeground: "rgb(100, 116, 139)", // --muted-foreground
  accent: "rgb(241, 245, 249)", // --accent
  accentForeground: "rgb(15, 23, 42)", // --accent-foreground
  destructive: "rgb(239, 68, 68)", // --destructive
  destructiveForeground: "rgb(248, 250, 252)", // --destructive-foreground
  success: "rgb(34, 197, 94)", // --success
  successForeground: "rgb(248, 250, 252)", // --success-foreground
  border: "rgb(226, 232, 240)", // --border
  input: "rgb(226, 232, 240)", // --input
  ring: "rgb(234, 88, 12)", // --ring
};

export const darkColors: ThemeColors = {
  background: "rgb(2, 8, 23)", // --background
  foreground: "rgb(248, 250, 252)", // --foreground
  primary: "rgb(249, 115, 22)", // --primary
  primaryForeground: "rgb(15, 23, 42)", // --primary-foreground
  secondary: "rgb(30, 41, 59)", // --secondary
  secondaryForeground: "rgb(248, 250, 252)", // --secondary-foreground
  muted: "rgb(30, 41, 59)", // --muted
  mutedForeground: "rgb(148, 163, 184)", // --muted-foreground
  accent: "rgb(30, 41, 59)", // --accent
  accentForeground: "rgb(248, 250, 252)", // --accent-foreground
  destructive: "rgb(127, 29, 29)", // --destructive
  destructiveForeground: "rgb(248, 250, 252)", // --destructive-foreground
  success: "rgb(20, 83, 45)", // --success
  successForeground: "rgb(248, 250, 252)", // --success-foreground
  border: "rgb(30, 41, 59)", // --border
  input: "rgb(30, 41, 59)", // --input
  ring: "rgb(194, 65, 12)", // --ring
};

export function getThemeColors(
  theme: Theme,
  systemColorScheme: ColorSchemeName
): ThemeColors {
  if (theme === "system") {
    return systemColorScheme === "dark" ? darkColors : lightColors;
  }
  return theme === "dark" ? darkColors : lightColors;
}
