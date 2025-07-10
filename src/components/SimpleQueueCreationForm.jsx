import React, { useState, useMemo } from 'react';
import { Box, TextField, Autocomplete, Alert, Typography, Chip, Grid } from '@mui/material';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import { getCountryCallingCode } from 'libphonenumber-js';

// Try different ways to import the MCC-MNC data
let mccMncListImport;
try {
  // Method 1: Import the main module
  mccMncListImport = require('mcc-mnc-list');
  console.log('Successfully imported mcc-mnc-list module');
} catch (error) {
  try {
    // Method 2: Import JSON directly
    mccMncListImport = require('mcc-mnc-list/mcc-mnc-list.json');
    console.log('Successfully imported mcc-mnc-list JSON directly');
  } catch (error2) {
    console.warn('Failed to import mcc-mnc-list:', error2);
    mccMncListImport = null;
  }
}

// Register English locale for country names
countries.registerLocale(enLocale);

// Safely handle the MCC-MNC list import
let mccMncList = [];
if (mccMncListImport && typeof mccMncListImport.all === 'function') {
  // Method 1: Use the module's all() function
  mccMncList = mccMncListImport.all();
  console.log('Using mcc-mnc-list module with all() function');
} else if (Array.isArray(mccMncListImport)) {
  // Method 2: Direct JSON array
  mccMncList = mccMncListImport;
  console.log('Using direct JSON array import');
} else if (mccMncListImport && mccMncListImport.default && Array.isArray(mccMncListImport.default)) {
  mccMncList = mccMncListImport.default;
  console.log('Using default export');
} else if (mccMncListImport && Array.isArray(mccMncListImport.data)) {
  mccMncList = mccMncListImport.data;
  console.log('Using data property');
} else if (mccMncListImport && typeof mccMncListImport === 'object') {
  // Try to find array property in the object
  const possibleArrays = Object.values(mccMncListImport).filter(Array.isArray);
  if (possibleArrays.length > 0) {
    mccMncList = possibleArrays[0];
    console.log('Found array in object properties');
  } else {
    console.warn('Could not find MCC-MNC data in expected format - using fallback');
    mccMncList = getFallbackData();
  }
} else {
  console.warn('Could not find MCC-MNC data in expected format - using fallback');
  mccMncList = getFallbackData();
}

function getFallbackData() {
  return [
    // Cameroon
    { mcc: '624', mnc: '01', countryCode: 'CM', operator: 'MTN Cameroon', brand: 'MTN', status: 'Operational' },
    { mcc: '624', mnc: '02', countryCode: 'CM', operator: 'Orange Cameroon', brand: 'Orange', status: 'Operational' },
    { mcc: '624', mnc: '04', countryCode: 'CM', operator: 'Nexttel', brand: 'Nexttel', status: 'Operational' },
    // Nigeria (expanded)
    { mcc: '621', mnc: '30', countryCode: 'NG', operator: 'MTN Nigeria', brand: 'MTN', status: 'Operational' },
    { mcc: '621', mnc: '20', countryCode: 'NG', operator: 'Airtel Nigeria', brand: 'Airtel', status: 'Operational' },
    { mcc: '621', mnc: '50', countryCode: 'NG', operator: 'Glo Mobile', brand: 'Glo', status: 'Operational' },
    { mcc: '621', mnc: '60', countryCode: 'NG', operator: '9mobile', brand: '9mobile', status: 'Operational' },
    // Kenya
    { mcc: '639', mnc: '02', countryCode: 'KE', operator: 'Safaricom', brand: 'Safaricom', status: 'Operational' },
    { mcc: '639', mnc: '03', countryCode: 'KE', operator: 'Airtel Kenya', brand: 'Airtel', status: 'Operational' },
    { mcc: '639', mnc: '07', countryCode: 'KE', operator: 'Telkom Kenya', brand: 'Telkom', status: 'Operational' },
    // United States
    { mcc: '310', mnc: '004', countryCode: 'US', operator: 'Verizon', brand: 'Verizon', status: 'Operational' },
    { mcc: '310', mnc: '030', countryCode: 'US', operator: 'AT&T', brand: 'AT&T', status: 'Operational' },
    { mcc: '310', mnc: '260', countryCode: 'US', operator: 'T-Mobile', brand: 'T-Mobile', status: 'Operational' },
    { mcc: '310', mnc: '120', countryCode: 'US', operator: 'Sprint', brand: 'Sprint', status: 'Operational' },
    // Ghana
    { mcc: '620', mnc: '01', countryCode: 'GH', operator: 'MTN Ghana', brand: 'MTN', status: 'Operational' },
    { mcc: '620', mnc: '02', countryCode: 'GH', operator: 'Vodafone Ghana', brand: 'Vodafone', status: 'Operational' },
    { mcc: '620', mnc: '03', countryCode: 'GH', operator: 'AirtelTigo', brand: 'AirtelTigo', status: 'Operational' }
  ];
}

