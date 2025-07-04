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
                      strokeWidth="3.5"
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
      {/* Why Use QueueDriod Section */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        sx={{
          py: 8,
          px: { xs: 2, md: 4 },
          backgroundColor: 'background.default'
        }}
      >
        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
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
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                fontWeight: 'bold',
                mb: 2,
                color: 'primary.main'
              }}
            >
              Why Choose QueueDriod?
            </Typography>
            <Typography
              variant="h6"
              component={motion.p}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              sx={{
                fontSize: { xs: '1rem', md: '1.2rem' },
                color: 'text.secondary',
                maxWidth: '700px',
                mx: 'auto',
                lineHeight: 1.6
              }}
            >
              Join thousands of businesses already saving money and improving their SMS delivery rates with our intelligent platform
            </Typography>
          </Box>

          {/* Features List */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Feature 1 */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 4,
                flexDirection: { xs: 'column', md: 'row' },
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                  Slash SMS Costs by 40%
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}>
                  Our intelligent routing system automatically selects the most cost-effective carriers for each message, dramatically
                  reducing your SMS expenses without compromising delivery quality.
                </Typography>
                <Typography variant="body1" sx={{ color: 'success.main', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  💰 Save up to $2,000 per month on SMS costs
                </Typography>
              </Box>
              <Box
                sx={{
                  position: 'relative',
                  flexShrink: 0,
                  width: { xs: '100%', md: '300px' },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                {/* Image */}
                <Box
                  component="img"
                  src="/orange.png"
                  alt="Cost Optimization Dashboard"
                  sx={{
                    width: '100%',
                    maxWidth: '250px',
                    height: 'auto',
                    borderRadius: 2,
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                    mb: 2
                  }}
                />
                {/* Half Circle */}
                <Box
                  sx={{
                    width: 100,
                    height: 50,
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                    borderRadius: '50px 50px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3)',
                    position: 'absolute',
                    bottom: -10,
                    right: -10
                  }}
                >
                  <LineChartOutlined style={{ fontSize: '2rem', color: 'white' }} />
                </Box>
              </Box>
            </Box>

            {/* Feature 2 */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 4,
                flexDirection: { xs: 'column', md: 'row-reverse' },
                textAlign: { xs: 'center', md: 'right' }
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                  99.9% Delivery Success Rate
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}>
                  Advanced queuing with automatic retry mechanisms ensures your critical messages reach recipients even during peak traffic
                  times or network issues.
                </Typography>
                <Typography variant="body1" sx={{ color: 'success.main', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  📈 Increase customer engagement by 25%
                </Typography>
              </Box>
              <Box
                sx={{
                  position: 'relative',
                  flexShrink: 0,
                  width: { xs: '100%', md: '300px' },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                {/* Image */}
                <Box
                  component="img"
                  src="/white.png"
                  alt="Delivery Success Analytics"
                  sx={{
                    width: '100%',
                    maxWidth: '250px',
                    height: 'auto',
                    borderRadius: 2,
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                    mb: 2
                  }}
                />
                {/* Half Circle */}
                <Box
                  sx={{
                    width: 100,
                    height: 50,
                    background: 'linear-gradient(135deg, #4ecdc4 0%, #44a08d 100%)',
                    borderRadius: '50px 50px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 25px rgba(78, 205, 196, 0.3)',
                    position: 'absolute',
                    bottom: -10,
                    left: -10
                  }}
                >
                  <SecurityScanOutlined style={{ fontSize: '2rem', color: 'white' }} />
                </Box>
              </Box>
            </Box>

            {/* Feature 3 */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 4,
                flexDirection: { xs: 'column', md: 'row' },
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                  5-Minute Setup
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}>
                  Simple REST API with comprehensive documentation gets you up and running in minutes, not days. No complex configurations
                  or lengthy onboarding processes.
                </Typography>
                <Typography variant="body1" sx={{ color: 'success.main', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  ⚡ Start sending SMS in under 5 minutes
                </Typography>
              </Box>
              <Box
                sx={{
                  position: 'relative',
                  flexShrink: 0,
                  width: { xs: '100%', md: '300px' },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                {/* Image */}
                <Box
                  component="img"
                  src="/dgroup.png"
                  alt="Quick Setup Interface"
                  sx={{
                    width: '100%',
                    maxWidth: '250px',
                    height: 'auto',
                    borderRadius: 2,
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                    mb: 2
                  }}
                />
                {/* Half Circle */}
                <Box
                  sx={{
                    width: 100,
                    height: 50,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '50px 50px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                    position: 'absolute',
                    bottom: -10,
                    right: -10
                  }}
                >
                  <DashboardOutlined style={{ fontSize: '2rem', color: 'white' }} />
                </Box>
              </Box>
            </Box>

            {/* Feature 4 */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              viewport={{ once: true }}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 4,
                flexDirection: { xs: 'column', md: 'row-reverse' },
                textAlign: { xs: 'center', md: 'right' }
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                  Scale to Millions
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}>
                  Handle massive marketing campaigns and notifications with our enterprise-grade infrastructure. From 100 to 10 million
                  messages, we scale with your business.
                </Typography>
                <Typography variant="body1" sx={{ color: 'success.main', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  🚀 Process 10M+ messages per hour
                </Typography>
              </Box>
              <Box
                sx={{
                  position: 'relative',
                  flexShrink: 0,
                  width: { xs: '100%', md: '300px' },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                {/* Image */}
                <Box
                  component="img"
                  src="/background.png"
                  alt="Enterprise Scale Infrastructure"
                  sx={{
                    width: '100%',
                    maxWidth: '250px',
                    height: 'auto',
                    borderRadius: 2,
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                    mb: 2
                  }}
                />
                {/* Half Circle */}
                <Box
                  sx={{
                    width: 100,
                    height: 50,
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    borderRadius: '50px 50px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 25px rgba(240, 147, 251, 0.3)',
                    position: 'absolute',
                    bottom: -10,
                    left: -10
                  }}
                >
                  <UsergroupAddOutlined style={{ fontSize: '2rem', color: 'white' }} />
                </Box>
              </Box>
            </Box>

            {/* Feature 5 */}
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.0 }}
              viewport={{ once: true }}
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 4,
                flexDirection: { xs: 'column', md: 'row' },
                textAlign: { xs: 'center', md: 'left' }
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
                  AI-Powered Scheduling
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2, lineHeight: 1.6 }}>
                  Machine learning algorithms analyze recipient behavior patterns and time zones to schedule messages for maximum engagement
                  and conversion rates.
                </Typography>
                <Typography variant="body1" sx={{ color: 'success.main', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  📊 Boost open rates by 35%
                </Typography>
              </Box>
              <Box
                sx={{
                  position: 'relative',
                  flexShrink: 0,
                  width: { xs: '100%', md: '300px' },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}
              >
                {/* Image */}
                <Box
                  component="img"
                  src="/orange.png"
                  alt="AI Scheduling Dashboard"
                  sx={{
                    width: '100%',
                    maxWidth: '250px',
                    height: 'auto',
                    borderRadius: 2,
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                    mb: 2
                  }}
                />
                {/* Half Circle */}
                <Box
                  sx={{
                    width: 100,
                    height: 50,
                    background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                    borderRadius: '50px 50px 0 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 25px rgba(252, 182, 159, 0.3)',
                    position: 'absolute',
                    bottom: -10,
                    right: -10
                  }}
                >
                  <DashOutlined style={{ fontSize: '2rem', color: '#d67230' }} />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Call to Action */}
          <Box
            component={motion.div}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            viewport={{ once: true }}
            sx={{
              textAlign: 'center',
              mt: 8,
              p: 4,
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(182, 59, 22, 0.1) 0%, rgba(141, 57, 8, 0.1) 100%)',
              border: '2px solid',
              borderColor: 'primary.main'
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
              Ready to Transform Your SMS Strategy?
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 4, lineHeight: 1.6 }}>
              Join over 5,000+ businesses already saving money and improving delivery rates
            </Typography>
            <AnimateButton>
              <Button
                variant="contained"
                size="large"
                startIcon={<MessageOutlined />}
                sx={{
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  borderRadius: '50px',
                  background: 'linear-gradient(45deg, #B63B16 30%, #8D3908 90%)',
                  boxShadow: '0 8px 30px rgba(182, 59, 22, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #8D3908 30%, #B63B16 90%)',
                    boxShadow: '0 12px 40px rgba(182, 59, 22, 0.4)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Start Free Trial Now
              </Button>
            </AnimateButton>
          </Box>
        </Box>
      </Box>

      <Footer />
    </>
  );
};

export default Landing;
