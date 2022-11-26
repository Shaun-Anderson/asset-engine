import { styled } from "../../stitches.config";

export const Card = styled("div", {
  appearance: "none",
  border: "none",
  boxSizing: "border-box",
  font: "inherit",
  lineHeight: "1",
  outline: "none",
  padding: 0,
  textAlign: "inherit",
  verticalAlign: "middle",
  WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",

  backgroundColor: "$panel",
  display: "block",
  textDecoration: "none",
  color: "inherit",
  flexShrink: 0,
  borderRadius: "$3",
  position: "relative",

  "&::before": {
    boxSizing: "border-box",
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    boxShadow: "inset 0 0 0 1px rgba(0,0,0,.1)",
    borderRadius: "$3",
    pointerEvents: "none",
  },

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
    glass: {
      true: {
        backdropFilter: "blur(12px) saturate(160%)",
      },
    },
    variant: {
      interactive: {
        "@hover": {
          "&:hover": {
            "&::before": {
              boxShadow: "inset 0 0 0 1px rgba(0,0,0,.2)",
            },
            [`.dark-theme &`]: {
              boxShadow: "inset 0 0 0 1px #888888",
            },
          },
        },
        "&:active": {
          "&::before": {
            boxShadow: "inset 0 0 0 1px $colors$blue8, 0 0 0 1px $colors$blue8",
          },
        },
        "&:focus": {
          "&::before": {
            boxShadow: "inset 0 0 0 1px $colors$blue8, 0 0 0 1px $colors$blue8",
          },
        },
      },
      ghost: {
        backgroundColor: "transparent",
        transition:
          "transform 200ms cubic-bezier(0.22, 1, 0.36, 1), background-color 25ms linear",
        willChange: "transform",
        "&::before": {
          boxShadow:
            "0px 10px 38px -10px rgba(22, 23, 24, 0.35), 0px 10px 20px -15px rgba(22, 23, 24, 0.2)",
          opacity: "0",
          transition: "all 200ms cubic-bezier(0.22, 1, 0.36, 1)",
        },
        "@hover": {
          "&:hover": {
            backgroundColor: "$panel",
            transform: "translateY(-2px)",
            "&::before": {
              opacity: "1",
            },
          },
        },
        "&:active": {
          transform: "translateY(0)",
          transition: "none",
          "&::before": {
            boxShadow:
              "0px 5px 16px -5px rgba(22, 23, 24, 0.35), 0px 5px 10px -7px rgba(22, 23, 24, 0.2)",
            opacity: "1",
          },
        },
        "&:focus": {
          boxShadow: "inset 0 0 0 1px $colors$blue8, 0 0 0 1px $colors$blue8",
        },
      },
      active: {
        transform: "translateY(0)",
        transition: "none",
        "&::before": {
          boxShadow:
            "0px 5px 16px -5px rgba(22, 23, 24, 0.35), 0px 5px 10px -7px rgba(22, 23, 24, 0.2)",
          opacity: "1",
        },
        "&:focus": {
          boxShadow: "inset 0 0 0 1px $colors$blue8, 0 0 0 1px $colors$blue8",
        },
      },
    },
  },
});
