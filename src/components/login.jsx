import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Grid, Card, CardContent, FormControlLabel, Checkbox, Box } from '@mui/material';
import CustomInput from '../components/commonElements/CustomInput';
import CustomButton from '../components/commonElements/CustomButton';
import Typography from '../components/commonElements/Typography';
import theme from '../theme';
import { login } from '../redux/slice/authSlice'; // Import the login action
import '../global1.css';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Watermark from './Watermark';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (event) => {
    event.preventDefault();
    dispatch(login({ username, password }))
      .unwrap()
      .then((response) => {
        // Store token in local storage
        localStorage.setItem('ACCESS_TOKEN', response.access);
        localStorage.setItem('REFRESH_TOKEN', response.refresh);
        navigate('/dashboard');
      })
      .catch((error) => {
        // Handle the error if needed
        setError(error?.detail || 'Login failed');
        setOpen(true);
        
      });
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div className="login-page">
      <Watermark /> {/* Add Watermark */}
      <AppBar position="static" style={{ backgroundColor: theme.colors.white }}>
        <Toolbar>
         <Typography
            variant="h6"
            sx={{
              fontSize: '40px',
              fontWeight: 600,
              lineHeight: '60px',
              textAlign: 'left',
              color: theme.colors.white,
            }}
          >
            <img src="../src/assets/logo.png" className='logo'/>
          </Typography>
        </Toolbar>
      </AppBar>

      <Grid container spacing={2} className="grid-container">
        <Grid item xs={12} md={8} className="login-card-grid">
          <Card className="login-card">
            <CardContent>
              <Typography variant="h3" className="login-title">
                Login
              </Typography>
              <form onSubmit={handleLogin}>
                <Box sx={{ mb: 2 }}>
                  <CustomInput
                    id="username"
                    label="Username"
                    placeholder="Enter Your Username...."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <CustomInput
                    id="password"
                    label="Password"
                    placeholder="Enter Your Password...."
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Box>
                
                <Grid container justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Grid item>
                    <FormControlLabel
                      control={
                        <Checkbox
                          sx={{
                            color: theme.colors.white,
                            '&.Mui-checked': {
                              color: theme.colors.white,
                            },
                          }}
                        />
                      }
                      label={<Typography variant="body1">Remember Me?</Typography>}
                      className="remember-checkbox"
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="body1">Forgot Password</Typography>
                  </Grid>
                </Grid>
                <Grid container justifyContent="center">
                  <CustomButton type="submit">Login</CustomButton>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4} className="image-grid">
          <div className="image-wrapper">
            <img src="../src/assets/operationTheatre.jpeg" alt="Operation Theatre" className="image" />
            <div className="image-overlay"></div>
            <Typography variant="h1" className="image-text">
             SurgiCoach
            </Typography>
          </div>
        </Grid>
      </Grid>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Login;
