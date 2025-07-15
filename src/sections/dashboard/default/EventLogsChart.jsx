import { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';

import { BarChart } from '@mui/x-charts/BarChart';

// project imports
import MainCard from 'components/MainCard';
import { eventLogsAPI } from '../../../utils/api';

// ==============================|| EVENT LOGS CHART ||============================== //

export default function EventLogsChart() {
  const theme = useTheme();

  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    labels: [],
    queuedData: [],
    failedData: [],
    pendingData: []
  });
  const [showQueued, setShowQueued] = useState(true);
  const [showFailed, setShowFailed] = useState(true);
  const [showPending, setShowPending] = useState(true);

  // Fetch event logs data for chart
  useEffect(() => {
    const fetchEventLogsData = async () => {
      try {
        setLoading(true);

        // Get event logs for different statuses
        const [queuedResponse, failedResponse, pendingResponse] = await Promise.all([
          eventLogsAPI.getAll(1, 50, '', 'QUEUED'),
          eventLogsAPI.getAll(1, 50, '', 'FAILED'),
          eventLogsAPI.getAll(1, 50, '', 'PENDING')
        ]);

        // Process responses
        const processResponse = async (response) => {
          if (response && typeof response.json === 'function') {
            return await response.json();
          }
          return response;
        };

        const queuedData = await processResponse(queuedResponse);
        const failedData = await processResponse(failedResponse);
        const pendingData = await processResponse(pendingResponse);

        // Group data by date (last 7 days)
        const last7Days = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          last7Days.push(date.toISOString().split('T')[0]);
        }

        // Count events by date
        const countEventsByDate = (events, dates) => {
          return dates.map((date) => {
            const dayEvents = events.filter((event) => {
              const eventDate = new Date(event.created_at).toISOString().split('T')[0];
              return eventDate === date;
            });
            return dayEvents.length;
          });
        };

        const queuedCounts = countEventsByDate(queuedData.data || [], last7Days);
        const failedCounts = countEventsByDate(failedData.data || [], last7Days);
        const pendingCounts = countEventsByDate(pendingData.data || [], last7Days);

        // Format labels for display
        const labels = last7Days.map((date) => {
          const d = new Date(date);
          return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
        });

        setChartData({
          labels,
          queuedData: queuedCounts,
          failedData: failedCounts,
          pendingData: pendingCounts
        });
      } catch (error) {
        console.error('Error fetching event logs data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventLogsData();
  }, []);

  const axisFontStyle = { fontSize: 10, fill: theme.palette.text.secondary };

  const queuedColor = theme.palette.success.main;
  const failedColor = theme.palette.error.main;
  const pendingColor = theme.palette.warning.main;

  const series = [
    ...(showQueued
      ? [
          {
            data: chartData.queuedData,
            label: 'Queued',
            color: queuedColor,
            type: 'bar'
          }
        ]
      : []),
    ...(showFailed
      ? [
          {
            data: chartData.failedData,
            label: 'Failed',
            color: failedColor,
            type: 'bar'
          }
        ]
      : []),
    ...(showPending
      ? [
          {
            data: chartData.pendingData,
            label: 'Pending',
            color: pendingColor,
            type: 'bar'
          }
        ]
      : [])
  ];

  return (
    <MainCard sx={{ mt: 1 }} content={false}>
      <Box sx={{ p: 2.5, pb: 0 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              Event Logs (Last 7 Days)
            </Typography>
            <Typography variant="h4">Message Status Overview</Typography>
          </Box>

          <FormGroup>
            <Stack direction="row">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showQueued}
                    onChange={() => setShowQueued(!showQueued)}
                    sx={{
                      '&.Mui-checked': { color: queuedColor },
                      '&:hover': { backgroundColor: alpha(queuedColor, 0.08) }
                    }}
                  />
                }
                label="Queued"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showFailed}
                    onChange={() => setShowFailed(!showFailed)}
                    sx={{
                      '&.Mui-checked': { color: failedColor },
                      '&:hover': { backgroundColor: alpha(failedColor, 0.08) }
                    }}
                  />
                }
                label="Failed"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showPending}
                    onChange={() => setShowPending(!showPending)}
                    sx={{
                      '&.Mui-checked': { color: pendingColor },
                      '&:hover': { backgroundColor: alpha(pendingColor, 0.08) }
                    }}
                  />
                }
                label="Pending"
              />
            </Stack>
          </FormGroup>
        </Stack>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
            <Typography variant="body2" color="text.secondary">
              Loading chart data...
            </Typography>
          </Box>
        ) : (
          <BarChart
            height={400}
            grid={{ horizontal: true }}
            xAxis={[
              {
                data: chartData.labels,
                scaleType: 'band',
                tickLabelStyle: { ...axisFontStyle, fontSize: 12 }
              }
            ]}
            yAxis={[
              {
                disableLine: true,
                disableTicks: true,
                tickLabelStyle: axisFontStyle
              }
            ]}
            series={series}
            slotProps={{
              legend: { hidden: true },
              bar: { rx: 5, ry: 5 }
            }}
            axisHighlight={{ x: 'none' }}
            margin={{ top: 30, left: 40, right: 10 }}
            tooltip={{ trigger: 'item' }}
            sx={{
              '& .MuiBarElement-root:hover': { opacity: 0.6 },
              '& .MuiChartsAxis-directionX .MuiChartsAxis-tick, & .MuiChartsAxis-root line': {
                stroke: theme.palette.divider
              }
            }}
          />
        )}
      </Box>
    </MainCard>
  );
}
