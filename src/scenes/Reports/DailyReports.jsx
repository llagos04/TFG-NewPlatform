import React, { useState, useCallback, useRef, useMemo } from "react";
import { Box, Paper, Stack, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { StaticDatePicker, PickersDay } from "@mui/x-date-pickers";
import { es } from "date-fns/locale";
import { format, isSameDay, isSameMonth } from "date-fns";
import {
  PickersLayoutRoot,
  PickersLayoutContentWrapper,
  pickersLayoutClasses,
  usePickerLayout,
} from "@mui/x-date-pickers/PickersLayout";
import colors from "../../styles/colors";

const TabsRightContentContainer = ({ children, rightContent }) => {
  return (
    <Stack sx={{ mt: "-4.5rem" }}>
      <Box
        sx={{
          width: "100%",
          height: "3rem",
          // backgroundColor: "rgba(255, 0, 0, 0.3)",
          display: "flex", // Usamos flexbox
          justifyContent: "flex-end", // Contenido alineado a la derecha
          alignItems: "center",
          alignContent: "center",
          overflow: "hidden",
          mb: "1.5rem",
        }}
      >
        {rightContent}
      </Box>
      {children}
    </Stack>
  );
};

export const DailyReports = () => {
  // --- Estado de selección de día ---
  const today = new Date();
  const inicialStr = format(today, "yyyy-MM-dd", { locale: es });
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedDay, setSelectedDay] = useState(inicialStr);
  const [hoveredDay, setHoveredDay] = useState(null);
  const lastHovered = useRef(null);

  // --- Datos estáticos ---
  const dailyInsightsData = [inicialStr]; // siempre disponible
  const dayInsight = {
    metrics: {
      conversations: 570,
      messages: 864,
      success: "87%",
    },
    topics: [
      { title: "Políticas de equipaje", value: 15 },
      { title: "Objetos prohibidos", value: 43 },
      { title: "Información sobre terminales", value: 7 },
      { title: "Puerta de embarque", value: 69 },
      { title: "Normas de seguridad", value: 69 },
      { title: "Tiempo estimado de espera", value: 1 },
      { title: "Ayuda movilidad reducida", value: 15 },
      { title: "Dónde comer/comprar", value: 43 },
      { title: "WiFi disponible", value: 7 },
      { title: "Aparcamientos y precios", value: 69 },
    ],
    recommendations: [
      "Incluir opciones de telescopios disponibles en tienda (ID: 1523).",
      "Proporcionar un procedimiento para resolver pedidos incorrectos (ID: 1535).",
      "Agregar información sobre tiendas en Madrid y su inventario (ID: 1537).",
      "Incluir juguetes de coches específicos según rangos de edad (ID: 1553).",
      "Añadir información sobre los horarios del servicio de transporte al centro de Atlanta.",
      "Falta información sobre límites de peso para equipaje facturado con Delta Airlines.",
      "Usuarios no encuentran el punto de atención al cliente.",
      "Agregar información sobre restaurantes abiertos en la Terminal F.",
      "Añadir protocolo de asistencia para menores no acompañados.",
      "Usuarios preguntan por la clave del WiFi.",
    ],
    actions: [
      "Incluir enlace directo para cancelar pedidos en el flujo de cancelación (ID: 1585).",
      "Revisar respuestas imprecisas sobre la ubicación de las puertas de embarque B.",
      "Mejorar la detección de audio en conversaciones en francés.",
      "Baja tasa de satisfacción en consultas sobre objetos perdidos.",
    ],
    text_insights: null,
  };

  // --- Handlers de cambio de día ---
  const handleDateChange = useCallback((newDate) => {
    const str = format(newDate, "yyyy-MM-dd", { locale: es });
    setSelectedDate(newDate);
    setSelectedDay(str);
  }, []);

  const handleDayHover = useCallback((day) => {
    if (!lastHovered.current || !isSameDay(lastHovered.current, day)) {
      lastHovered.current = day;
      setHoveredDay(day);
    }
  }, []);

  // --- Renderizado de cada día para mantener highlight semanal (opcional) ---
  const MyCustomDay = useMemo(() => {
    return React.forwardRef((props, ref) => {
      const { day, outsideCurrentMonth, ...other } = props;
      const isToday = isSameDay(day, selectedDate);
      return (
        <PickersDay
          {...other}
          ref={ref}
          day={day}
          outsideCurrentMonth={outsideCurrentMonth}
          selected={isToday}
          onMouseEnter={() => handleDayHover(day)}
          sx={{
            backgroundColor: isToday ? colors.primary : "inherit",
            color: isToday ? "white" : colors.gray700,
            fontWeight: isSameMonth(day, selectedDate) ? 700 : 400,
            width: "2rem",
            height: "2rem",
            borderRadius: "8px",
          }}
        />
      );
    });
  }, [selectedDate, handleDayHover]);

  // --- Layout del picker sin estilos extra ---
  function MyLayout(props) {
    const { toolbar, content, actionBar } = usePickerLayout(props);
    return (
      <PickersLayoutRoot
        className={pickersLayoutClasses.root}
        ownerState={props}
        sx={{
          ".MuiDateCalendar-root": { p: 0, m: 0 },
          ".MuiDayCalendar-slideTransition": { height: "14rem" },
          ".MuiPickersDay-root": { borderRadius: "8px" },
        }}
      >
        {toolbar}
        <PickersLayoutContentWrapper>{content}</PickersLayoutContentWrapper>
        {actionBar}
      </PickersLayoutRoot>
    );
  }

  return (
    <TabsRightContentContainer
      rightContent={<Box width="fit-content">{/* botón exportar aquí */}</Box>}
    >
      <Box
        height="calc(100vh - 15rem)"
        sx={{ overflow: "auto", width: "100%" }}
      >
        <Stack direction="row" spacing={4}>
          {/* Calendario estático */}
          <Box>
            <Paper
              elevation={0}
              sx={{
                borderRadius: "1rem",
                border: `1px solid ${colors.gray200}`,
                p: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={es}
              >
                <StaticDatePicker
                  displayStaticWrapperAs="desktop"
                  value={selectedDate}
                  onChange={handleDateChange}
                  minDate={new Date("2024-01-01")}
                  maxDate={new Date("2026-12-31")}
                  slots={{ layout: MyLayout, day: MyCustomDay }}
                  renderInput={(params) => <TextField {...params} />}
                  showDaysOutsideCurrentMonth
                  reduceAnimations={false}
                />
              </LocalizationProvider>
            </Paper>
          </Box>

          {/* Informe hardcodeado */}
          {/* <Box width="100%">
            <InformeHTML
              data={dayInsight}
              periodo="diario"
              availableData={
                selectedDay !== null &&
                dailyInsightsData.includes(selectedDay)
              }
            />
          </Box> */}
        </Stack>
      </Box>
    </TabsRightContentContainer>
  );
};
