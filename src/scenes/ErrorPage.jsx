import React from "react";
import { Box, Grid, Stack, Typography } from "@mui/material";
import mantImage from "../assets/mantenimiento.png";
import { CustomButton } from "../components/CustomButton";

export const ErrorPage = ({ errorMessage }) => {
  return (
    <Box sx={{ margin: "5rem 2rem 0 2rem" }}>
      <Grid
        container
        width="100%"
        minHeight="100vh" // Cambiado a minHeight para mejor flexibilidad
        alignItems="center"
        justifyContent="center"
      >
        <Grid
          item
          xs={12}
          container
          alignItems="center"
          justifyContent="center"
        >
          <Stack spacing={2} alignItems="center">
            <Typography
              sx={{
                fontSize: "3.5rem",
                fontWeight: "800",
                fontFamily: "Inter",
                textAlign: "center",
              }}
            >
              {"Lo sentimos, estamos de mantenimiento."}
            </Typography>
            <Typography
              sx={{
                fontSize: "1.25rem",
                fontWeight: "500",
                fontFamily: "Inter",
                textAlign: "center",
              }}
            >
              {errorMessage
                ? errorMessage
                : "La plataforma se encuentra en mantenimiento. Pronto volverá a estar disponible."}
            </Typography>
            <Box>
              <img
                src={mantImage}
                alt="Logo byNeural"
                style={{
                  width: "90%",
                  maxWidth: "50rem",
                  margin: "3rem 0 1rem 0",
                }}
              />
            </Box>

            <Box
              display="flex"
              width="20rem"
              alignItems="center"
              justifyContent="center"
              paddingTop="1rem"
            >
              <CustomButton
                label="Recargar la página"
                changesNotSaved={true}
                variant="white"
                onClick={() => window.location.reload()}
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
          {/* Alinea el contenido al inicio (parte superior) */}
        </Grid>
      </Grid>
    </Box>
  );
};

export default ErrorPage;
