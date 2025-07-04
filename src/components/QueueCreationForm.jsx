import React, { useState, useEffect } from 'react';
import { Box, TextField, Autocomplete, Alert, Typography, Chip, Grid } from '@mui/material';
import { getCountries, getCountryCallingCode } from 'libphonenumber-js';
import countries from 'i18n-iso-countries';
import mccMncList from 'mcc-mnc-list';
import enLocale from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(enLocale);

const QueueCreationForm = ({ formData, onChange }) => {
  const [countryOptions, setCountryOptions] = useState([]);
  const [networkOptions, setNetworkOptions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null);

  useEffect(() => {
    const countryList = getCountries()
      .map((countryCode) => {
        const countryName = countries.getName(countryCode, 'en');
        const callingCode = getCountryCallingCode(countryCode);

        return {
          code: countryCode,
          name: countryName,
          callingCode: callingCode,
          label: `${countryName} (+${callingCode})`,
          value: callingCode
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));

    setCountryOptions(countryList);
  }, []);

  const handleCountryChange = (event, newValue) => {
    setSelectedCountry(newValue);
    setSelectedNetwork(null);

    if (newValue) {
      onChange({
        ...formData,
        country_code: newValue.callingCode,
        mcc: '',
        mnc: ''
      });

      const networksForCountry = mccMncList.filter((item) => item.countryCode === newValue.code);

      const networkOptions = networksForCountry.map((network) => ({
        ...network,
        label: `${network.network} (MCC: ${network.mcc}, MNC: ${network.mnc})`,
        value: `${network.mcc}-${network.mnc}`
      }));

      setNetworkOptions(networkOptions);
    } else {
      onChange({
        ...formData,
        country_code: '',
        mcc: '',
        mnc: ''
      });
      setNetworkOptions([]);
    }
  };

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
        mcc: '',
        mnc: ''
      });
    }
  };

  const handleManualChange = (field, value) => {
    onChange({
      ...formData,
      [field]: value
    });
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Queue Configuration
      </Typography>

      <Grid container spacing={2}>
        {/* Country Selection */}
        <Grid item xs={12}>
          <Autocomplete
            options={countryOptions}
            value={selectedCountry}
            onChange={handleCountryChange}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => <TextField {...params} label="Select Country" placeholder="Search for a country..." required />}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Typography variant="body2">
                  {option.name} (+{option.callingCode})
                </Typography>
              </Box>
            )}
          />
        </Grid>

        {/* Network Selection */}
        <Grid item xs={12}>
          <Autocomplete
            options={networkOptions}
            value={selectedNetwork}
            onChange={handleNetworkChange}
            getOptionLabel={(option) => option.label}
            disabled={!selectedCountry}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Network Operator"
                placeholder="Choose a network operator..."
                required
                helperText={selectedCountry ? 'Select a network operator' : 'Please select a country first'}
              />
            )}
            renderOption={(props, option) => (
              <Box component="li" {...props}>
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {option.network}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    MCC: {option.mcc} | MNC: {option.mnc}
                  </Typography>
                </Box>
              </Box>
            )}
          />
        </Grid>

        {/* Manual Override Section */}
        <Grid item xs={12}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Manual Override (Optional)
          </Typography>
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Country Code"
            value={formData.country_code}
            onChange={(e) => handleManualChange('country_code', e.target.value)}
            size="small"
            helperText="e.g., 237 for Cameroon"
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="MCC"
            value={formData.mcc}
            onChange={(e) => handleManualChange('mcc', e.target.value)}
            size="small"
            helperText="Mobile Country Code"
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="MNC"
            value={formData.mnc}
            onChange={(e) => handleManualChange('mnc', e.target.value)}
            size="small"
            helperText="Mobile Network Code"
          />
        </Grid>

        {/* Current Values Display */}
        {(formData.country_code || formData.mcc || formData.mnc) && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {formData.country_code && <Chip label={`Country: +${formData.country_code}`} size="small" color="primary" />}
              {formData.mcc && <Chip label={`MCC: ${formData.mcc}`} size="small" color="secondary" />}
              {formData.mnc && <Chip label={`MNC: ${formData.mnc}`} size="small" color="secondary" />}
            </Box>
          </Grid>
        )}
      </Grid>

      <Alert severity="info" sx={{ mt: 2 }}>
        <Typography variant="body2">
          <strong>Tip:</strong> Select a country to automatically populate available network operators, or manually enter the codes if you
          know them. You can also find MCC/MNC codes at{' '}
          <a href="https://www.mcc-mnc.com/" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit' }}>
            mcc-mnc.com
          </a>
        </Typography>
      </Alert>
    </Box>
  );
};

export default QueueCreationForm;