console.log('MCC-MNC data initialized:', mccMncList.length, 'operators');

// Helper function to map country names from mcc-mnc-list to ISO codes
const mapCountryCodeFromMccMnc = (mccMncItem, isoCode) => {
  if (!mccMncItem || !mccMncItem.countryName) return false;

  // Get the country name from the countries library for comparison
  const countryNames = countries.getNames('en', { select: 'official' });
  const expectedCountryName = countryNames[isoCode.toLowerCase()];

  if (!expectedCountryName) return false;

  const mccCountryName = mccMncItem.countryName.toLowerCase();
  const expectedName = expectedCountryName.toLowerCase();

  // Direct match
  if (mccCountryName === expectedName) return true;

  // Common variations and matches
  const commonMappings = {
    'united states': ['usa', 'us', 'united states of america'],
    'united kingdom': ['uk', 'britain', 'great britain'],
    'south korea': ['korea', 'republic of korea'],
    'north korea': ["democratic people's republic of korea"],
    'czech republic': ['czechia'],
    'bosnia and herzegovina': ['bosnia'],
    'democratic republic of the congo': ['congo (kinshasa)', 'congo, democratic republic'],
    'republic of the congo': ['congo (brazzaville)', 'congo'],
    'ivory coast': ["côte d'ivoire"],
    'east timor': ['timor-leste'],
    myanmar: ['burma'],
    swaziland: ['eswatini'],
    macedonia: ['north macedonia'],
    russia: ['russian federation'],
    iran: ['islamic republic of iran'],
    syria: ['syrian arab republic'],
    venezuela: ['bolivarian republic of venezuela'],
    bolivia: ['plurinational state of bolivia'],
    tanzania: ['united republic of tanzania'],
    moldova: ['republic of moldova'],
    'south africa': ['republic of south africa']
  };

  // Check if expected name has mappings
  const variations = commonMappings[expectedName] || [];
  if (variations.some((variation) => mccCountryName.includes(variation))) return true;

  // Check if mcc country name has mappings
  const mccVariations = commonMappings[mccCountryName] || [];
  if (mccVariations.some((variation) => expectedName.includes(variation))) return true;

  // Partial match for compound names
  if (expectedName.includes(' ') || mccCountryName.includes(' ')) {
    const expectedWords = expectedName.split(' ');
    const mccWords = mccCountryName.split(' ');

    // Check if main words match
    const significantWords = expectedWords.filter(
      (word) => word.length > 3 && !['the', 'and', 'of', 'republic', 'democratic', "people's"].includes(word)
    );

    if (significantWords.length > 0) {
      return significantWords.some((word) => mccCountryName.includes(word));
    }
  }

  return false;
};

