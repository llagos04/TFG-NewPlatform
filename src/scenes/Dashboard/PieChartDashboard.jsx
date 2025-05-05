import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Box, Grid, Typography } from "@mui/material";
import colors from "../../styles/colors";

const PieChartDashboard = ({
  icon,
  iconSize = "1.7rem",
  totalThreads,
  languages = {},
}) => {
  const languageMap = {
    ES: "Español",
    IT: "Italiano",
    PT: "Portugués",
    EN: "Inglés",
    FR: "Francés",
    CA: "Catalán",
  };

  const data = Object.entries(languages)
    .map(([key, value]) => ({
      name: languageMap[key] || key,
      value,
    }))
    .filter((item) => item.value > 0);

  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const top4Data = sortedData.slice(0, 4);
  const othersValue = sortedData
    .slice(4)
    .reduce((acc, cur) => acc + cur.value, 0);
  const top5Data =
    othersValue > 0
      ? [...top4Data, { name: "Otros", value: othersValue }]
      : top4Data;

  const chartColors = [
    "#990A34", // más oscuro (más valor)
    "#C2083F",
    "#FF0F56",
    "#FF4F83",
    "#FF81A6",
    "#FFA0BC",
    "#FFCEDD",
    "#FFD2DC", // más claro
  ];

  const RADIAN = Math.PI / 180;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const abbreviation = top5Data[index].name.substring(0, 2).toUpperCase();
    return (
      <text
        x={x}
        y={y}
        fill={"#fff"}
        textAnchor="middle"
        fontWeight="600"
        dominantBaseline="central"
      >
        {abbreviation}
      </text>
    );
  };

  const totalConversations = top5Data.reduce((acc, cur) => acc + cur.value, 0);

  return (
    <Box
      sx={{
        backgroundColor: colors.gray200,
        borderRadius: "1rem",
        width: "auto",
        height: "auto",
        padding: "1.25rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: "0.5rem",
        }}
      >
        <Typography
          fontSize="1rem"
          fontWeight={600}
          sx={{ fontFamily: "Inter", color: "#000" }}
        >
          Distribución por idiomas
        </Typography>
        {icon &&
          React.cloneElement(icon, {
            size: iconSize,
            style: {
              color: "#000",
              margin: 0,
              opacity: 0.2,
            },
          })}
      </Box>

      <Grid container sx={{ height: "100%" }}>
        {/* Leyenda a la derecha */}
        <Grid
          item
          xs={5}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: "0.5rem",
            pr: "0.5rem",
            mt: "2rem",
          }}
        >
          {top5Data.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "0.75rem",
                  height: "0.75rem",
                  backgroundColor: chartColors[index % chartColors.length],
                  borderRadius: "25%",
                  mr: "0.5rem",
                }}
              />
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontSize: "0.75rem",
                  color: "#000",
                  mr: "0.25rem",
                }}
              >
                {item.name}
              </Typography>
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontSize: "0.75rem",
                  fontWeight: "900",
                  color: "#000",
                }}
              >
                {((item.value / totalConversations) * 100).toFixed(0)}%
              </Typography>
            </Box>
          ))}
        </Grid>
        {/* Gráfica a la izquierda */}
        <Grid item xs={7} sx={{ display: "flex", alignItems: "flex-end" }}>
          <Box sx={{ width: "100%", height: "14rem", mb: "1rem" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={top5Data}
                  cx="50%"
                  cy="50%"
                  innerRadius="65%"
                  outerRadius="100%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  dataKey="value"
                  startAngle={0}
                  endAngle={360}
                >
                  {top5Data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={chartColors[index % chartColors.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PieChartDashboard;
