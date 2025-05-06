import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
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
import { ReportContent } from "./ReportContent";

export const WeeklyReports = () => {
  const today = new Date();

  const [selectedWeek, setSelectedWeek] = useState(null);
  const [selectedWeekStart, setSelectedWeekStart] = useState(null);
  const [selectedDate, setSelectedDate] = useState(today);
  const [hoveredWeek, setHoveredWeek] = useState(null);
  const lastHoveredDay = useRef(null);
  const [isWeekSelectionMode, setIsWeekSelectionMode] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(today);
  const [monthChange, setMonthChange] = useState(false);

  const handleWeekChange = useCallback((newDate) => {
    // Calculamos el inicio (lunes) y el fin de la semana
    const start = startOfWeek(newDate, { weekStartsOn: 1 });
    // const end = endOfWeek(newDate, { weekStartsOn: 1 }); // Ya no es necesario para la petición

    // Formateamos la fecha del lunes
    const formattedStartDate = format(start, "yyyy-MM-dd", { locale: es });
    // const formattedEndDate = format(end, "yyyy-MM-dd", { locale: es });

    setSelectedDate(newDate);
    setVisibleMonth(newDate);
    setIsWeekSelectionMode(false);
    // En lugar de pasar el fin de semana, pasamos el lunes
    setSelectedWeek(formattedStartDate);
    setSelectedWeekStart(formattedStartDate);
    setMonthChange(false);
  }, []);

  const handleMonthChange = useCallback((newMonth) => {
    setVisibleMonth(newMonth);
    setSelectedDate(newMonth);
    setIsWeekSelectionMode(false);
    setMonthChange(false); // Asegurar que se resetee correctamente
    lastHoveredDay.current = null;
    setHoveredWeek(null);
  }, []);

  const handleDayHover = useCallback(
    (day) => {
      if (!lastHoveredDay.current || !isSameDay(lastHoveredDay.current, day)) {
        const start = startOfWeek(day, { weekStartsOn: 1 });
        const end = endOfWeek(day, { weekStartsOn: 1 });
        setHoveredWeek({ start, end });
        lastHoveredDay.current = day;
      }
    },
    [hoveredWeek]
  );

  const MyCustomDay = useMemo(() => {
    return React.forwardRef((props, ref) => {
      const { day, outsideCurrentMonth, ...other } = props;

      const isSelectedWeek =
        selectedDate &&
        !monthChange &&
        isWithinInterval(day, {
          start: startOfWeek(selectedDate, { weekStartsOn: 1 }),
          end: endOfWeek(selectedDate, { weekStartsOn: 1 }),
        });

      const isHoveredWeek = hoveredWeek && isWithinInterval(day, hoveredWeek);

      const isStartOfWeek = isSameDay(
        day,
        startOfWeek(day, { weekStartsOn: 1 })
      );
      const isEndOfWeek = isSameDay(day, endOfWeek(day, { weekStartsOn: 1 }));

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
              ? isStartOfWeek || isEndOfWeek
                ? `${colors.primary} !important`
                : `${"#FFCEDD"} !important`
              : isHoveredWeek
              ? isStartOfWeek || isEndOfWeek
                ? `${colors.gray500} !important`
                : colors.gray200
              : "inherit",
            color: outsideCurrentMonth
              ? isSelectedWeek || isHoveredWeek
                ? isStartOfWeek || isEndOfWeek
                  ? "white !important"
                  : `${colors.gray700} !important`
                : "#7f7f83 !important"
              : isSelectedWeek
              ? isStartOfWeek || isEndOfWeek
                ? "white !important"
                : `${colors.gray700} !important`
              : isHoveredWeek
              ? isStartOfWeek || isEndOfWeek
                ? "white !important"
                : colors.gray700
              : `${colors.gray700} !important`,
            borderRadius:
              isSelectedWeek || isHoveredWeek
                ? isStartOfWeek
                  ? "8px 0 0 8px !important"
                  : isEndOfWeek
                  ? "0 8px 8px 0 !important"
                  : "0px !important"
                : "8px",
            "&:hover": {
              backgroundColor: isHoveredWeek
                ? isStartOfWeek || isEndOfWeek
                  ? `${colors.gray500} !important`
                  : colors.gray300
                : colors.gray300,
            },
            fontWeight: isSameMonth(day, visibleMonth)
              ? "bold"
              : "400 !important",
          }}
        />
      );
    });
  }, [selectedDate, handleWeekChange, colors, visibleMonth, monthChange]);

  function MyCustomLayout(props) {
    const { toolbar, content, actionBar } = usePickerLayout(props);
    return (
      <PickersLayoutRoot
        className={pickersLayoutClasses.root}
        ownerState={props}
        sx={{
          minWidth: "0px !important",
          ".MuiDateCalendar-root": {
            width: "fit-content",
            p: "0 1rem",
            m: 0,
            height: "fit-content",
          },
          ".MuiDayCalendar-slideTransition": {
            height: "14rem",
            minHeight: "auto",
          },
          ".MuiDayCalendar-weekDayLabel": {
            width: "2rem",
            m: 0,
            color: "transparent",
            mt: "-1rem",
            height: "0 !important",
          },
          ".MuiPickersCalendarHeader-root": {
            fontSize: "0.75rem",
            fontFamily: "Inter, Arial, sans-serif",
            width: "auto",
            pr: 0,
            pl: "0.5rem",
          },
          ".MuiTypography-h4": {
            fontSize: "0.75rem",
            fontFamily: "Inter, Arial, sans-serif",
          },
          ".MuiPickersCalendarHeader-label": {
            fontSize: "0.75rem",
            fontFamily: "Inter, Arial, sans-serif",
          },
          ".MuiPickersYear-yearButton": {
            fontSize: "0.75rem",
            fontFamily: "Inter, Arial, sans-serif",
          },
          ".MuiPickersDay-root": {
            fontSize: "0.75rem",
            fontFamily: "Inter, Arial, sans-serif",
            fontWeight: 700,
            color: colors.gray700,
            p: 0,
            m: 0,
            width: "2rem",
            height: "2rem",
            borderRadius: "8px",
          },

          ".MuiPickersCalendarHeader-switchViewButton, .MuiPickersArrowSwitcher-button":
            {
              visibility: "visible !important",
              opacity: "1 !important",
            },
        }}
      >
        {toolbar}
        <PickersLayoutContentWrapper
          className={pickersLayoutClasses.contentWrapper}
        >
          {content}
        </PickersLayoutContentWrapper>
        {actionBar}
      </PickersLayoutRoot>
    );
  }

  return (
    <Box>
      <Stack direction="row" spacing={4}>
        <Box width="fit-content">
          <Paper
            sx={{
              pb: "-1rem",
              borderRadius: "1rem",
              border: `1px solid ${colors.gray300}`,

              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            elevation={0}
          >
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              adapterLocale={es}
            >
              <StaticDatePicker
                displayStaticWrapperAs="desktop"
                label="Seleccione una semana"
                value={selectedDate}
                onChange={handleWeekChange}
                onMonthChange={handleMonthChange}
                minDate={new Date("2024-01-01")}
                maxDate={new Date("2026-12-31")}
                slots={{
                  layout: MyCustomLayout,
                  day: MyCustomDay,
                }}
                showDaysOutsideCurrentMonth={true}
                reduceAnimations={false}
                sx={{
                  ".MuiPickersCalendarHeader-iconButton": {
                    transition: "none", // Eliminar transiciones
                  },
                }}
              />
            </LocalizationProvider>
          </Paper>
        </Box>

        <Box flex={1} ml={4}>
          <ReportContent isDaily={false}/>
        </Box>
      </Stack>
    </Box>
  );
};
