// material-ui
import { Box, Typography, CardContent, Button, Link } from '@mui/material';
import { GitHub, Email, Launch } from '@mui/icons-material';

// project imports
import MainCard from 'components/MainCard';

// ==============================|| HELP PAGE ||============================== //

export default function Help() {
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
      link: '/docs',
      action: 'Read Docs',
      external: false
    }
  ];

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Need help with QueueDroid? Access our complete documentation or get in touch with our support team.
          </Typography>
        </Box>

        {/* Documentation Link */}
        <MainCard sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Launch color="primary" sx={{ mr: 2, fontSize: 28 }} />
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Complete Documentation
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.7 }}>
            Find detailed guides, API references, tutorials, and answers to frequently asked questions in our comprehensive documentation.
          </Typography>
          <Button
            variant="contained"
            component={Link}
            href="/docs"
            target="_blank"
            rel="noopener noreferrer"
            startIcon={<Launch />}
            size="large"
          >
            View Documentation
          </Button>
        </MainCard>

        {/* Contact Support */}
        <Box id="contact-support" sx={{ mb: 6 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, mb: 3, color: 'primary.main' }}>
            Contact & Support
          </Typography>

          <Typography variant="body1" sx={{ mb: 4, lineHeight: 1.7 }}>
            Need personalized assistance? We're here to help you get the most out of QueueDroid:
          </Typography>

          {contactMethods.slice(0, 2).map((contact, index) => (
            <MainCard key={index} sx={{ mb: 3 }}>
              <CardContent>
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
                >
                  {contact.action}
                </Button>
              </CardContent>
            </MainCard>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
