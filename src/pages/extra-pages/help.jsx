// material-ui
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  Stack,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Link
} from '@mui/material';
import {
  ExpandMore,
  Help as HelpIcon,
  Settings,
  Message,
  Api,
  Dashboard,
  Storage,
  Security,
  Phone,
  Email,
  GitHub,
  QuestionAnswer,
  CheckCircle,
  Warning,
  Error,
  Launch
} from '@mui/icons-material';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| HELP PAGE ||============================== //

export default function Help() {
  const faqData = [
    {
      category: 'Getting Started',
      questions: [
        {
          question: 'How do I create my first exchange?',
          answer:
            'Navigate to Exchange Management from the sidebar, click "Create Exchange", fill in a descriptive label and description, then click Create. Your exchange will be ready for queue configuration.'
        },
        {
          question: 'What is an exchange in QueueDroid?',
          answer:
            'An exchange is a container that organizes your SMS traffic. It acts as a routing hub where queues are created and messages are distributed based on network configurations and device linking.'
        },
        {
          question: 'How are queues created?',
          answer:
            'Queues are automatically created when you configure network settings (country and mobile operator). Each queue corresponds to a specific MCC/MNC combination for optimal carrier routing.'
        }
      ]
    },
    {
      category: 'Account Management',
      questions: [
        {
          question: 'Where can I find my account token?',
          answer:
            'Your account token is displayed in the Dashboard under "User Information". Click the eye icon to reveal it and use the copy button to copy it to your clipboard.'
        },
        {
          question: 'How do I update my profile information?',
          answer:
            'Click on your profile avatar in the top-right corner, select "Edit Profile" or "Settings", then update your information in the Settings page.'
        },
        {
          question: 'What should I do if my session expires?',
          answer:
            'The system automatically handles session expiration by redirecting you to the login page. Simply log back in with your credentials to continue.'
        }
      ]
    },
    {
      category: 'Messaging',
      questions: [
        {
          question: 'How do I send SMS messages?',
          answer:
            'Use the floating compose button (+ icon) in the bottom-right corner for quick messages, or integrate with our API for bulk messaging. Ensure you have active exchanges and queues configured.'
        },
        {
          question: 'Why are my messages showing as "FAILED"?',
          answer:
            'Failed messages can result from invalid phone numbers, insufficient account balance, network issues, or inactive queues. Check the Message Logs for specific error details.'
        },
        {
          question: 'What do the message statuses mean?',
          answer:
            'QUEUED (green): Message successfully queued for delivery. PENDING (yellow): Message is being processed. FAILED (red): Message delivery failed - check logs for details.'
        }
      ]
    },
    {
      category: 'API Integration',
      questions: [
        {
          question: 'How do I authenticate API requests?',
          answer:
            'Include your account token in the Authorization header: "Authorization: Bearer YOUR_ACCOUNT_TOKEN". Get your token from the Dashboard User Information section.'
        },
        {
          question: 'Can I send bulk messages via API?',
          answer:
            'Yes, use the POST /messages/bulk-send endpoint to send multiple messages in a single request. Refer to the API documentation for request format.'
        }
      ]
    },
    {
      category: 'Troubleshooting',
      questions: [
        {
          question: 'I am getting 401 Unauthorized errors',
          answer:
            'This indicates an expired or invalid session token. Log out and log back in to refresh your session. The system should handle this automatically.'
        },
        {
          question: 'My dashboard statistics are not updating',
          answer:
            'Click the "Refresh" button in the dashboard header. If issues persist, check your internet connection and try logging out and back in.'
        }
      ]
    }
  ];

  const featureGuides = [
    {
      title: 'Dashboard Overview',
      icon: <Dashboard color="primary" />,
      description: 'Understanding your QueueDroid dashboard and key metrics',
      steps: [
        'View total exchanges and active queues',
        'Monitor message statistics and delivery rates',
        'Access recent message logs',
        'Copy your account token for API use',
        'Navigate to different sections via sidebar'
      ]
    },
    {
      title: 'Exchange Management',
      icon: <Api color="primary" />,
      description: 'Creating and managing message exchanges',
      steps: [
        'Click "Create Exchange" to add new exchange',
        'Provide descriptive label and description',
        'View exchange ID for API integration',
        'Edit or delete exchanges as needed',
        'Monitor queue status and activity'
      ]
    },
    {
      title: 'Queue Configuration',
      icon: <Storage color="primary" />,
      description: 'Setting up queues for optimal message routing',
      steps: ['Queues are automatically created', 'Link devices for queue management', 'Monitor queue state and message counts']
    },
    {
      title: 'Message Monitoring',
      icon: <Message color="primary" />,
      description: 'Tracking and analyzing your SMS traffic',
      steps: [
        'Access Message Logs from sidebar',
        'Filter by status, date, or category',
        'View delivery details and carrier info',
        'Export logs for external analysis',
        'Monitor real-time message processing'
      ]
    }
  ];

  const contactMethods = [
    {
      icon: <GitHub color="primary" />,
      title: 'GitHub Repository',
      description: 'Source code, issues, and contributions',
      link: 'https://github.com/queuedroid/qdroid-server',
      action: 'Visit Repository'
    },
    {
      icon: <Email color="primary" />,
      title: 'Email Support',
      description: 'Direct email for technical assistance',
      link: 'mailto:developers@smswithoutborders.com',
      action: 'Send Email'
    },
    {
      icon: <Launch color="primary" />,
      title: 'Documentation',
      description: 'Complete API and user documentation',
      link: '/dashboard/documentation',
      action: 'Read Docs'
    }
  ];

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Find answers to common questions and learn how to use QueueDroid effectively
          </Typography>
          <Alert severity="info" sx={{ maxWidth: 600 }}>
            Need immediate assistance? Check our troubleshooting section or contact support directly.
          </Alert>
        </Box>

        {/* Table of Contents */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
            Table of Contents
          </Typography>

          <Box sx={{ pl: 2, borderLeft: '3px solid', borderColor: 'primary.main', bgcolor: 'primary.50', py: 2, px: 3, borderRadius: 1 }}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                  Getting Started
                </Typography>
                <Stack spacing={1} sx={{ ml: 2 }}>
                  <Typography variant="body2">
                    <Link
                      href="#getting-started"
                      sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { textDecoration: 'underline' } }}
                    >
                      1. Quick Start Guide
                    </Link>
                  </Typography>
                  <Typography variant="body2">
                    <Link
                      href="#api-authentication"
                      sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { textDecoration: 'underline' } }}
                    >
                      2. Frequently Asked Questions
                    </Link>
                  </Typography>
                  <Typography variant="body2">
                    <Link
                      href="#status-indicators"
                      sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { textDecoration: 'underline' } }}
                    >
                      3. Status Indicators Guide
                    </Link>
                  </Typography>
                </Stack>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                  Support & Resources
                </Typography>
                <Stack spacing={1} sx={{ ml: 2 }}>
                  <Typography variant="body2">
                    <Link
                      href="#contact-support"
                      sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { textDecoration: 'underline' } }}
                    >
                      4. Contact & Support
                    </Link>
                  </Typography>
                  <Typography variant="body2">
                    <Link
                      href="/dashboard/documentation"
                      sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { textDecoration: 'underline' } }}
                    >
                      5. Complete API Documentation
                    </Link>
                  </Typography>
                  <Typography variant="body2">
                    <Link
                      href="https://github.com/queuedroid/qdroid-server"
                      target="_blank"
                      sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { textDecoration: 'underline' } }}
                    >
                      6. GitHub Repository
                    </Link>
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Quick Start Guide */}
        <Box id="getting-started" sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
            1. Quick Start Guide
          </Typography>

          {featureGuides.map((guide, index) => (
            <Box key={index} sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center' }}>
                {guide.icon}
                <Box component="span" sx={{ ml: 1 }}>
                  {guide.title}
                </Box>
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 2, lineHeight: 1.7 }}>
                {guide.description}
              </Typography>
              <Box component="ol" sx={{ pl: 3, m: 0 }}>
                {guide.steps.map((step, stepIndex) => (
                  <Box component="li" key={stepIndex} sx={{ mb: 1 }}>
                    <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                      {step}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        {/* FAQ Section */}
        <Box id="api-authentication" sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
            2. Frequently Asked Questions
          </Typography>

          {faqData.map((category, categoryIndex) => (
            <Box key={categoryIndex} sx={{ mb: 4 }}>
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: 'text.primary' }}>
                {category.category}
              </Typography>

              {category.questions.map((faq, faqIndex) => (
                <Box key={faqIndex} sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    Q: {faq.question}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ lineHeight: 1.7, pl: 2, borderLeft: '2px solid', borderColor: 'grey.300' }}
                  >
                    {faq.answer}
                  </Typography>
                </Box>
              ))}

              {categoryIndex < faqData.length - 1 && <Divider sx={{ my: 4 }} />}
            </Box>
          ))}
        </Box>

        {/* Status Indicators Guide */}
        <Box id="status-indicators" sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
            3. Understanding Status Indicators
          </Typography>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
            QueueDroid uses different status indicators to help you track the progress of your SMS messages. Here's what each status means:
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
              <Chip label="QUEUED" color="success" size="small" sx={{ mr: 2 }} />
              Successfully Queued
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, pl: 2 }}>
              Your message has been successfully received and queued for delivery. It's waiting in the queue to be sent to the recipient.
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
              <Chip label="PENDING" color="warning" size="small" sx={{ mr: 2 }} />
              Processing
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, pl: 2 }}>
              The message is currently being processed by the system. This is a temporary state before the message is either delivered or
              fails.
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
              <Chip label="FAILED" color="error" size="small" sx={{ mr: 2 }} />
              Delivery Failed
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, pl: 2 }}>
              Message delivery failed. Common reasons include invalid phone numbers, network issues, or insufficient account balance. Check
              the message logs for specific error details.
            </Typography>
          </Box>
        </Box>

        {/* Contact Support */}
        <Box id="contact-support" sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
            4. Contact & Support
          </Typography>

          <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7 }}>
            Need help with QueueDroid? We're here to assist you. Choose the best method to get in touch with our team:
          </Typography>

          {contactMethods.map((contact, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
                {contact.icon}
                <Box component="span" sx={{ ml: 1 }}>
                  {contact.title}
                </Box>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, lineHeight: 1.6 }}>
                {contact.description}
              </Typography>
              <Button
                variant="outlined"
                component={Link}
                href={contact.link}
                target={contact.link.startsWith('http') ? '_blank' : undefined}
                rel={contact.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                startIcon={contact.link.startsWith('http') ? <Launch /> : undefined}
                sx={{ mb: 2 }}
              >
                {contact.action}
              </Button>
            </Box>
          ))}
        </Box>

        {/* Additional Resources */}
        <Box sx={{ mt: 6, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
            Additional Information
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
              <Security color="primary" sx={{ mr: 1 }} />
              Security
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, pl: 4 }}>
              All API communications use HTTPS encryption and bearer token authentication to ensure your data remains secure.
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
              <Phone color="primary" sx={{ mr: 1 }} />
              SMS Delivery Performance
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, pl: 4 }}>
              Average delivery time is 1-5 seconds for most carriers, ensuring your messages reach recipients quickly.
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center' }}>
              <Settings color="primary" sx={{ mr: 1 }} />
              Network Configuration
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6, pl: 4 }}>
              MCC/MNC codes ensure optimal carrier routing for cost efficiency and improved delivery rates.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
