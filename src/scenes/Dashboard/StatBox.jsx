import React from 'react';
import { Box, Typography } from '@mui/material';
import colors from '../../styles/colors';

const StatBox = ({
  stat,
  title,
  icon,
  iconSize = '1.7rem',
  percentage = 0,
  isPositive = true,
  isAdminPanel = false,
}) => {
  return (
    <Box
      sx={{
        backgroundColor: colors.gray200,
        borderRadius: '1rem',
        width: 'auto',
        height: '100%',
        minWidth: 0,           // 🔑 permite que el componente se encoja
        display: 'flex',
        flexDirection: 'column',
        p: 3,
      }}
    >
      {/* encabezado */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          overflow: 'hidden',
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Inter',
            fontSize: 14,
            fontWeight: 500,
            color: '#000',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          }}
        >
          {title}
        </Typography>

        {icon && !isAdminPanel &&
          React.cloneElement(icon, {
            size: iconSize,
            style: { color: '#000', opacity: 0.2, marginTop: 4 },
          })}
      </Box>

      {/* contenido */}
      <Box sx={{ mt: 3 }}>
        <Typography
          sx={{
            fontFamily: 'Inter',
            fontSize: 24,
            fontWeight: 700,
            color: '#000',
            lineHeight: 1.1,
            wordBreak: 'break-word',
          }}
        >
          {stat}
        </Typography>

        {!isAdminPanel && (
          <Typography
            sx={{
              mt: 0.5,
              fontFamily: 'Inter',
              fontSize: 12,
              fontWeight: 700,
              color: isPositive ? '#4CBF5F' : '#F15D5D',
            }}
          >
            {percentage}
            <span style={{ fontWeight: 400, color: colors.gray400 }}>
              &nbsp;este mes
            </span>
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default StatBox;
