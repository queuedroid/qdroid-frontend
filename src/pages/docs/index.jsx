import React, { useState } from 'react';
import {
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Container,
  Paper,
  Tabs,
  Tab,
  Alert,
  Breadcrumbs,
  Link,
  Divider,
  IconButton,
  Chip,
  AppBar,
  Toolbar,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Dashboard as DashboardIcon,
  Send as SendIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Code as CodeIcon,
  Analytics as AnalyticsIcon,
  Help as HelpIcon,
  Speed as SpeedIcon,
  Webhook as WebhookIcon,
  Home as HomeIcon,
  ChevronRight as ChevronRightIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';

const DocsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'));
  const [selectedSection, setSelectedSection] = useState('introduction');
  const [selectedLanguage, setSelectedLanguage] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const codeExamples = [
    {
      language: 'JavaScript',
      code: `const axios = require('axios');

const sendSMS = async () => {
  try {
    const response = await axios.post(
      'http://localhost:8080/v1/messages/send',
      {
        phone_number: '+1234567890',
        content: 'Hello from QueueDroid!',
        exchange_id: 'your-exchange-id',
        queue_id: 'optional-queue-id'
      },
      {
        headers: {
          'Authorization': 'Bearer YOUR_ACCOUNT_TOKEN',
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
      code: `import requests

def send_sms():
    url = "http://localhost:8080/v1/messages/send"
    
    headers = {
        "Authorization": "Bearer YOUR_ACCOUNT_TOKEN",
        "Content-Type": "application/json"
    }
    
    data = {
        "phone_number": "+1234567890",
        "content": "Hello from QueueDroid!",
        "exchange_id": "your-exchange-id",
        "queue_id": "optional-queue-id"
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        print("Message queued:", response.json())
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")

send_sms()`
    },
    {
      language: 'cURL',
      code: `curl -X POST http://localhost:8080/v1/messages/send \\
  -H "Authorization: Bearer YOUR_ACCOUNT_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone_number": "+1234567890",
    "content": "Hello from QueueDroid!",
    "exchange_id": "your-exchange-id",
    "queue_id": "optional-queue-id"
  }'`
    }
  ];

  const sections = [
    { id: 'introduction', title: 'Introduction', category: 'Getting Started' },
    { id: 'quickstart', title: 'Quick Start', category: 'Getting Started' },
    { id: 'dashboard-overview', title: 'Dashboard Overview', category: 'Getting Started' },
    { id: 'exchanges', title: 'Exchanges & Queues', category: 'Essentials' },
    { id: 'sending-sms', title: 'Sending SMS', category: 'Messaging' },
    { id: 'bulk-messaging', title: 'Bulk Messaging & CSV', category: 'Messaging' }
  ];

  const groupedSections = sections.reduce((acc, section) => {
    if (!acc[section.category]) {
      acc[section.category] = [];
    }
    acc[section.category].push(section);
    return acc;
  }, {});

  const sidebarContent = (
    <Box sx={{ width: isMobile ? '100vw' : 280, p: { xs: 2, sm: 3 } }}>
      <Typography
        variant={isMobile ? 'h6' : 'h5'}
        sx={{
          mb: 3,
          fontWeight: 'bold',
          color: '#ee5a52',
          fontSize: { xs: '1.25rem', sm: '1.5rem' }
        }}
      >
        QueueDroid Documentation
      </Typography>

      {Object.entries(groupedSections).map(([category, categorySection]) => (
        <Box key={category} sx={{ mb: 3 }}>
          <Typography
            variant="overline"
            sx={{
              mb: 1.5,
              display: 'block',
              fontWeight: 600,
              color: 'text.secondary',
              fontSize: { xs: '0.7rem', sm: '0.75rem' },
              letterSpacing: 1
            }}
          >
            {category}
          </Typography>
          <List sx={{ py: 0 }}>
            {categorySection.map((section) => (
              <ListItem
                key={section.id}
                button
                onClick={() => {
                  setSelectedSection(section.id);
                  if (isMobile) {
                    setMobileMenuOpen(false);
                  }
                }}
                sx={{
                  borderRadius: 1,
                  mb: 0.5,
                  py: { xs: 1.5, sm: 1 },
                  backgroundColor: selectedSection === section.id ? 'rgba(238, 90, 82, 0.1)' : 'transparent',
                  '&:hover': {
                    backgroundColor: selectedSection === section.id ? 'rgba(238, 90, 82, 0.1)' : 'rgba(238, 90, 82, 0.05)'
                  }
                }}
              >
                <ListItemText
                  primary={section.title}
                  sx={{
                    '& .MuiTypography-root': {
                      fontWeight: selectedSection === section.id ? 600 : 400,
                      color: selectedSection === section.id ? '#ee5a52' : 'inherit',
                      fontSize: { xs: '0.9rem', sm: '0.875rem' }
                    }
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </Box>
  );

  const getCurrentSection = () => sections.find((s) => s.id === selectedSection);

  const renderBreadcrumb = () => {
    const currentSection = getCurrentSection();
    return (
      <Breadcrumbs separator={<ChevronRightIcon fontSize="small" />} sx={{ mb: 3 }}>
        <Link color="inherit" href="#" onClick={() => setSelectedSection('introduction')}>
          Documentation
        </Link>
        <Typography color="text.primary">{currentSection?.title}</Typography>
      </Breadcrumbs>
    );
  };

  const renderContent = () => {
    switch (selectedSection) {
      case 'introduction':
        return (
          <Box>
            {renderBreadcrumb()}
            <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold', fontSize: { xs: '1.75rem', sm: '2.125rem', md: '3rem' } }}>
              Welcome to QueueDroid
            </Typography>

            <Alert severity="info" sx={{ mb: 4 }}>
              <Typography variant="body2" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                <strong>New to QueueDroid?</strong> Start with our{' '}
                <Link component="button" onClick={() => setSelectedSection('quickstart')} sx={{ textDecoration: 'none' }}>
                  Quick Start Guide
                </Link>{' '}
                to send your first SMS in under 5 minutes.
              </Typography>
            </Alert>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.8, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
              QueueDroid is a powerful, enterprise-grade SMS messaging platform designed for developers who need reliable, scalable bulk
              messaging with advanced routing capabilities. Built with modern microservices architecture, QueueDroid handles everything from
              single messages to massive campaigns with intelligent carrier optimization.
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                Key Features
              </Typography>

              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                Smart Routing: Automatic MCC/MNC-based carrier routing ensures optimal delivery rates and cost efficiency for your messages
                across different networks.
              </Typography>

              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                Real-time Analytics: Track message delivery status, view detailed analytics, and monitor system performance with
                comprehensive dashboard and reporting tools.
              </Typography>

              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                Bulk Messaging: Send thousands of messages efficiently with CSV upload support, personalized content, and intelligent queue
                management for optimal throughput.
              </Typography>
            </Box>

            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
              Core Concepts
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 2, color: '#ee5a52', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                Exchanges & Queues
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                QueueDroid organizes messaging through <strong>exchanges</strong> and <strong>queues</strong>. Exchanges act as message
                routing centers, while queues handle the actual message delivery to specific carriers or networks.
              </Typography>
              <Box component="ul" sx={{ mb: 3, '& li': { mb: 1 }, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                <li>
                  <strong>Exchange:</strong> A logical container for organizing related messaging traffic
                </li>
                <li>
                  <strong>Queue:</strong> Automatically created based on MCC/MNC codes for carrier-specific routing
                </li>
                <li>
                  <strong>Message:</strong> Individual SMS with content, recipient, and routing information
                </li>
              </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 2, color: '#ee5a52', fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                Authentication & Security
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                All API requests are secured using account tokens. Each user receives a unique token that must be included in the
                Authorization header of every request.
              </Typography>
            </Box>

            <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
              What You Can Build
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                Notification Systems: Order confirmations, appointment reminders, security alerts, and system notifications.
              </Typography>

              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                Marketing Campaigns: Promotional messages, product launches, customer engagement, and targeted campaigns.
              </Typography>

              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                Two-Factor Authentication: OTP delivery, account verification, password resets, and security confirmations.
              </Typography>

              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: { xs: '1rem', sm: '1.1rem' } }}>
                Business Intelligence: Automated reports, data alerts, status updates, and business process notifications.
              </Typography>
            </Box>
          </Box>
        );

      case 'quickstart':
        return (
          <Box>
            {renderBreadcrumb()}
            <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
              Quick Start Guide
            </Typography>

            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, fontSize: '1.1rem' }}>
              Get started with QueueDroid in under 5 minutes. This guide will walk you through creating your first exchange and sending your
              first SMS message.
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#ee5a52' }}>
                Prerequisites
              </Typography>
              <Box component="ul" sx={{ mb: 3, '& li': { mb: 1 }, fontSize: '1.1rem' }}>
                <li>A QueueDroid account (sign up at the login page)</li>
                <li>Your account token (available in the dashboard)</li>
                <li>A valid phone number for testing</li>
              </Box>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#ee5a52' }}>
                Step 1: Access Your Dashboard
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
                After logging in, you'll see your main dashboard with key statistics and your account information.
              </Typography>

              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body1">
                  <strong>Find Your Account Token:</strong> Look for the "User Information" section on your dashboard. Your account token is
                  displayed there - you'll need this for API authentication.
                </Typography>
              </Alert>

              {/* Placeholder for dashboard screenshot */}
              <Box
                component="img"
                src="dashboard.png"
                alt="Dashboard Screenshot"
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '100%',
                  borderRadius: 1,
                  boxShadow: 2
                }}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#ee5a52' }}>
                Step 2: Create Your First Exchange
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
                Navigate to "Exchange Management" in the sidebar and create a new exchange:
              </Typography>

              <Box component="ol" sx={{ mb: 3, '& li': { mb: 2 }, fontSize: '1.1rem' }}>
                <li>Click the "Create Exchange" button</li>
                <li>Enter a descriptive label (e.g., "My First Exchange")</li>
                <li>Add a description explaining the exchange purpose</li>
                <li>Click "Create" to save your exchange</li>
              </Box>

              {/* Placeholder for exchange creation screenshot */}
              <Box
                component="img"
                src="create-exchange.png"
                alt="Exchange Creation Screenshot"
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxWidth: '100%',
                  borderRadius: 1,
                  boxShadow: 2
                }}
              />
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#ee5a52' }}>
                Step 3: Send Your First SMS
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
                Now you're ready to send your first message. You can use either the dashboard interface or make an API call directly:
              </Typography>

              <Typography variant="h6" sx={{ mb: 2 }}>
                Option A: Using the Dashboard
              </Typography>
              <Box component="ol" sx={{ mb: 3, '& li': { mb: 1 }, fontSize: '1.1rem' }}>
                <li>Click the floating compose button in the bottom-right corner</li>
                <li>Select your newly created exchange</li>
                <li>Enter a phone number (include country code, e.g., +1234567890)</li>
                <li>Type your message content</li>
                <li>Click "Send" to queue your message</li>
              </Box>

              <Typography variant="h4" sx={{ mb: 2 }}>
                Option B: Using the API
              </Typography>
              <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7, fontSize: '1.1rem' }}>
                Make a POST request to send your message programmatically:
              </Typography>

              <Paper sx={{ p: 0, mb: 3, overflow: 'hidden' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs
                    value={selectedLanguage}
                    onChange={(event, newValue) => setSelectedLanguage(newValue)}
                    variant={isMobile ? 'scrollable' : 'standard'}
                    scrollButtons={isMobile ? 'auto' : false}
                    allowScrollButtonsMobile
                    sx={{
                      '& .MuiTab-root': {
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        minWidth: { xs: 80, sm: 120 }
                      }
                    }}
                  >
                    {codeExamples.map((example, index) => (
                      <Tab key={index} label={example.language} />
                    ))}
                  </Tabs>
                </Box>
                <Box
                  sx={{
                    backgroundColor: '#1e1e1e',
                    color: '#d4d4d4',
                    p: { xs: 2, sm: 3 },
                    fontFamily: 'monospace',
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    lineHeight: 1.5,
                    overflow: 'auto',
                    maxWidth: '100%'
                  }}
                >
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{codeExamples[selectedLanguage].code}</pre>
                </Box>
              </Paper>
            </Box>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#ee5a52' }}>
                Step 4: Track Your Message
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
                After sending, monitor your message status:
              </Typography>

              <Box component="ul" sx={{ mb: 3, '& li': { mb: 1 }, fontSize: '1.1rem' }}>
                <li>Navigate to "Event Logs" → "Messages" in the sidebar</li>
                <li>Find your message in the list (most recent first)</li>
                <li>
                  Check the status: <Chip label="QUEUED" color="success" size="small" /> means successfully queued
                </li>
                <li>View delivery details and any error information</li>
              </Box>
            </Box>

            <Alert severity="success" sx={{ mb: 4 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                🎉 Congratulations!
              </Typography>
              <Typography variant="body1">
                You've successfully sent your first SMS with QueueDroid. Next, explore{' '}
                <Link
                  component="button"
                  onClick={() => setSelectedSection('bulk-messaging')}
                  sx={{ textDecoration: 'none', fontWeight: 600 }}
                >
                  Bulk Messaging
                </Link>{' '}
                to send multiple messages or check out the{' '}
                <Link
                  component="button"
                  onClick={() => setSelectedSection('api-reference')}
                  sx={{ textDecoration: 'none', fontWeight: 600 }}
                >
                  Complete API Reference
                </Link>
                .
              </Typography>
            </Alert>
          </Box>
        );

      case 'dashboard-overview':
        return (
          <Box>
            {renderBreadcrumb()}
            <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
              Dashboard Overview
            </Typography>

            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, fontSize: '1.1rem' }}>
              The QueueDroid dashboard provides a comprehensive overview of your messaging operations, account details, and system
              performance. Here's a detailed walkthrough of each section.
            </Typography>

            <Box sx={{ mb: 5 }}>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#ee5a52' }}>
                Dashboard Statistics
              </Typography>

              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
                The top section displays four key metrics that give you an instant overview of your QueueDroid usage:
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ mb: 2, color: '#ee5a52' }}>
                  Total Exchanges
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
                  Shows the number of active exchanges in your account. Each exchange represents a logical grouping of your messaging
                  traffic.
                </Typography>

                <Typography variant="h5" sx={{ mb: 2, color: '#ee5a52' }}>
                  Active Queues
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
                  Displays queues that currently have active consumers. These are automatically created based on carrier routing
                  requirements.
                </Typography>

                <Typography variant="h5" sx={{ mb: 2, color: '#ee5a52' }}>
                  Total Messages
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
                  The cumulative count of all messages processed through your account, including queued, sent, and failed messages.
                </Typography>

                <Typography variant="h5" sx={{ mb: 2, color: '#ee5a52' }}>
                  Messages Queued
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
                  Shows messages currently pending delivery. This helps you monitor queue backlog and system performance.
                </Typography>
              </Box>
              <Box component="img" src="half.png" alt="Dashboard Screenshot" sx={{ width: '100%' }} />
            </Box>

            <Box sx={{ mb: 5 }}>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#ee5a52' }}>
                User Information Section
              </Typography>

              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
                This critical section contains your authentication credentials needed for API access:
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Account ID
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7, fontSize: '1.1rem' }}>
                  Your unique account identifier. This is used internally by the system and for support purposes.
                </Typography>
                <Box component="ul" sx={{ mb: 3, '& li': { mb: 1 }, fontSize: '1.1rem' }}>
                  <li>Hidden by default for security</li>
                  <li>Click the eye icon to reveal</li>
                  <li>Click the copy icon to copy to clipboard</li>
                </Box>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  Account Token
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7, fontSize: '1.1rem' }}>
                  Your API authentication token - this is what you'll use in the Authorization header for all API requests.
                </Typography>
                <Box component="ul" sx={{ mb: 3, '& li': { mb: 1 }, fontSize: '1.1rem' }}>
                  <li>Always keep this token secure and private</li>
                  <li>Never expose it in client-side code or public repositories</li>
                  <li>Use the copy button to safely copy it for API calls</li>
                  <li>Contact support if you need to regenerate your token</li>
                </Box>
              </Box>

              <Box component="img" src="user-info.png" alt="Dashboard Screenshot" sx={{ width: '100%' }} />
            </Box>

            <Box sx={{ mb: 5 }}>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#ee5a52' }}>
                Analytics Charts
              </Typography>

              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
                The dashboard includes two interactive charts that help you visualize your messaging data:
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ mb: 2, color: '#ee5a52' }}>
                  Event Logs Timeline Chart
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7, fontSize: '1.1rem' }}>
                  A time-series chart showing message activity over the past 7 days. Helps you:
                </Typography>
                <Box component="ul" sx={{ mb: 3, '& li': { mb: 0.5 }, fontSize: '1.1rem' }}>
                  <li>Track daily message volume patterns</li>
                  <li>Identify peak usage times</li>
                  <li>Monitor system activity trends</li>
                  <li>Plan capacity for busy periods</li>
                </Box>

                <Typography variant="h5" sx={{ mb: 2, color: '#ee5a52' }}>
                  Status Distribution Chart
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7, fontSize: '1.1rem' }}>
                  A pie chart breaking down message statuses:
                </Typography>
                <Box component="ul" sx={{ mb: 3, '& li': { mb: 0.5 }, fontSize: '1.1rem' }}>
                  <li>🟢 Queued messages</li>
                  <li>🟡 Pending messages</li>
                  <li>🔴 Failed messages</li>
                </Box>
              </Box>

              <Box component="img" src="message-chart.png" alt="Dashboard Screenshot" sx={{ width: '100%' }} />
            </Box>

            <Box sx={{ mb: 5 }}>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#ee5a52' }}>
                Recent Message Logs
              </Typography>

              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
                The bottom section displays your 5 most recent message logs in a convenient table format:
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Table Columns Explained
                </Typography>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7, fontSize: '1.1rem' }}>
                    <strong>Status:</strong> Color-coded chips showing message state
                  </Typography>
                  <Box component="ul" sx={{ mb: 3, ml: 2, '& li': { mb: 0.5 }, fontSize: '1.1rem' }}>
                    <li>
                      <Chip label="QUEUED" color="success" size="small" /> - Successfully queued
                    </li>
                    <li>
                      <Chip label="PENDING" color="warning" size="small" /> - Being processed
                    </li>
                    <li>
                      <Chip label="FAILED" color="error" size="small" /> - Delivery failed
                    </li>
                  </Box>

                  <Typography variant="body1" sx={{ mb: 1, lineHeight: 1.7, fontSize: '1.1rem' }}>
                    <strong>Queue:</strong> Shows the routing queue used (truncated for display)
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, lineHeight: 1.7, fontSize: '1.1rem' }}>
                    <strong>Carrier:</strong> The destination network/carrier if detected
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, lineHeight: 1.7, fontSize: '1.1rem' }}>
                    <strong>Recipient:</strong> The destination phone number
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, lineHeight: 1.7, fontSize: '1.1rem' }}>
                    <strong>Date:</strong> When the message was created (formatted as "MMM dd, HH:mm")
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1, lineHeight: 1.7, fontSize: '1.1rem' }}>
                    <strong>More:</strong> Quick link to view full details in Event Logs
                  </Typography>
                </Box>
              </Box>

              <Box component="img" src="message-logs.png" alt="Dashboard Screenshot" sx={{ width: '100%' }} />
            </Box>

            <Box sx={{ mb: 5 }}>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#ee5a52' }}>
                Quick Actions
              </Typography>

              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
                The dashboard provides several ways to quickly access common functions:
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  Floating Compose Button
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
                  The blue floating action button in the bottom-right corner opens the message composer, allowing you to quickly send single
                  messages or upload CSV files for bulk messaging.
                </Typography>

                <Typography variant="h5" sx={{ mb: 2 }}>
                  Refresh Button
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
                  Located in the top-right corner, this button refreshes all dashboard statistics to show the most current data without
                  requiring a page reload.
                </Typography>
              </Box>
            </Box>

            <Alert severity="info">
              <Typography variant="h5" sx={{ mb: 1 }}>
                Dashboard Tips
              </Typography>
              <Box component="ul" sx={{ mb: 0, '& li': { mb: 0.5 }, fontSize: '1.1rem' }}>
                <li>Use the refresh button to get real-time updates on your statistics</li>
                <li>The floating compose button is available on every page for quick access</li>
                <li>Click "View All →" next to Recent Message Logs to see your complete message history</li>
                <li>Hover over truncated queue names to see the full queue identifier</li>
                <li>Charts automatically update to reflect your latest messaging activity</li>
              </Box>
            </Alert>
          </Box>
        );

      case 'exchanges':
        return (
          <Box>
            {renderBreadcrumb()}
            <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
              Exchanges & Queues
            </Typography>

            <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.8, fontSize: '1.1rem' }}>
              Understanding exchanges and queues is fundamental to using QueueDroid effectively. This guide explains these core concepts and
              how to manage them.
            </Typography>

            <Alert severity="info" sx={{ mb: 4 }}>
              <Typography variant="body1">
                <strong>Quick Overview:</strong> Think of exchanges as projects or campaigns, and queues as the delivery routes that are
                automatically optimized for different carriers.
              </Typography>
            </Alert>

            <Box sx={{ mb: 5 }}>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#ee5a52' }}>
                What are Exchanges?
              </Typography>

              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
                An exchange is a logical container that organizes your messaging traffic. Each exchange represents a distinct messaging
                project, campaign, or application.
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  Use Cases for Exchanges
                </Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7, fontSize: '1.1rem' }}>
                    <strong>Marketing Campaigns:</strong> "Black Friday Promo 2024"
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7, fontSize: '1.1rem' }}>
                    <strong>Transactional Messages:</strong> "Order Confirmations"
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7 }}>
                    <strong>Security Alerts:</strong> "2FA Verification Codes"
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7, fontSize: '1.1rem' }}>
                    <strong>Appointment Reminders:</strong> "Dental Office Reminders"
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7, fontSize: '1.1rem' }}>
                    <strong>Customer Support:</strong> "Support Notifications"
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7, fontSize: '1.1rem' }}>
                    <strong>Event Updates:</strong> "Conference 2024 Updates"
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7, fontSize: '1.1rem' }}>
                    <strong>System Alerts:</strong> "Server Monitoring Alerts"
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7, fontSize: '1.1rem' }}>
                    <strong>Product Updates:</strong> "App Release Notifications"
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  Exchange Properties
                </Typography>
                <Box component="ul" sx={{ mb: 3, '& li': { mb: 1 }, fontSize: '1.1rem' }}>
                  <li>
                    <strong>Exchange ID:</strong> Unique identifier (auto-generated)
                  </li>
                  <li>
                    <strong>Label:</strong> Human-readable name for easy identification
                  </li>
                  <li>
                    <strong>Description:</strong> Detailed explanation of the exchange purpose
                  </li>
                  <li>
                    <strong>Creation Date:</strong> When the exchange was created
                  </li>
                  <li>
                    <strong>Status:</strong> Active/Inactive state
                  </li>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mb: 5 }}>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#ee5a52' }}>
                Understanding Queues
              </Typography>

              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
                Queues are automatically created routing channels that handle message delivery to specific carriers or networks. QueueDroid
                creates these automatically based on the destination phone numbers' MCC/MNC codes.
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  Automatic Queue Creation
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7, fontSize: '1.1rem' }}>
                  When you send a message, QueueDroid analyzes the destination phone number and:
                </Typography>
                <Box component="ol" sx={{ mb: 3, '& li': { mb: 1 }, fontSize: '1.1rem' }}>
                  <li>Extracts the country code and carrier information (MCC/MNC)</li>
                  <li>Determines the optimal routing queue for that carrier</li>
                  <li>Creates the queue automatically if it doesn't exist</li>
                  <li>Routes the message through the appropriate delivery channel</li>
                </Box>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  Queue Naming Convention
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.7, fontSize: '1.1rem' }}>
                  Queue names follow a specific pattern for easy identification:
                </Typography>
                <Paper sx={{ p: 3, backgroundColor: '#161515ff', mb: 3, color: '#f5f5f5' }}>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace', mb: 2 }}>
                    Format: [exchange_id].[country_code].[network_code]
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Example: <code>ex_abc123.237.62401</code>
                  </Typography>
                  <Box component="ul" sx={{ mt: 2, '& li': { mb: 0.5 }, fontSize: '1.1rem' }}>
                    <li>
                      <code>ex_abc123</code> - Exchange identifier
                    </li>
                    <li>
                      <code>237</code> - Country code (Cameroon)
                    </li>
                    <li>
                      <code>62401</code> - Network code (MTN Cameroon)
                    </li>
                  </Box>
                </Paper>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h3" sx={{ mb: 2 }}>
                  Queue Management Features
                </Typography>

                <Typography variant="h4" sx={{ mb: 2 }}>
                  Automatic Management
                </Typography>
                <Box component="ul" sx={{ mb: 3, '& li': { mb: 0.5 }, fontSize: '1.1rem' }}>
                  <li>Auto-creation based on routing needs</li>
                  <li>Intelligent message distribution</li>
                  <li>Load balancing across carriers</li>
                  <li>Failure handling and retries</li>
                </Box>

                <Typography variant="h4" sx={{ mb: 2 }}>
                  Manual Controls
                </Typography>
                <Box component="ul" sx={{ mb: 3, '& li': { mb: 0.5 }, fontSize: '1.1rem' }}>
                  <li>View queue statistics and status</li>
                  <li>Create custom queues if needed</li>
                  <li>Delete unused queues</li>
                  <li>Monitor queue performance</li>
                </Box>
              </Box>
            </Box>

            <Box sx={{ mb: 5 }}>
              <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, color: '#ee5a52' }}>
                Managing Exchanges
              </Typography>

              <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
                The Exchange Management page provides full control over your exchanges and their associated queues.
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  Creating an Exchange
                </Typography>
                <Box component="ol" sx={{ mb: 3, '& li': { mb: 1 }, fontSize: '1.1rem' }}>
                  <li>Navigate to "Exchange Management" in the sidebar</li>
                  <li>Click the "Create Exchange" button</li>
                  <li>Enter a descriptive label (e.g., "Customer Notifications")</li>
                  <li>Add a detailed description explaining the purpose</li>
                  <li>Click "Create" to save your new exchange</li>
                </Box>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  Editing an Exchange
                </Typography>
                <Box component="ul" sx={{ mb: 3, '& li': { mb: 1 }, fontSize: '1.1rem' }}>
                  <li>Find your exchange in the list</li>
                  <li>Click the edit (pencil) icon</li>
                  <li>Modify the label or description as needed</li>
                  <li>Save your changes</li>
                </Box>
              </Box>

              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                  Deleting an Exchange
                </Typography>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  <Typography variant="body1">
                    <strong>Important:</strong> Deleting an exchange will also remove all associated queues and stop message processing.
                    This action cannot be undone.
                  </Typography>
                </Alert>
                <Box component="ul" sx={{ mb: 3, '& li': { mb: 1 }, fontSize: '1.1rem' }}>
                  <li>Click the delete (trash) icon next to the exchange</li>
                  <li>Confirm the deletion in the popup dialog</li>
                  <li>All associated queues will be automatically removed</li>
                </Box>
              </Box>
            </Box>

            <Alert severity="success">
              <Typography variant="h4" sx={{ mb: 1 }}>
                Best Practices
              </Typography>
              <Box component="ul" sx={{ mb: 0, '& li': { mb: 0.5 }, fontSize: '1.1rem' }}>
                <li>Create separate exchanges for different types of messaging (transactional vs. marketing)</li>
                <li>Use descriptive labels that clearly indicate the exchange purpose</li>
                <li>Let QueueDroid handle queue creation automatically for optimal routing</li>
                <li>Monitor queue performance through the dashboard analytics</li>
                <li>Keep exchange descriptions updated as your use cases evolve</li>
              </Box>
            </Alert>
          </Box>
        );

      case 'sending-sms':
        return (
          <Box>
            {renderBreadcrumb()}
            <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
              Sending SMS
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
              Send SMS messages using the /messages/send endpoint. Here's how to structure your requests:
            </Typography>

            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              Endpoint
            </Typography>
            <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f5f5f5' }}>
              <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                POST http://localhost:8080/v1/messages/send
              </Typography>
            </Paper>

            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              Request Body
            </Typography>
            <Box
              sx={{
                backgroundColor: '#1e1e1e',
                color: '#d4d4d4',
                p: { xs: 2, sm: 3 },
                fontFamily: 'monospace',
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                lineHeight: 1.5,
                borderRadius: 1,
                mb: 3,
                overflow: 'auto',
                maxWidth: '100%'
              }}
            >
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{`{
  "phone_number": "+1234567890",     // Required: Phone number in E.164 format
  "content": "Your message",         // Required: Message content
  "exchange_id": "your-exchange-id", // Required: Exchange ID for routing
  "queue_id": "queue.name.here"      // Optional: Specific queue ID for routing
}`}</pre>
            </Box>

            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              Response
            </Typography>
            <Box
              sx={{
                backgroundColor: '#1e1e1e',
                color: '#d4d4d4',
                p: 3,
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                borderRadius: 1,
                mb: 3
              }}
            >
              <pre style={{ margin: 0 }}>{`{
  "id": "msg_1234567890",
  "status": "queued",
  "to": "+1234567890",
  "message": "Your message",
  "created_at": "2024-01-01T12:00:00Z",
  "estimated_delivery": "2024-01-01T12:00:05Z"
}`}</pre>
            </Box>
          </Box>
        );

      case 'bulk-messaging':
        return (
          <Box>
            {renderBreadcrumb()}
            <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
              Bulk Messaging & CSV Upload
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
              QueueDroid supports bulk messaging through JSON arrays or CSV file uploads for sending messages to multiple recipients.
            </Typography>

            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              JSON Bulk Messaging
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
              Send multiple messages using the /messages/bulk-send endpoint with a JSON payload:
            </Typography>
            <Box
              sx={{
                backgroundColor: '#1e1e1e',
                color: '#d4d4d4',
                p: 3,
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                borderRadius: 1,
                mb: 3
              }}
            >
              <pre style={{ margin: 0 }}>{`POST http://localhost:8080/v1/messages/bulk-send
Authorization: Bearer YOUR_ACCOUNT_TOKEN
Content-Type: application/json

{
  "messages": [
    {
      "content": "Hello, World!",
      "exchange_id": "ex_jkdfkjdfkdfjkd",
      "phone_number": "+2371234567890",
      "queue_id": "exch_jkdfkjdfkdfjkd.237.62401"
    },
    {
      "content": "Another message",
      "exchange_id": "ex_jkdfkjdfkdfjkd", 
      "phone_number": "+2379876543210",
      "queue_id": "exch_jkdfkjdfkdfjkd.237.62401"
    }
  ]
}`}</pre>
            </Box>

            <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
              CSV File Upload Options
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
              The CSV upload supports two modes depending on your CSV file structure:
            </Typography>

            <Typography variant="h5" sx={{ mb: 2 }}>
              Option 1: Phone Numbers Only
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
              Upload a CSV with just phone numbers. The system automatically adds the same message content (entered in the UI) to all
              recipients.
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
              Your CSV must contain at least one column with phone numbers. The column name can be any of the following:
            </Typography>
            <Box component="ul" sx={{ mb: 3, '& li': { mb: 1 }, fontSize: '1.1rem' }}>
              <li>
                <code>phone_number</code>, <code>phone</code>, <code>mobile</code>
              </li>
              <li>Any column name containing the words "phone", "number", or "mobile"</li>
            </Box>

            <Typography variant="h5" sx={{ mb: 2 }}>
              Example CSV Format (Phone Numbers Only)
            </Typography>
            <Box
              sx={{
                backgroundColor: '#1e1e1e',
                color: '#d4d4d4',
                p: 3,
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                borderRadius: 1,
                mb: 3
              }}
            >
              <pre style={{ margin: 0 }}>{`phone_number,name
+237123456789,John Doe
+237987654321,Jane Smith
+237555444333,Bob Johnson`}</pre>
            </Box>

            <Typography variant="h5" sx={{ mb: 2 }}>
              Option 2: Multiple Messages
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
              For sending different messages to different recipients, your CSV can include both phone numbers and message content:
            </Typography>

            <Box
              sx={{
                backgroundColor: '#1e1e1e',
                color: '#d4d4d4',
                p: 3,
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                borderRadius: 1,
                mb: 3,
                overflow: 'hidden'
              }}
            >
              <pre style={{ margin: 0, overflow: 'auto' }}>{`phone_number,name,content
+237123456789,"Hello John, your order #1234 is ready for pickup!",John Doe
+237987654321,"Hi Jane, your appointment is confirmed for tomorrow at 3 PM",Jane Smith
+237555444333,"Bob, your payment of $50 has been received. Thank you!",Bob Johnson`}</pre>
            </Box>

            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
              When using this format:
            </Typography>
            <Box component="ul" sx={{ mb: 3, '& li': { mb: 1 }, fontSize: '1.1rem' }}>
              <li>
                Include both <code>phone_number</code> and <code>content</code> columns
              </li>
              <li>Each row can have a personalized message</li>
              <li>The message content field in the UI will be ignored</li>
              <li>System automatically detects and uses the content from your CSV</li>
            </Box>

            <Typography variant="h5" sx={{ mb: 2 }}>
              CSV Upload Process
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7, fontSize: '1.1rem' }}>
              The system automatically processes your CSV based on the columns detected:
            </Typography>

            <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, fontSize: '1.1rem' }}>
              Phone Numbers Only Mode:
            </Typography>
            <Box component="ul" sx={{ mb: 3, '& li': { mb: 1 }, fontSize: '1.1rem' }}>
              <li>Detects the phone number column automatically</li>
              <li>Adds the exchange_id and message content (from UI) to each row</li>
              <li>Creates a new modified CSV with uniform message content</li>
              <li>Sends the enhanced CSV for bulk processing</li>
            </Box>

            <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, fontSize: '1.1rem' }}>
              Multiple Messages Mode:
            </Typography>
            <Box component="ul" sx={{ mb: 3, '& li': { mb: 1 }, fontSize: '1.1rem' }}>
              <li>Detects both phone_number and content columns</li>
              <li>Uses the individual message content from each CSV row</li>
              <li>Adds only the exchange_id to complete the required format</li>
              <li>Preserves personalized messages for each recipient</li>
            </Box>

            <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, fontSize: '1.1rem' }}>
              File Requirements
            </Typography>
            <Box component="ul" sx={{ mb: 3, '& li': { mb: 1 }, fontSize: '1.1rem' }}>
              <li>File extension must be .csv</li>
              <li>Maximum file size: 5MB</li>
              <li>CSV should include headers in the first row</li>
              <li>Phone numbers should include country code (e.g., +237123456789)</li>
            </Box>

            <Typography variant="body2" sx={{ mb: 2, fontWeight: 600, fontSize: '1.1rem' }}>
              Response Format
            </Typography>
            <Box
              sx={{
                backgroundColor: '#1e1e1e',
                color: '#d4d4d4',
                p: 3,
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                borderRadius: 1,
                mb: 3
              }}
            >
              <pre style={{ margin: 0, overflow: 'auto' }}>{`HTTP/1.1 202 Accepted

{
  "count": 5,
  "message": "Bulk message processing started. Check your logs for more details."
}`}</pre>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fafafa' }}>
      {/* Mobile AppBar */}
      {isMobile && (
        <AppBar position="fixed" sx={{ backgroundColor: 'white', color: 'text.primary', zIndex: theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <IconButton edge="start" onClick={() => setMobileMenuOpen(true)} sx={{ mr: 2, color: '#ee5a52' }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1, color: '#ee5a52', fontWeight: 'bold' }}>
              QueueDroid Docs
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <Box
          sx={{
            width: isTablet ? 250 : 280,
            backgroundColor: 'white',
            borderRight: 1,
            borderColor: 'divider',
            position: 'fixed',
            height: '100vh',
            overflowY: 'auto'
          }}
        >
          {sidebarContent}
        </Box>
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          sx={{
            '& .MuiDrawer-paper': {
              width: '85vw',
              maxWidth: 320
            }
          }}
          ModalProps={{
            keepMounted: true // Better open performance on mobile
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <IconButton onClick={() => setMobileMenuOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          {sidebarContent}
        </Drawer>
      )}

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          ml: isMobile ? 0 : isTablet ? '250px' : '280px',
          mt: isMobile ? '64px' : 0,
          p: { xs: 2, sm: 3, md: 4 },
          maxWidth: '100%',
          overflow: 'hidden'
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            px: { xs: 1, sm: 2, md: 3 },
            maxWidth: '100% !important'
          }}
        >
          <Box
            sx={{
              p: { xs: 1, sm: 2, md: 4 },
              minHeight: 'calc(100vh - 100px)',
              maxWidth: '100%'
            }}
          >
            {renderContent()}
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default DocsPage;
