import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
//import LoginPage from './components/loginPage';
import Listing from './components/Listing';
import Dashboard from './components/dashboard';
import PracticeTasks from './components/PracticeTasks';
import Sidebar from './components/Sidebar';
import { AuthProvider } from './components/AuthContext';

function App() {
  return (
   
<Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<PracticeTasks/>}/>
        <Route path="/listing" element={<Listing/>}/>
        <Route path="/sidebar" element={<Sidebar/>}/>
      </Routes>
    </Router>
   
  );
}

export default App;
