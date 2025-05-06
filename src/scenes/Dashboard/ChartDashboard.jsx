import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { Box, Typography } from "@mui/material";
import colors from "../../styles/colors";

// Componente de Tooltip personalizado
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center", // Centra verticalmente el texto con la caja de color
          justifyContent: "space-between",
          gap: 0.5,
          backgroundColor: "#fff",
          padding: "10px",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Inter",
            fontSize: "0.75rem",
            color: "#000",
          }}
        >
          Number of messages:{" "}
        </Typography>
        <Typography
          sx={{
            fontFamily: "Inter",
            fontSize: "0.75rem",
            fontWeight: "bold",
            color: "#000",
          }}
        >
          {payload[0].value}
        </Typography>
      </Box>
    );
  }

  return null;
};

const ChartDashboard = ({
  receivedData,
  isCustomLineColors = false,
  isDashboard = false,
}) => {
  const [data1, setData1] = useState([]);

  useEffect(() => {
    if (receivedData) {
      const transformedData = receivedData.map((item) => ({
        x: item.day.split("T")[0].split("-")[2], // Asume que el formato de fecha es YYYY-MM-DD
        y: item.total,
      }));

      setData1(transformedData);
    }
  }, [receivedData]);

  return (
    <ResponsiveContainer maxHeight={"80%"}>
      <AreaChart data={data1}>
        <defs>
          <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={colors.primary} stopOpacity={0.4} />
            <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="x" axisLine={false} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "none" }} />
        <Area
          type="monotone"
          dataKey="y"
          stroke={colors.primary}
          strokeWidth={"0.08rem"}
          fillOpacity={1}
          fill="url(#colorUv)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default ChartDashboard;
