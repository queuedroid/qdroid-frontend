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
  TextField,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Queue as QueueIcon,
  Router as RouterIcon,
  Public as PublicIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import MainCard from 'components/MainCard';
import { exchangeAPI } from '../../utils/api';
import { format } from 'date-fns';

const Queues = () => {
  const [exchanges, setExchanges] = useState([]);
  const [filteredQueues, setFilteredQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [carrierFilter, setCarrierFilter] = useState('');
  const [expandedExchange, setExpandedExchange] = useState(null);

  // Fetch all exchanges with their queues
  const fetchExchangesWithQueues = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // Get all exchanges
      const response = await exchangeAPI.getAll(1, 100); // Get all exchanges
      let data;
      if (response && typeof response.json === 'function') {
        data = await response.json();
      } else {
        data = response;
      }

      // Handle different response structures
      let exchangesList = [];
      if (Array.isArray(data)) {
        exchangesList = data;
      } else if (data && data.results && Array.isArray(data.results)) {
        exchangesList = data.results;
      } else if (data && data.data && Array.isArray(data.data)) {
        exchangesList = data.data;
      }

      setExchanges(exchangesList);
      
      // Flatten all queues for display
      const allQueues = [];
      exchangesList.forEach((exchange) => {
        if (exchange.queues && Array.isArray(exchange.queues)) {
          exchange.queues.forEach((queue) => {
            allQueues.push({
              ...queue,
              exchange_id: exchange.exchange_id || exchange.id,
              exchange_label: exchange.label || exchange.exchange_id,
              exchange_description: exchange.description
            });
          });
        }
      });

      setFilteredQueues(allQueues);
    } catch (err) {
      console.error('Error fetching exchanges:', err);
      setError('Failed to load queues. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchExchangesWithQueues();
  }, [fetchExchangesWithQueues]);

  // Filter queues based on search and filters
  useEffect(() => {
    let filtered = [];
    
    exchanges.forEach((exchange) => {
      if (exchange.queues && Array.isArray(exchange.queues)) {
        exchange.queues.forEach((queue) => {
          const enrichedQueue = {
            ...queue,
            exchange_id: exchange.exchange_id || exchange.id,
            exchange_label: exchange.label || exchange.exchange_id,
            exchange_description: exchange.description
          };

          // Apply search filter
          const matchesSearch = !searchTerm || 
            queue.queue_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            queue.queue_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            queue.country_code?.includes(searchTerm) ||
            queue.carrier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            exchange.label?.toLowerCase().includes(searchTerm.toLowerCase());

          // Apply country filter
          const matchesCountry = !countryFilter || queue.country_code === countryFilter;

          // Apply carrier filter
          const matchesCarrier = !carrierFilter || queue.carrier === carrierFilter;

          if (matchesSearch && matchesCountry && matchesCarrier) {
            filtered.push(enrichedQueue);
          }
        });
      }
    });

    setFilteredQueues(filtered);
    setPage(0); // Reset to first page when filtering
  }, [exchanges, searchTerm, countryFilter, carrierFilter]);

  // Get unique countries and carriers for filters
  const uniqueCountries = [...new Set(filteredQueues.map(q => q.country_code).filter(Boolean))].sort();
  const uniqueCarriers = [...new Set(filteredQueues.map(q => q.carrier).filter(Boolean))].sort();

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setCountryFilter('');
    setCarrierFilter('');
    setPage(0);
  };

  const getCountryFlag = (countryCode) => {
    // Simple country code to flag mapping (you might want to use a proper flag library)
    const flags = {
      '237': '🇨🇲', // Cameroon
      '234': '🇳🇬', // Nigeria
      '233': '🇬🇭', // Ghana
      '1': '🇺🇸',    // US
      '44': '🇬🇧',   // UK
      '33': '🇫🇷',   // France
      '49': '🇩🇪',   // Germany
      '91': '🇮🇳',   // India
    };
    return flags[countryCode] || '🌍';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  const paginatedQueues = filteredQueues.slice(page * pageSize, page * pageSize + pageSize);

  // Calculate statistics
  const totalQueues = filteredQueues.length;
  const totalExchanges = exchanges.length;
  const uniqueCountriesCount = uniqueCountries.length;
  const uniqueCarriersCount = uniqueCarriers.length;

  return (
    <Box>
      <MainCard>
        <CardContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              Queue Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage all SMS routing queues across exchanges
            </Typography>
          </Box>

          {/* Statistics Cards */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                      <QueueIcon />
                    </Avatar>
                    <Box>
                      <Typography color="text.secondary" variant="body2">
                        Total Queues
                      </Typography>
                      <Typography variant="h4">{totalQueues}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'secondary.main' }}>
                      <RouterIcon />
                    </Avatar>
                    <Box>
                      <Typography color="text.secondary" variant="body2">
                        Exchanges
                      </Typography>
                      <Typography variant="h4">{totalExchanges}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'success.main' }}>
                      <PublicIcon />
                    </Avatar>
                    <Box>
                      <Typography color="text.secondary" variant="body2">
                        Countries
                      </Typography>
                      <Typography variant="h4">{uniqueCountriesCount}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                      <InfoIcon />
                    </Avatar>
                    <Box>
                      <Typography color="text.secondary" variant="body2">
                        Carriers
                      </Typography>
                      <Typography variant="h4">{uniqueCarriersCount}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Search and Filters */}
          <Stack direction="row" spacing={2} sx={{ mb: 3 }} alignItems="center" flexWrap="wrap">
            <TextField
              size="small"
              placeholder="Search queues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
              }}
              sx={{ minWidth: 250 }}
            />

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Country</InputLabel>
              <Select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} label="Country">
                <MenuItem value="">All Countries</MenuItem>
                {uniqueCountries.map((country) => (
                  <MenuItem key={country} value={country}>
                    {getCountryFlag(country)} +{country}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Carrier</InputLabel>
              <Select value={carrierFilter} onChange={(e) => setCarrierFilter(e.target.value)} label="Carrier">
                <MenuItem value="">All Carriers</MenuItem>
                {uniqueCarriers.map((carrier) => (
                  <MenuItem key={carrier} value={carrier}>
                    {carrier}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Button variant="outlined" size="small" onClick={clearFilters} disabled={!searchTerm && !countryFilter && !carrierFilter}>
              Clear Filters
            </Button>

            <Button variant="outlined" size="small" onClick={fetchExchangesWithQueues} startIcon={<RefreshIcon />}>
              Refresh
            </Button>
          </Stack>

          {/* Exchanges Overview */}
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Exchange Overview
              </Typography>
              <Grid container spacing={2}>
                {exchanges.map((exchange) => (
                  <Grid item xs={12} md={6} lg={4} key={exchange.exchange_id || exchange.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {exchange.label || exchange.exchange_id}
                          </Typography>
                          <Chip
                            label={`${exchange.queues?.length || 0} queues`}
                            size="small"
                            color={exchange.queues?.length > 0 ? 'success' : 'default'}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {exchange.description || 'No description'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {exchange.exchange_id || exchange.id}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Queues Table */}
          <TableContainer component={Paper} variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Queue ID</TableCell>
                  <TableCell>Exchange</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>MCC</TableCell>
                  <TableCell>MNC</TableCell>
                  <TableCell>Carrier</TableCell>
                  <TableCell>Routing Key</TableCell>
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
                ) : paginatedQueues.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Box sx={{ py: 4, textAlign: 'center' }}>
                        <QueueIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          No queues found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {searchTerm || countryFilter || carrierFilter
                            ? 'Try adjusting your filters'
                            : 'Create queues within exchanges to see them here'}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedQueues.map((queue) => (
                    <TableRow key={`${queue.exchange_id}-${queue.id || queue.queue}`} hover>
                      <TableCell>
                        <Tooltip title={queue.queue_id || queue.id}>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {(queue.queue_name || queue.queue_id || queue.id || '').substring(0, 20)}...
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {queue.exchange_label}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {queue.exchange_id}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2">
                            {getCountryFlag(queue.country_code)} +{queue.country_code || 'N/A'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip label={queue.mcc || 'N/A'} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip label={queue.mnc || 'N/A'} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>{queue.carrier || '-'}</TableCell>
                      <TableCell>
                        <Tooltip title={queue.routing_key}>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                            {queue.routing_key ? `${queue.routing_key.substring(0, 20)}...` : 'N/A'}
                          </Typography>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{formatDate(queue.created_at)}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Edit Queue">
                            <IconButton size="small" color="primary">
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Queue">
                            <IconButton size="small" color="error">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
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
            count={filteredQueues.length}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={pageSize}
            onRowsPerPageChange={handlePageSizeChange}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </CardContent>
      </MainCard>
    </Box>
  );
};

export default Queues;
