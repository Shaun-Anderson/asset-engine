import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { styled, keyframes } from "@stitches/react";
import { violet, mauve } from "@radix-ui/colors";

const slideUpAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(2px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const slideRightAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateX(-2px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
});

const slideDownAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateY(-2px)" },
  "100%": { opacity: 1, transform: "translateY(0)" },
});

const slideLeftAndFade = keyframes({
  "0%": { opacity: 0, transform: "translateX(2px)" },
  "100%": { opacity: 1, transform: "translateX(0)" },
});

const contentStyles = {
  minWidth: 220,
  backgroundColor: "white",
  borderRadius: 6,
  padding: 5,
  boxShadow:
    "0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)",
  animationDuration: "400ms",
  animationTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
  willChange: "transform, opacity",
  '&[data-state="open"]': {
    '&[data-side="top"]': { animationName: slideDownAndFade },
    '&[data-side="right"]': { animationName: slideLeftAndFade },
    '&[data-side="bottom"]': { animationName: slideUpAndFade },
    '&[data-side="left"]': { animationName: slideRightAndFade },
  },
};

const DropdownMenuContent = styled(DropdownMenu.Content, contentStyles);
const DropdownMenuSubContent = styled(DropdownMenu.SubContent, contentStyles);

const DropdownMenuArrow = styled(DropdownMenu.Arrow, { fill: "white" });

const itemStyles = {
  all: "unset",
  fontSize: 13,
  lineHeight: 1,
  color: violet.violet11,
  borderRadius: 3,
  display: "flex",
  alignItems: "center",
  height: 25,
  padding: "$1 $2",
  position: "relative",
  paddingLeft: 25,
  userSelect: "none",

  "&[data-disabled]": {
    color: mauve.mauve8,
    pointerEvents: "none",
  },

  "&[data-highlighted]": {
    backgroundColor: violet.violet9,
    color: violet.violet1,
  },

  variants: {
    color: {
      red: {
        color: "$red11",
        "&:focus": {
          boxShadow: "inset 0 0 0 1px $colors$red8, 0 0 0 1px $colors$red8",
        },
        "&[data-highlighted]": {
          backgroundColor: "$red9",
          color: "$red1",
        },
      },
    },
  },
};

const DropdownMenuItem = styled(DropdownMenu.Item, itemStyles);
const DropdownMenuCheckboxItem = styled(DropdownMenu.CheckboxItem, itemStyles);
const DropdownMenuRadioItem = styled(DropdownMenu.RadioItem, itemStyles);
const DropdownMenuSubTrigger = styled(DropdownMenu.SubTrigger, {
  '&[data-state="open"]': {
    backgroundColor: violet.violet4,
    color: violet.violet11,
  },
  ...itemStyles,
});

const DropdownMenuLabel = styled(DropdownMenu.Label, {
  paddingLeft: 25,
  fontSize: 12,
  lineHeight: "25px",
  color: mauve.mauve11,
});

const DropdownMenuSeparator = styled(DropdownMenu.Separator, {
  height: 1,
  backgroundColor: violet.violet6,
  margin: 5,
});

const DropdownMenuItemIndicator = styled(DropdownMenu.ItemIndicator, {
  position: "absolute",
  left: 0,
  width: 25,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
});

const RightSlot = styled("div", {
  marginLeft: "auto",
  paddingLeft: 20,
  color: mauve.mauve11,
  "[data-highlighted] > &": { color: "white" },
  "[data-disabled] &": { color: mauve.mauve8 },
});

export {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  RightSlot,
  DropdownMenuSubTrigger,
  DropdownMenuItemIndicator,
  DropdownMenuSeparator,
  DropdownMenuSubContent,
  DropdownMenuLabel,
};
