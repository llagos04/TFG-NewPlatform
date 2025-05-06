import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Divider,
  IconButton,
  Link,
  Stack,
  Typography,
} from "@mui/material";
import { IoMdSend } from "react-icons/io";
import { TextField } from "@mui/material";
import { styled } from "@mui/system";

const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    height: "3.1rem",
    borderRadius: "0.7rem",
    fontSize: "1rem",
    border: "none",
    backgroundColor: "#fff",
    "&.Mui-focused": {
      border: "none",
      backgroundColor: "#fff",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "& input::placeholder": {
      opacity: 0.5,
    },
    "&:focus-within input::placeholder": {
      opacity: 0,
    },
  },
  "& input": {
    border: "none",
    backgroundColor: "#fff",
    "&:focus": {
      border: "none",
      outline: "none",
      backgroundColor: "#fff",
    },
  },
}));

const TextfieldChatbot = ({
  text,
  setText,
  disabled,
  handleSendMessage,
  language,
  isMobile,
}) => {
  const inputRef = useRef(null);
  // Si autoFocus es true, ponemos el foco en el campo de texto
  useEffect(() => {
    if (!disabled && inputRef.current && !isMobile) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleChange = (event) => {
    setText(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const textMappings = {
    EN: "Write your message here...",
    ES: "Escribe tu mensaje aquí...",
    FR: "Écrivez votre message ici...",
    IT: "Scrivi il tuo messaggio qui...",
    CA: "Escriu el teu missatge aquí...",
    PT: "Escreva sua mensagem aqui...",
  };

  return (
    <CustomTextField
      inputRef={inputRef} // Asignamos el ref al campo de texto
      disabled={disabled}
      fullWidth
      value={text}
      onChange={handleChange}
      onKeyPress={handleKeyPress}
      variant="outlined"
      placeholder={language ? textMappings[language] : textMappings["ES"]}
      InputProps={{
        sx: {
          fontFamily: "Inter",
        },
        autoComplete: "off",
        inputMode: "text",
      }}
    />
  );
};

export const ChatWindowFooter = ({
  sendMessage,
  loading,
  active,
  language,
  isMobile,
}) => {
  const [text, setText] = useState("");

  const handleSendMessage = () => {
    if (text.trim() && active) {
      sendMessage(text.trim());
      setText("");
    }
  };

  return (
    <Box
      padding="0rem 1rem 0.2rem 1rem"
      sx={{
        backgroundColor: "white",
        borderRadius: "0 0 16px 16px",
      }}
    >
      <Stack>
        {/* Divider above the input */}
        <Divider sx={{ zIndex: 1 }} />

        {/* Input + Send button row */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mt="0.3rem"
          mb="0.5rem"
        >
          <TextfieldChatbot
            text={text}
            setText={setText}
            disabled={loading || !active}
            handleSendMessage={handleSendMessage}
            language={language}
            isMobile={isMobile}
          />
          <IconButton
            onClick={handleSendMessage}
            disabled={loading || !active}
            sx={{
              color: text.trim() ? "#c30433" : "#9a9a9a",
            }}
          >
            <IoMdSend size="1.75rem" />
          </IconButton>
        </Stack>

        {/* Footer credit */}
        <Typography
          variant="body2"
          component="div"
          align="center"
          sx={{
            fontSize: "0.7rem",
            fontFamily: "Inter",
            color: "#9a9a9a",
            mt: "0.25rem",
          }}
        >
          DEVELOPED FOR{" "}
          <Box component="span" sx={{ fontSize: "0.75rem" }}>
            <Link
              href="https://www.upc.edu/ca"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: "#c30433",
                fontWeight: 600,
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              UPC
            </Link>
          </Box>
        </Typography>
      </Stack>
    </Box>
  );
};
