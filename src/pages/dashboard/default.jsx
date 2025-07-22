// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import { useEffect, useState, useCallback } from 'react';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useUserDetails } from '../../hooks/useUserDetails';
import { eventLogsAPI } from '../../utils/api';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import CopyOutlined from '@ant-design/icons/CopyOutlined';
import { UndoOutlined } from '@ant-design/icons';
import { Event as EventIcon, OpenInNew as OpenInNewIcon } from '@mui/icons-material';
import EventLogsChart from '../../sections/dashboard/default/EventLogsChart';
import EventLogsPieChart from '../../sections/dashboard/default/EventLogsPieChart';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const { exchangeStats, loading, fetchStats } = useDashboardStats();
  const { userDetails, loading: userLoading, error: userError, fetchUserDetails } = useUserDetails();
  const [showToken, setShowToken] = useState(false);
  const [showAccountId, setShowAccountId] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState('');
  const navigate = useNavigate();

  // Event logs state
  const [eventLogs, setEventLogs] = useState([]);
  const [eventLogsLoading, setEventLogsLoading] = useState(false);
  const [eventLogsError, setEventLogsError] = useState('');

  // Fetch recent event logs for dashboard
  const fetchRecentEventLogs = useCallback(async () => {
    try {
      setEventLogsLoading(true);
      setEventLogsError('');

      const response = await eventLogsAPI.getAll(1, 5); // Get first 5 recent events
      let data;
      if (response && typeof response.json === 'function') {
        data = await response.json();
      } else {
        data = response;
      }

      setEventLogs(data.data || []);
    } catch (err) {
      console.error('Error fetching recent event logs:', err);
      setEventLogsError('Failed to load recent events');
    } finally {
      setEventLogsLoading(false);
    }
  }, []);

  // Utility functions for event logs
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
      return format(new Date(dateString), 'MMM dd, HH:mm');
    } catch {
      return dateString;
    }
  };

  const truncateText = (text, maxLength = 30) => {
    if (!text) return '-';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Fetch exchange statistics
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Fetch user details
  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  // Fetch recent event logs
  useEffect(() => {
    fetchRecentEventLogs();
  }, [fetchRecentEventLogs]);

  // Debug logging
  useEffect(() => {
    console.log('User details:', userDetails);
    console.log('User loading:', userLoading);
    console.log('User error:', userError);
    console.log('Exchange stats:', exchangeStats);
    console.log('Exchange stats loading:', loading);
    console.log('Token from localStorage:', localStorage.getItem('token'));
    console.log('Account token from userDetails:', userDetails.account_token);
  }, [userDetails, userLoading, userError, exchangeStats, loading]);

  // Handle token copy
  const handleCopyToken = async () => {
    try {
      await navigator.clipboard.writeText(userDetails.account_token);
      setCopyFeedback('Copied!');
      setTimeout(() => setCopyFeedback(''), 2000);
    } catch (err) {
      console.error('Failed to copy token:', err);
      setCopyFeedback('Failed to copy');
      setTimeout(() => setCopyFeedback(''), 2000);
    }
  };

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ textTransform: 'capitalize' }}>
            Hi{userDetails?.full_name ? `, ${userDetails.full_name}` : ''}!👋🏼
          </Typography>
          <Tooltip title="Refresh dashboard statistics">
            <Button variant="outlined" startIcon={<UndoOutlined />} onClick={fetchStats} disabled={loading} size="small">
              Refresh
            </Button>
          </Tooltip>
        </Box>
      </Grid>

      {/* Statistics Cards */}
      <Grid size={{ xs: 6, sm: 6, md: 3, lg: 3 }}>
        <AnalyticEcommerce
          title="Total Exchanges"
          count={loading ? '...' : exchangeStats.totalExchanges.toString()}
          extra="Active exchanges"
          isLoss={false}
        />
      </Grid>
      <Grid size={{ xs: 6, sm: 6, md: 3, lg: 3 }}>
        <AnalyticEcommerce
          title="Active Queues"
          count={loading ? '...' : exchangeStats.activeQueues.toString()}
          extra="SMS queues"
          isLoss={false}
        />
      </Grid>
      <Grid size={{ xs: 6, sm: 6, md: 3, lg: 3 }}>
        <AnalyticEcommerce
          title="Total Messages"
          count={loading ? '...' : exchangeStats.messagesSent.toLocaleString()}
          extra="All message logs"
          isLoss={false}
        />
      </Grid>
      <Grid size={{ xs: 6, sm: 6, md: 3, lg: 3 }}>
        <AnalyticEcommerce
          title="Messages Queued"
          count={loading ? '...' : exchangeStats.messagesQueued.toLocaleString()}
          extra="Pending delivery"
          isLoss={false}
        />
      </Grid>

      {/* User Information Section */}
      <Grid size={{ xs: 12, md: 12, lg: 12 }}>
        <MainCard title="User Information" sx={{ mt: 1 }}>
          <Box sx={{ p: 2 }}>
            <Stack spacing={3}>
              {userError && (
                <Typography variant="body2" color="error">
                  Error loading user information: {userError}
                </Typography>
              )}

              {/* Account Fields - Side by side on large screens */}
              <Grid container spacing={3}>
                {/* Account ID */}
                <Grid size={{ xs: 12, lg: 6 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Account ID
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Your unique account identifier
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <OutlinedInput
                        fullWidth
                        type={showAccountId ? 'text' : 'password'}
                        value={userLoading ? 'Loading...' : userDetails.account_id || 'No account ID available'}
                        readOnly
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            cursor: 'default',
                            userSelect: 'none',
                            caretColor: 'transparent'
                          }
                        }}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowAccountId(!showAccountId)} edge="end" size="small">
                              {showAccountId ? (
                                <EyeInvisibleOutlined style={{ color: 'grey' }} />
                              ) : (
                                <EyeOutlined style={{ color: 'grey' }} />
                              )}
                            </IconButton>
                            <IconButton
                              onClick={async () => {
                                try {
                                  await navigator.clipboard.writeText(userDetails.account_id);
                                  setCopyFeedback('Account ID copied!');
                                  setTimeout(() => setCopyFeedback(''), 2000);
                                } catch (err) {
                                  console.error('Failed to copy account ID:', err);
                                  setCopyFeedback('Failed to copy');
                                  setTimeout(() => setCopyFeedback(''), 2000);
                                }
                              }}
                              edge="end"
                              size="small"
                              disabled={!userDetails.account_id}
                            >
                              <CopyOutlined style={{ color: 'grey' }} />
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </Box>
                  </Box>
                </Grid>

                {/* Account Token */}
                <Grid size={{ xs: 12, lg: 6 }}>
                  <Box>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Account Token
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Use this token to authenticate API requests
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <OutlinedInput
                        fullWidth
                        type={showToken ? 'text' : 'password'}
                        value={userLoading ? 'Loading...' : userDetails.account_token || 'No token available'}
                        readOnly
                        size="small"
                        sx={{
                          '& .MuiOutlinedInput-input': {
                            cursor: 'default',
                            userSelect: 'none',
                            caretColor: 'transparent'
                          }
                        }}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowToken(!showToken)} edge="end" size="small">
                              {showToken ? <EyeInvisibleOutlined style={{ color: 'grey' }} /> : <EyeOutlined style={{ color: 'grey' }} />}
                            </IconButton>
                            <IconButton onClick={handleCopyToken} edge="end" size="small" disabled={!userDetails.account_token}>
                              <CopyOutlined style={{ color: 'grey' }} />
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              {/* Copy Feedback */}
              {copyFeedback && (
                <Typography
                  variant="caption"
                  sx={{
                    color: copyFeedback.includes('copied') || copyFeedback === 'Copied!' ? 'success.main' : 'error.main',
                    textAlign: 'center'
                  }}
                >
                  {copyFeedback}
                </Typography>
              )}
            </Stack>
          </Box>
        </MainCard>
      </Grid>

      {/* Event Logs Chart Section */}
      <Grid size={{ xs: 12, md: 8, lg: 8 }}>
        <EventLogsChart />
      </Grid>

      {/* Event Logs Pie Chart Section */}
      <Grid size={{ xs: 12, md: 4, lg: 4 }}>
        <EventLogsPieChart />
      </Grid>

      {/* Recent Event Logs Section */}
      <Grid size={{ xs: 12, md: 12, lg: 12 }}>
        <MainCard sx={{ mt: 1 }}>
          <Box sx={{ p: { md: 3, xs: 0 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Recent Message Logs</Typography>
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('logs/messages')}
                sx={{ textDecoration: 'none', cursor: 'pointer' }}
              >
                View All →
              </Link>
            </Box>

            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Status</TableCell>
                    <TableCell>Queue</TableCell>
                    <TableCell>Carrier</TableCell>
                    <TableCell>Recipient</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell align="center">More</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {eventLogsLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <CircularProgress size={24} />
                      </TableCell>
                    </TableRow>
                  ) : eventLogsError ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Alert severity="error" sx={{ border: 'none' }}>
                          {eventLogsError}
                        </Alert>
                      </TableCell>
                    </TableRow>
                  ) : eventLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        <Box sx={{ py: 3, textAlign: 'center' }}>
                          <EventIcon sx={{ fontSize: 32, color: 'text.disabled', mb: 1 }} />
                          <Typography variant="body2" color="text.secondary">
                            No recent messages found
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    eventLogs.map((log) => (
                      <TableRow key={log.eid} hover>
                        <TableCell>
                          <Chip label={log.status} color={getStatusColor(log.status)} size="small" />
                        </TableCell>
                        <TableCell>
                          <Tooltip title={log.queue_id}>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                              {truncateText(log.queue_name || log.queue_id, 15)}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{log.carrier || '-'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{log.to || '-'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{formatDate(log.created_at)}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="View in Event Logs">
                            <IconButton size="small" onClick={() => navigate('logs/messages')}>
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
          </Box>
        </MainCard>
      </Grid>
    </Grid>
  );
}
