import { HTMLProps, ReactNode } from "react";
import {
  DeepMap,
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
  UseControllerProps,
  UseFormRegister,
  useController,
} from "react-hook-form";
import * as Label from "@radix-ui/react-label";
import { styled } from "../../stitches.config";
import { Flex } from "../design-system";

interface TextfieldProps<TFormValues extends FieldValues>
  extends Omit<HTMLProps<HTMLInputElement>, "ref" | "name" | "defaultValue">,
    UseControllerProps<TFormValues> {
  // rules?: RegisterOptions;
  // errors?: Partial<DeepMap<TFormValues, FieldError>>;
  // register?: UseFormRegister<TFormValues>;
  label?: string;
  className?: string;
  leading?: ReactNode;
  variant?: "default" | "ghost";
}

export const TextField = <TFormValues extends object>(
  props: TextfieldProps<TFormValues>
): JSX.Element => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController(props);
  return (
    <Wrapper colSpan={props.colSpan}>
      {props.label && <LabelRoot htmlFor={props.name}>{props.label}</LabelRoot>}
      <div className="relative">
        {props.leading && (
          <LeadingArea
            className="absolute left-0 top-0 bottom-0"
            size={props.size}
          >
            {props.leading}
          </LeadingArea>
        )}
        <TextFieldBase
          id={props.name}
          type={props.type}
          className={`${props.className} ${props.leading && "leading-icon"}`}
          state={error && "invalid"}
          value={value}
          onChange={(event) => {
            // if (props.onChange) props.onChange(event);
            if (props.type === "number") {
              const v =
                event.target.value === ""
                  ? undefined
                  : event.target.valueAsNumber;
              onChange(v);
            } else {
              onChange(event.target.value);
            }
          }}
          defaultValue={props.defaultValue as string}
          // {...(register && register(name as Path<TFormValues>, rules))}
          // {...props}
        />
      </div>
      {error && <ErrorMessage>{error.message}</ErrorMessage>}
    </Wrapper>
  );
};

const LeadingArea = styled("div", {
  position: "absolute",
  left: "$2",
  top: 0,
  bottom: 0,
  display: "flex",
  alignItems: "center",

  variants: {
    size: {
      "1": {
        "& svg": {
          height: "$2",
        },
      },
      "2": {
        "& svg": {
          height: "$3",
        },
      },
      "3": {
        "& svg": {
          height: "$4",
        },
      },
    },
  },
  defaultVariants: {
    size: "2",
  },
});
const Wrapper = styled("div", {
  width: "100%",
  variants: {
    colSpan: {
      "1": {
        gridColumn: "span 1 / span 1",
      },
      "2": {
        gridColumn: "span 2 / span 2",
      },
      "3": {
        gridColumn: "span 3 / span 3",
      },
      "4": {
        gridColumn: "span 4 / span 4",
      },
      "6": {
        gridColumn: "span 6 / span 6",
      },
      "12": {
        gridColumn: "span 12 / span 12",
      },
    },
  },
});
const LabelRoot = styled(Label.Root, {
  fontSize: 15,
  fontWeight: 500,
  lineHeight: "35px",
  color: "$hiContrast",
  userSelect: "none",
});

export const ErrorMessage = styled("p", {
  color: "$red11",
  fontSize: "$1",
  marginTop: "$1",
});

const TextFieldBase = styled("input", {
  // Reset
  appearance: "none",
  borderWidth: "0",
  boxSizing: "border-box",
  fontFamily: "inherit",
  margin: "0",
  outline: "none",
  padding: "0",
  width: "100%",
  WebkitTapHighlightColor: "rgba(0,0,0,0)",
  "&::before": {
    boxSizing: "border-box",
  },
  "&::after": {
    boxSizing: "border-box",
  },

  // Custom
  backgroundColor: "$loContrast",
  boxShadow: "inset 0 0 0 1px $colors$slate7",
  color: "$hiContrast",
  fontVariantNumeric: "tabular-nums",

  "&:-webkit-autofill": {
    boxShadow:
      "inset 0 0 0 1px $colors$amber6, inset 0 0 0 100px $colors$amber3",
  },

  "&:-webkit-autofill::first-line": {
    fontFamily: "$untitled",
    color: "$hiContrast",
  },

  "&:focus": {
    boxShadow:
      "inset 0px 0px 0px 1px $colors$amber8, 0px 0px 0px 1px $colors$amber8",
    "&:-webkit-autofill": {
      boxShadow:
        "inset 0px 0px 0px 1px $colors$blue8, 0px 0px 0px 1px $colors$amber8, inset 0 0 0 100px $colors$amber3",
    },
  },
  "&::placeholder": {
    color: "$slate9",
  },
  "&:disabled": {
    pointerEvents: "none",
    backgroundColor: "$slate2",
    color: "$slate8",
    cursor: "not-allowed",
    "&::placeholder": {
      color: "$slate7",
    },
  },
  "&:read-only": {
    backgroundColor: "$slate2",
    "&:focus": {
      boxShadow: "inset 0px 0px 0px 1px $colors$slate7",
    },
  },
  "&.leading-icon": {
    pl: "$6",
  },

  variants: {
    size: {
      "1": {
        borderRadius: "$1",
        height: "$5",
        fontSize: "$1",
        px: "$1",
        lineHeight: "$sizes$5",
        "&:-webkit-autofill::first-line": {
          fontSize: "$1",
        },
      },
      "2": {
        borderRadius: "$2",
        height: "$6",
        fontSize: "$3",
        px: "$2",
        lineHeight: "$sizes$6",
        "&:-webkit-autofill::first-line": {
          fontSize: "$3",
        },
      },
      "3": {
        borderRadius: "$2",
        height: "$7",
        fontSize: "$4",
        px: "$3",
        lineHeight: "$sizes$7",
        "&:-webkit-autofill::first-line": {
          fontSize: "$4",
        },
      },
    },
    variant: {
      ghost: {
        boxShadow: "none",
        backgroundColor: "transparent",
        "@hover": {
          "&:hover": {
            boxShadow: "inset 0 0 0 1px $colors$slateA7",
          },
        },
        "&:focus": {
          backgroundColor: "$loContrast",
          boxShadow:
            "inset 0px 0px 0px 1px $colors$blue8, 0px 0px 0px 1px $colors$blue8",
        },
        "&:disabled": {
          backgroundColor: "transparent",
        },
        "&:read-only": {
          backgroundColor: "transparent",
        },
      },
    },
    state: {
      invalid: {
        boxShadow: "inset 0 0 0 1px $colors$red7",
        "&:focus": {
          boxShadow:
            "inset 0px 0px 0px 1px $colors$red8, 0px 0px 0px 1px $colors$red8",
        },
      },
      valid: {
        boxShadow: "inset 0 0 0 1px $colors$green7",
        "&:focus": {
          boxShadow:
            "inset 0px 0px 0px 1px $colors$green8, 0px 0px 0px 1px $colors$green8",
        },
      },
    },
    cursor: {
      default: {
        cursor: "default",
        "&:focus": {
          cursor: "text",
        },
      },
      text: {
        cursor: "text",
      },
    },
  },
  defaultVariants: {
    size: "2",
  },
});
