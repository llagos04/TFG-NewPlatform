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
import { PiMicrophone } from "react-icons/pi";
import {
  createAudioRecorder,
  transcribeAudio,
} from "../utils/audioTranscriber";

const CustomTextFieldStyled = styled(TextField)(({ theme }) => ({
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

const CustomTextField = ({
  text,
  setText, // NO lo pases al <TextField />
  disabled,
  handleSendMessage, // NO lo pases al <TextField />
  language,
  isMobile,
  placeholder, // <-- sí puedes pasarlo
}) => {
  // Solo usa text, setText, handleSendMessage, etc. para la lógica interna:

  const handleChange = (event) => setText(event.target.value);
  const handleKeyPress = (event) => {
    if (event.key === "Enter") handleSendMessage();
  };

  return (
    <CustomTextFieldStyled
      value={text}
      onChange={handleChange}
      onKeyPress={handleKeyPress}
      disabled={disabled}
      fullWidth
      variant="outlined"
      placeholder={placeholder}
      InputProps={{
        sx: { fontFamily: "Inter" },
        autoComplete: "off",
        inputMode: "text",
      }}
    />
  );
};

export default CustomTextField;

export const ChatWindowFooter = ({
  sendMessage,
  loading,
  active,
  language,
  isMobile,
}) => {
  const [text, setText] = useState("");
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [placeholder, setPlaceholder] = useState();
  const recorderRef = useRef(null);

  const handleSendMessage = () => {
    if (text.trim() && active && !recording && !processing) {
      sendMessage(text.trim());
      setText("");
    }
  };

  const handleMicrophoneClick = async () => {
    if (!recording && !processing) {
      // Empezar a grabar
      try {
        recorderRef.current = createAudioRecorder();
        await recorderRef.current.start();
        setRecording(true);
        setPlaceholder("Recording...");
        setText(""); // Limpia campo texto
      } catch (err) {
        alert("Error al iniciar la grabación: " + err.message);
      }
    } else if (recording) {
      // Detener y transcribir
      setRecording(false);
      setProcessing(true);
      setPlaceholder("Processing audio...");
      setText(""); // Limpia campo texto
      try {
        const blob = await recorderRef.current.stop();
        const transcript = await transcribeAudio(blob);
        setProcessing(false);
        setPlaceholder(); // Vuelve a normal al acabar
        if (transcript && transcript.trim()) {
          sendMessage(transcript.trim()); // ENVÍA directamente
        }
      } catch (err) {
        setProcessing(false);
        setPlaceholder();
        alert("Error al transcribir: " + err.message);
      }
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
    <Box
      padding="0rem 1rem 0.2rem 1rem"
      sx={{ backgroundColor: "white", borderRadius: "0 0 16px 16px" }}
    >
      <Stack>
        <Divider sx={{ zIndex: 1 }} />
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mt="0.3rem"
          mb="0.5rem"
        >
          <CustomTextField
            text={text}
            setText={setText}
            disabled={loading || !active || recording || processing}
            handleSendMessage={handleSendMessage}
            language={language}
            isMobile={isMobile}
            placeholder={
              placeholder ||
              (language ? textMappings[language] : textMappings["ES"])
            }
          />
          <IconButton
            onClick={handleSendMessage}
            disabled={loading || !active}
            sx={{ color: text.trim() ? "#c30433" : "#9a9a9a" }}
          >
            <IoMdSend size="1.75rem" />
          </IconButton>
          <IconButton
            onClick={handleMicrophoneClick}
            disabled={loading || !active}
            sx={{ color: recording ? "#c30433" : "#9a9a9a" }}
          >
            <PiMicrophone size="1.75rem" />
          </IconButton>
        </Stack>
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
                "&:hover": { textDecoration: "underline" },
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
