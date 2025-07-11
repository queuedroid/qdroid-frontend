import React, { useState, useEffect, useRef } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  TextField,
  Avatar,
  Grid,
  Alert
} from '@mui/material';
import { QRCodeCanvas } from 'qrcode.react';
import { CopyOutlined, WhatsAppOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { useUserDetails } from 'hooks/useUserDetails';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignalMessenger } from '@fortawesome/free-brands-svg-icons';

const platformStyles = {
  WhatsApp: {
    hoverBg: '#25D366',
    color: '#fff'
  },
  Signal: {
    hoverBg: '#3A76F0',
    color: '#fff'
  }
};

const platforms = [
  {
    name: 'WhatsApp',
    img: <WhatsAppOutlined />
  },
  {
    name: 'Signal',
    img: <FontAwesomeIcon icon={faSignalMessenger} />
  }
];

const OnboardingStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [platform, setPlatform] = useState('');
  const [copied, setCopied] = useState(false);
  const { userDetails } = useUserDetails();
  const [deviceMsg, setDeviceMsg] = useState('');
  const [deviceError, setDeviceError] = useState('');
  const [testMsg, setTestMsg] = useState('');
  const [testPhone, setTestPhone] = useState('');
  const [testMsgStatus, setTestMsgStatus] = useState('');
  const [testMsgError, setTestMsgError] = useState('');
  const [wsQrData, setWsQrData] = useState('');
  const wsRef = useRef(null);

  const apiKey = 'sk_live_12345-abcdef-ghijk';
  const navigate = useNavigate();

  const steps = ['Add Platform', 'Test Send'];

  // When a platform is selected, run the add device API request and move to next step
  const handlePlatformSelect = async (name) => {
    setPlatform(name);
    setDeviceMsg('');
    setDeviceError('');
    setWsQrData('');
    // Close any previous websocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    try {
      const access_token = localStorage.getItem('token');
      const username = userDetails.full_name || 'User';
      let platformKey = name.toLowerCase();
      if (platformKey === 'whatsapp') platformKey = 'wa';
      const endpoint = `https://sherlockwisdom.com:8080/${platformKey}/devices/`;
      const payload = {
        username,
        access_token
      };
      console.log('Add device payload:', payload, 'Endpoint:', endpoint);
      const res = await axios.post(endpoint, payload, {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log('Add device server response:', res.data);
      setDeviceMsg('Device added successfully!');
      // Connect to websocket if websocket_url is returned
      if (res.data?.websocket_url) {
        let wsUrl = res.data.websocket_url;
        // Ensure wsUrl is absolute and uses wss
        if (wsUrl.startsWith('/')) {
          wsUrl = `wss://sherlockwisdom.com:8090${wsUrl}`;
        }
        try {
          wsRef.current = new window.WebSocket(wsUrl);
          wsRef.current.onopen = () => {
            console.log('WebSocket connected:', wsUrl);
          };
          wsRef.current.onmessage = (event) => {
            console.log('WebSocket message:', event.data);
            setWsQrData(event.data);
          };
          wsRef.current.onerror = (error) => {
            console.error('WebSocket error:', error);
            setDeviceError('WebSocket connection failed. Please ensure the backend WebSocket endpoint is running and accessible.');
          };
          wsRef.current.onclose = (event) => {
            console.log('WebSocket closed', event);
          };
        } catch (wsErr) {
          console.error('WebSocket connection error:', wsErr);
          setDeviceError('WebSocket connection error. Please check your backend and network.');
        }
      }
      setActiveStep(1);
    } catch (err) {
      if (err.response?.data?.message) {
        setDeviceError(err.response.data.message);
        console.error('Add device error:', err.response.data.message, err.response);
      } else {
        setDeviceError(err.message || 'Failed to add device');
        console.error('Add device error:', err, err?.response);
      }
    }
  };

  const handleFinish = () => {
    localStorage.setItem('hasOnboarded', 'true');
    navigate('/dashboard');
  };

  // Send test message
  const handleSendTestMessage = async () => {
    setTestMsgStatus('');
    setTestMsgError('');
    try {
      const access_token = localStorage.getItem('token');
      let platformKey = platform.toLowerCase();
      if (platformKey === 'whatsapp') platformKey = 'wa';
      const endpoint = `https://sherlockwisdom.com:8080/${platformKey}/message/${testPhone}`;
      const payload = {
        access_token,
        message: testMsg
      };
      console.log('Send message payload:', payload, 'Endpoint:', endpoint);
      const res = await axios.post(endpoint, payload, {
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log('Send message server response:', res.data);
      setTestMsgStatus('Message sent successfully!');
    } catch (err) {
      if (err.response?.data) {
        setTestMsgError(err.response.data.message || JSON.stringify(err.response.data));
        console.error('Send message error:', err.response.data, err.response);
      } else {
        setTestMsgError(err.message || 'Failed to send message');
        console.error('Send message error:', err, err?.response);
      }
    }
  };

  // Cleanup websocket on unmount
  useEffect(() => {
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4 }}>
        {activeStep === 0 && (
          <Box>
            <Typography variant="h6" textAlign="center" fontWeight="bold" sx={{ mb: 2 }}>
              Select a platform to add
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {platforms.map((p) => (
                <Grid item key={p.name}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      cursor: 'pointer',
                      border: platform === p.name ? '2px solid #1976d2' : '2px solid transparent',
                      p: 2,
                      width: 100,
                      height: 100,
                      justifyContent: 'center',
                      transition: 'border 0.2s, background 0.2s',
                      '&:hover': {
                        background: platformStyles[p.name]?.hoverBg || '#eee',
                        color: platformStyles[p.name]?.color || 'inherit'
                      },
                      '&:hover .MuiAvatar-root': {
                        background: 'transparent'
                      }
                    }}
                    onClick={() => handlePlatformSelect(p.name)}
                  >
                    <Avatar
                      sx={{
                        bgcolor: platform === p.name ? platformStyles[p.name]?.hoverBg : 'default',
                        color: platform === p.name ? platformStyles[p.name]?.color : 'inherit',
                        mb: 1,
                        width: 48,
                        height: 48,
                        transition: 'background 0.2s, color 0.2s'
                      }}
                    >
                      {p.img}
                    </Avatar>
                    <Typography variant="body1">{p.name}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
            {deviceMsg && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {deviceMsg}
              </Alert>
            )}
            {deviceError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {deviceError}
              </Alert>
            )}
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Test Sending a Message
            </Typography>
            {/* Show QR code from websocket if available */}
            {wsQrData && (
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Scan this QR Code (live from device)
                </Typography>
                <QRCodeCanvas value={wsQrData} size={200} />
              </Box>
            )}
            <TextField
              fullWidth
              label="Phone Number"
              sx={{ mt: 2 }}
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              placeholder="Enter phone number"
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Message"
              sx={{ mt: 2 }}
              value={testMsg}
              onChange={(e) => setTestMsg(e.target.value)}
              placeholder="Enter your message"
            />
            <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSendTestMessage} disabled={!testPhone || !testMsg}>
              Send Test Message
            </Button>
            <Button variant="outlined" color="success" sx={{ mt: 2, ml: 2 }} onClick={handleFinish}>
              Finish
            </Button>
            {testMsgStatus && (
              <Alert severity="success" sx={{ mt: 2 }}>
                {testMsgStatus}
              </Alert>
            )}
            {testMsgError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {testMsgError}
              </Alert>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default OnboardingStepper;
