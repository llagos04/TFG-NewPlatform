import { alpha, Box, styled } from "@mui/material";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import colors from "../styles/colors";
import MessageTimestamp from "./MessafeTimeStamp";

// Expresión regular para detectar correos electrónicos
const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,})/g;

const StyledMarkdown = styled(ReactMarkdown)`
  & h3 {
    font-size: 1rem;
    font-weight: bold;
    margin: 0rem 0;
  }

  & strong {
    font-weight: bold;
  }

  & p {
    margin: 0;
  }
  & ul,
  & ol {
    margin-left: 1ch;
    padding-left: 2ch;
  }

  & ul ul,
  & ol ol {
    margin-left: 1ch;
  }

  & ul ul ul,
  & ol ol ol {
    margin-left: 1ch;
  }
`;

export const TextMessage = ({
  message,
  isUser = true,
  index = 0,
  rawContent = false,
  reduceSizeOnMobile = false,
  timestamp,
}) => {
  const [hover, setHover] = useState(false);

  const isValidMessage = typeof message === "string";

  // Función para convertir texto plano en enlaces mailto
  const processMessageWithEmails = (text) => {
    // Reemplazamos los emails detectados en el texto con enlaces mailto:
    return text.replace(emailRegex, (match) => {
      return `[${match}](mailto:${match})`; // Cambiamos el texto plano en un enlace Markdown
    });
  };

  // Convertimos el mensaje plano en un mensaje con enlaces mailto si es necesario
  const processedMessage = isValidMessage
    ? processMessageWithEmails(message)
    : message;

  const renderers = {
    a: ({ href, children }) => {
      const isEmail = href && href.startsWith("mailto:");

      return (
        <span
          onClick={(e) => {
            e.preventDefault();
            if (isEmail) {
              // Abrir el cliente de correo con el email predeterminado
              window.location.href = href;
            } else {
              window.location.href = href;
            }
          }}
          style={{
            color: "#c30433 ", // Color principal para todos los enlaces
            cursor: "pointer",
            textDecoration: "underline", // Todos los enlaces subrayados
          }}
        >
          {children}
        </span>
      );
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        justifyContent: isUser ? "flex-end" : "flex-start",
        m: isUser ? "0.5rem 0 0.15rem 0" : "0.15rem 0",
        position: "relative", // Aseguramos que los elementos secundarios se posicionen bien
      }}
    >
      {/* Mostrar la fecha y hora al lado del mensaje cuando el usuario no es el emisor */}
      {isUser && hover && (
        <MessageTimestamp timestamp={timestamp} isUser={isUser} />
      )}

      <Box
        onMouseEnter={() => setHover(true)} // Cuando el ratón entra, se activa el hover
        onMouseLeave={() => setHover(false)} // Cuando el ratón sale, se desactiva el hover
        sx={{
          display: "inline-block",
          color: isUser ? "white" : colors.gray800,
          backgroundImage: isUser
            ? `linear-gradient(to top right, #C2083F, ${alpha("#C2083F", 0.7)})`
            : null,

          backgroundColor: isUser ? null : "#F0F2F7",
          padding: "0.9375rem",
          borderRadius:
            index !== 0
              ? "0.75rem 0.75rem 0.75rem 0.75rem"
              : isUser
              ? "0.75rem 0rem 0.75rem 0.75rem"
              : "0rem 0.75rem 0.75rem 0.75rem",
          maxWidth: isUser ? "77%" : "100%",

          fontSize: reduceSizeOnMobile ? "0.75rem" : "0.875rem",
          fontFamily: "Inter",
          wordBreak: "break-word",
          overflowWrap: "break-word",
        }}
      >
        {isValidMessage ? (
          // Usamos `ReactMarkdown` para procesar el Markdown y los correos electrónicos
          <StyledMarkdown components={renderers}>
            {processedMessage}
          </StyledMarkdown>
        ) : rawContent ? (
          <>{message}</>
        ) : (
          <Box color="error.main">Error: Contenido no válido</Box>
        )}
      </Box>
    </Box>
  );
};
