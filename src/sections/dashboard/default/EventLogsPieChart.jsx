import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';

import { PieChart } from '@mui/x-charts/PieChart';

// project imports
import MainCard from 'components/MainCard';
import { eventLogsAPI } from '../../../utils/api';

// ==============================|| EVENT LOGS PIE CHART ||============================== //

export default function EventLogsPieChart() {
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [pieData, setPieData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch event logs data for pie chart
  useEffect(() => {
    const fetchPieData = async () => {
      try {
        setLoading(true);

        // Get summary data for all statuses
        const categories = ['MESSAGE', 'PAYMENT', 'AUTH'];
        let combinedSummary = {
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

            if (data && data.data) {
              combinedSummary.total_queued += data.data.total_queued || 0;
              combinedSummary.total_pending += data.data.total_pending || 0;
              combinedSummary.total_failed += data.data.total_failed || 0;
            }
          } catch (err) {
            console.error(`Error fetching summary for ${cat}:`, err);
          }
        }

        const total = combinedSummary.total_queued + combinedSummary.total_pending + combinedSummary.total_failed;
        setTotalCount(total);

        // Create pie chart data
        const data = [
          {
            id: 'queued',
            value: combinedSummary.total_queued,
            label: 'Queued',
            color: theme.palette.success.main
          },
          {
            id: 'pending',
            value: combinedSummary.total_pending,
            label: 'Pending',
            color: theme.palette.warning.main
          },
          {
            id: 'failed',
            value: combinedSummary.total_failed,
            label: 'Failed',
            color: theme.palette.error.main
          }
        ].filter((item) => item.value > 0); // Only show statuses with data

        setPieData(data);
      } catch (error) {
        console.error('Error fetching pie chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPieData();
  }, [theme]);

  return (
    <MainCard sx={{ mt: 1 }} content={false}>
      <Box sx={{ p: 2.5 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Event Status Distribution
            </Typography>
            <Typography variant="h4">{totalCount.toLocaleString()} Total Events</Typography>
          </Box>
        </Stack>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <Typography variant="body2" color="text.secondary">
              Loading status distribution...
            </Typography>
          </Box>
        ) : pieData.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
            <Typography variant="body2" color="text.secondary">
              No event data available
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <PieChart
              series={[
                {
                  data: pieData,
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                  innerRadius: 60,
                  outerRadius: 120,
                  paddingAngle: 2,
                  cornerRadius: 5
                }
              ]}
              width={400}
              height={300}
              slotProps={{
                legend: {
                  direction: 'column',
                  position: { vertical: 'middle', horizontal: 'right' },
                  padding: 0
                }
              }}
            />
          </Box>
        )}

        {/* Status Summary */}
        {!loading && pieData.length > 0 && (
          <Stack direction="row" sx={{ justifyContent: 'space-around', mt: 2 }}>
            {pieData.map((item) => (
              <Box key={item.id} sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: item.color,
                    mx: 'auto',
                    mb: 0.5
                  }}
                />
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="h6" color={item.color}>
                  {item.value.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {totalCount > 0 ? `${Math.round((item.value / totalCount) * 100)}%` : '0%'}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </MainCard>
  );
}
