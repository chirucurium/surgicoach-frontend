import React from 'react';
import { Box, Typography } from '@mui/material';
import customtheme from '../theme';

const Footer = () => {
  return (
    <Box
      sx={{
        width: '100%',
        py: 2,
        mt: 'auto',
        backgroundColor: customtheme.colors.white,
        color: 'black',
        position: 'fixed',
        bottom: 0,
        left: 0,
        display: 'flex',
        justifyContent: 'center',  // Center the copyright text
        alignItems: 'center',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow
      }}
    >
      {/* Copyright centered */}
      <Typography variant="body2">
        © 2024 Curium.life. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
