import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import colors from "../../styles/colors";

const TextBoxDashboard = ({ title, text, height }) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.gray200,
        borderRadius: "1rem",
        width: "auto",
        height: height,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "1.25rem 1.875rem",
        overflow: "hidden",
      }}
    >
      <Typography
        sx={{
          fontSize: "1rem",
          fontFamily: "Inter",
          color: colors.gray800,
          fontWeight: 500,
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          mt: "1rem",
          overflow: "auto",
          flexGrow: 1,
        }}
      >
        <Typography
          sx={{
            fontSize: "0.875rem",
            fontFamily: "Inter",
            color: colors.gray600,
            whiteSpace: "pre-wrap",
          }}
        >
          {text}
        </Typography>
      </Box>
    </Box>
  );
};

export default TextBoxDashboard;
