import React, { useState, useCallback, useMemo, useRef } from "react";
import { Box, Paper, Stack } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { StaticDatePicker, PickersDay } from "@mui/x-date-pickers";
import { es } from "date-fns/locale";
import {
  format,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
  isSameDay,
  isSameMonth,
} from "date-fns";
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

export const WeeklyReports = () => {
  // --- Estado de selección de semana ---
  const today = new Date();
  const initialStart = startOfWeek(today, { weekStartsOn: 1 });
  const initialStr = format(initialStart, "yyyy-MM-dd", { locale: es });
  const [selectedDate, setSelectedDate] = useState(initialStart);
  const [selectedWeekStart, setSelectedWeekStart] = useState(initialStr);
  const [visibleMonth, setVisibleMonth] = useState(initialStart);
  const [hoveredWeek, setHoveredWeek] = useState(null);
  const lastHoveredDay = useRef(null);

  // --- Datos estáticos (métricas, topics, recomendaciones y acciones) ---
  const weekInsight = {
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
      { title: "Tiempo estimado de espera", value: 1 },
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
      "Varios usuarios no encuentran el punto de atención al cliente.",
      "Agregar información actualizada sobre restaurantes abiertos en la Terminal F.",
      "Añadir protocolo de asistencia para menores no acompañados.",
      "Varios usuarios preguntan por la clave del WiFi.",
    ],
    actions: [
      "Incluir enlace directo para cancelar pedidos en el flujo de cancelación (ID: 1585).",
      "Revisar respuestas imprecisas sobre la ubicación de las puertas de embarque B.",
      "Mejorar la detección de audio en conversaciones en francés.",
      "Baja tasa de satisfacción en consultas sobre objetos perdidos.",
    ],
    // (si tu InformeHTML necesita text_insights, puedes concatenar aquí un string con <li>…</li> o Markdown)
    text_insights: null,
  };

  // --- Datos fijos para la gráfica de líneas ---
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

  // --- Handlers para cambio de semana y mes ---
  const handleWeekChange = useCallback((newDate) => {
    const start = startOfWeek(newDate, { weekStartsOn: 1 });
    setSelectedDate(newDate);
    setSelectedWeekStart(format(start, "yyyy-MM-dd", { locale: es }));
    setVisibleMonth(newDate);
  }, []);

  const handleMonthChange = useCallback((newMonth) => {
    setVisibleMonth(newMonth);
    setSelectedDate(newMonth);
    lastHoveredDay.current = null;
    setHoveredWeek(null);
  }, []);

  const handleDayHover = useCallback((day) => {
    if (!lastHoveredDay.current || !isSameDay(lastHoveredDay.current, day)) {
      const start = startOfWeek(day, { weekStartsOn: 1 });
      const end = endOfWeek(day, { weekStartsOn: 1 });
      setHoveredWeek({ start, end });
      lastHoveredDay.current = day;
    }
  }, []);

  // --- Renderizado de cada día en bloque semanal ---
  const MyCustomDay = useMemo(() => {
    return React.forwardRef((props, ref) => {
      const { day, outsideCurrentMonth, ...other } = props;
      const isSelectedWeek =
        selectedDate &&
        isWithinInterval(day, {
          start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
          end: endOfWeek(selectedDate, { weekStartsOn: 1 }),
        });
      const isHoveredWeek = hoveredWeek && isWithinInterval(day, hoveredWeek);
      const isStartOfWeek = isSameDay(
        day,
        startOfWeek(selectedDate, { weekStartsOn: 1 })
      );
      const isEndOfWeek = isSameDay(
        day,
        endOfWeek(selectedDate, { weekStartsOn: 1 })
      );

      return (
        <PickersDay
          {...other}
          ref={ref}
          day={day}
          outsideCurrentMonth={outsideCurrentMonth}
          selected={isSelectedWeek}
          onMouseEnter={() => handleDayHover(day)}
          onMouseLeave={() => setHoveredWeek(null)}
          onClick={() => handleWeekChange(day)}
          sx={{
            backgroundColor: isSelectedWeek
              ? "#FFCEDD"
              : isHoveredWeek
              ? colors.grey[150]
              : "inherit",
            color: outsideCurrentMonth
              ? "#7f7f83"
              : isSelectedWeek
              ? colors.grey[700]
              : colors.grey[700],
            borderRadius: isSelectedWeek || isHoveredWeek ? 0 : "8px",
            fontWeight: isSameMonth(day, visibleMonth) ? 700 : 400,
            p: 0,
            m: 0,
            width: "2rem",
            height: "2rem",
          }}
        />
      );
    });
  }, [
    selectedDate,
    hoveredWeek,
    visibleMonth,
    handleDayHover,
    handleWeekChange,
  ]);

  // --- Layout del picker (sin bordes extra) ---
  function MyCustomLayout(props) {
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

  // --- Fechas para el título ---
  const startTitle = format(new Date(selectedWeekStart), "dd/MM/yyyy", {
    locale: es,
  });
  const endTitle = format(
    endOfWeek(new Date(selectedWeekStart), { weekStartsOn: 1 }),
    "dd/MM/yyyy",
    { locale: es }
  );

  return (
    <TabsRightContentContainer
      rightContent={
        <Box width="fit-content">
          {/* Aquí podrías poner un botón de exportar */}
        </Box>
      }
    >
      <Box>
        <Stack direction="row" spacing={4}>
          {/* Calendario estático */}
          <Box width="fit-content">
            <Paper
              elevation={0}
              sx={{
                borderRadius: "1rem",
                border: `1px solid ${colors.grey[150]}`,
              }}
            >
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={es}
              >
                <StaticDatePicker
                  displayStaticWrapperAs="desktop"
                  value={selectedDate}
                  onChange={handleWeekChange}
                  onMonthChange={handleMonthChange}
                  minDate={new Date("2024-01-01")}
                  maxDate={new Date("2026-12-31")}
                  slots={{
                    layout: MyCustomLayout,
                    day: MyCustomDay,
                  }}
                  showDaysOutsideCurrentMonth
                  reduceAnimations={false}
                />
              </LocalizationProvider>
            </Paper>
          </Box>

          {/* Informe hardcodeado */}
          {/* <Box width="100%">
            <Box
              height="calc(100vh - 15rem)"
              sx={{ overflow: "auto", width: "100%" }}
            >
              <InformeHTML
                semana={`Semana ${startTitle} - ${endTitle}`}
                data={{
                  ...weekInsight,
                  receivedData,
                }}
              />
            </Box>
          </Box> */}
        </Stack>
      </Box>
    </TabsRightContentContainer>
  );
};
