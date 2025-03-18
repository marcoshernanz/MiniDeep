import { useColorScheme } from "./hooks/useColorScheme";

const rgbToColor = (r: number, g: number, b: number) => `rgb(${r}, ${g}, ${b})`;
const rgbaToColor = (r: number, g: number, b: number, a: number) =>
  `rgba(${r}, ${g}, ${b}, ${a})`;

const colors = {
  light: {
    background: [255, 255, 255],
    foreground: [2, 8, 23],
    card: [255, 255, 255],
    cardForeground: [2, 8, 23],
    popover: [255, 255, 255],
    popoverForeground: [2, 8, 23],
    primary: [234, 88, 12],
    primaryForeground: [248, 250, 252],
    secondary: [241, 245, 249],
    secondaryForeground: [15, 23, 42],
    muted: [241, 245, 249],
    mutedForeground: [100, 116, 139],
    accent: [241, 245, 249],
    accentForeground: [15, 23, 42],
    destructive: [239, 68, 68],
    destructiveForeground: [248, 250, 252],
    success: [34, 197, 94],
    successForeground: [248, 250, 252],
    link: [37, 99, 235],
    border: [226, 232, 240],
    input: [226, 232, 240],
    ring: [234, 88, 12],
  },
  dark: {
    background: [2, 8, 23],
    foreground: [248, 250, 252],
    card: [2, 8, 23],
    cardForeground: [248, 250, 252],
    popover: [2, 8, 23],
    popoverForeground: [248, 250, 252],
    primary: [249, 115, 22],
    primaryForeground: [15, 23, 42],
    secondary: [30, 41, 59],
    secondaryForeground: [248, 250, 252],
    muted: [30, 41, 59],
    mutedForeground: [148, 163, 184],
    accent: [30, 41, 59],
    accentForeground: [248, 250, 252],
    destructive: [127, 29, 29],
    destructiveForeground: [248, 250, 252],
    success: [20, 83, 45],
    successForeground: [248, 250, 252],
    link: [59, 130, 246],
    border: [30, 41, 59],
    input: [30, 41, 59],
    ring: [194, 65, 12],
  },
} as const;

export type ColorName = keyof typeof colors.light;

export default function getColor(
  colorName: ColorName,
  opacity?: number,
): string {
  const { isDarkColorScheme } = useColorScheme();
  const colorScheme = isDarkColorScheme ? colors.dark : colors.light;
  const [r, g, b] = colorScheme[colorName];

  if (opacity !== undefined) {
    return rgbaToColor(r, g, b, opacity);
  }

  return rgbToColor(r, g, b);
}
