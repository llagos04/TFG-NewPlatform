import React, { useState, useCallback } from "react";
import {
  alpha,
  Box,
  Grid,
  Stack,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  PiDotsThreeOutlineVerticalFill,
  PiX,
  PiArrowsClockwise,
  PiTranslate,
} from "react-icons/pi";
import { CiLock } from "react-icons/ci";
import colors from "../styles/colors";
import profileImage from "../assets/profile_logo.png";
import { Divider } from "@mui/material";

export const ChatWindowHeader = ({
  setOpen,
  clearConversation,
  isMobile,
  language = "EN",
  setLanguage,
}) => {
  const translations = {
    EN: {
      name: "Atlanta AI",
      subtitle: "AI Assistant",
      restart: "Restart conversation",
      close: "Close chat",
      privacy: "Privacy Policy",
    },
    ES: {
      name: "Atlanta IA",
      subtitle: "Asistente de IA",
      restart: "Reiniciar conversación",
      close: "Cerrar chat",
      privacy: "Política de privacidad",
    },
    FR: {
      name: "Atlanta IA",
      subtitle: "Assistant IA",
      restart: "Redémarrer la conversation",
      close: "Fermer le chat",
      privacy: "Politique de confidentialité",
    },
    DE: {
      name: "Atlanta KI",
      subtitle: "KI-Assistent",
      restart: "Konversation neu starten",
      close: "Chat schließen",
      privacy: "Datenschutzrichtlinie",
    },
    IT: {
      name: "Atlanta IA",
      subtitle: "Assistente IA",
      restart: "Riavvia conversazione",
      close: "Chiudi chat",
      privacy: "Informativa sulla privacy",
    },
    CA: {
      name: "Atlanta IA",
      subtitle: "Assistent IA",
      restart: "Reiniciar conversa",
      close: "Tancar xat",
      privacy: "Política de privacitat",
    },
  };

  const t = translations[language] || translations.EN;

  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = useCallback((e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  }, []);

  const handleMenuClose = useCallback((e) => {
    e.stopPropagation();
    setAnchorEl(null);
  }, []);

  const handleChangeLanguage = (lang) => {
    setLanguage(lang);
    clearConversation(); // Reinicia el hilo y muestra mensaje traducido
  };

  return (
    <Box sx={{ backgroundColor: "white", borderRadius: "16px 16px 0 0" }}>
      <Box
        sx={{
          p: "1rem 1.25rem",
          display: "flex",
          alignItems: "center",
          borderRadius: isMobile ? "0" : "16px 16px 0 0",
          backgroundImage: `linear-gradient(100deg, ${alpha(
            colors.primary,
            1
          )}, ${alpha(colors.primary, 0.8)})`,
          overflow: "visible",
          zIndex: 1,
        }}
      >
        <Grid container alignItems="center">
          <Grid item xs={10} display="flex" alignItems="center">
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                mr: 1,
                backgroundImage: `url(${profileImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
            />
            <Stack>
              <Typography color="white" fontSize={20} fontWeight={500}>
                {t.name}
              </Typography>
              <Typography color="white" fontSize={14} fontWeight={300}>
                {t.subtitle}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={2}>
            <Stack direction="row" justifyContent="center" alignItems="center">
              <IconButton onClick={handleMenuOpen} sx={{ color: "#fff" }}>
                <PiDotsThreeOutlineVerticalFill size={24} />
              </IconButton>
              <IconButton
                onClick={() => setOpen(false)}
                sx={{ color: "#fff", ml: 1 }}
              >
                <PiX size={26} />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "12px",
            boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
            mt: "3rem",
          },
        }}
      >
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            clearConversation();
            handleMenuClose(e);
          }}
          sx={{ borderBottom: "1px solid #e0e0e0" }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <PiArrowsClockwise style={{ fontSize: 18 }} />
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                color: "black",
              }}
            >
              {t.restart}
            </Typography>
          </Stack>
        </MenuItem>

        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            setOpen(false);
            handleMenuClose(e);
          }}
          sx={{ borderBottom: "1px solid #e0e0e0" }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <PiX style={{ fontSize: 18 }} />
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                color: "black",
              }}
            >
              {t.close}
            </Typography>
          </Stack>
        </MenuItem>

        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            window.open("https://byneural.ai/politicas-asistentes", "_blank");
            handleMenuClose(e);
          }}
          sx={{ borderBottom: "1px solid #e0e0e0" }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <CiLock style={{ fontSize: 18 }} />
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                color: "black",
              }}
            >
              {t.privacy}
            </Typography>
          </Stack>
        </MenuItem>

        <MenuItem>
          <Stack direction="row" spacing={1} alignItems="center">
            <PiTranslate style={{ fontSize: 18 }} />
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                color: "black",
              }}
            >
              {{
                EN: "Change language",
                ES: "Cambiar idioma",
                FR: "Changer de langue",
                DE: "Sprache ändern",
                IT: "Cambia lingua",
                CA: "Canviar idioma",
              }[language] || "Change language"}
            </Typography>
          </Stack>
        </MenuItem>

        {[
          { code: "EN", label: "English" },
          { code: "ES", label: "Español" },
          { code: "FR", label: "Français" },
          { code: "DE", label: "Deutsch" },
          { code: "IT", label: "Italiano" },
          { code: "CA", label: "Català" },
        ].map(({ code, label }) => (
          <MenuItem
            key={code}
            onClick={(e) => {
              e.stopPropagation();
              handleChangeLanguage(code);
              handleMenuClose(e);
            }}
          >
            <Typography
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: "14px",
                color: "black",
                ml: "2rem",
              }}
            >
              {label}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};
