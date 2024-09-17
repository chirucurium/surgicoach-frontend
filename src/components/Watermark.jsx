import React from 'react';
import { Box, Typography } from '@mui/material';

const Watermark = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 10,  // Adjust zIndex to ensure the watermark appears above most content
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.1,
        pointerEvents: 'none',
        userSelect: 'none',
        overflow: 'hidden',
      }}
    >
      <Typography
        sx={{
          color: 'gray',
          fontWeight: 'bold',
          transform: 'rotate(-45deg)',
          whiteSpace: 'nowrap',
          fontSize: {
            xs: 'h6.fontSize',  // Adjust for smaller screens
            sm: 'h5.fontSize',
            md: 'h4.fontSize',
            lg: 'h3.fontSize',  // Larger font size for larger screens
          },
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(-45deg)',  // Center and rotate text
          textAlign: 'center',
          maxWidth: '90%',  // Adjust to avoid overflow
          lineHeight: 1.2,  // Improve readability
          p: 2,  // Add padding
        }}
      >
        Draft - Not for Production
      </Typography>
    </Box>
  );
};

export default Watermark;
