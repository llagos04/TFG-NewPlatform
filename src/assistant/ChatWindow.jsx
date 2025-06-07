import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import { ChatWindowHeader } from "./ChatWindowHeader";
import { ChatWindowFooter } from "./ChatWindowFooter";
import { MessagesContainer } from "./MessagesContainer";
import { transformMessages } from "../utils/transformMessages";
import { useViewportHeight } from "../hooks/useViewportHeight";

export const ChatWindow = ({
  visible,
  setOpen,
  messages,
  sendMessage,
  loading,
  streamedResponse,
  clearConversation,
  isMobile,
  language,
  setLanguage,
}) => {
  const viewportHeight = useViewportHeight();

  if (!visible) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: isMobile ? "0" : "7rem",
        right: isMobile ? "0" : "2rem",
        width: isMobile ? "100%" : 480,
        height: isMobile ? viewportHeight : `calc(90vh - 7rem)`, // altura aproximada
        display: "flex",
        flexDirection: "column",
        boxShadow: 3,
        borderRadius: isMobile ? "0" : "1rem",
        overflow: "hidden",
        zIndex: 49,
      }}
    >
      {/* Header */}
      <ChatWindowHeader
        setOpen={setOpen}
        clearConversation={clearConversation}
        isMobile={isMobile}
        language={language}
        setLanguage={setLanguage}
      />

      {/* Contenedor de mensajes */}
      <MessagesContainer
        messages={transformMessages(messages)}
        sendMessage={sendMessage}
        loading={loading}
        streamedResponse={streamedResponse}
        isMobile={isMobile}
        language={language}
      />

      {/* Footer */}
      <ChatWindowFooter
        sendMessage={sendMessage}
        loading={loading}
        active={!loading}
        language={language}
        isMobile={false}
      />
    </Box>
  );
};
