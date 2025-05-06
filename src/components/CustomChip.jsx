// CustomChip.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import colors from "../styles/colors";

/*  Mapa de estilos por variante  */
const CHIP_STYLES = {
  default: { bg: "#FFEEF3", txt: colors.primary },
  green: { bg: "#E6F7EF", txt: "#0F8C4B" },
  orange: { bg: "#FFF2E6", txt: "#D26A00" },
  yellow: { bg: "#FFF9E6", txt: "#B89A00" },
  red: { bg: "#FEECEC", txt: "#D52222" },
};

export const CustomChip = ({ text, variant = "default" }) => {
  const { bg, txt } = CHIP_STYLES[variant] ?? CHIP_STYLES.default;

  return (
    <Box
      sx={{
        width: "fit-content",
        minWidth: "3rem",
        px: "0.75rem",
        py: "0.375rem",
        borderRadius: "1rem",
        backgroundColor: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        sx={{
          fontFamily: "Inter",
          fontSize: "0.75rem",
          fontWeight: 500,
          lineHeight: 1,
          color: txt,
          textTransform: "capitalize",
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};
