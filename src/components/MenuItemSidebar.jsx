import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import colors from "../styles/colors";

import { useNavigate } from "react-router-dom";
import { PiLockBold } from "react-icons/pi";

export const MenuItemSideBar = ({
  icon,
  url,
  page,
  title_page,
  onTabClick,
  index,
  available = true,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const itemRef = useRef(null);

  const [currentMode, setCurrentMode] = useState(theme.palette.mode);

  useEffect(() => {
    setCurrentMode(theme.palette.mode);
  }, [theme.palette.mode]);

  const isSelected = page === url;

  const backgroundColor = isSelected ? "#ffff" : colors.gray200;
  const hoverColor = "#ffff";
  const textColor = isSelected
    ? colors.primary
    : available
    ? colors.gray600
    : colors.gray400;

  const handleClick = () => {
    const itemTopPosition = itemRef.current.offsetTop;

    onTabClick(url, title_page, index);
  };

  return (
    <Box ref={itemRef} sx={{ paddingRight: "0rem" }}>
      <Box
        width="100%"
        margin="0.5rem 0rem"
        padding="0.75rem 0rem"
        sx={{
          border: isSelected ? "1px solid rgba(0,0,0,0.1)" : null,
          backgroundColor,
          transition: "background-color 0.2s ease-in-out",
          "&:hover": {
            backgroundColor: hoverColor,
          },
          display: "flex",
          height: "100%",
          alignItems: "center",
          justifyContent: "space-between", // Cambiado para alinear a los extremos
          borderRadius: "0.75rem",
          cursor: "pointer",
          position: "relative",
          boxShadow: isSelected ? "0px 2px 4px rgba(0, 0, 0, 0.05)" : null,
        }}
        onClick={
          available
            ? handleClick
            : () => {
                navigate("/configuracion/plan");
              }
        }
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              m: "-0.25rem 0.6rem 0 1rem",
              height: "1rem",
              color: textColor,
              transition: "color 0.4s ease-in-out",
            }}
          >
            {icon}
          </Box>
          <Typography
            fontSize="0.875rem"
            fontFamily="Inter"
            fontWeight={isSelected ? 600 : 400}
            sx={{
              textAlign: "left",
              transition: "color 0.3s ease-in-out",
            }}
            color={textColor}
          >
            {title_page}
          </Typography>
        </Box>

        {!available && (
          <PiLockBold
            style={{
              fontSize: "1rem",
              color: textColor,
              marginRight: "1rem", // Añade un margen derecho para espaciado
            }}
          />
        )}
      </Box>
    </Box>
  );
};
