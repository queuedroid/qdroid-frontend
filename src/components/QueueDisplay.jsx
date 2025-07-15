import React, { useState } from 'react';
import {
  Box,
  Chip,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  ExpandLess,
  Refresh as RefreshIcon
} from '@mui/icons-material';

const QueueDisplay = ({ queues = [], onRefresh }) => {
  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = (event, isExpanded) => {
    setExpanded(isExpanded);
  };

  if (!queues || queues.length === 0) {
    return (
      <Box sx={{ mt: 1 }}>
        <Chip label="No queues configured" size="small" variant="outlined" color="default" />
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
          Queues are created automatically when needed
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 1 }}>
      <Accordion
        expanded={expanded}
        onChange={handleAccordionChange}
        sx={{
          boxShadow: 'none',
          border: '1px solid',
          borderColor: 'divider',
          '&:before': { display: 'none' }
        }}
      >
        <AccordionSummary
          expandIcon={null}
          sx={{
            minHeight: 'auto',
            '& .MuiAccordionSummary-content': {
              margin: '8px 0',
              alignItems: 'center'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
            <Chip label={`${queues.length} Queue${queues.length !== 1 ? 's' : ''} (Read-only)`} size="small" color="primary" />
            <Typography variant="caption" color="text.secondary">
              Queues are managed automatically
            </Typography>
            <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {onRefresh && (
                <Tooltip title="Refresh Queues">
                  <IconButton size="small" onClick={onRefresh} sx={{ p: 0.5 }}>
                    <RefreshIcon sx={{ color: 'grey' }} fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {expanded ? (
                <ExpandLess sx={{ color: 'grey' }} fontSize="small" />
              ) : (
                <ExpandMoreIcon sx={{ color: 'grey' }} fontSize="small" />
              )}
            </Box>
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ pt: 0 }}>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Queue Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>State</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Messages</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Consumers</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {queues.map((queue, index) => (
                  <TableRow key={queue.name || index}>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {queue.name || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={queue.state || 'N/A'}
                        size="small"
                        color={queue.state === 'running' ? 'success' : queue.state === 'idle' ? 'default' : 'warning'}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{queue.messages !== undefined ? queue.messages : 'N/A'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{queue.consumers !== undefined ? queue.consumers : 'N/A'}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {queues.length > 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Queue Information:</strong> Each queue is bound to this exchange and handles message routing. The state shows the
                current operational status, while messages and consumers indicate queue activity.
              </Typography>
            </Alert>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default QueueDisplay;
