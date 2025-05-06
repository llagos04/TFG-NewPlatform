import React from "react";
import { Box, Stack } from "@mui/system";
import colors from "../../styles/colors";
import { LoadingSkeleton } from "./LoadingSkeleton";

export const ConversationSkeleton = () => {
  return (
    <Box
      maxHeight={"75vh"}
      height={"75vh"}
      width={"100%"}
      sx={{
        overflow: "hidden",
        border: `1px solid ${colors.gray200}`,
        borderRadius: "0.75rem",
      }}
    >
      <Box
        sx={{
          borderRadius: "0rem 0rem 0.75rem 0.75rem",
          width: "100%",
          flexGrow: 1,
          flex: 1,
          overflowY: "auto",
          backgroundColor: "white", // '#f1f1f1' si prefieres ese color
          padding: "1rem 1rem 1rem 1rem",
          display: "flex",
          flexDirection: "column", // Los hijos se apilan verticalmente
          justifyContent: "space-between", // Espacio entre hijos
          "&::-webkit-scrollbar": {
            width: "6px",
            height: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
            borderRadius: "4px",
            visibility: "hidden",
          },
          "&:hover::-webkit-scrollbar-thumb": {
            visibility: "visible",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "transparent",
          },
        }}
      >
        <Stack spacing={2}>
          <LoadingSkeleton
            isUser={true}
            index={0}
            uiConfig={{ general: { primary_color: colors.primary[500] } }}
          />
          <LoadingSkeleton
            isUser={false}
            index={0}
            uiConfig={{ general: { primary_color: colors.primary[500] } }}
          />
          <LoadingSkeleton
            isUser={true}
            index={0}
            uiConfig={{ general: { primary_color: colors.primary[500] } }}
          />
        </Stack>
      </Box>
    </Box>
  );
};
