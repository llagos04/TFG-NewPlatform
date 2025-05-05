import { Box, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import colors from "../../styles/colors";

const StatBox = ({
  stat,
  title,
  icon,
  iconSize = "1.7rem",
  percentage = 0,
  isPositive = true,
  arrow = false,
  arrowText = null,
  isAdminPanel = false,
}) => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        backgroundColor: colors.gray200,
        borderRadius: "1rem",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        flexGrow: 1,
      }}
      padding={{
        xs: "1.25rem 1.25rem 1.5rem 1.5rem",
      }}
    >
      {/* Contenedor para el título y el icono (opcional) en la parte superior */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Typography
          fontSize="0.875rem"
          sx={{
            fontFamily: "Inter",
            color: "#000",
          }}
          maxWidth="calc(100% - 3rem)"
        >
          {title}
        </Typography>
        {icon &&
          !isAdminPanel &&
          React.cloneElement(icon, {
            size: iconSize,
            style: {
              color: "#000",
              margin: "0.2rem 0 0 0",
              opacity: 0.2,
            },
          })}
      </Box>

      {/* Contenedor exclusivo para el título en la parte inferior izquierda */}
      <Box
        sx={{
          height: "100%",
          mt: "0.5rem",
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <Typography
          sx={{
            fontSize: "1.5rem",
            fontFamily: "Inter",
            fontWeight: "bold",
            color: "#000",
          }}
        >
          {stat}
        </Typography>
        {!isAdminPanel && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {percentage !== undefined && (
              <Typography
                sx={{
                  mt: "0.25rem",
                  fontSize: { xs: "0.75rem", xl: "0.85rem" },
                  fontFamily: "Inter",
                  fontWeight: "bold",
                  color: isPositive ? "#4CBF5F" : "#F15D5D",
                }}
              >
                {/* {percentage === "-" ? "" : isPositive ? "+" : "-"} */}
                {percentage}{" "}
                <span style={{ color: colors.gray400, fontWeight: "400" }}>
                  este mes
                </span>
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default StatBox;
