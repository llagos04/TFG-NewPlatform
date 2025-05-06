import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import CloseIcon from "@mui/icons-material/Close";
import { ChatWindowHeader } from "./ChatWindowHeader";
import { ChatWindowFooter } from "./ChatWindowFooter";
import { MessagesContainer } from "./MessagesContainer";
import { transformMessages } from "../utils/transformMessages";

export const ChatWindow = ({
  visible,
  setOpen,
  messages,
  sendMessage,
  loading,
  streamedResponse,
  clearConversation,
}) => {
  if (!visible) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "7rem", // justo encima del ChatBox (bottom: 1rem + altura 2rem ≈ 4rem)
        right: "2rem",
        width: 480,
        height: `calc(90vh - 7rem)`, // altura aproximada
        display: "flex",
        flexDirection: "column",
        boxShadow: 3,
        borderRadius: "1rem",
        overflow: "hidden",
        zIndex: 49,
      }}
    >
      {/* Header */}
      <ChatWindowHeader
        setOpen={setOpen}
        clearConversation={clearConversation}
      />

      {/* Contenedor de mensajes */}
      <MessagesContainer
        messages={transformMessages(messages)}
        sendMessage={sendMessage}
        loading={loading}
        streamedResponse={streamedResponse}
      />

      {/* Footer */}
      <ChatWindowFooter
        sendMessage={sendMessage}
        loading={loading}
        active={!loading}
        language="EN"
        isMobile={false}
      />
    </Box>
  );
};
