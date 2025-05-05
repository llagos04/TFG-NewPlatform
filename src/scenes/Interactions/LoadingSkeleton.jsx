import { Skeleton } from "@mui/material";
import { Box, lighten } from "@mui/system";
import React from "react";

export const LoadingSkeleton = ({ isUser, index }) => (
  <Box
    sx={{
      display: "flex",
      width: "100%",
      justifyContent: isUser ? "flex-end" : "flex-start",
      m: isUser ? "0.5rem 0 0.15rem 0" : "0.15rem 0",
    }}
  >
    <Box
      sx={{
        display: "flex", // Cambiado de "inline-block" a "flex"
        flexDirection: "column", // Asegura que los Skeleton se apilen verticalmente
        alignItems: isUser ? "flex-end" : "flex-start", // Alinea los Skeleton a la derecha si es un usuario
        backgroundColor: isUser ? lighten("#C2083F", 0.4) : "#F0F2F7", 
        padding: "0.9375rem",
        borderRadius:
          index !== 0
            ? "0.75rem 0.75rem 0.75rem 0.75rem"
            : isUser
            ? "0.75rem 0rem 0.75rem 0.75rem"
            : "0rem 0.75rem 0.75rem 0.75rem",
        width: "70%",
        fontSize: "0.875rem",
        wordBreak: "break-word",
        overflowWrap: "break-word",
      }}
    >
      <Skeleton
        variant="text"
        width="100%"
        height="1rem"
        sx={{ marginBottom: "0.5rem" }}
      />
      {!isUser && (
        <>
          <Skeleton
            variant="text"
            width="100%"
            height="1rem"
            sx={{ marginBottom: "0.5rem" }}
          />
          <Skeleton
            variant="text"
            width="100%"
            height="1rem"
            sx={{ marginBottom: "0.5rem" }}
          />
          <Skeleton
            variant="text"
            width="100%"
            height="1rem"
            sx={{ marginBottom: "0.5rem" }}
          />
        </>
      )}
      <Skeleton variant="text" width="60%" height="1rem" />
    </Box>
  </Box>
);
