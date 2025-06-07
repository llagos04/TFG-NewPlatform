import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import colors from "../styles/colors";

const translations = {
  EN: {
    viewMap: "View on interactive map",
  },
  ES: {
    viewMap: "Ver en el mapa interactivo",
  },
  FR: {
    viewMap: "Voir sur la carte interactive",
  },
  DE: {
    viewMap: "Auf interaktiver Karte anzeigen",
  },
  IT: {
    viewMap: "Visualizza sulla mappa interattiva",
  },
  CA: {
    viewMap: "Veure al mapa interactiu",
  },
};

const ServiceCard = ({ service, isFirst, isLast, language = "EN" }) => {
  const data =
    typeof service.text === "string" ? JSON.parse(service.text) : service.text;
  const t = translations[language] || translations.EN;

  return (
    <Stack
      direction={"column"}
      sx={{
        padding: "1rem",
        border: "1px solid #E5E5E5",
        borderRadius: isFirst
          ? "0.75rem 0.75rem 0rem 0rem"
          : isLast
          ? "0rem 0rem 0.75rem 0.75rem"
          : "0rem",
        borderTop: isFirst ? "inherit" : "none",
        backgroundColor: "white",
      }}
    >
      {/* 🟦 BLOQUE 1 */}
      <Stack
        direction={"row"}
        spacing={2}
        width={"100%"}
        justifyContent={"space-between"}
      >
        <Stack direction="column" spacing={0.5}>
          <Typography
            sx={{
              fontFamily: "Inter, sans-serif",
              fontSize: "1rem",
              fontWeight: 600,
              color: "black",
            }}
          >
            {data.Name}
          </Typography>
          <Typography sx={{ fontSize: "0.875rem", color: colors.gray500 }}>
            {data.Location}
          </Typography>
          <Typography sx={{ fontSize: "0.875rem", color: colors.gray500 }}>
            {data["Opening Hours"]}
          </Typography>
        </Stack>
        <Box
          component="img"
          src={data.Image}
          alt={data.Name}
          sx={{
            ml: "auto",
            width: "5rem",
            height: "5rem",
            objectFit: "contain",
            borderRadius: "0.5rem",
            backgroundColor: colors.gray100,
          }}
        />
      </Stack>

      {/* 🟩 BLOQUE 2 */}
      <Stack mt={1.5} spacing={0.5}>
        <Typography
          sx={{
            fontSize: "0.875rem",
            color: colors.gray700,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {data.Description}
        </Typography>

        <a
          href={data["Link to view the exact location on the interactive map"]}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "0.875rem",
            color: colors.primary,
            textDecoration: "underline",
            marginTop: "0.5rem",
            display: "inline-block",
          }}
        >
          {t.viewMap}
        </a>
      </Stack>
    </Stack>
  );
};

export const ServiceList = ({ services, isMobile, language = "EN" }) => {
  if (!services || services.length === 0) return null;

  return (
    <Stack
      sx={{ mt: 1.5 }}
      borderTop={`3px solid ${colors.primary}`}
      borderRadius={"0.75rem"}
      width={"100%"}
      maxWidth={isMobile ? "100%" : `calc(77% + 2rem)`}
    >
      {services.map((s, i) => (
        <Box key={i}>
          <ServiceCard
            service={s}
            isFirst={i === 0}
            isLast={i === services.length - 1}
            language={language}
          />
        </Box>
      ))}
    </Stack>
  );
};
