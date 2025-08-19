import React, { useState } from 'react';
import { Box, Typography, Button, Card, CardContent, Avatar, Divider, Tabs, Tab } from '@mui/material';
import Grid from '@mui/material/Grid';
import {
  ApiOutlined,
  CopyOutlined,
  DashboardOutlined,
  LineChartOutlined,
  MessageOutlined,
  SecurityScanOutlined,
  UsergroupAddOutlined
} from '@ant-design/icons';
import Nav from '../../components/Nav';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import AnimateButton from 'components/@extended/AnimateButton';

const Footer = () => (
  <Box component="footer" sx={{ py: 4, px: 2, textAlign: 'center', bottom: 0 }}>
    <Divider />
    <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
      &copy; {new Date().getFullYear()} Afkanerd. All rights reserved.
    </Typography>
  </Box>
);

const Landing = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(0);

  const codeExamples = [
    {
      language: 'JavaScript',
      color: '#f7df1e',
      textColor: '#000',
      code: `const axios = require('axios');

// Send SMS with QueueDroid
await axios.post('https://api.queuedroid.com/v1/sms/send', {
  to: '+1234567890',
  message: 'Hello from QueueDroid!',
  priority: 'normal'
}, {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

console.log('✅ Message queued successfully!');`
    },
    {
      language: 'Python',
      color: 'linear-gradient(135deg, #3776ab 0%, #ffd43b 100%)',
      textColor: '#fff',
      code: `import requests

# Send SMS with QueueDroid
response = requests.post(
    'https://api.queuedroid.com/v1/sms/send',
    json={
        'to': '+1234567890',
        'message': 'Hello from QueueDroid!',
        'priority': 'normal'
    },
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    }
)

print('✅ Message queued successfully!')`
    },
    {
      language: 'cURL',
      color: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      textColor: '#fff',
      code: `# Send SMS with QueueDroid
curl -X POST https://api.queuedroid.com/v1/sms/send \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+1234567890",
    "message": "Hello from QueueDroid!",
    "priority": "normal"
  }'

# Response: {"status": "queued", "id": "msg_123"}`
    },
    {
      language: 'PHP',
      color: 'linear-gradient(135deg, #777bb4 0%, #4f5b93 100%)',
      textColor: '#fff',
      code: `<?php
// Send SMS with QueueDroid
$response = file_get_contents(
    'https://api.queuedroid.com/v1/sms/send',
    false,
    stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => [
                'Authorization: Bearer YOUR_API_KEY',
                'Content-Type: application/json'
            ],
            'content' => json_encode([
                'to' => '+1234567890',
                'message' => 'Hello from QueueDroid!',
                'priority' => 'normal'
            ])
        ]
    ])
);

echo '✅ Message queued successfully!';`
    }
  ];

  const handleLanguageChange = (event, newValue) => {
    setSelectedLanguage(newValue);
  };

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
          sx={{
            py: { xs: 4, sm: 6, md: 0 },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg,rgb(247, 232, 228) 0%,rgb(214, 214, 214) 100%)',
            position: 'relative',
            overflow: 'hidden',
            minHeight: { xs: 'auto', md: '100vh' }
          }}
        >
          {/* Main content */}
          <Grid
            container
            columnSpacing={4}
            rowSpacing={0}
            sx={{
              alignItems: 'center',
              zIndex: 1,
              px: { xs: 2, sm: 3, md: 15, lg: 15, xl: 25 },
              justifyContent: 'center',
              my: 'auto',
              mx: 'auto'
            }}
          >
            {/* Text Content - Left Side */}
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }} sx={{ mt: { xs: 5, sm: 8, md: 10 }, order: { xs: 1, md: 1 } }}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                  <Typography
                    variant="h1"
                    sx={{
                      fontSize: { xs: '2rem', sm: '2.8rem', md: '4rem', lg: '5.5rem', xl: '6rem' },
                      fontWeight: 800,
                      mb: { xs: 2, sm: 2, md: 2 },
                      mt: { xs: 4, sm: 3, md: 0 }
                    }}
                  >
                    QueueDroid
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
                >
                  <Typography
                    variant="h4"
                    sx={{
                      fontSize: { xs: '1rem', sm: '1.3rem', md: '1.6rem', lg: '1.6rem', xl: '1.9rem' },
                      mb: 2,
                      fontWeight: 600,
                      opacity: 0.9,
                      lineHeight: 1.4,
                      position: 'relative'
                    }}
                  >
                    The Smart SMS Queuing System
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
                >
                  {/* Animated wavy underline */}
                  <Box
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
                      style={{ marginBottom: '8px' }}
                    >
                      <motion.path
                        d="M10 12 Q 35 4, 65 11 Q 95 17, 125 9 Q 155 5, 185 13 Q 215 8, 245 14 Q 265 11, 270 10"
                        stroke="rgb(182, 59, 22)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 1.2,
                          delay: 0.5,
                          ease: 'easeInOut'
                        }}
                      />
                    </svg>
                  </Box>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem' },
                      mb: { xs: 3, sm: 4, md: 10 },
                      opacity: 0.8,
                      lineHeight: 1.6
                    }}
                  >
                    Make sending bulk SMS messages easy and affordable. Queue, schedule, and deliver your messages with intelligent routing
                    and cost optimization.
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.8, ease: 'easeOut' }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      gap: { xs: 1.5, sm: 2, md: 3 },
                      justifyContent: { xs: 'center', md: 'flex-start' },
                      flexDirection: { xs: 'column', sm: 'row' },
                      alignItems: 'center',
                      mb: { xs: 3, sm: 4, md: 4 }
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
                          px: { xs: 2, sm: 3, md: 4 },
                          py: { xs: 1.2, sm: 1.6, md: 2 },
                          fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1.1rem' },
                          color: '#fff',
                          borderRadius: '50px',
                          background: 'linear-gradient(135deg,rgb(182, 59, 22) 0%,rgb(141, 57, 8) 100%)',
                          boxShadow: '0 8px 30px rgba(255, 107, 107, 0.3)',
                          minWidth: { xs: '140px', sm: 'auto' },
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

                    <AnimateButton type="slide" direction="up" offset={5}>
                      <Button
                        component={Link}
                        target="_blank"
                        rel="noopener noreferrer"
                        to="/docs"
                        variant="outlined"
                        size="large"
                        startIcon={<ApiOutlined />}
                        sx={{
                          px: { xs: 2, sm: 3, md: 4 },
                          py: { xs: 1.2, sm: 1.6, md: 1.8, lg: 1.8, xl: 2 },
                          fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1.1rem' },
                          borderRadius: '50px',
                          borderColor: 'black',
                          color: 'black',
                          minWidth: { xs: '140px', sm: 'auto' },
                          '&:hover': {
                            borderColor: 'white',
                            background: 'rgba(26, 5, 5, 0.1)',
                            transform: 'translateY(-2px)'
                          }
                        }}
                      >
                        View Documentation
                      </Button>
                    </AnimateButton>
                  </Box>
                </motion.div>
              </Box>
            </Grid>

            {/* Image Content - Right Side */}
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }} sx={{ order: { xs: 2, md: 2 } }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  position: 'relative',
                  mb: { xs: 5, sm: 8, md: 15 },
                  mt: { xs: 0, sm: 0, md: 0 },
                  px: { xs: 1, md: 0 }
                }}
              >
                {/* Tilted box behind the image */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: { xs: '340px', sm: '490px', md: '490px', lg: '490px', xl: '600px' },
                    height: { xs: '320px', sm: '490px', md: '490px', lg: '490px', xl: '600px' },
                    background: 'linear-gradient(135deg, rgba(245, 57, 57, 0.94) 0%, rgba(151, 66, 1, 0.97) 100%)',
                    borderRadius: '20px',
                    transform: { xs: 'rotate(4deg)', sm: 'rotate(5deg)', md: 'rotate(2deg)' },
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                    zIndex: 0,
                    mt: { xs: 15, sm: 20, md: 35 }
                  }}
                />

                <Box
                  component="img"
                  src="/black-girl.png"
                  alt="QueueDroid System Illustration"
                  sx={{
                    width: { xs: '85%', sm: '80%', md: '80%', lg: '95%', xl: '90%' },
                    height: 'auto',
                    filter: 'drop-shadow(0 10px 30px rgba(0, 0, 0, 0.2))',
                    position: 'relative',
                    zIndex: 1
                  }}
                />

                {/* Stats card */}
                <Box
                  sx={{
                    position: 'absolute',
                    width: { xs: '350px', sm: '450px', md: '680px', lg: '600px', xl: '680px' },
                    height: { xs: '140px', sm: '160px', md: '160px', lg: '160px', xl: '190px' },
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(247, 245, 240, 0.97) 100%)',
                    borderRadius: '20px',
                    transform: { xs: 'rotate(-4deg)', sm: 'rotate(-5deg)', md: 'rotate(-5deg)' },
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
                    mt: { xs: 40, sm: 55, md: 85, lg: 85, xl: 95 },
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    px: { xs: 1, sm: 2, md: 4 },
                    py: { xs: 1, sm: 2, md: 3 }
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
                        width: { xs: 24, sm: 30, md: 45 },
                        height: { xs: 24, sm: 30, md: 45 },
                        border: '3px solid #fff',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                        zIndex: 3
                      }}
                    />
                    <Avatar
                      src="/front-view-man-Photoroom.png"
                      sx={{
                        width: { xs: 24, sm: 30, md: 45 },
                        height: { xs: 24, sm: 30, md: 45 },
                        border: '3px solid #fff',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                        ml: { xs: -0.5, sm: -1, md: -1.5 },
                        zIndex: 2
                      }}
                    />
                    <Avatar
                      sx={{
                        width: { xs: 24, sm: 30, md: 45 },
                        height: { xs: 24, sm: 30, md: 45 },
                        border: '3px solid #fff',
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                        ml: { xs: -0.5, sm: -1, md: -1.5 },
                        zIndex: 1,
                        bgcolor: '#ee5a52'
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ color: '#fff', fontWeight: 'bold', fontSize: { xs: '0.5rem', sm: '0.6rem', md: '0.9rem' } }}
                      >
                        +5K
                      </Typography>
                    </Avatar>
                  </Box>

                  {/* Text Content */}
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: { xs: '0.6rem', sm: '0.75rem', md: '1rem' },
                      fontWeight: 600,
                      textAlign: 'center',
                      color: '#333',
                      mb: { xs: 0.3, sm: 0.5, md: 1 },
                      lineHeight: 1.2
                    }}
                  >
                    Queue over 5,000+ messages
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: { xs: '0.7rem', sm: '0.7rem', md: '0.85rem' },
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

        {/* Why Use QueueDroid Section */}
        <Box
          sx={{
            pt: { xs: 10, sm: 15, md: 20 },
            px: { xs: 2, sm: 3, md: 4 }
          }}
        >
          <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
            {/* Section Header */}
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                    fontWeight: 700,
                    mb: { xs: 4, sm: 6, md: 8 }
                  }}
                >
                  Why Choose QueueDroid?
                </Typography>
              </motion.div>
            </Box>

            {/* Features Grid */}
            <Box sx={{ position: 'relative' }}>
              <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} sx={{ position: 'relative', zIndex: 1 }}>
                {/* Feature 1 */}
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <Card
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
                          Our intelligent routing system automatically selects the most cost-effective carriers for each message,
                          dramatically reducing your SMS expenses without compromising delivery quality.
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>

                {/* Feature 2 */}
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <Card
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
                  </motion.div>
                </Grid>

                {/* Feature 3 */}
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <Card
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
                  </motion.div>
                </Grid>

                {/* Feature 4 */}
                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <Card
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
                  </motion.div>
                </Grid>
              </Grid>
            </Box>

            {/* Build & Manage Section */}
            <Box
              sx={{
                mt: { xs: 8, sm: 12, md: 16, lg: 16, xl: 25 },
                mb: 6
              }}
            >
              <Grid container columnSpacing={6} sx={{ alignItems: 'center', mx: 'auto', maxWidth: '1400px', px: { xs: 2, sm: 3, md: 4 } }}>
                {/* Image Section */}
                <Grid size={{ xs: 12, sm: 12, md: 5 }} sx={{ order: { xs: 2, sm: 2, md: 1 } }}>
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        py: { xs: 4, sm: 6, md: 8 }
                      }}
                    >
                      {/* Main Image */}
                      <Box
                        component="img"
                        src="/man-using-tablet.jpg"
                        alt="QueueDroid Build & Manage Dashboard"
                        sx={{
                          width: '100%',
                          height: '100%',
                          filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1))',
                          borderRadius: 4,
                          border: '3px solid rgb(15, 15, 13)',
                          position: 'relative',
                          zIndex: 1
                        }}
                      />

                      {/* Floating Chat Boxes */}
                      {/* Order Confirmation - Top Left */}
                      <motion.div
                        initial={{ opacity: 0, y: -20, x: -20 }}
                        whileInView={{ opacity: 1, y: 0, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: { xs: '5%', sm: '8%', md: '-10%' },
                            left: { xs: '-10%', sm: '-5%', md: '-20%' },
                            background: 'white',
                            color: 'black',
                            padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 16px' },
                            borderRadius: '12px 12px 12px 4px',
                            boxShadow: '0 8px 25px rgba(110, 142, 251, 0.3)',
                            maxWidth: { xs: '140px', sm: '160px', md: '180px' },
                            zIndex: 2,
                            transform: 'rotate(-5deg)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(7, 6, 6, 0.9)'
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                              fontWeight: 500,
                              lineHeight: 1.3,
                              mb: 0.5
                            }}
                          >
                            📦 Order #1234
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                              opacity: 0.95,
                              lineHeight: 1.2
                            }}
                          >
                            Your order has been confirmed and will ship within 24 hours.
                          </Typography>
                        </Box>
                      </motion.div>

                      {/* 2FA Code - Top Right */}
                      <motion.div
                        initial={{ opacity: 0, y: -20, x: 20 }}
                        whileInView={{ opacity: 1, y: 0, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: { xs: '15%', sm: '12%', md: '-5%' },
                            right: { xs: '-8%', sm: '-4%', md: '-5%' },
                            background: 'white',
                            color: 'black',
                            padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 16px' },
                            borderRadius: '12px 12px 4px 12px',
                            boxShadow: '0 8px 25px rgba(34, 197, 94, 0.3)',
                            maxWidth: { xs: '120px', sm: '140px', md: '160px' },
                            zIndex: 2,
                            transform: 'rotate(3deg)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(17, 15, 15, 0.89)'
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                              fontWeight: 600,
                              lineHeight: 1.3,
                              mb: 0.5
                            }}
                          >
                            🔐 Security Code
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                              opacity: 0.95,
                              lineHeight: 1.2
                            }}
                          >
                            Your login code: 456789
                          </Typography>
                        </Box>
                      </motion.div>

                      {/* Marketing Campaign - Middle Left */}
                      <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            top: { xs: '45%', sm: '50%', md: '75%' },
                            left: { xs: '7%', sm: '7%', md: '-25%' },
                            background: 'white',
                            color: 'black',
                            padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 16px' },
                            borderRadius: '12px 12px 12px 4px',
                            boxShadow: '0 8px 25px rgba(245, 101, 101, 0.3)',
                            maxWidth: { xs: '150px', sm: '170px', md: '190px' },
                            zIndex: 2,
                            transform: 'rotate(-3deg)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(7, 6, 6, 0.84)'
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                              fontWeight: 500,
                              lineHeight: 1.3,
                              mb: 0.5
                            }}
                          >
                            🎉 Flash Sale!
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                              opacity: 0.95,
                              lineHeight: 1.2
                            }}
                          >
                            50% OFF everything! Use code FLASH50. Limited time only.
                          </Typography>
                        </Box>
                      </motion.div>

                      {/* Appointment Reminder - Bottom Right */}
                      <motion.div
                        initial={{ opacity: 0, y: 20, x: 20 }}
                        whileInView={{ opacity: 1, y: 0, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.9 }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: { xs: '10%', sm: '15%', md: '20%' },
                            right: { xs: '-10%', sm: '-5%', md: '-4%' },
                            background: 'white',
                            color: 'black',
                            padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 16px' },
                            borderRadius: '12px 12px 4px 12px',
                            boxShadow: '0 8px 25px rgba(168, 85, 247, 0.3)',
                            maxWidth: { xs: '140px', sm: '160px', md: '180px' },
                            zIndex: 2,
                            transform: 'rotate(4deg)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(10, 10, 10, 0.87)'
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                              fontWeight: 500,
                              lineHeight: 1.3,
                              mb: 0.5
                            }}
                          >
                            Reminder
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                              opacity: 0.95,
                              lineHeight: 1.2
                            }}
                          >
                            Your appointment is tomorrow at 2:00 PM.
                          </Typography>
                        </Box>
                      </motion.div>

                      {/* Status Update - Bottom Left */}
                      <motion.div
                        initial={{ opacity: 0, y: 20, x: -20 }}
                        whileInView={{ opacity: 1, y: 0, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 1.1 }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: { xs: '5%', sm: '5%', md: '45%' },
                            left: { xs: '-8%', sm: '-2%', md: '-15%' },
                            background: 'white',
                            color: 'black',
                            padding: { xs: '8px 12px', sm: '10px 14px', md: '12px 16px' },
                            borderRadius: '12px 12px 12px 4px',
                            boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
                            maxWidth: { xs: '130px', sm: '150px', md: '170px' },
                            zIndex: 2,
                            transform: 'rotate(-2deg)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(8, 8, 8, 0.84)'
                          }}
                        >
                          <Typography
                            sx={{
                              fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.8rem' },
                              fontWeight: 500,
                              lineHeight: 1.3,
                              mb: 0.5
                            }}
                          >
                            Report Ready
                          </Typography>
                          <Typography
                            sx={{
                              fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                              opacity: 0.95,
                              lineHeight: 1.2
                            }}
                          >
                            Monthly analytics report is now available.
                          </Typography>
                        </Box>
                      </motion.div>
                    </Box>
                  </motion.div>
                </Grid>

                {/* Content Section */}
                <Grid size={{ xs: 12, sm: 12, md: 7 }} sx={{ order: { xs: 1, sm: 1, md: 2 } }}>
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  >
                    <Box
                      sx={{
                        textAlign: { xs: 'center', md: 'left' }
                      }}
                      px={{ xs: 2, sm: 4, md: 3, lg: 4, xl: 6 }}
                      py={{ xs: 4, sm: 5, md: 0 }}
                    >
                      <Typography
                        variant="h2"
                        sx={{
                          fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                          fontWeight: 700,
                          mb: { xs: 3, sm: 4, md: 4 }
                        }}
                      >
                        Build & Manage What Matters
                      </Typography>

                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                          mb: { xs: 3, sm: 4, md: 4 },
                          opacity: 0.9,
                          lineHeight: 1.7
                        }}
                      >
                        From simple notifications to complex business workflows, QueueDroid empowers you to build powerful SMS solutions
                        while providing the tools to manage them effectively.
                      </Typography>

                      {/* Use Case List */}
                      <Box sx={{ mb: { xs: 4, sm: 5, md: 5 } }}>
                        <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: { xs: 'center', sm: 'flex-start' },
                                textAlign: { xs: 'center', sm: 'left' },
                                mb: 2
                              }}
                            >
                              <Box
                                sx={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: '50%',
                                  background: 'linear-gradient(135deg, rgba(110, 142, 251, 0.2) 0%, rgba(167, 119, 227, 0.2) 100%)',
                                  border: '2px solid rgba(110, 142, 251, 0.4)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  mr: { xs: 0, sm: 2 },
                                  mb: { xs: 1, sm: 0 },
                                  mt: { xs: 0, sm: 0.5 },
                                  flexShrink: 0
                                }}
                              >
                                <MessageOutlined style={{ fontSize: '0.9rem', color: 'rgba(110, 142, 251, 1)' }} />
                              </Box>
                              <Box>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1rem' },
                                    fontWeight: 600,
                                    mb: 0.5,
                                    color: '#333'
                                  }}
                                >
                                  Notification Systems
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                                    opacity: 0.8,
                                    lineHeight: 1.5
                                  }}
                                >
                                  Order confirmations, appointment reminders, security alerts
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>

                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: { xs: 'center', sm: 'flex-start' },
                                textAlign: { xs: 'center', sm: 'left' },
                                mb: 2
                              }}
                            >
                              <Box
                                sx={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: '50%',
                                  background: 'linear-gradient(135deg, rgba(245, 101, 101, 0.2) 0%, rgba(255, 158, 68, 0.2) 100%)',
                                  border: '2px solid rgba(245, 101, 101, 0.4)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  mr: { xs: 0, sm: 2 },
                                  mb: { xs: 1, sm: 0 },
                                  mt: { xs: 0, sm: 0.5 },
                                  flexShrink: 0
                                }}
                              >
                                <LineChartOutlined style={{ fontSize: '0.9rem', color: 'rgba(245, 101, 101, 1)' }} />
                              </Box>
                              <Box>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1rem' },
                                    fontWeight: 600,
                                    mb: 0.5,
                                    color: '#333'
                                  }}
                                >
                                  Marketing Campaigns
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                                    opacity: 0.8,
                                    lineHeight: 1.5
                                  }}
                                >
                                  Promotional messages, product launches, targeted campaigns
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>

                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: { xs: 'center', sm: 'flex-start' },
                                textAlign: { xs: 'center', sm: 'left' },
                                mb: 2
                              }}
                            >
                              <Box
                                sx={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: '50%',
                                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
                                  border: '2px solid rgba(34, 197, 94, 0.4)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  mr: { xs: 0, sm: 2 },
                                  mb: { xs: 1, sm: 0 },
                                  mt: { xs: 0, sm: 0.5 },
                                  flexShrink: 0
                                }}
                              >
                                <SecurityScanOutlined style={{ fontSize: '0.9rem', color: 'rgba(34, 197, 94, 1)' }} />
                              </Box>
                              <Box>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1rem' },
                                    fontWeight: 600,
                                    mb: 0.5,
                                    color: '#333'
                                  }}
                                >
                                  Two-Factor Authentication
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                                    opacity: 0.8,
                                    lineHeight: 1.5
                                  }}
                                >
                                  OTP delivery, account verification, password resets
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>

                          <Grid size={{ xs: 12, sm: 6 }}>
                            <Box
                              sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: { xs: 'center', sm: 'flex-start' },
                                textAlign: { xs: 'center', sm: 'left' },
                                mb: 2
                              }}
                            >
                              <Box
                                sx={{
                                  width: 28,
                                  height: 28,
                                  borderRadius: '50%',
                                  background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
                                  border: '2px solid rgba(168, 85, 247, 0.4)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  mr: { xs: 0, sm: 2 },
                                  mb: { xs: 1, sm: 0 },
                                  mt: { xs: 0, sm: 0.5 },
                                  flexShrink: 0
                                }}
                              >
                                <DashboardOutlined style={{ fontSize: '0.9rem', color: 'rgba(168, 85, 247, 1)' }} />
                              </Box>
                              <Box>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontSize: { xs: '0.9rem', sm: '1rem', md: '1rem' },
                                    fontWeight: 600,
                                    mb: 0.5,
                                    color: '#333'
                                  }}
                                >
                                  Business Intelligence
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontSize: { xs: '0.8rem', sm: '0.85rem', md: '0.9rem' },
                                    opacity: 0.8,
                                    lineHeight: 1.5
                                  }}
                                >
                                  Automated reports, data alerts, status updates
                                </Typography>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      </Box>

                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
                          mb: { xs: 4, sm: 5, md: 4 },
                          opacity: 0.8,
                          lineHeight: 1.6
                        }}
                      >
                        Our comprehensive dashboard gives you complete control over your SMS operations with real-time analytics, cost
                        tracking, and delivery monitoring all in one intuitive interface.
                      </Typography>

                      <AnimateButton>
                        <Button
                          component={Link}
                          to="/dashboard"
                          variant="contained"
                          size="large"
                          startIcon={<DashboardOutlined />}
                          sx={{
                            px: { xs: 4, sm: 5, md: 7 },
                            py: { xs: 1.4, sm: 1.6, md: 2 },
                            fontSize: { xs: '0.95rem', sm: '1rem', md: '1.1rem' },
                            borderRadius: '50px',
                            color: '#fff',
                            background: 'linear-gradient(135deg,rgb(182, 59, 22) 0%,rgb(141, 57, 8) 100%)',
                            boxShadow: '0 8px 30px rgba(255, 107, 107, 0.3)',
                            '&:hover': {
                              background: 'linear-gradient(45deg,rgb(255, 122, 82) 30%,rgb(180, 58, 28) 90%)',
                              boxShadow: '0 12px 40px rgba(255, 107, 107, 0.4)',
                              transform: 'translateY(-2px)'
                            }
                          }}
                        >
                          Start Building Today
                        </Button>
                      </AnimateButton>
                    </Box>
                  </motion.div>
                </Grid>
              </Grid>
            </Box>

            {/* How Easy It Is Section */}
            <Box
              sx={{
                mt: { xs: 8, sm: 12, md: 16, xl: 22 },
                mb: { xs: 8, sm: 12, md: 16 },
                px: { xs: 2, sm: 3, md: 4 }
              }}
            >
              <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
                {/* Section Header */}
                <Box sx={{ textAlign: 'center', mb: { xs: 6, sm: 8, md: 10 } }}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  >
                    <Typography
                      variant="h2"
                      sx={{
                        fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                        fontWeight: 700,
                        mb: { xs: 2, sm: 3, md: 3 }
                      }}
                    >
                      Simple Integration, Powerful Results
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: { xs: '0.9rem', sm: '1rem', md: '1.2rem' },
                        opacity: 0.8,
                        maxWidth: '800px',
                        mx: 'auto',
                        lineHeight: 1.6
                      }}
                    >
                      Get started with QueueDroid in minutes. Choose your favorite programming language and start sending SMS messages with
                      just a few lines of code.
                    </Typography>
                  </motion.div>
                </Box>

                {/* Code Examples with Tabs */}
                <Box sx={{ maxWidth: '1000px', mx: 'auto', px: { xs: 1, sm: 2, md: 0 } }}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <Card
                      sx={{
                        borderRadius: { xs: 1, sm: 2 },
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                        border: '1px solid #333',
                        overflow: 'hidden',
                        background: '#0d1117'
                      }}
                    >
                      {/* Terminal Header */}
                      <Box
                        sx={{
                          background: 'linear-gradient(135deg, #21262d 0%, #161b22 100%)',
                          borderBottom: '1px solid #30363d'
                        }}
                      >
                        {/* Top row with terminal dots and copy button */}
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            px: { xs: 2, sm: 3 },
                            py: { xs: 1.5, sm: 2 }
                          }}
                        >
                          {/* Terminal Dots */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box
                              sx={{
                                width: { xs: 10, sm: 12 },
                                height: { xs: 10, sm: 12 },
                                borderRadius: '50%',
                                background: '#ff5f56'
                              }}
                            />
                            <Box
                              sx={{
                                width: { xs: 10, sm: 12 },
                                height: { xs: 10, sm: 12 },
                                borderRadius: '50%',
                                background: '#ffbd2e'
                              }}
                            />
                            <Box
                              sx={{
                                width: { xs: 10, sm: 12 },
                                height: { xs: 10, sm: 12 },
                                borderRadius: '50%',
                                background: '#27ca3f'
                              }}
                            />
                            <Typography
                              sx={{
                                ml: { xs: 1, sm: 2 },
                                color: '#8b949e',
                                fontSize: { xs: '0.7rem', sm: '0.9rem' },
                                fontFamily: 'monospace',
                                display: { xs: 'none', sm: 'block' }
                              }}
                            >
                              @queuedroid: sending message...
                            </Typography>
                          </Box>

                          {/* Copy Button */}
                          <Button
                            size="small"
                            sx={{
                              minWidth: 'auto',
                              p: { xs: 0.5, sm: 1 },
                              color: '#8b949e',
                              fontFamily: 'monospace',
                              fontSize: { xs: '0.7rem', sm: '0.8rem' },
                              opacity: 0.8,
                              '&:hover': {
                                opacity: 1,
                                color: '#58a6ff',
                                bgcolor: 'rgba(88, 166, 255, 0.1)'
                              }
                            }}
                            onClick={() => navigator.clipboard.writeText(codeExamples[selectedLanguage].code)}
                          >
                            <CopyOutlined style={{ marginRight: { xs: 2, sm: 4 }, fontSize: { xs: '0.8rem', sm: '0.9rem' } }} />
                            <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                              COPY
                            </Box>
                          </Button>
                        </Box>

                        {/* Tabs row - full width for better mobile experience */}
                        <Box
                          sx={{
                            px: { xs: 1, sm: 3 },
                            pb: { xs: 1, sm: 1.5 }
                          }}
                        >
                          <Tabs
                            value={selectedLanguage}
                            onChange={handleLanguageChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            allowScrollButtonsMobile
                            sx={{
                              minHeight: 'auto',
                              '& .MuiTabScrollButton-root': {
                                color: '#8b949e',
                                '&.Mui-disabled': {
                                  opacity: 0.3
                                }
                              },
                              '& .MuiTabs-scrollButtons': {
                                '&.Mui-disabled': {
                                  opacity: 0.3
                                }
                              },
                              '& .MuiTab-root': {
                                color: '#8b949e',
                                opacity: 0.8,
                                minWidth: { xs: 'auto', sm: 'auto' },
                                px: { xs: 1.5, sm: 2 },
                                py: { xs: 0.5, sm: 0.5 },
                                fontSize: { xs: '0.65rem', sm: '0.8rem', md: '0.85rem' },
                                fontWeight: 500,
                                fontFamily: 'monospace',
                                textTransform: 'uppercase',
                                minHeight: { xs: '32px', sm: '40px' },
                                '&.Mui-selected': {
                                  color: '#58a6ff',
                                  opacity: 1
                                },
                                '&:hover': {
                                  color: '#58a6ff',
                                  opacity: 0.9
                                }
                              },
                              '& .MuiTabs-indicator': {
                                backgroundColor: '#58a6ff',
                                height: 2
                              },
                              '& .MuiTabs-flexContainer': {
                                gap: { xs: 0.5, sm: 1 }
                              }
                            }}
                          >
                            {codeExamples.map((example, index) => (
                              <Tab key={index} label={example.language} />
                            ))}
                          </Tabs>
                        </Box>
                      </Box>

                      {/* Code Display */}
                      <CardContent sx={{ p: 0 }}>
                        <Box
                          sx={{
                            background: '#0d1117',
                            color: '#e6edf3',
                            p: { xs: 1.5, sm: 3, md: 4 },
                            fontFamily:
                              '"JetBrains Mono", "Fira Code", "SF Mono", Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                            fontSize: { xs: '0.65rem', sm: '0.8rem', md: '0.9rem' },
                            lineHeight: 1.6,
                            overflow: 'auto',
                            maxHeight: { xs: '400px', sm: '500px' },
                            position: 'relative',
                            '&::-webkit-scrollbar': {
                              width: '8px',
                              height: '8px'
                            },
                            '&::-webkit-scrollbar-track': {
                              background: '#21262d'
                            },
                            '&::-webkit-scrollbar-thumb': {
                              background: '#30363d',
                              borderRadius: '4px',
                              '&:hover': {
                                background: '#484f58'
                              }
                            }
                          }}
                        >
                          {/* Terminal Prompt */}
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: { xs: 0.5, sm: 0 } }}>
                            <Typography
                              sx={{
                                color: '#7c3aed',
                                fontWeight: 'bold',
                                mr: 1,
                                fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' }
                              }}
                            >
                              user@queuedroid:~$
                            </Typography>
                            <Typography
                              sx={{
                                color: '#8b949e',
                                fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
                                wordBreak: 'break-all'
                              }}
                            >
                              {selectedLanguage === 0 && 'node send-sms.js'}
                              {selectedLanguage === 1 && 'python send-sms.py'}
                              {selectedLanguage === 2 && 'bash'}
                              {selectedLanguage === 3 && 'php send-sms.php'}
                            </Typography>
                          </Box>
                          <pre
                            style={{
                              margin: 0,
                              whiteSpace: 'pre-wrap',
                              color: '#e6edf3'
                            }}
                          >
                            {codeExamples[selectedLanguage].code}
                          </pre>
                        </Box>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
};

export default Landing;
