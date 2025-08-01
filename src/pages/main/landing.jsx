import React, { useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Avatar, Divider } from '@mui/material';
import Grid from '@mui/material/Grid';
import { motion } from 'framer-motion';
import {
  ApiOutlined,
  DashboardOutlined,
  LineChartOutlined,
  MessageOutlined,
  SecurityScanOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import AnimateButton from 'components/@extended/AnimateButton';
import Nav from '../../components/Nav';
import { Link } from 'react-router';

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
            py: { md: 0, xs: 0 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg,rgb(247, 232, 228) 0%,rgb(214, 214, 214) 100%)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Main content */}
          <Grid container spacing={4} sx={{ alignItems: 'center', zIndex: 1, px: { xs: 2, md: 25 }, justifyContent: 'center', my: 'auto' }}>
            {/* Text Content - Left Side */}
            <Grid size={{ xs: 12, md: 6 }} sx={{ mt: 10 }}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography
                  variant="h1"
                  component={motion.h1}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  sx={{
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem', lg: '6rem' },
                    fontWeight: 800,
                    mb: { md: 2, xs: 3 },
                    mt: { xs: 5, md: 0 }
                  }}
                >
                  QueueDroid
                </Typography>

                <Typography
                  variant="h4"
                  component={motion.h2}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  sx={{
                    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.9rem' },
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
                      d="M5 12c15-3 25-8 45-6 20 2 30 8 50 6 25-3 35-10 55-8 20 2 25 5 40 4 15-1 20-2 30-1 10 1 15 2 20 1 5-1 10-2 15-1 55-8 20 2 25"
                      stroke="rgb(182, 59, 22)"
                      strokeWidth="3.9"
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
                    mb: { md: 10, xs: 4 },
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
                    gap: { xs: 2, md: 3 },
                    justifyContent: { xs: 'center', md: 'flex-start' },
                    flexWrap: 'nowrap',
                    mb: { md: 4, xs: 0 }
                  }}
                >
                  <AnimateButton>
                    <Button
                      component={Link}
                      to="/dashboard"
                      variant="contained"
                      size="large"
                      startIcon={<MessageOutlined />}
                      sx={{
                        px: { xs: 2, md: 4 },
                        py: { md: 2, xs: 1.4 },
                        fontSize: { xs: '0.9rem', md: '1.1rem' },
                        color: '#fff',
                        borderRadius: '50px',
                        background: 'linear-gradient(135deg,rgb(182, 59, 22) 0%,rgb(141, 57, 8) 100%)',
                        boxShadow: '0 8px 30px rgba(255, 107, 107, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(45deg,rgb(255, 122, 82) 30%,rgb(180, 58, 28) 90%)',
                          boxShadow: '0 12px 40px rgba(255, 107, 107, 0.4)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      Get Started
                    </Button>
                  </AnimateButton>

                  <AnimateButton>
                    <Button
                      component={Link}
                      to="https://github.com/queuedroid/qdroid-server?tab=readme-ov-file"
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="outlined"
                      size="large"
                      startIcon={<ApiOutlined />}
                      sx={{
                        px: { xs: 2, md: 4 },
                        py: { md: 2, xs: 1.4 },
                        fontSize: { xs: '0.9rem', md: '1.1rem' },
                        borderRadius: '50px',
                        borderColor: 'black',
                        color: 'black',
                        '&:hover': {
                          borderColor: 'white',
                          background: 'rgba(26, 5, 5, 0.1)',
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
                  height: '100%',
                  position: 'relative',
                  mb: { xs: 5, md: 15 },
                  px: { xs: 2, md: 0 }
                }}
              >
                {/* Tilted box behind the image */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: { xs: '370px', sm: '520px', md: '600px' },
                    height: { xs: '380px', sm: '520px', md: '600px' },
                    background: 'linear-gradient(135deg, rgba(245, 57, 57, 0.94) 0%, rgba(151, 66, 1, 0.97) 100%)',
                    borderRadius: '20px',
                    transform: { xs: 'rotate(6deg)', md: 'rotate(2deg)' },
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                    zIndex: 0,
                    mt: { xs: 22, sm: 30, md: 35 }
                  }}
                />

                <Box
                  component="img"
                  src="/black-boy-posing.png"
                  alt="QueueDroid System Illustration"
                  sx={{
                    width: { xs: '100%', sm: '75%', md: '85%' },
                    height: 'auto',
                    filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.2))',
                    position: 'relative',
                    zIndex: 1
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    width: { xs: '400px', sm: '620px', md: '680px' },
                    height: { xs: '150px', sm: '200px', md: '200px' },
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.94) 0%, rgba(247, 245, 240, 0.97) 100%)',
                    borderRadius: '20px',
                    transform: { xs: 'rotate(-6deg)', md: 'rotate(-5deg)' },
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                    mt: { xs: 57, sm: 70, md: 95 },
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    px: { xs: 1, md: 4 },
                    py: { xs: 1, md: 3 }
                  }}
                >
                  {/* Connected Avatars */}
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      mb: { xs: 1, md: 2 },
                      position: 'relative'
                    }}
                  >
                    <Avatar
                      src="/african-man.png"
                      sx={{
                        width: { xs: 32, md: 45 },
                        height: { xs: 32, md: 45 },
                        border: '3px solid #fff',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                        zIndex: 3
                      }}
                    />
                    <Avatar
                      src="/front-view-man-Photoroom.png"
                      sx={{
                        width: { xs: 32, md: 45 },
                        height: { xs: 32, md: 45 },
                        border: '3px solid #fff',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                        ml: { xs: -1, md: -1.5 },
                        zIndex: 2
                      }}
                    />
                    <Avatar
                      sx={{
                        width: { xs: 32, md: 45 },
                        height: { xs: 32, md: 45 },
                        border: '3px solid #fff',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                        ml: { xs: -1, md: -1.5 },
                        zIndex: 1,
                        bgcolor: '#ee5a52'
                      }}
                    >
                      <Typography variant="body2" sx={{ color: '#fff', fontWeight: 'bold', fontSize: { xs: '0.7rem', md: '0.9rem' } }}>
                        +5K
                      </Typography>
                    </Avatar>
                  </Box>

                  {/* Text Content */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: { xs: '0.8rem', md: '1rem' },
                      fontWeight: 600,
                      textAlign: 'center',
                      color: '#333',
                      mb: { xs: 0.5, md: 1 },
                      lineHeight: 1.2
                    }}
                  >
                    Queue over 5,000+ messages
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: '0.7rem', md: '0.85rem' },
                      textAlign: 'center',
                      color: '#666',
                      opacity: 0.8,
                      lineHeight: 1.3
                    }}
                  >
                    QueueDroid uses advanced queuing with automatic retry mechanisms ensuring your business-critical messages are delivered
                    reliably.
                  </Typography>
                </Box>
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

        {/* Why Use QueueDroid Section */}
        <Box
          component={motion.div}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          sx={{
            pt: 20,
            px: { xs: 2, md: 4 }
          }}
        >
          <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
            {/* Section Header */}
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <Typography
                variant="h2"
                component={motion.h2}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                sx={{
                  fontSize: { xs: '1.8rem', sm: '2.3rem', md: '2.5rem' },
                  fontWeight: 700,
                  mb: 2
                }}
              >
                Why Choose QueueDroid?
              </Typography>
            </Box>

            {/* Features Grid */}
            <Box sx={{ position: 'relative' }}>
              <Grid container spacing={4} sx={{ position: 'relative', zIndex: 1 }}>
                {/* Feature 1 */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card
                    component={motion.div}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      textAlign: 'center',
                      p: 2,
                      borderRadius: 3,
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 3
                        }}
                      >
                        <LineChartOutlined style={{ fontSize: '2rem', color: '#ee5a52' }} />
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: '#000' }}>
                        Slash SMS Costs by 40%
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}>
                        Our intelligent routing system automatically selects the most cost-effective carriers for each message, dramatically
                        reducing your SMS expenses without compromising delivery quality.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Feature 2 */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card
                    component={motion.div}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      textAlign: 'center',
                      p: 2,
                      borderRadius: 3,
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 3
                        }}
                      >
                        <SecurityScanOutlined style={{ fontSize: '2rem', color: '#ee5a52' }} />
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: '#000' }}>
                        99.9% Delivery Success Rate
                      </Typography>
                      <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}>
                        Advanced queuing with automatic retry mechanisms ensures your critical messages reach recipients even during peak
                        traffic times or network issues.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Feature 3 */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card
                    component={motion.div}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    viewport={{ once: true }}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      textAlign: 'center',
                      p: 2,
                      borderRadius: 3,
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 3
                        }}
                      >
                        <DashboardOutlined style={{ fontSize: '2rem', color: '#ee5a52' }} />
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: '#000' }}>
                        5-Minute Setup
                      </Typography>
                      <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}>
                        Simple REST API with comprehensive documentation gets you up and running in minutes, not days. No complex
                        configurations or lengthy onboarding processes.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Feature 4 */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card
                    component={motion.div}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    viewport={{ once: true }}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      textAlign: 'center',
                      p: 2,
                      borderRadius: 3,
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 3
                        }}
                      >
                        <UsergroupAddOutlined style={{ fontSize: '2rem', color: '#ee5a52' }} />
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: '#000' }}>
                        Scale to Millions
                      </Typography>
                      <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}>
                        Handle massive marketing campaigns and notifications with our enterprise-grade infrastructure. From 100 to 10
                        million messages, we scale with your business.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
            {/* Management Section */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              sx={{
                mt: { xs: 10, md: 25 },
                mb: 6
              }}
            >
              <Grid container spacing={0} sx={{ alignItems: 'center' }}>
                {/* Image Section */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Box
                    component={motion.div}
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Box
                      component="img"
                      src="/man-using-tablet.jpg"
                      alt="QueueDroid Management Dashboard"
                      sx={{
                        width: '100%',
                        height: '100%',
                        filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1))',
                        borderRadius: 4,
                        border: '3px solid rgb(15, 15, 13)'
                      }}
                    />
                  </Box>
                </Grid>

                {/* Text and Button Section */}
                <Grid size={{ xs: 12, md: 8 }}>
                  <Box
                    component={motion.div}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    sx={{
                      textAlign: { xs: 'center', md: 'left' }
                    }}
                    justifyContent="center"
                    alignItems="center"
                    px={{ xs: 3, md: 7 }}
                    py={{ xs: 3, md: 0 }}
                  >
                    <Typography
                      variant="h2"
                      sx={{
                        fontSize: { xs: '1.4rem', sm: '1.5rem', md: '1.8rem' },
                        fontWeight: 700,
                        mb: 3
                      }}
                    >
                      Manage Your SMS Campaigns
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1rem' },
                        mb: 2,
                        opacity: 0.9,
                        lineHeight: 1.6
                      }}
                    >
                      Take control of your SMS operations with our comprehensive dashboard. Monitor delivery rates, track costs, schedule
                      campaigns, and analyze performance metrics all from one centralized platform.
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1rem' },
                        mb: 3,
                        opacity: 0.8,
                        lineHeight: 1.6
                      }}
                    >
                      Our intuitive interface makes it easy to manage thousands of messages, set up automated workflows, and get real-time
                      insights into your SMS performance.
                    </Typography>
                    <AnimateButton>
                      <Button
                        component={Link}
                        to="/dashboard"
                        variant="contained"
                        size="large"
                        startIcon={<DashboardOutlined />}
                        sx={{
                          px: { xs: 4, md: 6 },
                          py: { xs: 1.4, md: 1.8 },
                          fontSize: { xs: '1rem', md: '1.1rem' },
                          borderRadius: '50px',
                          color: '#fff',
                          background: 'linear-gradient(135deg,rgb(182, 59, 22) 0%,rgb(141, 57, 8) 100%)',
                          boxShadow: '0 8px 30px rgba(255, 107, 107, 0.3)',
                          '&:hover': {
                            background: 'linear-gradient(45deg,rgb(255, 122, 82) 30%,rgb(180, 58, 28) 90%)',
                            boxShadow: '0 12px 40px rgba(255, 107, 107, 0.4)',
                            transform: 'translateX(2px)'
                          }
                        }}
                      >
                        Get Started
                      </Button>
                    </AnimateButton>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default Landing;
