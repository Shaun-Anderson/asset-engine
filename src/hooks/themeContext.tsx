import { useSession } from "next-auth/react";
import React, { createContext, PropsWithChildren, useEffect } from "react";
import { darkTheme } from "../stitches.config";

export const ThemeContext = createContext({
  theme: "theme-default",
  setTheme: (theme: string) => {},
});

export const ThemeProvider = (props: PropsWithChildren) => {
  const { data } = useSession();
  const [theme, setTheme] = React.useState("theme-default");

  useEffect(() => {
    document.body.classList.remove("theme-default", darkTheme);
    document.body.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
};
