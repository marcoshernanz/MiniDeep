import { useColorScheme as useNativewindColorScheme } from "nativewind";
import { useEffect } from "react";

export function useColorScheme() {
  const { setColorScheme } = useNativewindColorScheme();
  useEffect(() => {
    setColorScheme("dark");
  }, [setColorScheme]);

  return {
    colorScheme: "dark" as const,
    isDarkColorScheme: true,
    setColorScheme: (_: "light" | "dark") => {},
    toggleColorScheme: () => {},
  };
}
