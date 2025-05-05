import React from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { CustomButton } from "../components/CustomButton";

export const Page404 = () => {
  const navigate = useNavigate();
  return (
    <Grid
      container
      width="100%"
      height="100vh" // Ajusta la altura al 100% de la ventana
      alignItems="center"
      justifyContent="center"
    >
      <Grid item xs={12} alignItems="center"></Grid>
      <Grid item xs={12} container alignItems="center" justifyContent="center">
        <Stack spacing={2} alignItems="center">
          <Typography
            sx={{
              fontSize: "4rem",
              fontWeight: "800",
              fontFamily: "Inter",
              textAlign: "center",
            }}
          >
            404
          </Typography>
          <Typography
            sx={{
              fontSize: "1.25rem",
              fontWeight: "500",
              fontFamily: "Inter",
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            Página no encontrada
          </Typography>
          <Box
            display="flex"
            width="20rem"
            alignItems="center"
            justifyContent="center"
            paddingTop="1rem"
          >
            <CustomButton
              label="Ir a Login"
              changesNotSaved={true}
              variant="white"
              onClick={() => navigate("/login")}
            />
          </Box>
          <Box
            display="flex"
            width="20rem"
            alignItems="center"
            justifyContent="center"
            paddingTop="0.5rem"
          >
            <CustomButton
              label="Ir al Panel de Control"
              changesNotSaved={true}
              onClick={() => navigate("/")}
            />
          </Box>
        </Stack>
      </Grid>

      <Grid
        item
        xs={12}
        container
        alignItems="flex-start"
        justifyContent="center"
      >
        {" "}
        {/* Alinea el contenido al inicio (parte superior) */}
      </Grid>
    </Grid>
  );
};

export default Page404;
