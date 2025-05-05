import React from "react";
import Button from "@mui/material/Button";
import colors from "../styles/colors";
import { darken, lighten } from "@mui/system"; 

export function CustomButton({
  label,
  onClick,
  variant = "primmary", // 'primmary' | 'white' | 'red'
  customColor = null,
  disabled = false,
  height = "2rem",
  borderRadius = "0.5rem",
}) {
  const getBackgroundColor = () => {
    if (customColor) return customColor;
    if (variant === "primmary") return colors.primary;
    if (variant === "white") return "white";
    if (variant === "red") return "#F15D5D";
    return colors.primary;
  };

  const getHoverColor = () => {
    if (customColor) return darken(customColor, 0.2);
    if (variant === "primmary") return darken(colors.primary, 0.1);
    if (variant === "red") return "#e04848";
    return colors.gray300;
  };

  return (
    <Button
      fullWidth
      onClick={onClick}
      disabled={disabled}
      sx={{
        padding: "0 1rem",
        height,
        borderRadius,
        fontWeight: 500,
        fontFamily: "Inter",
        fontSize: "0.875rem",
        lineHeight: 2.8,
        color: variant === "white" ? colors.primary : "white",
        backgroundColor: getBackgroundColor(),
        "&:hover": {
          backgroundColor: getHoverColor(),
        },
        textTransform: "none",
        textAlign: "center",
        border: variant === "white" ? `1px solid ${colors.primary}` : "none",
        "&.Mui-disabled": {
          color: "white",
          backgroundColor: customColor
            ? lighten(customColor, 0.4)
            : colors.gray400,
        },
      }}
    >
      {label}
    </Button>
  );
}
