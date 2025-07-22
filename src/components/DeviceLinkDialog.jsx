import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider
} from '@mui/material';
import {
  CopyOutlined,
  LinkOutlined,
  CloudServerOutlined,
  KeyOutlined,
  UserOutlined,
  DatabaseOutlined,
  TagOutlined,
  QrcodeOutlined,
  GlobalOutlined,
  NumberOutlined
} from '@ant-design/icons';
import QRCode from 'qrcode';
import { exchangeAPI } from '../utils/api';
import { ExpandMore } from '@mui/icons-material';

const DeviceLinkDialog = ({ open, onClose, exchange, queue = null }) => {
  const [tabValue, setTabValue] = useState(0);
  const [connectionData, setConnectionData] = useState(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedField, setCopiedField] = useState('');

  const isQueueConnection = queue !== null;

  useEffect(() => {
    if (open) {
      fetchConnectionDetails();
    } else {
      // Reset state when dialog closes
      setConnectionData(null);
      setQrCodeUrl('');
      setError('');
      setTabValue(0);
      setCopiedField('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, exchange, queue]);

  const fetchConnectionDetails = async () => {
    setLoading(true);
    setError('');

    try {
      let response;
      if (isQueueConnection) {
        response = await exchangeAPI.getQueueConnectionDetails(exchange.exchange_id || exchange.id, queue.name);
      } else {
        response = await exchangeAPI.getConnectionDetails(exchange.exchange_id || exchange.id);
      }

      setConnectionData(response);
      await generateQRCode(response);
    } catch (err) {
      console.error('Error fetching connection details:', err);
      setError('Failed to fetch connection details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async (data) => {
    try {
      // Create a comprehensive connection object for the QR code
      const qrData = {
        type: isQueueConnection ? 'queue_connection' : 'exchange_connection',
        amqp_url: data.amqp_url,
        host: data.host,
        port: data.port,
        protocol: data.protocol,
        username: data.username,
        password: data.password,
        virtual_host: data.virtual_host,
        exchange: data.exchange,
        ...(isQueueConnection && { binding_key: data.binding_key }),
        timestamp: new Date().toISOString()
      };

      const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData), {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        quality: 0.92,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 300
      });

      setQrCodeUrl(qrCodeDataURL);
    } catch (err) {
      console.error('Error generating QR code:', err);
      setError('Failed to generate QR code.');
    }
  };

  const copyToClipboard = async (text, fieldName) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(''), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const ConnectionField = ({ label, value, fieldName, icon: Icon, multiline = false }) => (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Icon style={{ fontSize: '1.1rem', marginRight: '8px', color: '#666' }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          fullWidth
          value={value || ''}
          variant="outlined"
          size="small"
          multiline={multiline}
          rows={multiline ? 2 : 1}
          InputProps={{
            readOnly: true,
            sx: {
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              backgroundColor: '#f5f5f5'
            }
          }}
        />
        <Tooltip title={copiedField === fieldName ? 'Copied!' : `Copy ${label}`}>
          <IconButton
            size="small"
            onClick={() => copyToClipboard(value, fieldName)}
            sx={{
              color: copiedField === fieldName ? '#4caf50' : '#666',
              '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
            }}
          >
            <CopyOutlined />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  const QuickConnectChip = ({ label, value, fieldName }) => (
    <Chip
      label={`${label}: ${value}`}
      variant="outlined"
      size="small"
      onClick={() => copyToClipboard(value, fieldName)}
      sx={{
        fontFamily: 'monospace',
        fontSize: '0.75rem',
        cursor: 'pointer',
        backgroundColor: copiedField === fieldName ? '#e8f5e8' : 'transparent',
        borderColor: copiedField === fieldName ? '#4caf50' : undefined,
        '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' }
      }}
    />
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinkOutlined style={{ color: '#ee5a52' }} />
          <Typography variant="h6" component="span">
            Link Device to {isQueueConnection ? 'Queue' : 'Exchange'}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {isQueueConnection
            ? `Queue: ${queue?.name || queue?.label || 'Unknown Queue'}`
            : `Exchange: ${exchange?.label || exchange?.exchange_id || exchange?.id}`}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Fetching connection details...</Typography>
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : connectionData ? (
          <>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
              <Tab label="QR Code" icon={<QrcodeOutlined />} iconPosition="start" sx={{ minHeight: 48 }} />
              <Tab label="Manual Setup" icon={<CloudServerOutlined />} iconPosition="start" sx={{ minHeight: 48 }} />
            </Tabs>

            {tabValue === 0 && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Scan QR Code with Your Device
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Scan this QR code with your mobile app to automatically configure the connection settings.
                </Typography>

                {qrCodeUrl && (
                  <Paper elevation={2} sx={{ display: 'inline-block', p: 2, mb: 3 }}>
                    <img src={qrCodeUrl} alt="Connection QR Code" style={{ width: 300, height: 300 }} />
                  </Paper>
                )}

                <Accordion sx={{ mt: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="subtitle2">Quick Copy Values</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      <QuickConnectChip label="Host" value={connectionData.host} fieldName="host" />
                      <QuickConnectChip label="Port" value={connectionData.port} fieldName="port" />
                      <QuickConnectChip label="Protocol" value={connectionData.protocol} fieldName="protocol" />
                      <QuickConnectChip label="Username" value={connectionData.username} fieldName="username" />
                      <QuickConnectChip label="Password" value={connectionData.password} fieldName="password" />
                      <QuickConnectChip label="Virtual Host" value={connectionData.virtual_host} fieldName="virtual_host" />
                      <QuickConnectChip label="Exchange" value={connectionData.exchange} fieldName="exchange" />
                      {isQueueConnection && (
                        <QuickConnectChip label="Binding Key" value={connectionData.binding_key} fieldName="binding_key" />
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>
            )}

            {tabValue === 1 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Manual Configuration
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Use these connection details to manually configure your device or application.
                </Typography>

                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                      Connection Details
                    </Typography>

                    <ConnectionField label="AMQP URL" value={connectionData.amqp_url} fieldName="amqp_url" icon={LinkOutlined} multiline />

                    <ConnectionField label="Host" value={connectionData.host} fieldName="host" icon={GlobalOutlined} />

                    <ConnectionField label="Port" value={connectionData.port} fieldName="port" icon={NumberOutlined} />

                    <ConnectionField label="Protocol" value={connectionData.protocol} fieldName="protocol" icon={CloudServerOutlined} />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                      Authentication & Routing
                    </Typography>

                    <ConnectionField label="Username" value={connectionData.username} fieldName="username" icon={UserOutlined} />

                    <ConnectionField label="Password" value={connectionData.password} fieldName="password" icon={KeyOutlined} />

                    <ConnectionField
                      label="Virtual Host"
                      value={connectionData.virtual_host}
                      fieldName="virtual_host"
                      icon={DatabaseOutlined}
                    />

                    <ConnectionField label="Exchange" value={connectionData.exchange} fieldName="exchange" icon={CloudServerOutlined} />

                    {isQueueConnection && (
                      <ConnectionField label="Binding Key" value={connectionData.binding_key} fieldName="binding_key" icon={TagOutlined} />
                    )}
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Note:</strong> Keep these credentials secure. They provide access to your{' '}
                    {isQueueConnection ? 'queue' : 'exchange'} and should not be shared publicly.
                  </Typography>
                </Alert>
              </Box>
            )}
          </>
        ) : null}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        {connectionData && (
          <Button
            onClick={() => copyToClipboard(JSON.stringify(connectionData, null, 2), 'full_json')}
            variant="contained"
            startIcon={<CopyOutlined />}
            sx={{
              backgroundColor: copiedField === 'full_json' ? '#4caf50' : '#ee5a52',
              '&:hover': {
                backgroundColor: copiedField === 'full_json' ? '#45a049' : '#d84b43'
              }
            }}
          >
            {copiedField === 'full_json' ? 'Copied!' : 'Copy All Details'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DeviceLinkDialog;
