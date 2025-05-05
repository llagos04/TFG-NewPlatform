// src/scenes/Dashboard/MockDashboard.jsx
import React from "react";
import { Box, Grid, Stack, Typography, useTheme } from "@mui/material";
// import StatBox from "./StatBox";
import colors from "../../styles/colors";

const RedBox = ({
  h = "100%",
  stat,
  title,
  percentage = 0,
  isPositive = true,
  width = "100%",
}) => (
  <Box
    sx={{
      bgcolor: "error.main",
      width: "100%",
      height: h,
      borderRadius: 1,
    }}
  />
);

const RedBox2 = ({
  h = "100%",
  stat,
  title,
  percentage = 0,
  isPositive = true,
  width = "100%",
}) => (
  <Box
    sx={{
      bgcolor: "error.main",
      width: "100%",
      height: h,
      borderRadius: 1,
    }}
  >
    <Stack
      sx={{
        bgcolor: "blue",
        width: "fit-content",
        height: h,
        borderRadius: 1,
        paddingLeft: 2,
      }}
    >
      <Typography
        sx={{
          fontFamily: "Inter",
          fontSize: 14,
          fontWeight: 500,
          color: "#000",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
        }}
      >
        hola
      </Typography>
    </Stack>
  </Box>
);

const StatBox = ({
  stat,
  title,
  icon,
  iconSize = "1.7rem",
  percentage = 0,
  isPositive = true,
  isAdminPanel = false,
  width = "100%",
}) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.gray200,
        borderRadius: "1rem",
        flex: 1,
        width: width,
        height: "100%",
        minWidth: 0,
        flexDirection: "column",
        justifyContent: "space-between",
        p: 2,
      }}
    >
      {/* encabezado */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Inter",
            fontSize: 14,
            fontWeight: 500,
            color: "#000",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            overflow: "hidden",
            width: "100%",
          }}
        >
          {title}
        </Typography>
      </Box>

      {/* contenido */}
      <Box sx={{ mt: 1, width: "100%" }}>
        <Typography
          sx={{
            fontFamily: "Inter",
            fontSize: 24,
            fontWeight: 700,
            color: "#000",
            lineHeight: 1.1,
            wordBreak: "break-word",
            width: "100%",
          }}
        >
          {stat}
        </Typography>

        {!isAdminPanel && (
          <Typography
            sx={{
              mt: 0.5,
              fontFamily: "Inter",
              fontSize: 12,
              fontWeight: 700,
              color: isPositive ? "#4CBF5F" : "#F15D5D",
            }}
          >
            {percentage}
            <span style={{ fontWeight: 400, color: colors.gray400 }}>
              &nbsp;este mes
            </span>
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export const NewDashboard = () => {
  const theme = useTheme();

  /*  👉 260 px para el bloque superior de AMBAS columnas
      🔎 Hay que sumar el gap vertical (theme.spacing(2) = 16 px) cuando
      se compara con el bloque inferior a la derecha. */
  const TOP = 320;
  const GAP = Number(theme.spacing(2).replace("px", "")); // 16

  const receivedStats = {
    total_threads: [82, "34%"], // 34% más que el periodo anterior
    total_messages: [547, "48%"], // aumento notable
    messages_per_thread: [6.67, "10%"], // incremento moderado
    aprox_time_saved: ["12:30", "25%"], // en formato h:mm
    leads_data: [19, "58%"], // leads generados
    languages: {
      ES: 328,
      EN: 142,
      FR: 37,
      IT: 24,
      PT: 9,
      CA: 6,
    },
    success: ["87.05%", "14%"],
  };

  const receivedData = [
    { day: "2025-03-01", total: 12 },
    { day: "2025-03-02", total: 18 },
    { day: "2025-03-03", total: 22 },
    { day: "2025-03-04", total: 30 },
    { day: "2025-03-05", total: 25 },
    { day: "2025-03-06", total: 17 },
    { day: "2025-03-07", total: 9 },
    { day: "2025-03-08", total: 13 },
    { day: "2025-03-09", total: 20 },
    { day: "2025-03-10", total: 26 },
    { day: "2025-03-11", total: 14 },
    { day: "2025-03-12", total: 0 },
    { day: "2025-03-13", total: 6 },
    { day: "2025-03-14", total: 11 },
    { day: "2025-03-15", total: 8 },
    { day: "2025-03-16", total: 4 },
    { day: "2025-03-17", total: 10 },
    { day: "2025-03-18", total: 21 },
    { day: "2025-03-19", total: 32 },
    { day: "2025-03-20", total: 19 },
    { day: "2025-03-21", total: 24 },
  ];

  return (
    <Grid container spacing={2} sx={{ height: "100%", p: 0 }}>
      {/* ─────────── Columna Izquierda (9/12) ─────────── */}
      <Grid item xs={12} md={9} sx={{ height: "100%" }}>
        <Grid container direction="column" spacing={2} sx={{ height: "100%" }}>
          {/* Izq-TOP */}
          <Grid item>
            <Grid container spacing={2} sx={{ height: TOP }}>
              {/* Col-1 (2 filas) */}
              <Grid item xs={4}>
                <Grid
                  container
                  direction="column"
                  spacing={2}
                  sx={{ height: "100%" }}
                >
                  <Grid item sx={{ flex: 1 }}>
                    <StatBox
                      stat={receivedStats ? receivedStats.total_messages[0] : 0}
                      title="Número de mensajes"
                      percentage={
                        receivedStats ? receivedStats.total_messages[1] : 0
                      }
                      isPositive={true}
                    />
                  </Grid>
                  <Grid item sx={{ flex: 1 }}>
                    <RedBox2 />
                  </Grid>
                </Grid>
              </Grid>

              {/* Col-2 (2 filas) */}
              <Grid item xs={4}>
                <Grid
                  container
                  direction="column"
                  spacing={2}
                  sx={{ height: "100%" }}
                >
                  <Grid item sx={{ flex: 1 }}>
                    <RedBox />
                  </Grid>
                  <Grid item sx={{ flex: 1 }}>
                    <RedBox />
                  </Grid>
                </Grid>
              </Grid>

              {/* Col-3 (1 fila) */}
              <Grid item xs={4}>
                <RedBox h="100%" />
              </Grid>
            </Grid>
          </Grid>

          {/* Izq-BOTTOM  ocupa el resto */}
          <Grid item sx={{ flex: 1 /* full height */ }}>
            <RedBox h="100%" />
          </Grid>
        </Grid>
      </Grid>

      {/* ─────────── Columna Derecha (3/12) ─────────── */}
      <Grid item xs={12} md={3} sx={{ height: "100%" }}>
        <Grid
          container
          direction="column"
          spacing={2}
          sx={{ height: "100%", minHeight: 0 }} // evita desbordes
        >
          {/* Der-TOP → exactamente igual que Izq-TOP  */}
          <Grid item>
            <RedBox h={TOP} />
          </Grid>

          {/* Der-BOTTOM → (100% – TOP – gap) */}
          <Grid
            item
            sx={{
              flex: 1,
              minHeight: `calc(100% - ${TOP + GAP}px)`, // asegura alineación
            }}
          >
            <RedBox h="100%" />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
