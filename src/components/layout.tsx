import { useSession } from "next-auth/react";
import { useContext } from "react";
import { ThemeContext } from "../hooks/themeContext";
import { trpc } from "../utils/trpc";
import { CommandMenu } from "./CommandK";
import { Navbar } from "./Navbar";
import { darkTheme } from "../stitches.config";
import { Box } from "./design-system/Box";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { theme, setTheme } = useContext(ThemeContext);
  const updateMutation = trpc.useMutation(["user.update_theme"]);
  const { data } = useSession();

  const darkModeChange = () => {
    setTheme(theme === "theme-default" ? darkTheme : "theme-default");
  };

  return (
    <>
      <Box
        css={{ bc: "$loContrast", height: "100%" }}
        className={`h-screen w-screen`}
      >
        <div
          className={`container mx-auto flex flex-col sm:flex-row sm:gap-5 min-h-screen  max-w-3xl`}
        >
          <Navbar onThemeChange={darkModeChange} />
          <CommandMenu />
          <div className=" w-full sm:pt-20 px-5">{children}</div>
        </div>
      </Box>
    </>
  );
}
