import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  TablePagination,
  Button,
  Grid,
  Tooltip,
  IconButton,
  Snackbar
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Event as EventIcon,
  OpenInNew as OpenInNewIcon,
  Info
} from '@mui/icons-material';
import MainCard from 'components/MainCard';
import { eventLogsAPI } from '../../utils/api';
import { format } from 'date-fns';

const MessageLogs = () => {
  const navigate = useNavigate();
  const [eventLogs, setEventLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [status, setStatus] = useState('');
  const [summary, setSummary] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fixed category for message logs
  const category = 'MESSAGE';

  // Fetch event logs
  const fetchEventLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await eventLogsAPI.getAll(page + 1, pageSize, category, status || null);

      // Handle response format
      let data;
      if (response && typeof response.json === 'function') {
        data = await response.json();
      } else {
        data = response;
      }

      console.log('Message logs API response:', data);

      setEventLogs(data.data || []);
      setTotalCount(data.pagination?.total || 0);
    } catch (err) {
      console.error('Error fetching message logs:', err);
      setError('Failed to load message logs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, status]);

  // Fetch summary for message category
  const fetchSummary = useCallback(async () => {
    try {
      const response = await eventLogsAPI.getSummary(category);
      let data;
      if (response && typeof response.json === 'function') {
        data = await response.json();
      } else {
        data = response;
      }
      setSummary(data.data);
    } catch (err) {
      console.error('Error fetching message summary:', err);
      showSnackbar('Failed to load summary statistics', 'error');
    }
  }, []);

  useEffect(() => {
    fetchEventLogs();
    fetchSummary();
  }, [fetchEventLogs, fetchSummary]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(0);
  };

  const handleQueueClick = (log) => {
    // Navigate to exchange page - the exchange page will need to handle highlighting the specific queue
    navigate('/dashboard/exchange');
  };

  const clearFilters = () => {
    setStatus('');
    setPage(0);
  };

  const refreshData = () => {
    fetchEventLogs();
    fetchSummary();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'QUEUED':
        return 'success';
      case 'FAILED':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return '-';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <Box>
      <MainCard>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              Message Logs
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Monitor all message-related events and their statuses
            </Typography>
          </Box>

          {/* Summary Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 6, sm: 6, md: 3 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total Events
                  </Typography>
                  <Typography variant="h4">{summary?.total_count || 0}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Message events
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 6, md: 3 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Queued
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {summary?.total_queued || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Successfully queued
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 6, md: 3 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Pending
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {summary?.total_pending || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Awaiting processing
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 6, sm: 6, md: 3 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Failed
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {summary?.total_failed || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Processing failed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Filters */}
          <Stack direction="row" spacing={2} sx={{ mb: 3 }} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select value={status} onChange={handleStatusChange} label="Status">
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="QUEUED">QUEUED</MenuItem>
                <MenuItem value="FAILED">FAILED</MenuItem>
              </Select>
            </FormControl>

            <Button variant="outlined" size="small" onClick={clearFilters} disabled={!status}>
              Clear Filters
            </Button>

            <Button variant="outlined" size="small" onClick={refreshData} startIcon={<RefreshIcon />}>
              Refresh
            </Button>
          </Stack>

          {/* Table */}
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event ID</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Queue</TableCell>
                  <TableCell>Carrier</TableCell>
                  <TableCell>Recipient</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Alert severity="error">{error}</Alert>
                    </TableCell>
                  </TableRow>
                ) : eventLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      <Box sx={{ py: 4, textAlign: 'center' }}>
                        <EventIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No message logs found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {status ? 'Try adjusting your filters' : 'Message logs will appear here once you start sending messages'}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  eventLogs.map((log) => (
                    <TableRow key={log.eid} hover>
                      <TableCell>
                        <Tooltip title={log.eid}>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {log.eid?.substring(0, 8)}...
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Chip label={log.status} color={getStatusColor(log.status)} size="small" />
                      </TableCell>
                      <TableCell>
                        <Tooltip title={log.description || (log.status === 'QUEUED' ? 'Sent successfully' : 'No description')}>
                          <Typography variant="body2" noWrap>
                            {truncateText(log.description || (log.status === 'QUEUED' ? 'Sent successfully' : 'No description'), 40)}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={`Click to view queue: ${log.queue_id}`}>
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => handleQueueClick(log)}
                            sx={{
                              fontFamily: 'monospace',
                              fontSize: '0.875rem',
                              textTransform: 'none',
                              color: 'primary.main',
                              '&:hover': {
                                backgroundColor: 'primary.light',
                                color: 'primary.contrastText'
                              },
                              padding: '4px 8px',
                              minWidth: 'auto'
                            }}
                          >
                            {truncateText(log.queue_name || log.queue_id, 20)}
                          </Button>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{log.carrier || '-'}</TableCell>
                      <TableCell>{log.to || '-'}</TableCell>
                      <TableCell>
                        <Typography variant="body2">{formatDate(log.created_at)}</Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <TablePagination
            component="div"
            count={totalCount}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={pageSize}
            onRowsPerPageChange={handlePageSizeChange}
            rowsPerPageOptions={[5, 10, 25, 50, 100]}
          />
        </CardContent>
      </MainCard>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MessageLogs;
