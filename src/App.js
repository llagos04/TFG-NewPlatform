import React, { useState } from "react";
import colors from "./styles/colors";
import {
  BrowserRouter as Router,
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
      <Sidebar page={page} />
      {/* <ChatBot id={"byneural"} /> */}
      <Box
        sx={{
          height: "97vh",
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
        <div
          style={{
            // backgroundColor: 'rgba(0, 0, 0, 0.5)',
            overflow: "hidden",
            height: "100%",
            marginTop: "0.625rem",
            width: "100%",
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
                    fontFamily: "Inter",
                    fontSize: "1.25rem",
                    fontWeight: "600",
                    color: colors.gray600,
                  }}
                >
                  {title}
                </Typography>
              </Stack>
            </Stack>
            <div
              style={{
                height: "100%",
                overflow: isTabsPage ? "auto" : "visible",
                paddingBottom: "0rem",
              }}
            >
              <Outlet />
            </div>
          </Stack>
        </div>
      </Box>
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
      {/* <AnimatedDiv triggerUpdate={update}> */}
      <div
        style={{
          height: "100%",
          //  overflow: "auto",
        }}
      >
        {" "}
        {content}
      </div>

      {/* </AnimatedDiv> */}
    </Stack>
  );
};

function App({ error }) {
  const routingPages = {
    interacciones: {
      name: "Interacciones",
    },
    estadisticas: {
      name: "Estadísticas",
      subpages: {},
    },
    informes: {
      name: "Informes",
      subpages: {
        diarios: "Diarios",
        semanales: "Semanales",
      },
    },
  };

  return (
    <Router basename={"/"}>
      {error ? (
        <ErrorPage errorMessage={error} />
      ) : (
        <Routes>
          <Route index element={<Navigate to="estadisticas" replace />} />
          {/* ------------ Dashboard -------------------------*/}
          <Route
            path="/estadisticas"
            element={
              <PlatformPage
                routingPages={routingPages}
                page="estadisticas"
                title="Estadísticas"
              />
            }
          >
            <Route path="" element={<Dashboard />} />
          </Route>
          {/* ------------ Interactions -------------------------*/}
          <Route
            path="/interacciones"
            element={
              <PlatformPage
                routingPages={routingPages}
                page="interacciones"
                title="Interacciones"
              />
            }
          >
            <Route path="" element={<Interactions />} />
          </Route>
          {/* ------------ Reports -------------------------*/}
          <Route
            path="/informes"
            element={
              <PlatformPage
                isTabsPage
                routingPages={routingPages}
                page="informes"
                title="Informes"
              />
            }
          >
            <Route index element={<Navigate to="diarios" replace />} />
            <Route
              path="diarios"
              element={
                <TabsContent
                  tab="Diarios"
                  tabsList={{
                    Diarios: "diarios",
                    Semanales: "semanales",
                  }}
                  content={<WeeklyReports />}
                />
              }
            />
            <Route
              path="semanales"
              element={
                <TabsContent
                  tab="Semanales"
                  tabsList={{
                    Diarios: "diarios",
                    Semanales: "semanales",
                  }}
                  content={<DailyReports />}
                />
              }
            />
          </Route>
          <Route path="*" element={<Page404 />} /> {/* Página 404 */}
        </Routes>
      )}
    </Router>
  );
}

export default App;
