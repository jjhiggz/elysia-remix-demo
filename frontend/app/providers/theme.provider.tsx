import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";
export const validThemes = [
  "bumblebee",
  "light",
  "dark",
  "cupcake",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "synthwave",
  "cupcake",
] as const;

type Theme = (typeof validThemes)[number];

type TThemeContext = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<TThemeContext | null>(null);

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("acid");

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === null)
    throw new Error(
      "Please use `useTheme` hook within the context of a `ThemeContextProvider`"
    );
  return context;
};
