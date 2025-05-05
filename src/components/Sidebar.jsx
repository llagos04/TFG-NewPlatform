import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Box, Grid, Stack, Drawer } from "@mui/material";

import colors from "../styles/colors";

import LogoAtlanta from "../assets/Atlanta_logo.png";
import { MenuItemSideBar } from "./MenuItemSidebar";

import { PiChartLineUp, PiChats, PiFileText } from "react-icons/pi";

export const Sidebar = ({ page }) => {
  const navigate = useNavigate();

  const drawerWidth = 16;

  const handleTabClick = (url) => {
    navigate("/" + url);
  };

  const drawer = (
    <div style={{ height: "100vh", width: "100%" }}>
      <Stack height="100%" justifyContent={"space-between"}>
        <Stack>
          <div>
            <Grid container spacing={0} width="100%" paddingX={"1.3rem"}>
              <Grid item xs={12}>
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  margin="4rem 0 1.75rem 0"
                >
                  <img
                    src={LogoAtlanta}
                    alt="Logo byNeural"
                    style={{ maxWidth: "90%" }}
                  />
                </Box>
              </Grid>
            </Grid>
          </div>
          {/* <Divider/> */}
          <div>
            <Grid container width="100%" paddingX={"1.3rem"}>
              <Grid item xs={12}>
                <Box>
                  <Stack
                    sx={{
                      paddingTop: "1rem",
                    }}
                    spacing={0}
                  >
                    <MenuItemSideBar
                      icon={<PiChartLineUp fontSize="1.3rem" />}
                      url={"estadisticas"}
                      page={page}
                      title_page="Estadísticas"
                      onTabClick={handleTabClick}
                    />

                    <MenuItemSideBar
                      icon={<PiChats fontSize="1.3rem" />}
                      url={"interacciones"}
                      page={page}
                      title_page="Interacciones"
                      onTabClick={handleTabClick}
                    />

                    <MenuItemSideBar
                      icon={
                        <PiFileText
                          fontSize="1.3rem"
                          style={{ marginTop: "-0.125rem" }}
                        />
                      }
                      url={"informes"}
                      page={page}
                      title_page="Informes"
                      onTabClick={handleTabClick}
                    />
                  </Stack>
                </Box>
              </Grid>
            </Grid>
          </div>
        </Stack>
      </Stack>
    </div>
  );

  return (
    <Box>
      <Box
        component="nav"
        sx={{ width: { md: `${drawerWidth}rem` }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="permanent"
          sx={{
            "& .MuiDrawer-paper": {
              width: `${drawerWidth}rem`,
              backgroundColor: "transparent",
              borderRight: `1px solid transparent`,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
};
