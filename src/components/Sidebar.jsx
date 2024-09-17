import React, { useState, useEffect } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SettingsIcon from '@mui/icons-material/Settings';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import { Link, useLocation } from 'react-router-dom';
import customtheme from '../theme';
import LogoutIcon from '@mui/icons-material/Logout';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { logoutAction } from '../redux/slice/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import useMediaQuery from '@mui/material/useMediaQuery';
import InsightsIcon from '@mui/icons-material/Insights';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { getProfileData } from '../redux/slice/volumeSlice';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    marginLeft: `-${drawerWidth}px`,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  width: '100%',
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1),
  justifyContent: 'center',
  backgroundColor: '#4f8273',
}));

const UserInfo = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  '& .MuiTypography-body1': {
    marginLeft: theme.spacing(2),
  },
}));

const CustomListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(1.5),
  '&.Mui-selected': {
    backgroundColor: customtheme.colors.primary,
    color: theme.palette.common.white,
    '& .MuiListItemIcon-root': {
      color: theme.palette.common.white,
    },
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: customtheme.colors.primary, // Ensures the hover color on active items is the same
      color: theme.palette.common.white,
      '& .MuiListItemIcon-root': {
        color: theme.palette.common.white,
      },
    },
  },
  '&:hover': {
    backgroundColor: customtheme.colors.primary,
    color: theme.palette.common.white,
    '& .MuiListItemIcon-root': {
      color: theme.palette.common.white,
    },
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
  },
}));

export default function Sidebar({ children }) {
  const theme = useTheme();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [user, setUser] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    getProfileName();
  },[]) 

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogoutClick = () => {
    setDialogOpen(true);
  };

  const handleLogoutConfirm = (event) => {
    event.preventDefault();
    const payload = {
      refresh: localStorage.getItem('REFRESH_TOKEN'),
    };
    dispatch(logoutAction(payload))
      .unwrap()
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error('Logout failed:', error);
      });
    setDialogOpen(false);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, link: '/listing' },
    { text: 'Practice Tasks', icon: <UploadFileIcon />, link: '/tasks' },
    { text: 'Insights', icon: <InsightsIcon />, link: '#' },
  ];

  const userMenuItems = [
    { text: 'My Profile', icon: <PersonIcon />, link: '/profile' },
    { text: 'Settings', icon: <SettingsIcon />, link: '/settings' },
  ];

  const getProfileName = async () => {
    try {
      const profileData = await dispatch(getProfileData()).unwrap();
     
      if (profileData) {
        const { fname, lname } = profileData;  // Extracting fname and lname from the response
        localStorage.setItem('fname', fname);
        localStorage.setItem('lname', lname);
        setUser(`${fname} ${lname}`);

      } else {
        console.error('No profile data available');
      }
    } catch (error) {
      console.error('Get profile failed:', error);
    }
  };
  
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" style={{ backgroundColor: customtheme.colors.white }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
              <MenuIcon sx={{ color: customtheme.colors.black }} />
            </IconButton>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Logo" style={{ height: 30, marginRight: 60}} />
            <Typography sx={{fontSize:'25px' , color: customtheme.colors.black}}>SurgiCoach</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleMenuClick}>
              <IconButton
                color="inherit"
                aria-controls="user-menu"
                aria-haspopup="true"
                sx={{ color: customtheme.colors.black }}
              >
                <PersonIcon />
              </IconButton>
              <Typography variant="body1" sx={{ ml: 1, mr: 1 , color: customtheme.colors.black}}>
                {user}
              </Typography>
              <ArrowDropDownIcon sx={{ color: customtheme.colors.black }}/>
            </Box>
            
            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              {userMenuItems.map((item) => (
                <MenuItem
                  key={item.text}
                  component={Link}
                  to={item.link}
                  onClick={handleMenuClose}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </MenuItem>
              ))}
              <Divider />
              <MenuItem onClick={handleLogoutClick}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            zIndex: theme.zIndex.appBar - 1, // Ensure it is under the AppBar
          },
        }}
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor="left"
        open={isMobile ? open : true}
        onClose={isMobile ? handleDrawerClose : undefined}
      >
        <DrawerHeader />
        <Box sx={{ overflow: 'auto', flexGrow: 1, marginTop: 10 }}>
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <CustomListItemButton
                  component={Link}
                  to={item.link}
                  selected={location.pathname === item.link}
                  sx={{ marginLeft: '15px', marginRight: '15px' }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </CustomListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        <Divider />
      </Drawer>
      <Main open={open}>
        {children}
      </Main>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogoutConfirm} color="primary">
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
