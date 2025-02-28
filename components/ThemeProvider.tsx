import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

type Theme = "dark" | "light";

type ThemeProviderProps = {
  children: React.ReactNode;
  value?: Theme;
};

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeContextType = {
  theme: "light",
  setTheme: () => null,
};

const ThemeContext = createContext<ThemeContextType>(initialState);

export function ThemeProvider({
  children,
  value = "light",
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(value);
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (value === "system") {
      setTheme(colorScheme === "dark" ? "dark" : "light");
    }
  }, [colorScheme, value]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
