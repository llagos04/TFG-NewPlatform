import React from "react";
import { Box, Stack, Typography } from "@mui/material";
import colors from "../styles/colors";
import { CustomChip } from "../components/CustomChip";
import DL from "../assets/airlines/DL.png";
import UA from "../assets/airlines/UA.png";
import AA from "../assets/airlines/AA.png";
import BA from "../assets/airlines/BA.png";
import KL from "../assets/airlines/KL.png";
import YX from "../assets/airlines/YX.png";

const airlineLogo = {
  DL: DL,
  UA: UA,
  AA: AA,
  BA: BA,
  KL: KL,
  YX: YX,
};

const translations = {
  EN: {
    terminal: "Terminal",
    boardingGate: "Boarding gate",
    destinationTerminal: "Destination terminal",
  },
  ES: {
    terminal: "Terminal",
    boardingGate: "Puerta de embarque",
    destinationTerminal: "Terminal de destino",
  },
  FR: {
    terminal: "Terminale",
    boardingGate: "Porte d'embarquement",
    destinationTerminal: "Terminal de destination",
  },
  DE: {
    terminal: "Terminal",
    boardingGate: "Abflug-Gate",
    destinationTerminal: "Zielterminal",
  },
  IT: {
    terminal: "Terminal",
    boardingGate: "Gate d'imbarco",
    destinationTerminal: "Terminal di destinazione",
  },
  CA: {
    terminal: "Terminal",
    boardingGate: "Porta d'embarcament",
    destinationTerminal: "Terminal de destinació",
  },
};

const getChipVariant = (statusRaw = "") => {
  const status = statusRaw.toLowerCase();
  if (status.includes("delayed")) return "orange";
  if (status.includes("gate arrival")) return "yellow";
  return "green";
};

const formatTime24 = (time12) => {
  if (!time12) return "-";
  const [time, modifier] = time12.split(" ");
  let [hours, minutes] = time.split(":");
  hours = parseInt(hours, 10);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  const H = String(hours).padStart(2, "0");
  const M = String(minutes).padStart(2, "0");
  return `${H}:${M}`;
};

const FlightInfoCard = ({ flight, isFirst, isLast, language = "EN" }) => {
  const { flightNumber, airline, status, origin, destination } = flight;
  const logoSrc = airlineLogo[airline] || airlineLogo.DL;
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
      }}
    >
      <Stack direction={"row"}>
        <Stack direction={"column"}>
          <Typography
            sx={{
              fontFamily: "Inter, sans-serif",
              fontSize: "1rem",
              color: "black",
            }}
          >
            {formatTime24(origin.scheduled)} – {airline} {flightNumber}
          </Typography>
          <Typography
            sx={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.875rem",
              color: colors.gray500,
            }}
          >
            {origin.code} &gt; {destination.code}
          </Typography>
        </Stack>
        <Box
          component="img"
          src={logoSrc}
          alt={airline}
          sx={{
            ml: "auto",
            width: "4rem",
            height: "4rem",
            objectFit: "contain",
            borderRadius: "0.5rem",
            backgroundColor: colors.gray100,
          }}
        />
      </Stack>
      <Stack direction={"row"}>
        <Stack direction={"column"}>
          <Typography
            sx={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.875rem",
              color: colors.gray500,
            }}
          >
            {t.terminal}: {origin.terminal ?? "-"}
          </Typography>
          <Typography
            sx={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.875rem",
              color: colors.gray500,
            }}
          >
            {t.boardingGate}: {origin.gate ?? "-"}
          </Typography>
          <Typography
            sx={{
              fontFamily: "Inter, sans-serif",
              fontSize: "0.875rem",
              color: colors.gray500,
            }}
          >
            {t.destinationTerminal}: {destination.terminal ?? "-"}
          </Typography>
        </Stack>
        <Box sx={{ alignContent: "center", ml: "auto" }}>
          <CustomChip text={status} variant={getChipVariant(status)} />
        </Box>
      </Stack>
    </Stack>
  );
};

export const FlightInfoList = ({ flights, isMobile, language = "EN" }) => {
  if (!flights || flights.length === 0) {
    return null;
  }

  const flightsReversed = [...flights].reverse();

  return (
    <Stack
      sx={{ mt: 1.5 }}
      borderTop={`3px solid ${colors.primary}`}
      borderRadius={"0.75rem"}
      width={"100%"}
      maxWidth={isMobile ? "100%" : `calc(77% + 2rem)`}
    >
      {flightsReversed.map((flight, idx) => (
        <Box key={idx}>
          <FlightInfoCard
            flight={flight}
            isFirst={idx === 0}
            isLast={idx === flights.length - 1}
            language={language}
          />
        </Box>
      ))}
    </Stack>
  );
};
