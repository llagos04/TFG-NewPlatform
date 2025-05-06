import React from "react";
import Box from "@mui/material/Box";
import imgOpen from "../assets/button_icon.png";
import imgClose from "../assets/button_close.png";
import colors from "../styles/colors";

export const ChatButton = ({ onClick, isOpen }) => (
  <Box
    component="div"
    onClick={onClick}
    role="button"
    tabIndex={0}
    onKeyPress={(e) => {
      if (e.key === "Enter" || e.key === " ") onClick();
    }}
    sx={{
      position: "fixed",
      bottom: "2rem",
      right: "2rem",
      bgcolor: colors.primary,
      p: "1rem",
      borderRadius: "1rem",
      cursor: "pointer",
      width: "2rem",
      height: "2rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background-color 0.3s ease",
      "&:focus": {
        outline: "none",
        boxShadow: "0 0 0 2px white",
      },
      "&:hover": {
        bgcolor: "#E42F65",
      },
    }}
    aria-label="Abrir chat"
  >
    <Box
      component="img"
      key={isOpen ? "open" : "close"} // fuerza animación con cambio de clave
      src={isOpen ? imgClose : imgOpen}
      alt="Icono de chat"
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        transition: "opacity 0.3s ease",
        opacity: 1,
      }}
    />
  </Box>
);
