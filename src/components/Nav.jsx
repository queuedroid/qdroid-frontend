import React, { useState, useEffect } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { SunOutlined, MoonOutlined, GithubOutlined } from '@ant-design/icons';
import { useThemeCustomization } from '../themes/index';

const Nav = () => {
  const { toggleColorMode } = useThemeCustomization();
  const [mode, setMode] = useState(() => {
    const storedMode = localStorage.getItem('themeMode');
    return storedMode === 'dark' ? 'light' : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const handleThemeToggle = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
    toggleColorMode();
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 3 },
        bgcolor: 'rgba(255, 255, 255, 0.14)',
        mx: 8,
        mt: 2,
        borderRadius: 2,
        boxShadow: 3,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000, // Ensure the nav is above other content
        backdropFilter: 'blur(10px)', // Optional: adds a blur effect to the background
        color: 'white' // Change text color to white for better contrast
      }}
    >
      {/* Logo + Name */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box component="img" src="/white.png" alt="Logo" sx={{ width: 30, mr: 1 }} />
        <Typography variant="h6" className="header" sx={{ fontWeight: 'bold', fontSize: { xs: 12, md: 20 } }}>
          QueueDriod
        </Typography>
      </Box>

      {/* Buttons + GitHub */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          component="a"
          href="/dashboard"
          target="_blank"
          variant="contained"
          sx={{ textTransform: 'none', borderRadius: 7, px: 4, bgcolor: 'white', color: 'black' }}
        >
          Login
        </Button>
        <a href="https://github.com/QueueDriod" target="_blank">
          {' '}
          <GithubOutlined style={{ fontSize: 27, color: 'white' }} />{' '}
        </a>
        <IconButton onClick={handleThemeToggle}>{mode === 'light' ? <SunOutlined /> : <MoonOutlined />}</IconButton>
      </Box>
    </Box>
  );
};

export default Nav;
