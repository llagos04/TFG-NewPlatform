import React from "react";
import { Box, Typography } from "@mui/material";
import colors from "../styles/colors";

export const CustomChip = ({ text }) => {
  return (
    <Box
      sx={{
        width: "fit-content",
        minWidth: "3rem",
        borderRadius: "1rem",
        backgroundColor: "#FFEEF3", // Cambia si quieres otro color base
        padding: "0.375rem 0.75rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        sx={{
          fontSize: "0.75rem",
          color: colors.primary,
          fontFamily: "Inter",
          fontWeight: 500,
          lineHeight: 1,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};
