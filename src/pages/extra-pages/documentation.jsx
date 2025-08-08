// material-ui
import {
  Box,
  Typography,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Divider,
  Chip,
  Alert,
  Stack,
  Button,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid
} from '@mui/material';
import { ExpandMore, Launch, Code, Api, Dashboard, Settings, Message, Storage } from '@mui/icons-material';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| DOCUMENTATION PAGE ||============================== //

export default function Documentation() {
  const apiEndpoints = [
    { method: 'GET', endpoint: '/exchanges', description: 'Get all exchanges with pagination' },
    { method: 'POST', endpoint: '/exchanges', description: 'Create a new exchange' },
    { method: 'PUT', endpoint: '/exchanges/{id}', description: 'Update an existing exchange' },
    { method: 'DELETE', endpoint: '/exchanges/{id}', description: 'Delete an exchange' },
    { method: 'GET', endpoint: '/exchanges/{id}/queues', description: 'Get queues for a specific exchange' },
    { method: 'POST', endpoint: '/exchanges/{id}/queues', description: 'Create a queue for an exchange' },
    { method: 'DELETE', endpoint: '/exchanges/{id}/queues/{queueId}', description: 'Delete a queue' },
    { method: 'GET', endpoint: '/exchanges/{id}/connection', description: 'Get exchange connection details' },
    { method: 'POST', endpoint: '/messages/send', description: 'Send a single SMS message' },
    { method: 'POST', endpoint: '/messages/bulk-send', description: 'Send multiple SMS messages (JSON or CSV upload)' },
    { method: 'GET', endpoint: '/event-logs', description: 'Get message logs with filtering' },
    { method: 'POST', endpoint: '/auth/login', description: 'User authentication' },
    { method: 'POST', endpoint: '/auth/signup', description: 'User registration' },
    { method: 'POST', endpoint: '/auth/logout', description: 'User logout' }
  ];

  const features = [
    {
      title: 'Exchange Management',
      description: 'Create and manage message exchanges for organizing SMS traffic',
      icon: <Api color="primary" />,
      details: [
        'Create exchanges with labels and descriptions',
        'Edit exchange metadata',
        'Delete exchanges (with all associated queues)',
        'Copy exchange IDs for API integration',
        'Auto-refresh capabilities'
      ]
    },
    {
      title: 'Queue System',
      description: 'Advanced queuing system for reliable message delivery',
      icon: <Storage color="primary" />,
      details: [
        'Automatic queue creation based on network configuration',
        'MCC/MNC-based routing for carrier optimization',
        'Queue state monitoring (active, paused, error)',
        'Message and consumer count tracking',
        'Device linking for queue management'
      ]
    },
    {
      title: 'Message Logs',
      description: 'Comprehensive logging and analytics for all SMS activity',
      icon: <Message color="primary" />,
      details: [
        'Real-time message status tracking (queued, pending, failed)',
        'Carrier and recipient information',
        'Timestamp tracking for delivery analysis',
        'Filtering by status, category, and date range',
        'Export capabilities for data analysis'
      ]
    },
    {
      title: 'Dashboard Analytics',
      description: 'Visual insights into your SMS operations',
      icon: <Dashboard color="primary" />,
      details: [
        'Total exchanges and active queues count',
        'Messages sent and queued statistics',
        'Recent message logs overview',
        'Interactive charts for message status distribution',
        'Account information and token management'
      ]
    }
  ];

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Complete guide to using the QueueDroid SMS queuing and management system
          </Typography>
          <Alert severity="info" sx={{ mb: 3 }}>
            QueueDroid v1.5.0 - Built with React 18 and Material-UI for optimal performance and user experience
          </Alert>
        </Box>

        {/* Quick Start */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'grey' }} />}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              🚀 Quick Start Guide
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ pl: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Getting Started
              </Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    1. Account Setup
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sign up for a QueueDroid account and verify your email address. Your account token will be automatically generated.
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    2. Create Your First Exchange
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Navigate to Exchange Management and create your first exchange with a descriptive label and description.
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    3. Configure Queues
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Queues are automatically created based on your country and network operator selection. Link devices to manage queue
                    routing.
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    4. Start Sending Messages
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Use the global compose button or API integration to start sending SMS messages through your configured exchanges.
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Features Overview */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'grey' }} />}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              ✨ Features Overview
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={3}>
              {features.map((feature, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        {feature.icon}
                        <Typography variant="h6" sx={{ ml: 1, fontWeight: 600 }}>
                          {feature.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {feature.description}
                      </Typography>
                      <Box component="ul" sx={{ pl: 2, m: 0 }}>
                        {feature.details.map((detail, idx) => (
                          <Typography component="li" variant="body2" key={idx} sx={{ mb: 0.5 }}>
                            {detail}
                          </Typography>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>

        {/* API Reference */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'grey' }} />}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              🔌 API Reference
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                QueueDroid provides a comprehensive REST API for programmatic access to all platform features.
              </Typography>
              <Alert severity="warning" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Base URL:</strong> <code>{import.meta.env.VITE_APP_API_URL || 'http://localhost:8080/v1'}</code>
                  <br />
                  <strong>Authentication:</strong> Bearer token required for all endpoints
                </Typography>
              </Alert>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>Method</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Endpoint</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Description</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {apiEndpoints.map((endpoint, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Chip
                          label={endpoint.method}
                          size="small"
                          color={
                            endpoint.method === 'GET'
                              ? 'primary'
                              : endpoint.method === 'POST'
                                ? 'success'
                                : endpoint.method === 'PUT'
                                  ? 'warning'
                                  : 'error'
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          {endpoint.endpoint}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{endpoint.description}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                startIcon={<Launch />}
                href="https://github.com/queuedroid/qdroid-server?tab=readme-ov-file"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Complete API Documentation
              </Button>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* CSV Format */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'grey' }} />}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              📄 CSV Upload Format
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Bulk Message CSV Format
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  When uploading CSV files for bulk messaging, your CSV file only needs to contain phone numbers. The system automatically
                  adds the exchange ID and message content to each row before processing.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Required Column
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Your CSV must contain at least one column with phone numbers. The column name can be any of the following:
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                    <code>phone_number</code>, <code>phone</code>, <code>mobile</code>
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                    Any column name containing the words "phone", "number", or "mobile"
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Example CSV Format
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace', whiteSpace: 'pre' }}>
                    {`phone_number,name
+237123456789,John Doe
+237987654321,Jane Smith
+237555444333,Bob Johnson`}
                  </Typography>
                </Paper>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                  The system will automatically convert this to include exchange_id and content columns for processing.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  File Requirements
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                    File extension must be .csv
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                    Maximum file size: 5MB
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                    CSV should include headers in the first row
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                    Phone numbers should include country code (e.g., +237123456789)
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Authentication */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'grey' }} />}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              🔐 Authentication & Security
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Account Token
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Your account token is automatically generated and can be found in the Dashboard under User Information. This token is
                  required for all API requests.
                </Typography>
                <Alert severity="warning">
                  <Typography variant="body2">
                    Keep your account token secure. Do not share it publicly or commit it to version control.
                  </Typography>
                </Alert>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Session Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sessions automatically expire after inactivity. The system includes automatic logout on 401 errors and session cleanup for
                  security.
                </Typography>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  API Authentication
                </Typography>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                    Authorization: Bearer YOUR_ACCOUNT_TOKEN
                  </Typography>
                </Paper>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Configuration */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'grey' }} />}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              ⚙️ Configuration & Setup
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Environment Variables
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>
                          <strong>Variable</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Description</strong>
                        </TableCell>
                        <TableCell>
                          <strong>Default</strong>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <code>VITE_APP_API_URL</code>
                        </TableCell>
                        <TableCell>API base URL for backend communication</TableCell>
                        <TableCell>http://localhost:8080/v1</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <code>VITE_APP_BASE_NAME</code>
                        </TableCell>
                        <TableCell>Base path for React Router</TableCell>
                        <TableCell>/</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Network Configuration
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  QueueDroid uses MCC (Mobile Country Code) and MNC (Mobile Network Code) for intelligent routing:
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                    Select your country to automatically populate available networks
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                    Choose specific network operators for targeted routing
                  </Typography>
                  <Typography component="li" variant="body2" sx={{ mb: 0.5 }}>
                    Queues are automatically created based on network selection
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Troubleshooting */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'grey' }} />}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              🔧 Troubleshooting
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Common Issues
                </Typography>
                <Stack spacing={2}>
                  <Alert severity="warning">
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      401 Unauthorized Errors
                    </Typography>
                    <Typography variant="body2">
                      Usually indicates expired session or invalid token. Try logging out and back in. The system automatically handles this
                      and redirects to login.
                    </Typography>
                  </Alert>

                  <Alert severity="warning">
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Messages Not Sending
                    </Typography>
                    <Typography variant="body2">
                      Check that your exchange has active queues and your account token is valid. Verify network configuration and ensure
                      sufficient account balance.
                    </Typography>
                  </Alert>

                  <Alert severity="warning">
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Queue Creation Failures
                    </Typography>
                    <Typography variant="body2">
                      Ensure you have selected a valid country and network operator. Some networks may not be available in all regions.
                    </Typography>
                  </Alert>
                </Stack>
              </Box>

              <Box>
                <Typography variant="h6" sx={{ mb: 1 }}>
                  Browser Console
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Open browser developer tools (F12) and check the Console tab for detailed error messages. Most API calls include
                  comprehensive logging for debugging.
                </Typography>
              </Box>
            </Stack>
          </AccordionDetails>
        </Accordion>

        {/* Support */}
        <Box sx={{ mt: 4, p: 3, bgcolor: 'primary.lighter', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Need More Help?
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<Launch />}
              href="https://github.com/queuedroid/qdroid-server"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Repository
            </Button>
            <Button variant="outlined" startIcon={<Settings />} href="/dashboard/help">
              Help Center
            </Button>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
