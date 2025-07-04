// material-ui
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import { useEffect } from 'react';
import { useDashboardStats } from '../../hooks/useDashboardStats';

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
  const username = localStorage.getItem('username');
  const { exchangeStats, loading, fetchStats } = useDashboardStats();

  // Fetch exchange statistics
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      {/* row 1 */}
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Typography variant="h5" sx={{ textTransform: 'capitalize' }}>
          Hi {username ? `, ${username}` : ''}!👋🏼
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
