import {
  IconActivity,
  IconAlarm,
  IconArrowBack,
  IconArrowLeft,
  IconChefHat,
  IconClock,
  IconDashboard,
  IconFile,
  IconHome,
  IconMenu,
  IconMoon,
  IconPlug,
  IconSettings,
  IconSun,
  IconUsers,
} from "@tabler/icons";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import dynamic from "next/dynamic";
import useDarkMode from "../hooks/useDarkMode";
import { ReactNode, useContext, useState } from "react";
import { ThemeContext } from "../hooks/themeContext";
import {
  AppBar,
  DropdownMenuItem,
  Flex,
  IconButton,
  Sheet,
  SheetContent,
  Link as TestLink,
  SheetTrigger,
} from "./design-system";
import { Button } from "./Button";

interface NavBarLinkProps {
  icon: ReactNode;
  href: string;
  preSelected: boolean;
}
const NavBarLink = (props: NavBarLinkProps) => {
  const { icon, href, preSelected } = props;
  return (
    <Link href={href}>
      <a
        className={`rounded-md text-sm font-medium w-10 h-10 flex justify-center items-center hover:scale-105 ${
          preSelected
            ? "bg-neutral-800 text-white"
            : "text-gray-500 hover:text-gray-800 hover:dark:text-gray-400"
        }`}
      >
        {icon}
      </a>
    </Link>
  );
};

export const Navbar = ({ onThemeChange }: { onThemeChange: () => void }) => {
  const { data } = useSession();
  const { theme } = useContext(ThemeContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const router = useRouter();
  const TimerDynamic = dynamic(() => import("./Timer"), {
    ssr: false,
  });

  return (
    <>
      <nav className=" sm:hidden flex sticky top-0 w-full">
        <AppBar glass css={{ p: "$2" }}>
          <Flex gap={2}>
            <Sheet>
              <SheetTrigger asChild>
                <IconButton>
                  <IconMenu />
                </IconButton>
              </SheetTrigger>
              <SheetContent side="left" css={{ pt: "$6" }}>
                <NavBarLink
                  icon={<IconDashboard strokeWidth={1} size={24} />}
                  href={"/"}
                  preSelected={router.asPath === "/"}
                />
                <NavBarLink
                  icon={<IconUsers strokeWidth={1} size={24} />}
                  href={"/clients"}
                  preSelected={router.asPath.includes("/clients")}
                />
                <NavBarLink
                  icon={<IconFile strokeWidth={1} size={24} />}
                  href={"/invoices"}
                  preSelected={router.asPath.includes("/invoices")}
                />
                <NavBarLink
                  icon={<IconAlarm strokeWidth={1} size={24} />}
                  href={"/worklog"}
                  preSelected={router.asPath.includes("/worklog")}
                />
              </SheetContent>
            </Sheet>
            {router.asPath.split("/").length > 2 && (
              <IconButton onClick={() => router.back()}>
                <IconArrowLeft />
              </IconButton>
            )}
          </Flex>
        </AppBar>
      </nav>
      <AppBar glass>
        <Flex direction="column">
          <TestLink>
            <Flex align={"center"} gap={2}>
              <IconPlug size={18} />
              Servers
            </Flex>
          </TestLink>
        </Flex>
      </AppBar>
      <nav className="hidden sm:block  bg-transparent px-4 max-h-screen sticky top-0 py-10 z-20">
        <div className="flex flex-col items-center h-full">
          {router.asPath.split("/").length > 2 && (
            <IconButton
              onClick={() => router.back()}
              css={{ position: "absolute" }}
            >
              <IconArrowLeft />
            </IconButton>
          )}
          <ul className="flex flex-col space-y-2 my-auto">
            <NavBarLink
              icon={<IconDashboard strokeWidth={1} size={24} />}
              href={"/"}
              preSelected={router.asPath === "/"}
            />
            <NavBarLink
              icon={<IconUsers strokeWidth={1} size={24} />}
              href={"/clients"}
              preSelected={router.asPath.includes("/clients")}
            />
            <NavBarLink
              icon={<IconFile strokeWidth={1} size={24} />}
              href={"/invoices"}
              preSelected={router.asPath.includes("/invoices")}
            />
            <NavBarLink
              icon={<IconAlarm strokeWidth={1} size={24} />}
              href={"/worklog"}
              preSelected={router.asPath.includes("/worklog")}
            />
          </ul>
          {/* <TimerDynamic /> */}

          <ul className="flex flex-col space-y-4 items-center">
            <button
              onClick={onThemeChange}
              className={`rounded-md text-sm font-medium w-10 h-10 flex justify-center items-center hover:scale-105 dark:text-white`}
            >
              {theme == "dark-theme" ? (
                <IconMoon strokeWidth={1} size={18} />
              ) : (
                <IconSun strokeWidth={1} size={18} />
              )}
            </button>
            {/* <NavBarLink
            icon={<IconSettings strokeWidth={1} size={18} />}
            href={"/settings"}
            preSelected={router.asPath.includes("/settings")}
          /> */}
            <Link href="/profile">
              <button
                type="button"
                className="bg-gray-80  flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                id="user-menu-button"
                aria-expanded="false"
                aria-haspopup="true"
              >
                <span className="sr-only">Open user menu</span>
                {data?.user?.image ? (
                  <img
                    className="w-8 h-8 rounded-full"
                    src={data.user.image}
                    alt=""
                  />
                ) : (
                  ""
                )}
              </button>
            </Link>
          </ul>
        </div>
      </nav>
    </>
  );
};
