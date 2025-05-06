import React, { useState } from "react";
import { Box, Paper, Stack } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { es } from "date-fns/locale";
import { format } from "date-fns";
import colors from "../../styles/colors";

import {
  PickersLayoutRoot,
  PickersLayoutContentWrapper,
  pickersLayoutClasses,
  usePickerLayout,
} from "@mui/x-date-pickers/PickersLayout";

import { ReportContent } from "./ReportContent";

export const DailyReports = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    const formatted = format(newDate, "yyyy-MM-dd", { locale: es });
    console.log("📅 Día seleccionado:", formatted);
  };

  function CustomCalendarLayout(props) {
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
            "&:hover": {
              backgroundColor: colors.gray500,
              color: "white",
            },
            "&.MuiPickersDay-dayOutsideMonth": {
              fontWeight: 400,
              color: colors.gray500,
            },
          },
          ".MuiPickersDay-root.Mui-selected": {
            backgroundColor: colors.primary,
            color: "white",
            borderRadius: "8px",
            "&:hover": {
              backgroundColor: colors.primary,
            },
            "&:focus": {
              backgroundColor: colors.primary,
            },
          },
          ".MuiPickersDay-root.Mui-focus": {
            backgroundColor: colors.primary,
            color: "white",
          },
        }}
      >
        {toolbar}
        <PickersLayoutContentWrapper>{content}</PickersLayoutContentWrapper>
        {actionBar}
      </PickersLayoutRoot>
    );
  }

  return (
    <Box>
      <Stack direction="row" spacing={4}>
        <Box width="fit-content">
          <Paper
            elevation={0}
            sx={{
              p: 0,
              borderRadius: "1rem",
              border: `1px solid ${colors.gray300}`,
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
                slots={{ layout: CustomCalendarLayout }}
                showDaysOutsideCurrentMonth
              />
            </LocalizationProvider>
          </Paper>
        </Box>

        <Box flex={1} ml={4}>
          <ReportContent isDaily/>
        </Box>
      </Stack>
    </Box>
  );
};
