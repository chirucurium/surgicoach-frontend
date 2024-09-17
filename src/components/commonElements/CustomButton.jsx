import React from 'react';
import { Button } from '@mui/material';
import theme from '../../theme';

const CustomButton = ({ children, onClick, type = 'button', sx = {} }) => {
  return (
    <Button
      variant="contained"
      type={type}
      onClick={onClick}
      sx={{
        width: '233px',
        height: '63px',
        borderRadius: '31.5px',
        fontSize: '21.34px',
        fontWeight: 600,
        lineHeight: '32.01px',
        backgroundColor: theme.colors.primary,
        color: theme.colors.white,
        boxShadow: '2px 7px 12.5px 0px #00000040',
        '&:hover': {
          backgroundColor: theme.colors.buttonHoverBackground,
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
};

export default CustomButton;
