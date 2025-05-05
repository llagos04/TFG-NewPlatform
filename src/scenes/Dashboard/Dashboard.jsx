import React from "react";
import { Box, Typography,  Grid } from "@mui/material";
import colors from "../../styles/colors";
import StatBox from "./StatBox";
import PieChartDashboard from "./PieChartDashboard";
import ChartDashboard from "./ChartDashboard";
import TextBoxDashboard from "./TextDashboard";

export const Dashboard = () => {
  
  const receivedStats = {
    total_threads: [82, "34%"], 
    total_messages: [547, "48%"], 
    messages_per_thread: [6.67, "10%"], 
    aprox_time_saved: ["12:30", "25%"], 
    leads_data: [19, "58%"], 
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

  function obtenerMesesDelRango(data) {
    
    if (!Array.isArray(data) || data.length === 0) {
      return "";
    }

    
    const primerFecha = new Date(data[0].day);
    const ultimaFecha = new Date(data[data.length - 1].day);

   
    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    
    const primerMes = meses[primerFecha.getMonth()];
    const ultimoMes = meses[ultimaFecha.getMonth()];

    
    return primerMes === ultimoMes ? primerMes : `${primerMes} - ${ultimoMes}`;
  }

  return (
    <Box>
      {/* ---------------------- Grid de Estadísticas ---------------------- */}
      <Grid container spacing={2}>
        {/* Stats + Idiomas + Gráfica */}
        <Grid item xs={9}>
          <Grid container spacing={2}>
            {/* Stats */}
            <Grid item xs={4} sx={{ height: "19.5rem" }}>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2, // Espaciado interno entre los StatBox
                  height: "19.5rem",
                }}
              >
                <StatBox
                  stat={receivedStats ? receivedStats.total_messages[0] : 0}
                  title="Número de mensajes"
                  percentage={
                    receivedStats ? receivedStats.total_messages[1] : 0
                  }
                  isPositive={true}
                />
                <StatBox
                  stat={
                    receivedStats ? receivedStats.messages_per_thread[0] : 0
                  }
                  title="Mensajes por conversación"
                  percentage={
                    receivedStats ? receivedStats.messages_per_thread[1] : 0
                  }
                  isPositive={false}
                />
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ height: "19.5rem" }}>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2, // Espaciado interno entre los StatBox
                  height: "19.5rem",
                }}
              >
                <StatBox
                  stat={receivedStats ? receivedStats.total_threads[0] : 0}
                  title="Número de conversaciones"
                  iconSize={"1.4rem"}
                  percentage={
                    receivedStats ? receivedStats.total_threads[1] : 0
                  }
                  isPositive={true}
                />
                <StatBox
                  stat={
                    receivedStats
                      ? receivedStats.aprox_time_saved[0] + " h"
                      : "00:00"
                  }
                  title="Tiempo ahorrado"
                  iconSize={"1.4rem"}
                  percentage={
                    receivedStats ? receivedStats.aprox_time_saved[1] : 0
                  }
                  isPositive={true}
                />
              </Box>
            </Grid>
            {/* Idiomas */}
            <Grid item xs={4}>
              <Box
                sx={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <PieChartDashboard
                  totalThreads={receivedStats.total_threads[0]}
                  languages={receivedStats.languages}
                />
              </Box>
            </Grid>
            {/* Gráfica */}
            <Grid item xs={12}>
              <Box
                sx={{
                  height: "22rem",
                  backgroundColor: colors.gray200,
                  borderRadius: "1rem",
                  pt: "1.25rem",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontSize: "0.875rem",
                    color: "#000",
                    textAlign: "center", // Centra el título
                    marginBottom: "1rem", // Añade un margen inferior para separar el título del gráfico
                  }}
                >
                  Número de mensajes:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {obtenerMesesDelRango(receivedData)}
                  </span>
                </Typography>
                <Box
                  padding={{
                    xs: "1rem 3rem 3rem 0rem",
                  }}
                  sx={{ height: "100%" }}
                >
                  <ChartDashboard
                    receivedData={receivedData}
                    isDashboard={true}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={3}
          sx={{
            display: "flex",
            flexDirection: "column",

            justifyContent: "space-between",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box
                sx={{
                  flex: 1,
                  borderRadius: "1rem",
                }}
              >
                <StatBox
                  stat={receivedStats ? receivedStats.success[0] : 0}
                  title="Mensajes por conversación"
                  percentage={receivedStats ? receivedStats.success[1] : 0}
                  isPositive={false}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  height: "33rem",
                  backgroundColor: "#fff",
                  borderRadius: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextBoxDashboard
                  title={"Cambios y modificaciones sugeridas"}
                  text={
                    <>
                      Añadir información sobre los horarios del servicio de
                      transporte al centro de Atlanta. Revisar respuestas
                      imprecisas sobre la ubicación de las puertas de embarque
                      B. Mejorar la detección de audio en conversaciones en
                      francés. Falta información sobre límites de peso para
                      equipaje facturado con Delta Airlines. Varios usuarios no
                      encuentran el punto de atención al cliente Baja tasa de
                      satisfacción en consultas sobre objetos perdidos. Añadir
                      información actualizada sobre restaurantes abiertos en la
                      Terminal F. Añadir protocolo de asistencia para menores no
                      acompañados. Varios usuarios preguntan por la clave del
                      WiFi - agregar información clara.
                    </>
                  }
                  height={"100%"}
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};
