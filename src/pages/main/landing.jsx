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

const sendSMS = async () => {
  try {
    const response = await axios.post(
      'https://api.queuedroid.com/v1/sms/send',
      {
        to: '+1234567890',
        message: 'Hello from QueueDroid!',
        priority: 'normal'
      },
      {
        headers: {
          'Authorization': 'Bearer YOUR_API_KEY',
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Message queued:', response.data);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
};

sendSMS();`
    },
    {
      language: 'Python',
      color: 'linear-gradient(135deg, #3776ab 0%, #ffd43b 100%)',
      textColor: '#fff',
      code: `import requests
import json

def send_sms():
    url = "https://api.queuedroid.com/v1/sms/send"
    
    headers = {
        "Authorization": "Bearer YOUR_API_KEY",
        "Content-Type": "application/json"
    }
    
    data = {
        "to": "+1234567890",
        "message": "Hello from QueueDroid!",
        "priority": "normal"
    }
    
    try:
        response = requests.post(url, 
                               headers=headers, 
                               json=data)
        response.raise_for_status()
        print("Message queued:", response.json())
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")

send_sms()`
    },
    {
      language: 'C',
      color: 'linear-gradient(135deg, #659ad2 0%, #03599c 100%)',
      textColor: '#fff',
      code: `#include <stdio.h>
#include <curl/curl.h>

int send_sms() {
    CURL *curl;
    CURLcode res;
    
    curl = curl_easy_init();
    if(curl) {
        struct curl_slist *headers = NULL;
        
        // Set headers
        headers = curl_slist_append(headers, 
            "Authorization: Bearer YOUR_API_KEY");
        headers = curl_slist_append(headers, 
            "Content-Type: application/json");
        
        // JSON payload
        const char *json_data = 
            "{"
            "\\"to\\": \\"+1234567890\\","
            "\\"message\\": \\"Hello from QueueDroid!\\","
            "\\"priority\\": \\"normal\\""
            "}";
        
        curl_easy_setopt(curl, CURLOPT_URL, 
            "https://api.queuedroid.com/v1/sms/send");
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, json_data);
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        
        res = curl_easy_perform(curl);
        
        curl_slist_free_all(headers);
        curl_easy_cleanup(curl);
        
        return (res == CURLE_OK) ? 0 : 1;
    }
    return 1;
}`
    },
    {
      language: 'C++',
      color: 'linear-gradient(135deg, #00599c 0%, #004482 100%)',
      textColor: '#fff',
      code: `#include <iostream>
#include <curl/curl.h>
#include <string>

class QueueDroidClient {
private:
    std::string api_key;
    std::string base_url;
    
public:
    QueueDroidClient(const std::string& key) 
        : api_key(key), 
          base_url("https://api.queuedroid.com/v1") {}
    
    bool sendSMS(const std::string& to, 
                 const std::string& message) {
        CURL *curl;
        CURLcode res;
        bool success = false;
        
        curl = curl_easy_init();
        if(curl) {
            struct curl_slist *headers = NULL;
            
            std::string auth_header = 
                "Authorization: Bearer " + api_key;
            headers = curl_slist_append(headers, 
                auth_header.c_str());
            headers = curl_slist_append(headers, 
                "Content-Type: application/json");
            
            std::string json_data = 
                "{\\"to\\": \\"" + to + "\\", "
                "\\"message\\": \\"" + message + "\\", "
                "\\"priority\\": \\"normal\\"}";
            
            std::string url = base_url + "/sms/send";
            
            curl_easy_setopt(curl, CURLOPT_URL, url.c_str());
            curl_easy_setopt(curl, CURLOPT_POSTFIELDS, 
                json_data.c_str());
            curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
            
            res = curl_easy_perform(curl);
            success = (res == CURLE_OK);
            
            curl_slist_free_all(headers);
            curl_easy_cleanup(curl);
        }
        return success;
    }
};

int main() {
    QueueDroidClient client("YOUR_API_KEY");
    
    if(client.sendSMS("+1234567890", 
                      "Hello from QueueDroid!")) {
        std::cout << "Message sent successfully!" << std::endl;
    } else {
        std::cout << "Failed to send message." << std::endl;
    }
    
    return 0;
}`
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

            {/* Management Section */}
            <Box
              sx={{
                mt: { xs: 8, sm: 12, md: 16, lg: 16, xl: 25 },
                mb: 6
              }}
            >
              <Grid container columnSpacing={2} sx={{ alignItems: 'center', mx: 'auto' }}>
                {/* Image Section */}
                <Grid size={{ xs: 12, sm: 12, md: 4 }} sx={{ order: { xs: 2, sm: 2, md: 1 } }}>
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
                  </motion.div>
                </Grid>

                {/* Text and Button Section */}
                <Grid size={{ xs: 12, sm: 12, md: 8 }} sx={{ order: { xs: 1, sm: 1, md: 2 } }}>
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
                      justifyContent="center"
                      alignItems="center"
                      px={{ xs: 2, sm: 4, md: 2, lg: 2, xl: 7 }}
                      py={{ xs: 3, sm: 4, md: 0 }}
                    >
                      <Typography
                        variant="h2"
                        sx={{
                          fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.8rem' },
                          fontWeight: 700,
                          mb: { xs: 2, sm: 3, md: 3 }
                        }}
                      >
                        Manage Your SMS Campaigns
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' },
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
                          fontSize: { xs: '0.85rem', sm: '0.95rem', md: '1rem' },
                          mb: { xs: 3, sm: 4, md: 3 },
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
                            px: { xs: 3, sm: 4, md: 6 },
                            py: { xs: 1.2, sm: 1.5, md: 1.8 },
                            fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
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
                <Box sx={{ maxWidth: '1000px', mx: 'auto' }}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                  >
                    <Card
                      sx={{
                        borderRadius: 3,
                        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.1)',
                        border: '1px solid',
                        borderColor: 'divider',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Language Tabs */}
                      <Box
                        sx={{
                          background: '#bdbbbbff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          px: 2,
                          py: 1
                        }}
                      >
                        <Tabs
                          value={selectedLanguage}
                          onChange={handleLanguageChange}
                          sx={{
                            '& .MuiTab-root': {
                              color: '#000',
                              opacity: 0.7,
                              minWidth: 'auto',
                              px: 2,
                              py: 1,
                              fontSize: { xs: '0.8rem', sm: '0.9rem', md: '1rem' },
                              fontWeight: 600,
                              '&.Mui-selected': {
                                color: '#000',
                                opacity: 1
                              }
                            },
                            '& .MuiTabs-indicator': {
                              backgroundColor: codeExamples[selectedLanguage].textColor,
                              height: 3
                            }
                          }}
                        >
                          {codeExamples.map((example, index) => (
                            <Tab key={index} label={example.language} />
                          ))}
                        </Tabs>

                        {/* Copy Button */}
                        <Button
                          size="small"
                          sx={{
                            minWidth: 'auto',
                            p: 1,
                            color: codeExamples[selectedLanguage].textColor,
                            opacity: 0.8,
                            '&:hover': {
                              opacity: 1,
                              bgcolor: 'rgba(255,255,255,0.1)'
                            }
                          }}
                          onClick={() => navigator.clipboard.writeText(codeExamples[selectedLanguage].code)}
                        >
                          <CopyOutlined /> Copy
                        </Button>
                      </Box>

                      {/* Code Display */}
                      <CardContent sx={{ p: 0 }}>
                        <Box
                          sx={{
                            background: '#1e1e1e',
                            color: '#d4d4d4',
                            p: 3,
                            fontFamily: 'monospace',
                            fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.85rem' },
                            lineHeight: 1.5,
                            overflow: 'auto',
                            maxHeight: '500px'
                          }}
                        >
                          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{codeExamples[selectedLanguage].code}</pre>
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
