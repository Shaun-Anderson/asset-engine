import { ReactNode, FC } from "react";
import * as BaseLink from "next/link";
import { Accent } from "../utils/color";
interface ButtonProps extends Omit<React.HTMLProps<HTMLAnchorElement>, "size"> {
  leading?: ReactNode;
  rounded?: "xs" | "sm" | "md" | "lg" | "xl" | "full";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  roundedSide?: "left" | "right" | "all";
  variant?: "base" | "outlined" | "light";
  loading?: boolean;
  accent?: Accent;
}

export const Link = (props: React.PropsWithChildren<ButtonProps>) => {
  const getRounding = () => {
    switch (props.roundedSide) {
      case "all":
        return `rounded-${props.rounded}`;
      case "left":
        return `rounded-l-${props.rounded}`;
      case "right":
        return `rounded-r-${props.rounded}`;
    }
  };

  const getSize = () => {
    switch (props.size) {
      case "sm":
        return "px-2 py-1 text-xs";
      case "md":
        return "px-4 py-2";
    }
  };
  const borderProps = (): string =>
    props.variant == "outlined"
      ? "bg-transparent border border-gray-300"
      : "border ";

  const getColor = () => {
    switch (props.accent) {
      case Accent.default:
        return "bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-300 hover:dark:bg-gray-100/10 dark:bg-gray-100/5 dark:border-zinc-600 dark:text-white";
      case Accent.success:
        return "bg-emerald-100 hover:bg-emerald-200 text-emerald-500 border-emerald-300 dark:bg-emerald-100/5 dark:hover:bg-emerald-100/10 focus:border-emerald-500 focus:ring-emerald-500";
      case Accent.warning:
        return "bg-amber-100 hover:bg-amber-200 text-amber-500 border-amber-300 ";
    }
  };
  return (
    <BaseLink href={props.href}>
      <a
        className={`relative whitespace-nowrap -ml-px ${getColor()} inline-flex gap-1 items-center ${getRounding()} space-x-2  ${getSize()} ${borderProps()}  font-medium    focus:outline-none focus:ring-1 `}
      >
        {props.leading}
        {props.children}
      </a>
    </BaseLink>
  );
};

Link.defaultProps = {
  rl: "md",
  rr: "md",
  size: "md",
  variant: "outlined",
  roundedSide: "all",
  rounded: "lg",
  accent: Accent.default,
};
