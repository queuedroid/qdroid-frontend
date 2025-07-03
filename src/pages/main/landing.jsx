import React, { useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Paper, TextField, CardMedia, Avatar, Divider, IconButton } from '@mui/material';
import { Tabs, Tab } from '@mui/material';
import Grid from '@mui/material/Grid';
import { motion } from 'framer-motion';
import {
  ApiOutlined,
  DashboardOutlined,
  DashOutlined,
  GithubOutlined,
  LineChartOutlined,
  MessageOutlined,
  MoonOutlined,
  SecurityScanOutlined,
  SunOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import BannerImage from '../../components/BannerImage';
import AnimateButton from 'components/@extended/AnimateButton';
import ReactFlow, { Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';
import { useThemeCustomization } from '../../themes';
import Nav from '../../components/Nav';

const Footer = () => (
  <Box component="footer" sx={{ py: 4, px: 2, textAlign: 'center', bottom: 0 }}>
    <Divider />
    <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
      &copy; {new Date().getFullYear()} Afkanerd. All rights reserved.
    </Typography>
  </Box>
);

const Landing = () => {
  return (
    <>
      <Nav />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          overflow: 'hidden'
        }}
      >
        {/* Hero Section */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg,rgb(182, 59, 22) 0%,rgb(141, 57, 8) 100%)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Background decorative elements */}
          <Box
            sx={{
              position: 'absolute',
              top: '10%',
              left: '5%',
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.1)',
              animation: 'float 6s ease-in-out infinite'
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: '15%',
              right: '10%',
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              animation: 'float 8s ease-in-out infinite reverse'
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: '30%',
              right: '20%',
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.06)',
              animation: 'float 7s ease-in-out infinite'
            }}
          />

          {/* Main content */}
          <Grid container spacing={4} sx={{ alignItems: 'center', zIndex: 1, px: { xs: 2, md: 20 } }}>
            {/* Text Content - Left Side */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' }, color: 'white' }}>
                <Typography
                  variant="h1"
                  component={motion.h1}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  sx={{
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem', lg: '6rem' },
                    fontWeight: 'bold',
                    mb: 3
                  }}
                >
                  QueueDriod
                </Typography>

                <Typography
                  variant="h4"
                  component={motion.h2}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  sx={{
                    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                    mb: 2,
                    fontWeight: 600,
                    opacity: 0.9,
                    lineHeight: 1.4,
                    position: 'relative'
                  }}
                >
                  The Smart SMS Queuing System
                </Typography>

                {/* Hand-drawn underline */}
                <Box
                  component={motion.div}
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 1, pathLength: 1 }}
                  transition={{ duration: 1.2, delay: 0.6 }}
                  sx={{
                    mb: 4,
                    display: 'flex',
                    justifyContent: { xs: 'center', md: 'flex-start' }
                  }}
                >
                  <svg
                    width="280"
                    height="20"
                    viewBox="0 0 280 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ overflow: 'visible' }}
                  >
                    <motion.path
                      d="M5 12c15-3 25-8 45-6 20 2 30 8 50 6 25-3 35-10 55-8 20 2 25 5 40 4 15-1 20-2 30-1 10 1 15 2 20 1 5-1 10-2 15-1"
                      stroke="#98880B"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, delay: 0.8, ease: 'easeInOut' }}
                    />
                  </svg>
                </Box>

                <Typography
                  variant="h6"
                  component={motion.p}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                    mb: 6,
                    opacity: 0.8,
                    lineHeight: 1.6
                  }}
                >
                  Make sending bulk SMS messages easy and affordable. Queue, schedule, and deliver your messages with intelligent routing
                  and cost optimization.
                </Typography>

                <Box
                  component={motion.div}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  sx={{
                    display: 'flex',
                    gap: 3,
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    flexWrap: 'wrap',
                    mb: 4
                  }}
                >
                  <AnimateButton>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<MessageOutlined />}
                      sx={{
                        px: 4,
                        py: 2,
                        fontSize: '1.1rem',
                        color: 'black',
                        borderRadius: '50px',
                        background: 'linear-gradient(45deg,rgb(241, 223, 223) 30%,rgb(219, 174, 174) 90%)',
                        boxShadow: '0 8px 30px rgba(255, 107, 107, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg,rgb(255, 122, 82) 30%,rgb(180, 58, 28) 90%)',
                          boxShadow: '0 12px 40px rgba(255, 107, 107, 0.4)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      Start Sending SMS
                    </Button>
                  </AnimateButton>

                  <AnimateButton>
                    <Button
                      variant="outlined"
                      size="large"
                      startIcon={<ApiOutlined />}
                      sx={{
                        px: 4,
                        py: 2,
                        fontSize: '1.1rem',
                        borderRadius: '50px',
                        borderColor: 'white',
                        color: 'white',
                        '&:hover': {
                          borderColor: 'white',
                          background: 'rgba(255, 255, 255, 0.1)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      View API Docs
                    </Button>
                  </AnimateButton>
                </Box>
              </Box>
            </Grid>

            {/* Image Content - Right Side */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                component={motion.div}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%'
                }}
              >
                <Box
                  component="img"
                  src="/dgroup.svg"
                  alt="QueueDriod System Illustration"
                  sx={{
                    maxWidth: '100%',
                    // maxHeight: '800px',
                    width: 'auto',
                    height: 'auto',
                    filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.2))'
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Add keyframes for floating animation */}
        <style>
          {`
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
            }
          `}
        </style>
      </Box>
      <Footer />
    </>
  );
};

export default Landing;
