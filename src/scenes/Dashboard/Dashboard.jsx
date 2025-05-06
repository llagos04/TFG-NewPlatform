import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import colors from "../../styles/colors";
import StatBox from "./StatBox";
import PieChartDashboard from "./PieChartDashboard";
import ChartDashboard from "./ChartDashboard";
import TextBoxDashboard from "./TextDashboard";
import { useDashboardStats } from "../../hooks/useDashboardStats";

export const Dashboard = () => {
  // Hardcoded stats data
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

  const { stats: receivedStats2, loading } = useDashboardStats();

  function getMonthRangeLabel(data) {
    if (!Array.isArray(data) || data.length === 0) {
      return "";
    }

    const firstDate = new Date(data[0].day);
    const lastDate = new Date(data[data.length - 1].day);

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const firstMonth = months[firstDate.getMonth()];
    const lastMonth = months[lastDate.getMonth()];

    return firstMonth === lastMonth
      ? firstMonth
      : `${firstMonth} - ${lastMonth}`;
  }

  return (
    <Box>
      {/* ---------------------- Stats Grid ---------------------- */}
      <Grid container spacing={0} sx={{ width: "100%" }}>
        {/* Stats + Languages + Chart */}
        <Grid item xs={9} sx={{ width: "100%" }}>
          <Grid container spacing={2} sx={{ width: "100%" }}>
            {/* Stats */}
            <Grid item xs={4} sx={{ height: "19.5rem", width: "100%" }}>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  height: "19.5rem",
                  width: "100%",
                }}
              >
                <StatBox
                  stat={receivedStats2 ? receivedStats2.total_messages[0] : 0}
                  title="Number of messages"
                  percentage={
                    receivedStats ? receivedStats.total_messages[1] : 0
                  }
                  isPositive={true}
                />
                <StatBox
                  stat={
                    receivedStats2 ? receivedStats2.messages_per_thread[0] : 0
                  }
                  title="Messages per conversation"
                  percentage={
                    receivedStats ? receivedStats.messages_per_thread[1] : 0
                  }
                  isPositive={false}
                />
              </Box>
            </Grid>
            <Grid item xs={4} sx={{ height: "19.5rem", width: "100%" }}>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  height: "19.5rem",
                }}
              >
                <StatBox
                  stat={receivedStats2 ? receivedStats2.total_threads[0] : 0}
                  title="Number of conversations"
                  iconSize={"1.4rem"}
                  percentage={
                    receivedStats ? receivedStats.total_threads[1] : 0
                  }
                  isPositive={true}
                />
                <StatBox
                  stat={
                    receivedStats2
                      ? receivedStats2.aprox_time_saved[0] + " h"
                      : "00:00"
                  }
                  title="Time saved"
                  iconSize={"1.4rem"}
                  percentage={
                    receivedStats ? receivedStats.aprox_time_saved[1] : 0
                  }
                  isPositive={true}
                />
              </Box>
            </Grid>
            {/* Languages */}
            <Grid item xs={4} sx={{ width: "auto" }}>
              <Box
                sx={{
                  width: "auto",
                  height: "19.5rem",
                }}
              >
                <PieChartDashboard
                  totalThreads={receivedStats.total_threads[0]}
                  languages={receivedStats.languages}
                />
              </Box>
            </Grid>
            {/* Message Chart */}
            <Grid item xs={12}>
              <Box
                sx={{
                  height: "22rem",
                  backgroundColor: colors.gray200,
                  borderRadius: "1rem",
                  pt: "1.25rem",
                  width: "100%",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontSize: "0.875rem",
                    color: colors.gray800,
                    textAlign: "center",
                    marginBottom: "1rem",
                  }}
                >
                  Number of messages:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {getMonthRangeLabel(receivedData)}
                  </span>
                </Typography>
                <Box
                  padding={{ xs: "1rem 3rem 3rem 0rem" }}
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
        {/* Summary + Suggestions */}
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
                  title="Success rate"
                  percentage={receivedStats ? receivedStats.success[1] : 0}
                  isPositive={false}
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  height: "34rem",
                  width: "auto",
                  backgroundColor: "#fff",
                  borderRadius: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <TextBoxDashboard
                  title={"Suggested changes and improvements"}
                  text={
                    <ul style={{ paddingLeft: "1.25rem", margin: 0 }}>
                      <li>
                        Add information about the shuttle service schedule to
                        downtown Atlanta.
                      </li>
                      <li>
                        Review inaccurate responses regarding the location of
                        Gate B.
                      </li>
                      <li>Improve audio detection in French conversations.</li>
                      <li>
                        Missing information about baggage weight limits for
                        Delta Airlines.
                      </li>
                      <li>
                        Several users cannot find the customer service desk.
                      </li>
                      <li>
                        Low satisfaction rate in lost and found inquiries.
                      </li>
                      <li>
                        Add updated information about open restaurants in
                        Terminal F.
                      </li>
                      <li>
                        Include assistance protocol for unaccompanied minors.
                      </li>
                      <li>
                        Several users ask for the WiFi password – add clear
                        information.
                      </li>
                    </ul>
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
