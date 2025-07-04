import React, { useState } from 'react';
import { Box, TextField, Autocomplete, Alert, Typography, Chip, Grid } from '@mui/material';

// Simplified country data with common countries and their calling codes
const commonCountries = [
  { code: 'US', name: 'United States', callingCode: '1', mcc: '310' },
  { code: 'IR', name: 'Iran', callingCode: '98', mcc: '432' },
  { code: 'CM', name: 'Cameroon', callingCode: '237', mcc: '624' },
  { code: 'GH', name: 'Ghana', callingCode: '233', mcc: '620' },
  { code: 'NG', name: 'Nigeria', callingCode: '234', mcc: '621' },
  { code: 'KE', name: 'Kenya', callingCode: '254', mcc: '639' },
  { code: 'ZA', name: 'South Africa', callingCode: '27', mcc: '655' },
  { code: 'EG', name: 'Egypt', callingCode: '20', mcc: '602' },
  { code: 'MA', name: 'Morocco', callingCode: '212', mcc: '604' },
  { code: 'TN', name: 'Tunisia', callingCode: '216', mcc: '605' },
  { code: 'UG', name: 'Uganda', callingCode: '256', mcc: '641' },
  { code: 'TZ', name: 'Tanzania', callingCode: '255', mcc: '640' }
];

// Common network operators for popular countries
const networkOperators = {
  US: [
    { name: 'Verizon', mcc: '310', mnc: '004' },
    { name: 'AT&T', mcc: '310', mnc: '030' },
    { name: 'T-Mobile', mcc: '310', mnc: '260' },
    { name: 'Sprint', mcc: '310', mnc: '120' }
  ],
  IR: [
    { name: 'Hamrah-e Avval (MCI)', mcc: '432', mnc: '11' },
    { name: 'Irancell', mcc: '432', mnc: '35' },
    { name: 'RighTel', mcc: '432', mnc: '20' }
  ],
  CM: [
    { name: 'MTN Cameroon', mcc: '624', mnc: '01' },
    { name: 'Orange Cameroon', mcc: '624', mnc: '02' },
    { name: 'Nexttel', mcc: '624', mnc: '04' }
  ],
  GH: [
    { name: 'MTN Ghana', mcc: '620', mnc: '01' },
    { name: 'Vodafone Ghana', mcc: '620', mnc: '02' },
    { name: 'AirtelTigo', mcc: '620', mnc: '03' }
  ],
  NG: [
    { name: 'MTN Nigeria', mcc: '621', mnc: '30' },
    { name: 'Airtel Nigeria', mcc: '621', mnc: '20' },
    { name: 'Glo Mobile', mcc: '621', mnc: '50' },
    { name: '9mobile', mcc: '621', mnc: '60' }
  ],
  KE: [
    { name: 'Safaricom', mcc: '639', mnc: '02' },
    { name: 'Airtel Kenya', mcc: '639', mnc: '03' },
    { name: 'Telkom Kenya', mcc: '639', mnc: '07' }
  ]
};

const SimpleQueueCreationForm = ({ formData, onChange }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null);

  // Handle country selection
  const handleCountryChange = (event, newValue) => {
    setSelectedCountry(newValue);
    setSelectedNetwork(null);

    if (newValue) {
      onChange({
        ...formData,
        country_code: newValue.callingCode,
        mcc: newValue.mcc,
        mnc: ''
      });
    } else {
      onChange({
        ...formData,
        country_code: '',
        mcc: '',
        mnc: ''
      });
    }
  };

  // Handle network selection
  const handleNetworkChange = (event, newValue) => {
    setSelectedNetwork(newValue);

    if (newValue) {
      onChange({
        ...formData,
        mcc: newValue.mcc,
        mnc: newValue.mnc
      });
    } else {
      onChange({
        ...formData,
        mnc: ''
      });
    }
  };

  // Handle manual input changes
  const handleManualChange = (field, value) => {
    onChange({
      ...formData,
      [field]: value
    });
  };

  const availableNetworks = selectedCountry ? networkOperators[selectedCountry.code] || [] : [];

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Queue Configuration
      </Typography>

      <Grid container spacing={2}>
        {/* Country Selection */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Autocomplete
            options={commonCountries}
            value={selectedCountry}
            onChange={handleCountryChange}
            getOptionLabel={(option) => `${option.name} (+${option.callingCode})`}
            renderInput={(params) => <TextField {...params} label="Select Country" placeholder="Choose a country..." required />}
          />
        </Grid>

        {/* Network Selection */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Autocomplete
            options={availableNetworks}
            value={selectedNetwork}
            onChange={handleNetworkChange}
            getOptionLabel={(option) => `${option.name} (MCC: ${option.mcc}, MNC: ${option.mnc})`}
            disabled={!selectedCountry || availableNetworks.length === 0}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Network Operator"
                placeholder="Choose a network operator..."
                required
                helperText={
                  !selectedCountry
                    ? 'Please select a country first'
                    : availableNetworks.length === 0
                      ? 'No predefined networks available, please enter manually below'
                      : 'Select a network operator'
                }
              />
            )}
          />
        </Grid>

        {/* Manual Override Section */}
        <Grid size={12}>
          <Typography variant="subtitle2" sx={{ mb: 2, mt: 2 }}>
            Manual Entry / Override
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="Country Code"
            value={formData.country_code}
            onChange={(e) => handleManualChange('country_code', e.target.value)}
            size="small"
            helperText="e.g., 237 for Cameroon"
            required
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="MCC"
            value={formData.mcc}
            onChange={(e) => handleManualChange('mcc', e.target.value)}
            size="small"
            helperText="Mobile Country Code"
            required
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            label="MNC"
            value={formData.mnc}
            onChange={(e) => handleManualChange('mnc', e.target.value)}
            size="small"
            helperText="Mobile Network Code"
            required
          />
        </Grid>

        {/* Current Values Display */}
        {(formData.country_code || formData.mcc || formData.mnc) && (
          <Grid size={12}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
              {formData.country_code && <Chip label={`Country: +${formData.country_code}`} size="small" color="primary" />}
              {formData.mcc && <Chip label={`MCC: ${formData.mcc}`} size="small" color="secondary" />}
              {formData.mnc && <Chip label={`MNC: ${formData.mnc}`} size="small" color="secondary" />}
            </Box>
          </Grid>
        )}
      </Grid>

      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>Quick Setup:</strong> Select a country to auto-fill codes, then choose a network operator. You can also manually enter
          codes below. Find more MCC/MNC codes at{' '}
          <a href="https://www.mcc-mnc.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
            mcc-mnc.com
          </a>
        </Typography>
      </Alert>
    </Box>
  );
};

export default SimpleQueueCreationForm;
