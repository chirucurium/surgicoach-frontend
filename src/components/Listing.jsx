import React, { useState, useEffect } from 'react';
import { Container, Box, Tabs, Tab, Typography, Button, Grid } from '@mui/material';
import InProgressTasks from './InProgressTasks';
import CompletedTasks from './CompletedTasks';
import Sidebar from './Sidebar';
import { useNavigate, useLocation } from 'react-router-dom';
import Footer from './Footer';
import Watermark from './Watermark';

const Listing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    if (location.state?.selectedTab !== undefined) {
      setSelectedTab(location.state.selectedTab);
    }
  }, [location.state]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleUpload = () => {
    navigate('/upload');
  };
  
  return (
    <>
    <Watermark /> {/* Add Watermark */}
    <Sidebar>
      <Box>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              HDSS
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={selectedTab} onChange={handleTabChange} aria-label="volume status tabs">
            <Tab label="In Progress" />
            <Tab label="Completed" />
          </Tabs>
        </Box>
        <Box sx={{ p: 3 }}>
          {selectedTab === 0 && <InProgressTasks />}
          {selectedTab === 1 && <CompletedTasks />}
        </Box>
      </Box>
    </Sidebar>
    <Footer/>
    </>
  );
};

export default Listing;
