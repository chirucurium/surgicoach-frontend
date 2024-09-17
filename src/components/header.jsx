import React from 'react';
import theme from '../theme';
import Typography from '../components/commonElements/Typography';
import { AppBar, Toolbar, Grid, Card, CardContent, FormControlLabel, Checkbox, Box } from '@mui/material';

const Header = () => {
 
  return (
    <AppBar position="static" style={{ backgroundColor: theme.colors.primary }}>
    <Toolbar>
      <Typography
        variant="h6"
        sx={{
          fontSize: '40px',
          fontWeight: 600,
          lineHeight: '60px',
          textAlign: 'left',
          color: theme.colors.black,
        }}
      >
        CuriumLife
      </Typography>
    </Toolbar>
  </AppBar>
  );
};

export default Header; 

