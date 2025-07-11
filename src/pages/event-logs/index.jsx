import React, { useState, useEffect, useCallback } from 'react';
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
import { Refresh as RefreshIcon, FilterList as FilterIcon, Event as EventIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import MainCard from 'components/MainCard';
import { eventLogsAPI } from '../../utils/api';
import { format } from 'date-fns';

const EventLogs = () => {
  const [eventLogs, setEventLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [summary, setSummary] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch event logs
  const fetchEventLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await eventLogsAPI.getAll(page + 1, pageSize, category || null, status || null);

      // Handle response format
      let data;
      if (response && typeof response.json === 'function') {
        data = await response.json();
      } else {
        data = response;
      }

      console.log('Event logs API response:', data);

      setEventLogs(data.data || []);
      setTotalCount(data.pagination?.total || 0);
    } catch (err) {
      console.error('Error fetching event logs:', err);
      setError('Failed to load event logs. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, category, status]);

  // Fetch summary for all categories (or specific category)
  const fetchSummary = useCallback(async (selectedCategory = null) => {
    try {
      // If no category selected, fetch summaries for all categories and combine them
      if (!selectedCategory) {
        const categories = ['MESSAGE', 'PAYMENT', 'AUTH'];
        let combinedSummary = {
          total_count: 0,
          total_queued: 0,
          total_pending: 0,
          total_failed: 0
        };

        // Fetch summary for each category and combine
        for (const cat of categories) {
          try {
            const response = await eventLogsAPI.getSummary(cat);
            let data;
            if (response && typeof response.json === 'function') {
              data = await response.json();
            } else {
              data = response;
            }

            if (data.data) {
              combinedSummary.total_count += data.data.total_count || 0;
              combinedSummary.total_queued += data.data.total_queued || 0;
              combinedSummary.total_pending += data.data.total_pending || 0;
              combinedSummary.total_failed += data.data.total_failed || 0;
            }
          } catch (err) {
            console.error(`Error fetching summary for ${cat}:`, err);
          }
        }

        setSummary(combinedSummary);
      } else {
        // Fetch summary for specific category
        const response = await eventLogsAPI.getSummary(selectedCategory);
        let data;
        if (response && typeof response.json === 'function') {
          data = await response.json();
        } else {
          data = response;
        }
        setSummary(data.data);
      }
    } catch (err) {
      console.error('Error fetching summary:', err);
      showSnackbar('Failed to load summary statistics', 'error');
    }
  }, []);

  useEffect(() => {
    fetchEventLogs();
    // Always fetch summary when page loads
    fetchSummary(category);
  }, [fetchEventLogs, category, fetchSummary]);

  // Load initial summary on page load
  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

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

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(0);
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(0);
  };

  const clearFilters = () => {
    setCategory('');
    setStatus('');
    setPage(0);
  };

  const refreshData = () => {
    fetchEventLogs();
    fetchSummary(category);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'QUEUED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'FAILED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'MESSAGE':
        return 'primary';
      case 'PAYMENT':
        return 'secondary';
      case 'AUTH':
        return 'info';
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
              Event Logs
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Monitor all system events and their statuses
            </Typography>
          </Box>

          {/* Summary Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Card variant="outlined">
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total Events
                  </Typography>
                  <Typography variant="h4">{summary?.total_count || 0}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {category ? `${category} category` : 'All categories'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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
              <InputLabel>Category</InputLabel>
              <Select value={category} onChange={handleCategoryChange} label="Category">
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="MESSAGE">MESSAGE</MenuItem>
                <MenuItem value="PAYMENT">PAYMENT</MenuItem>
                <MenuItem value="AUTH">AUTH</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Status</InputLabel>
              <Select value={status} onChange={handleStatusChange} label="Status">
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="PENDING">PENDING</MenuItem>
                <MenuItem value="QUEUED">QUEUED</MenuItem>
                <MenuItem value="FAILED">FAILED</MenuItem>
              </Select>
            </FormControl>

            <Button variant="outlined" size="small" onClick={clearFilters} disabled={!category && !status}>
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
                  <TableCell>Category</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Queue</TableCell>
                  <TableCell>Carrier</TableCell>
                  <TableCell>Recipient</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Alert severity="error">{error}</Alert>
                    </TableCell>
                  </TableRow>
                ) : eventLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Box sx={{ py: 4, textAlign: 'center' }}>
                        <EventIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No event logs found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {category || status
                            ? 'Try adjusting your filters'
                            : 'Event logs will appear here once you start using the system'}
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
                        <Chip label={log.category} color={getCategoryColor(log.category)} size="small" />
                      </TableCell>
                      <TableCell>
                        <Chip label={log.status} color={getStatusColor(log.status)} size="small" />
                      </TableCell>
                      <TableCell>
                        <Tooltip title={log.description}>
                          <Typography variant="body2" noWrap>
                            {truncateText(log.description, 40)}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={log.queue_id}>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {truncateText(log.queue_name || log.queue_id, 20)}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{log.carrier || '-'}</TableCell>
                      <TableCell>{log.to || '-'}</TableCell>
                      <TableCell>
                        <Typography variant="body2">{formatDate(log.created_at)}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="View Details">
                          <IconButton size="small" onClick={() => showSnackbar(`Event ID: ${log.eid}`, 'info')}>
                            <OpenInNewIcon sx={{ color: 'grey' }} fontSize="small" />
                          </IconButton>
                        </Tooltip>
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

export default EventLogs;
