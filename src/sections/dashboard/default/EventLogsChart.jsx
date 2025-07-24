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
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

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
  const [timePeriod, setTimePeriod] = useState('week'); // 'day', 'week', 'month'

  // Generate date ranges based on time period
  const generateDateRange = (period) => {
    const dates = [];
    const today = new Date();

    if (period === 'day') {
      // Last 24 hours (by hour)
      for (let i = 23; i >= 0; i--) {
        const date = new Date(today);
        date.setHours(date.getHours() - i, 0, 0, 0);
        dates.push(date);
      }
    } else if (period === 'week') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        dates.push(date);
      }
    } else if (period === 'month') {
      // Last 30 days (grouped by week)
      for (let i = 4; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i * 7);
        date.setHours(0, 0, 0, 0);
        dates.push(date);
      }
    }

    return dates;
  };

  // Format labels based on time period
  const formatLabel = (date, period) => {
    if (period === 'day') {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    } else if (period === 'week') {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } else if (period === 'month') {
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 6);
      return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }
    return '';
  };

  // Count events by date range
  const countEventsByDateRange = (events, dates, period) => {
    return dates.map((date) => {
      let filteredEvents;

      if (period === 'day') {
        // Count events within the hour
        const endHour = new Date(date);
        endHour.setHours(endHour.getHours() + 1);

        filteredEvents = events.filter((event) => {
          const eventDate = new Date(event.created_at);
          return eventDate >= date && eventDate < endHour;
        });
      } else if (period === 'week') {
        // Count events within the day
        const endDay = new Date(date);
        endDay.setDate(endDay.getDate() + 1);

        filteredEvents = events.filter((event) => {
          const eventDate = new Date(event.created_at);
          return eventDate >= date && eventDate < endDay;
        });
      } else if (period === 'month') {
        // Count events within the week
        const endWeek = new Date(date);
        endWeek.setDate(endWeek.getDate() + 7);

        filteredEvents = events.filter((event) => {
          const eventDate = new Date(event.created_at);
          return eventDate >= date && eventDate < endWeek;
        });
      }

      return filteredEvents ? filteredEvents.length : 0;
    });
  };

  // Fetch event logs data for chart
  useEffect(() => {
    const fetchEventLogsData = async () => {
      try {
        setLoading(true);

        // Determine the number of records to fetch based on time period
        const recordLimit = timePeriod === 'month' ? 200 : timePeriod === 'week' ? 100 : 50;

        // Get event logs for different statuses
        const [queuedResponse, failedResponse, pendingResponse] = await Promise.all([
          eventLogsAPI.getAll(1, recordLimit, '', 'QUEUED'),
          eventLogsAPI.getAll(1, recordLimit, '', 'FAILED'),
          eventLogsAPI.getAll(1, recordLimit, '', 'PENDING')
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

        // Generate date range based on selected period
        const dateRange = generateDateRange(timePeriod);

        // Count events by date range
        const queuedCounts = countEventsByDateRange(queuedData.data || [], dateRange, timePeriod);
        const failedCounts = countEventsByDateRange(failedData.data || [], dateRange, timePeriod);
        const pendingCounts = countEventsByDateRange(pendingData.data || [], dateRange, timePeriod);

        // Format labels for display
        const labels = dateRange.map((date) => formatLabel(date, timePeriod));

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
  }, [timePeriod]);

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

  const getChartTitle = () => {
    switch (timePeriod) {
      case 'day':
        return 'Message Logs (Last 24 Hours)';
      case 'week':
        return 'Message Logs (Last 7 Days)';
      case 'month':
        return 'Message Logs (Last 30 Days)';
      default:
        return 'Message Status Overview';
    }
  };

  const handleTimePeriodChange = (event, newPeriod) => {
    if (newPeriod !== null) {
      setTimePeriod(newPeriod);
    }
  };

  return (
    <MainCard sx={{ mt: 1 }} content={false}>
      <Box sx={{ p: 2.5, pb: 0 }}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
              {getChartTitle()}
            </Typography>
            <Typography variant="h4">Message Status Overview</Typography>
          </Box>

          <Stack direction="row" spacing={2} alignItems="center">
            {/* Time Period Selector */}
            <ToggleButtonGroup value={timePeriod} exclusive onChange={handleTimePeriodChange} size="small" sx={{ height: 32 }}>
              <ToggleButton value="day" sx={{ px: 2, color: 'grey' }}>
                Day
              </ToggleButton>
              <ToggleButton value="week" sx={{ px: 2, color: 'grey' }}>
                Week
              </ToggleButton>
              <ToggleButton value="month" sx={{ px: 2, color: 'grey' }}>
                Month
              </ToggleButton>
            </ToggleButtonGroup>

            {/* Status Checkboxes */}
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
                {/* <FormControlLabel
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
                /> */}
              </Stack>
            </FormGroup>
          </Stack>
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
