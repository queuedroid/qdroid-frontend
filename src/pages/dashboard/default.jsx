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

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import { useEffect, useState } from 'react';
import { useDashboardStats } from '../../hooks/useDashboardStats';
import { useUserDetails } from '../../hooks/useUserDetails';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';
import CopyOutlined from '@ant-design/icons/CopyOutlined';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const { exchangeStats, loading, fetchStats } = useDashboardStats();
  const { userDetails, loading: userLoading, error: userError, fetchUserDetails } = useUserDetails();
  const [showToken, setShowToken] = useState(false);
  const [showAccountId, setShowAccountId] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState('');

  // Fetch exchange statistics
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Fetch user details
  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  // Debug logging
  useEffect(() => {
    console.log('User details:', userDetails);
    console.log('User loading:', userLoading);
    console.log('User error:', userError);
    console.log('Token from localStorage:', localStorage.getItem('token'));
    console.log('Account token from userDetails:', userDetails.account_token);
  }, [userDetails, userLoading, userError]);

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
        <Typography variant="h5" sx={{ textTransform: 'capitalize' }}>
          Hi{userDetails?.full_name ? `, ${userDetails.full_name}` : ''}!👋🏼
        </Typography>
      </Grid>

      {/* Statistics Cards */}
      <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
        <AnalyticEcommerce
          title="Total Exchanges"
          count={loading ? '...' : exchangeStats.totalExchanges.toString()}
          extra="Active exchanges"
          isLoss={false}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
        <AnalyticEcommerce
          title="Active Queues"
          count={loading ? '...' : exchangeStats.activeQueues.toString()}
          extra="SMS queues"
          isLoss={false}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
        <AnalyticEcommerce
          title="Messages Sent"
          count={loading ? '...' : exchangeStats.messagesSent.toLocaleString()}
          extra="This month"
          isLoss={false}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
        <AnalyticEcommerce
          title="Messages Queued"
          count={loading ? '...' : exchangeStats.messagesQueued.toString()}
          extra="Pending delivery"
          isLoss={false}
        />
      </Grid>

      <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />

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

      {/* Filters Section */}
      <Grid size={{ xs: 12, md: 12, lg: 12 }}>
        <MainCard sx={{ mt: 1 }} content={false}>
          <Box sx={{ p: 3 }}></Box>
        </MainCard>
      </Grid>

      {/* row 2 */}
      {/* <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <UniqueVisitorCard filters={filtersApplied} />
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <CountryTable filters={filtersApplied} />
      </Grid>
      
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <UserTable filters={filtersApplied} />
      </Grid>

      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <ReportCard />
      </Grid> */}
    </Grid>
  );
}
