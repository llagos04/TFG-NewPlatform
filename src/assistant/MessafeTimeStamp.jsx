import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { keyframes } from "@emotion/react"; // Importamos keyframes
import colors from "../styles/colors";

// Función para formatear la fecha
const formatDate = (dateString) => {
  const date = new Date(dateString);

  // Formatear el día en formato DD/MM/YYYY
  const day = date.toLocaleDateString(undefined, {
    day: "2-digit", // Día con dos dígitos
    month: "2-digit", // Mes con dos dígitos
    year: "numeric", // Año completo
  });

  // Formatear la hora en formato 24h (HH:mm)
  const time = date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Formato de 24 horas
  });

  return { day, time };
};

// Definimos la animación de fade-in con keyframes
const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

// Componente para mostrar la fecha y hora
const MessageTimestamp = ({ timestamp, isUser }) => {
  const [fadeInState, setFadeInState] = useState(false);

  // Asegurarnos de que la animación se inicie después de que el componente se haya montado
  useEffect(() => {
    setFadeInState(true);
  }, []);

  if (!timestamp) return null;

  // Obtener la fecha y hora formateadas
  const { day, time } = formatDate(timestamp);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column", // Para mostrar la fecha y hora en filas separadas
        alignItems: "center",
        color: colors.gray400,
        marginLeft: isUser ? "0" : "0.5rem",
        marginRight: isUser ? "0.5rem" : "0",
        fontSize: "0.75rem",
        justifyContent: "center", // Alineamos la fecha al centro
        opacity: fadeInState ? 1 : 0, // La opacidad se cambia cuando 'fadeInState' es true
        animation: fadeInState ? `${fadeIn} 0.3s ease-out` : "", // Aplica la animación cuando 'fadeInState' es true
      }}
    >
      {/* Día en la primera fila */}
      <span>{day}</span>
      {/* Hora en la segunda fila */}
      <span style={{ marginTop: "-0.125rem" }}>{time}</span>
    </Box>
  );
};

export default MessageTimestamp;
