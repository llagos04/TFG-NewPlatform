import React, { useState } from "react";
import colors from "./styles/colors";
import {
  HashRouter as Router,
  Routes,
  Route,
  Outlet,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { Box, Stack } from "@mui/system";
import Page404 from "./scenes/Page404";
import ErrorPage from "./scenes/ErrorPage";
import { Sidebar } from "./components/Sidebar";
import { Typography } from "@mui/material";
import { Dashboard } from "./scenes/Dashboard/Dashboard";
import Interactions from "./scenes/Interactions/Interactions";
import { CustomTabs } from "./components/CustomTabs";
import { WeeklyReports } from "./scenes/Reports/WeeklyReports";
import { DailyReports } from "./scenes/Reports/DailyReports";
import { NewDashboard } from "./scenes/Dashboard/NewDashboard";
import { MainWidget } from "./assistant/MainWidget";

const PlatformPage = ({
  page,
  title,
  routingPages,
  isTabsPage = false,
  rightContentTitle = null,
  leftContentTitle = null,
  documentationInfo = null,
  versionDoc = "dark",
  infoDomain = null,
}) => {
  return (
    <div className="app">
      <Stack direction="row" height="100vh" width="100%">
        <Sidebar page={page} />
        <Box
          sx={{
            height: "93.5vh",
            flexGrow: 1,
            padding: "1rem 1.75rem",
            margin: "1.5vh 1.5vh 1.5vh 0rem",
            zIndex: 1,
            overflow: "hidden",
            backgroundColor: "#ffffff",
            borderRadius: "1rem",
            border: "1px solid rgba(0, 0, 0, 0.1)",
            boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.05)",
          }}
        >
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              marginTop: "0.625rem",
            }}
          >
            <Stack spacing={4} height="100%" width="100%">
              <Stack direction="row">
                <Stack
                  width="50rem"
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography
                    sx={{
                      marginTop: "1rem",
                      fontFamily: "Inter",
                      fontSize: "1.5rem",
                      fontWeight: "600",
                      color: "#000",
                    }}
                  >
                    {title}
                  </Typography>
                </Stack>
              </Stack>
              {/* Scrollable content */}
              <div
                style={{
                  height: "100%",
                  overflow: "visible",
                  paddingBottom: "0.5rem",
                }}
              >
                <Outlet />
              </div>
            </Stack>
          </Box>
        </Box>
      </Stack>
    </div>
  );
};

const TabsContent = ({ tab, tabsList, content }) => {
  const [update, setUpdate] = useState(0);
  const navigate = useNavigate();

  const filteredTabsList = Object.keys(tabsList).reduce((acc, key) => {
    acc[key] = tabsList[key];
    return acc;
  }, {});

  return (
    <Stack>
      <CustomTabs
        labels={filteredTabsList}
        tabSelected={tab}
        onTabClick={(subpage) => {
          navigate(`../${subpage}`);
          setUpdate(update + 1);
        }}
      />
      <div style={{ height: "100%" }}>{content}</div>
    </Stack>
  );
};

function App({ error }) {
  const routingPages = {
    interactions: {
      name: "Interactions",
    },
    statistics: {
      name: "Statistics",
      subpages: {},
    },
    reports: {
      name: "Reports",
      subpages: {
        daily: "daily",
        weekly: "weekly",
      },
    },
  };

  return (
    <Router basename={"/"}>
      {error ? (
        <ErrorPage errorMessage={error} />
      ) : (
        <Routes>
          {/* ------------ Assistant -------------------------*/}
          <Route path="/assistant">
            <Route path="" element={<MainWidget />} />
          </Route>
          {/* ------------ Dashboard -------------------------*/}
          <Route
            path="/dashboard"
            element={
              <PlatformPage
                routingPages={routingPages}
                page="dashboard"
                title="Dashboard"
              />
            }
          >
            <Route path="" element={<Dashboard />} />
          </Route>

          {/* ------------ Interactions -------------------------*/}
          <Route
            path="/interactions"
            element={
              <PlatformPage
                routingPages={routingPages}
                page="interactions"
                title="Interactions"
              />
            }
          >
            <Route path="" element={<Interactions />} />
          </Route>

          {/* ------------ Reports -------------------------*/}
          <Route
            path="/reports"
            element={
              <PlatformPage
                isTabsPage
                routingPages={routingPages}
                page="reports"
                title="Reports"
              />
            }
          >
            <Route index element={<Navigate to="daily" replace />} />
            <Route
              path="daily"
              element={
                <TabsContent
                  tab="Daily"
                  tabsList={{
                    Daily: "daily",
                    Weekly: "weekly",
                  }}
                  content={<DailyReports />}
                />
              }
            />
            <Route
              path="weekly"
              element={
                <TabsContent
                  tab="Weekly"
                  tabsList={{
                    Daily: "daily",
                    Weekly: "weekly",
                  }}
                  content={<WeeklyReports />}
                />
              }
            />
          </Route>

          {/* ------------ Fallback -------------------------*/}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
