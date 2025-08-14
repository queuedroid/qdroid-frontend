import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { GithubOutlined } from '@ant-design/icons';

const Nav = () => {
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 3 },
        bgcolor: 'rgba(255, 255, 255, 0.14)',
        mx: { md: 8, xs: 2 },
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
        zIndex: 1000,
        backdropFilter: 'blur(10px)',
        color: '#000'
      }}
    >
      {/* Logo + Name */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box component="img" src="/logo.png" alt="Logo" sx={{ width: { md: 30, xs: 20 }, mr: 1 }} />
        <Typography variant="h6" className="header" sx={{ fontWeight: 'bold', fontSize: { xs: 12, md: 20 } }}>
          QueueDroid
        </Typography>
      </Box>

      {/* Buttons + GitHub */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { md: 2, xs: 1 } }}>
        <Button
          size="small"
          component="a"
          href="/register"
          target="_blank"
          variant="contained"
          sx={{ textTransform: 'none', borderRadius: 7, px: { md: 4, xs: 2 }, bgcolor: 'black', color: 'white' }}
        >
          Signup
        </Button>
        <Button
          variant="text"
          size="small"
          component="a"
          href="/dashboard"
          target="_blank"
          sx={{
            textTransform: 'none',
            borderRadius: 7,
            px: { md: 4, xs: 2 },
            textDecoration: 'underline'
          }}
        >
          Login
        </Button>
        <a href="https://github.com/QueueDroid" target="_blank" rel="noopener noreferrer">
          <GithubOutlined style={{ fontSize: 27, color: 'black' }} />
        </a>
      </Box>
    </Box>
  );
};

export default Nav;
