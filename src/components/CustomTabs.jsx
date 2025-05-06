import React from "react";
import PropTypes from "prop-types";
import { Tabs, Tab, Box } from "@mui/material";
import colors from "../styles/colors";

export const CustomTabs = ({ labels, onTabClick, tabSelected }) => {
  const keys = Object.keys(labels); // Extraemos las claves de tabsList

  const handleChange = (event, newValue) => {
    if (onTabClick) {
      const selectedKey = keys[newValue]; // Obtenemos la clave seleccionada
      const selectedValue = labels[selectedKey]; // Obtenemos el valor correspondiente
      onTabClick(selectedValue); // Pasamos el valor a onTabClick
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        borderBottom: 1,
        borderColor: "divider",
        ".MuiTabs-indicator": {
          backgroundColor: colors.primary, // Color del borde de la tab seleccionada
          height: "1px",
        },
        // mt: "-0.75rem",
        mb: "1.5rem",
      }}
    >
      <Tabs
        value={keys.indexOf(tabSelected)} // Sincroniza el valor con tabSelected usando índice
        onChange={handleChange}
        variant="scrollable" // Permite desplazamiento si hay muchos tabs
        scrollButtons="auto"
      >
        {keys.map((key, index) => (
          <Tab
            key={index}
            label={key} // Mostramos la clave como texto
            sx={{
              height: "2.5rem",
              px: "0.75rem", // Padding uniforme a izquierda y derecha
              minWidth: "auto", // Elimina la restricción de anchura mínima
              textTransform: "none", // Mantiene el texto tal cual
              fontFamily: "Inter",
              fontSize: "0.875rem",
              borderRadius: "0.5rem",
              fontWeight: 400,
              color: "black", // Color predeterminado para texto no seleccionado
              "&.Mui-selected": {
                color: colors.primary, // Color del texto cuando está seleccionado
              },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );
};

CustomTabs.propTypes = {
  labels: PropTypes.object.isRequired, // labels es un objeto
  onTabClick: PropTypes.func,
  tabSelected: PropTypes.string.isRequired, // tabSelected es una clave válida de labels
};