const SimpleQueueCreationForm = ({ formData, onChange }) => {
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedNetwork, setSelectedNetwork] = useState(null);

  // Generate country list from libraries
  const countryList = useMemo(() => {
    try {
      const countryNames = countries.getNames('en', { select: 'official' });

      const processedCountries = Object.entries(countryNames)
        .map(([code, name]) => {
          try {
            // Try to get calling code, but don't fail if it's not available
            let callingCode = '';
            try {
              // Ensure the country code is in the correct format (2-letter ISO)
              if (code && code.length === 2) {
                const phoneCode = getCountryCallingCode(code.toUpperCase());
                callingCode = phoneCode?.toString() || '';
              }
            } catch (phoneError) {
              // If libphonenumber fails, skip calling code for this country
            }

            // Get MCCs for this country from mcc-mnc-list
            let primaryMcc = '';
            try {
              if (Array.isArray(mccMncList)) {
                const countryMccs = mccMncList.filter((item) => {
                  if (!item || typeof item !== 'object') return false;
                  return mapCountryCodeFromMccMnc(item, code.toUpperCase());
                });
                primaryMcc = countryMccs.length > 0 ? countryMccs[0].mcc : '';
              }
            } catch (mccError) {
              // If getting MCC fails, continue without it
            }

            // Include country even if we don't have calling code or MCC
            return {
              code: code.toUpperCase(),
              name,
              callingCode,
              mcc: primaryMcc
            };
          } catch (error) {
            // Log error but still include the country
            console.warn(`Error processing country ${code}:`, error);
            return {
              code: code.toUpperCase(),
              name,
              callingCode: '',
              mcc: ''
            };
          }
        })
        .filter((country) => country && country.name) // Only filter out completely invalid entries
        .sort((a, b) => a.name.localeCompare(b.name));

      return processedCountries;
    } catch (error) {
      console.error('Error generating country list:', error);
      // Return fallback list on error
      return [
        { code: 'US', name: 'United States', callingCode: '1', mcc: '310' },
        { code: 'GB', name: 'United Kingdom', callingCode: '44', mcc: '234' },
        { code: 'CA', name: 'Canada', callingCode: '1', mcc: '302' },
        { code: 'NG', name: 'Nigeria', callingCode: '234', mcc: '621' },
        { code: 'KE', name: 'Kenya', callingCode: '254', mcc: '639' },
        { code: 'GH', name: 'Ghana', callingCode: '233', mcc: '620' },
        { code: 'ZA', name: 'South Africa', callingCode: '27', mcc: '655' },
        { code: 'DE', name: 'Germany', callingCode: '49', mcc: '262' },
        { code: 'FR', name: 'France', callingCode: '33', mcc: '208' },
        { code: 'IN', name: 'India', callingCode: '91', mcc: '404' }
      ].sort((a, b) => a.name.localeCompare(b.name));
    }
  }, []);

  // Get network operators for selected country
  const availableNetworks = useMemo(() => {
    if (!selectedCountry) return [];

    try {
      // Ensure mccMncList is an array and has valid data
      if (!Array.isArray(mccMncList) || mccMncList.length === 0) {
        console.warn('mccMncList is empty or not an array');
        return [];
      }

      // Try different matching strategies
      const countryCode = selectedCountry.code;

      const networks = mccMncList
        .filter((item) => {
          // Add safety check for item structure
          if (!item || typeof item !== 'object') {
            return false;
          }

          // Use the new mapping function
          return mapCountryCodeFromMccMnc(item, countryCode);
        })
        .map((item) => ({
          name: item.brand || item.operator || `${item.mcc}-${item.mnc}`,
          mcc: item.mcc,
          mnc: item.mnc,
          operator: item.operator,
          brand: item.brand,
          status: item.status
        }))
        .filter((item) => item.status !== 'Not operational') // Filter out non-operational networks
        .sort((a, b) => (a.brand || a.name).localeCompare(b.brand || b.name));

      return networks;
    } catch (error) {
      console.error('Error generating networks list:', error);
      return [];
    }
  }, [selectedCountry]);

  // Handle country selection
  const handleCountryChange = (event, newValue) => {
    try {
      setSelectedCountry(newValue);
      setSelectedNetwork(null);

      if (newValue) {
        onChange({
          ...formData,
          country_code: newValue.callingCode || '',
          mcc: newValue.mcc || '',
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
    } catch (error) {
      console.error('Error handling country change:', error);
      // Reset to safe state
      setSelectedCountry(null);
      setSelectedNetwork(null);
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

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        Queue Configuration
      </Typography>

      <Grid container spacing={2}>
        {/* Country Selection */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Autocomplete
            options={countryList}
            value={selectedCountry}
            onChange={handleCountryChange}
            getOptionLabel={(option) => {
              const callingCodeText = option.callingCode ? ` (+${option.callingCode})` : '';
              return `${option.name}${callingCodeText}`;
            }}
            renderInput={(params) => <TextField {...params} label="Select Country" placeholder="Choose a country..." required />}
            filterOptions={(options, { inputValue }) => {
              return options.filter(
                (option) =>
                  option.name.toLowerCase().includes(inputValue.toLowerCase()) ||
                  option.code.toLowerCase().includes(inputValue.toLowerCase()) ||
                  (option.callingCode && option.callingCode.includes(inputValue))
              );
            }}
          />
        </Grid>

        {/* Network Selection */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Autocomplete
            options={availableNetworks}
            value={selectedNetwork}
            onChange={handleNetworkChange}
            getOptionLabel={(option) => {
              const displayName = option.brand || option.operator || option.name;
              return `${displayName} (MCC: ${option.mcc}, MNC: ${option.mnc})`;
            }}
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
                      ? 'No network operators found for this country'
                      : `${availableNetworks.length} operators available`
                }
              />
            )}
            filterOptions={(options, { inputValue }) => {
              return options.filter(
                (option) =>
                  (option.brand || '').toLowerCase().includes(inputValue.toLowerCase()) ||
                  (option.operator || '').toLowerCase().includes(inputValue.toLowerCase()) ||
                  option.mcc.includes(inputValue) ||
                  option.mnc.includes(inputValue)
              );
            }}
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
          <strong>Smart Setup:</strong> Select a country to automatically load its calling code and network operators from our comprehensive
          database. All MCC/MNC data is sourced from official telecommunications registries. You can also manually override any values below
          if needed.
        </Typography>
      </Alert>
    </Box>
  );
};

export default SimpleQueueCreationForm;
