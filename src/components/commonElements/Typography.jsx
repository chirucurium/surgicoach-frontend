// src/components/Typography.js
import React from 'react';
import { Typography as MuiTypography } from '@mui/material';
import theme from '../../theme';

const Typography = ({ variant, children, ...props }) => {
  const styles = {
    h3: {
      fontSize: '40px',
      fontWeight: 600,
      lineHeight: '60px',
      color: theme.colors.black,
    },
    h5: {
      fontSize: '24px',
      fontWeight: 300,
      lineHeight: '36px',
      color: theme.colors.black,
    },
    body1: {
      fontSize: '20px',
      fontStyle: 'italic',
      fontWeight: 300,
      lineHeight: '30px',
      color: theme.colors.black,
      textDecoration: 'underline',
      textDecorationColor: theme.colors.black,
    },
    body2: {
      fontSize: '16px',
      fontStyle: 'italic',
      fontWeight: 275,
      lineHeight: '24px',
      color: theme.colors.black,
    },
    h1:{
      fontSize: '66.33px',
      fontWeight: 600,
      lineHeight: '99.5px',
    }
  };

  return (
    <MuiTypography variant={variant} sx={styles[variant]} {...props}>
      {children}
    </MuiTypography>
  );
};

export default Typography;
