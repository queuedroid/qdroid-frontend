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
import { ExpandMore as ExpandMoreIcon, Delete as DeleteIcon, Info as InfoIcon, ExpandLess } from '@mui/icons-material';

const QueueDisplay = ({ queues = [] }) => {
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
            <Chip label={`${queues.length} Queue${queues.length !== 1 ? 's' : ''} (Read-only)`} size="small" color="info" />
            <Typography variant="caption" color="text.secondary">
              Queues are managed automatically
            </Typography>
            <Box sx={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {expanded ? <ExpandLess fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
            </Box>
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ pt: 0 }}>
          <TableContainer component={Paper} variant="outlined">
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Queue ID</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Country</strong>
                  </TableCell>
                  <TableCell>
                    <strong>MCC</strong>
                  </TableCell>
                  <TableCell>
                    <strong>MNC</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Routing Key</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {queues.map((queue, index) => (
                  <TableRow key={queue.id || queue.queue || index}>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {queue.id || queue.queue || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="body2">+{queue.country_code || 'N/A'}</Typography>
                        {queue.country_name && (
                          <Typography variant="caption" color="text.secondary">
                            ({queue.country_name})
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={queue.mcc || 'N/A'} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Chip label={queue.mnc || 'N/A'} size="small" variant="outlined" />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace" color="text.secondary">
                        {queue.routing_key || 'N/A'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {queues.length > 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                <strong>Queue Structure:</strong> Each queue is bound to this exchange and routes messages based on country code (+
                {queues[0]?.country_code}) and network operators (MCC/MNC codes).
              </Typography>
            </Alert>
          )}
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default QueueDisplay;
