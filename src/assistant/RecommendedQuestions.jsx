import { Box } from "@mui/material";
import React from "react";
import colors from "../styles/colors"; // Asegurate de que esté bien la ruta

export const RecommendedQuestions = ({ questions, onClick = () => {} }) => {
  // Si no hay preguntas, no renderizamos nada
  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <Box width="100%">
      <Box
        width="95%"
        sx={{
          marginLeft: "auto", // Alineación derecha
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap-reverse",
            gap: "0.4rem",
            alignItems: "flex-end",
            justifyContent: "flex-end",
            width: "100%",
            boxSizing: "border-box",
            padding: 0,
          }}
        >
          {questions.map((question, idx) => (
            <Box
              key={question ?? idx}
              sx={{
                padding: "0.3rem 0.8rem",
                borderRadius: "1rem",
                border: `1px solid ${colors.primary}`,
                fontFamily: "Inter",
                color: colors.primary,
                fontSize: "0.875rem",
                cursor: "pointer",
                transition: "background-color 0.3s ease, color 0.3s ease",
                "&:hover": {
                  backgroundColor: colors.primary,
                  color: "white",
                },
              }}
              onClick={() => onClick(question)}
            >
              {question}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};
