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

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const FeatureCard = ({ title, description, icon }) => (
  <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
    <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <Card
        variant="outlined"
        sx={{
          height: '100%',
          bgcolor: 'secondary.dark',
          borderColor: 'secondary[800]',
          color: '#ffffff',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: 2
          },
          px: 2,
          py: 4,
          minHeight: 210
        }}
      >
        <CardContent>
          <Typography className="header" fontWeight="bold" variant="h6" gutterBottom>
            {icon} {title}
          </Typography>
          <Typography variant="body2" sx={{ pt: 2 }}>
            {description}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  </Grid>
);

const Nav = () => {
  const { mode, setMode } = useThemeCustomization();

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        bgcolor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
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
        <AnimateButton>
          <Button
            component="a"
            href="/dashboard"
            target="_blank"
            variant="contained"
            sx={{ textTransform: 'none', borderRadius: 7, px: 4 }}
          >
            Login
          </Button>
        </AnimateButton>
        <a href="https://github.com/QueueDriod" target="_blank">
          {' '}
          <GithubOutlined style={{ fontSize: 27, color: 'black' }} />{' '}
        </a>
        <IconButton onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
          {mode === 'light' ? <SunOutlined /> : <MoonOutlined />}
        </IconButton>
      </Box>
    </Box>
  );
};

const Footer = () => (
  <Box component="footer" sx={{ py: 4, px: 2, textAlign: 'center', bottom: 0 }}>
    <Divider />
    <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
      &copy; {new Date().getFullYear()} Afkanerd. All rights reserved.
    </Typography>
  </Box>
);

const Home = () => {
  return (
    <>
      <Box
        bgcolor="secondary.darker"
        className="home"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          overflow: 'hidden',
          bgclor: 'secondary.darker',
          color: '#ffffff'
        }}
      >
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Nav />

          <Box
            sx={{
              py: { xs: 10, sm: 8, md: 8, lg: 10 },
              my: 'auto',
              px: { xs: 2, sm: 2, md: 20, lg: 25 },
              zIndex: 1
            }}
          >
            {/* Grid layout for hero section */}
            <Grid container spacing={4} alignItems="center" justifyContent="center">
              {/* Left: Header and subtext */}
              <Grid size={{ xs: 12, md: 6 }}>
                <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                  <Typography
                    variant="h1"
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: '3.5rem', sm: '5rem', md: '5.5rem' },
                      mixBlendMode: 'hard-light',
                      //   color: 'black',
                      textAlign: { xs: 'center', md: 'left' }
                    }}
                    className="header"
                  >
                    Coming Soon
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      py: { md: 8, xs: 4 },
                      fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
                      textAlign: { xs: 'center', md: 'left' }
                    }}
                    wrap
                  >
                    A powerful, self-hostable SMS API built for affordability, flexibility, and local optimization. Utilizes DekuSMS secure
                    messaging.
                  </Typography>
                  <Grid container justifyContent={{ xs: 'center', md: 'flex-start' }} spacing={1}>
                    <Grid
                      item
                      xs={6}
                      sx={{
                        display: 'flex',
                        justifyContent: { xs: 'flex-end', md: 'flex-start' },
                        alignItems: 'center',
                        pr: { xs: 0.5, sm: 1 }
                      }}
                    >
                      <Button
                        component="a"
                        href="/dashboard"
                        target="_blank"
                        size="large"
                        sx={{
                          borderRadius: 1,
                          color: '#000000',
                          backgroundColor: '#ffffff',
                          hover: {
                            bgcolor: '#E38E05',
                            color: '#ffffff'
                          },
                          textTransform: 'none',
                          px: { xs: 2, sm: 4, md: 8 },
                          py: { xs: 1, sm: 1.5, md: 2.2 },
                          fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                        }}
                        variant="contained"
                      >
                        Login
                      </Button>
                    </Grid>
                    <Grid
                      item
                      xs={6}
                      sx={{
                        display: 'flex',
                        justifyContent: { xs: 'flex-start', md: 'flex-start' },
                        alignItems: 'center',
                        pl: { xs: 0.5, sm: 1 }
                      }}
                    >
                      <Button
                        component="a"
                        href="mailto:developers@smswithoutborders.com?subject=Request%20Demo&body=Hi%20QueueDriod%20Team,%0A%0AI'd%20like%20to%20request%20a%20demo%20of%20your%20platform.%0A%0AThanks!"
                        target="_blank"
                        size="large"
                        sx={{
                          borderRadius: 1,
                          hover: {
                            backgroundColor: '#E38E05'
                          },
                          textTransform: 'none',
                          px: { xs: 2, sm: 4, md: 8 },
                          py: { xs: 1, sm: 1.5, md: 2.2 },
                          fontSize: { xs: '0.75rem', sm: '0.875rem', md: '1rem' }
                        }}
                        variant="outlined"
                      >
                        Request Demo
                      </Button>
                    </Grid>
                  </Grid>
                </motion.div>
              </Grid>
              {/* Right: Circles visual */}
              <Grid size={{ xs: 12, md: 6 }}>
                {/* Circles replacing BannerImage */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BannerImage />
                  {/* <Box component="img" src="bann.svg" sx={{ width: '90%' }} /> */}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Features Section */}
        <Box
          sx={{
            textAlign: 'center',
            py: 13,
            my: 5,
            // px: 2,
            px: { xs: 2, md: 15, sm: 10, lg: 25 },
            zIndex: 1,
            position: 'relative'
            // bgcolor: '#F3F3F3'
          }}
        >
          <Typography className="header" variant="h3">
            Key Features
          </Typography>
          <Typography variant="body1" sx={{ py: 6, px: { xs: 2, sm: 4, md: 10, lg: 45 } }} textAlign="center">
            QueueDroid is an open-source API service designed to enable seamless sending and receiving of SMS messages through Deku SMS.
            Whether you're building your own messaging platform or just need a reliable SMS backend, QueueDroid is your all-in-one solution.
          </Typography>

          <Grid container spacing={6} justifyContent="center" mt={{ md: 6, xs: 4, lg: 10 }}>
            <FeatureCard
              icon={<ApiOutlined />}
              title="RESTful API Endpoints"
              description="Integrate easily using standardized and scalable RESTful APIs."
            />
            <FeatureCard
              icon={<DashboardOutlined />}
              title="Plug-in System"
              description="Customize and extend core functionality with modular plugins."
            />
            <FeatureCard
              icon={<UsergroupAddOutlined />}
              title="Local Gateway Support"
              description="Connect to local SMS gateways for cheaper and more reliable delivery."
            />
            <FeatureCard
              icon={<LineChartOutlined />}
              title="Built-in Queueing"
              description="Ensure reliable message delivery with smart queue management."
            />
            <FeatureCard
              icon={<SecurityScanOutlined />}
              title="Scalable Infrastructure"
              description="Handle everything from low to high-volume messaging effortlessly."
            />
          </Grid>
        </Box>

        <Footer />
      </Box>
    </>
  );
};

export default Home;
