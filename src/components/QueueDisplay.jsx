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
  Alert,
  Pagination,
  Stack,
  Button
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Delete as DeleteIcon,
  Info as InfoIcon,
  ExpandLess,
  Refresh as RefreshIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { LinkOutlined } from '@ant-design/icons';

const QueueDisplay = ({
  queues = [],
  onRefresh,
  totalQueues = 0,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  onQueueLinkDevice,
  onQueueDelete,
  onQueuePurge
}) => {
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
            <Chip label={`${totalQueues} Queue${totalQueues !== 1 ? 's' : ''}`} size="small" color="primary" />
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <strong>Queue Name</strong>
                      <Tooltip title="Name of the queue">
                        <InfoIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <strong>State</strong>
                      <Tooltip title="Current state of the queue. This indicates whether the queue is running, idle, or in an error state. It can be used to monitor the health of the queue. Example values: 'running', 'idle', 'error'">
                        <InfoIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <strong>Messages</strong>
                      <Tooltip title="Number of messages in the queue. This is the number of messages that are currently in the queue waiting to be consumed. It can be used to monitor the load on the queue.">
                        <InfoIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <strong>Consumers</strong>
                      <Tooltip title="Number of devices connected to the queue. This is the number of consumers that are currently consuming messages from this queue. It can be used to monitor the load on the queue.">
                        <InfoIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      </Tooltip>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <strong>Actions</strong>
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
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                        {onQueueLinkDevice && (
                          <Button
                            size="small"
                            startIcon={<LinkOutlined />}
                            onClick={() => onQueueLinkDevice(queue)}
                            sx={{ fontSize: '0.75rem', minWidth: 'auto' }}
                          >
                            Link
                          </Button>
                        )}
                        {onQueuePurge && (
                          <Tooltip title="Purge all messages from queue">
                            <IconButton size="small" onClick={() => onQueuePurge(queue)} sx={{ color: 'warning.main' }}>
                              <ClearIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {onQueueDelete && (
                          <Tooltip title="Delete queue permanently">
                            <IconButton size="small" onClick={() => onQueueDelete(queue)} sx={{ color: 'error.main' }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          {totalQueues > pageSize && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Pagination
                count={Math.ceil(totalQueues / pageSize)}
                page={currentPage}
                onChange={(event, value) => onPageChange && onPageChange(value)}
                color="primary"
                size="small"
              />
            </Box>
          )}

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
