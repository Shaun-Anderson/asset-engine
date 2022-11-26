import React, { ReactNode } from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { styled } from "@stitches/react";
import { violet, mauve, blackA } from "@radix-ui/colors";
import { IconCheck, IconChevronDown, IconChevronUp } from "@tabler/icons";
import { useController, UseControllerProps } from "react-hook-form";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { ErrorMessage } from "../form/TextField";

interface SelectProps extends UseControllerProps<FormValues> {
  children: ReactNode;
  placeholder: string;
}

const Select = React.forwardRef(
  ({ children, ...props }: SelectProps, forwardedRef) => {
    const {
      field: { value, onChange },
      fieldState: { error },
    } = useController(props);

    return (
      <SelectPrimitive.Root
        {...props}
        value={value}
        onValueChange={(e) => onChange(e)}
      >
        <SelectTrigger ref={forwardedRef} className={`${error && "invalid"}`}>
          <SelectPrimitive.Value placeholder={props.placeholder} />
          <SelectIcon>
            <IconChevronDown />
          </SelectIcon>
        </SelectTrigger>
        <SelectPrimitive.Portal>
          <SelectContent>
            <SelectScrollUpButton>
              <IconChevronUp />
            </SelectScrollUpButton>
            <SelectViewport>{children}</SelectViewport>
            <SelectScrollDownButton>
              <IconChevronDown />
            </SelectScrollDownButton>
          </SelectContent>
        </SelectPrimitive.Portal>
        {error && <ErrorMessage>{error.message}</ErrorMessage>}
      </SelectPrimitive.Root>
    );
  }
);

Select.displayName = "Select";

const SelectTrigger = styled(SelectPrimitive.SelectTrigger, {
  all: "unset",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderRadius: "$2",
  boxSizing: "border-box",
  padding: "$2 $3",
  fontSize: 13,
  lineHeight: 1,
  // height: 35,
  gap: 5,
  width: "100%",
  // backgroundColor: "white",
  color: "$hiContrast",
  border: "1px",
  boxShadow: "inset 0 0 0 1px $colors$slate7",
  "&:hover": { backgroundColor: mauve.mauve3 },
  "&.invalid": { boxShadow: "inset 0 0 0 1px $colors$red7" },
  "&:focus": {
    boxShadow: `0 0 0 2px black`,
    [`.dark-theme &`]: {
      boxShadow: "0 0 0 2px white",
    },
  },
  "&[data-placeholder]": { color: "$hiContrast" },
  [`.dark-theme &`]: {
    "&:hover": { backgroundColor: "$grayA2" },
  },
});

const SelectIcon = styled(SelectPrimitive.SelectIcon, {
  color: "$hiContrast",
  "& svg": {
    height: "$3",
  },
});

const SelectContent = styled(SelectPrimitive.Content, {
  overflow: "hidden",
  backgroundColor: "white",
  [`.dark-theme &`]: {
    backgroundColor: "$gray2",
  },
  borderRadius: 6,
  boxShadow:
    "0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)",
});

const SelectViewport = styled(SelectPrimitive.Viewport, {
  padding: 5,
});

const SelectItem = React.forwardRef(({ children, ...props }, forwardedRef) => {
  return (
    <StyledItem {...props} ref={forwardedRef}>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
      <StyledItemIndicator>
        <IconCheck />
      </StyledItemIndicator>
    </StyledItem>
  );
});

SelectItem.displayName = "SelectItem";

const StyledItem = styled(SelectPrimitive.Item, {
  fontSize: 13,
  lineHeight: 1,
  color: "$hiContrast",
  borderRadius: "$2",
  display: "flex",
  alignItems: "center",
  height: "fit-content",
  // padding: "$1",
  padding: "$1 35px $1 25px",
  position: "relative",
  userSelect: "none",

  '&[data-state="checked"]': {
    backgroundColor: "$gray2",
    [`.dark-theme &`]: {
      backgroundColor: "$gray2",
    },
  },

  "&[data-disabled]": {
    color: mauve.mauve8,
    pointerEvents: "none",
  },

  "&[data-highlighted]": {
    outline: "none",
    backgroundColor: "$gray12",
    [`.dark-theme &`]: {
      backgroundColor: "$gray3",
    },
    color: "white",
  },
});

const SelectLabel = styled(SelectPrimitive.Label, {
  padding: "0 25px",
  fontSize: 12,
  lineHeight: "25px",
  color: mauve.mauve11,
});

const SelectSeparator = styled(SelectPrimitive.Separator, {
  height: 1,
  backgroundColor: violet.violet6,
  margin: 5,
});

const StyledItemIndicator = styled(SelectPrimitive.ItemIndicator, {
  position: "absolute",
  left: 0,
  width: 25,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  "& svg": {
    height: "$3",
  },
});

const scrollButtonStyles = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 25,
  backgroundColor: "white",
  color: violet.violet11,
  cursor: "default",
};

const SelectScrollUpButton = styled(
  SelectPrimitive.ScrollUpButton,
  scrollButtonStyles
);

const SelectScrollDownButton = styled(
  SelectPrimitive.ScrollDownButton,
  scrollButtonStyles
);

export {
  Select,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectLabel,
  StyledItem,
  SelectItem,
  SelectViewport,
  SelectTrigger,
  SelectIcon,
  SelectContent,
};
