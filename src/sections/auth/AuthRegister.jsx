import { useEffect, useState } from 'react';
import { Link as RouterLink, useSearchParams, useNavigate } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { getCountryCallingCode } from 'libphonenumber-js';
import countries from 'i18n-iso-countries';
import enCountries from 'i18n-iso-countries/langs/en.json';

// project imports
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';
import { API_BASE_URL } from 'config';

import { strengthColor, strengthIndicator } from 'utils/password-strength';

// assets
import EyeOutlined from '@ant-design/icons/EyeOutlined';
import EyeInvisibleOutlined from '@ant-design/icons/EyeInvisibleOutlined';

// ============================|| JWT - REGISTER ||============================ //

export default function AuthRegister() {
  const [level, setLevel] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneValue, setPhoneValue] = useState();
  const [selectedCountry, setSelectedCountry] = useState('');
  const navigate = useNavigate();

  // Initialize countries
  useEffect(() => {
    countries.registerLocale(enCountries);
  }, []);

  // Get country list
  const countryList = Object.entries(countries.getNames('en'))
    .map(([code, name]) => ({
      code,
      name
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  // Function to get country code from phone number
  const getCountryFromPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';

    // Extract country code from phone number
    const match = phoneNumber.match(/^\+(\d{1,3})/);
    if (!match) return '';

    const callingCode = match[1];

    // Find country by calling code
    const country = countryList.find((country) => {
      try {
        return getCountryCallingCode(country.code) === callingCode;
      } catch (e) {
        return false;
      }
    });

    return country ? country.code : '';
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  // Handle phone number change and auto-fill country
  const handlePhoneChange = (value) => {
    setPhoneValue(value);
    const detectedCountry = getCountryFromPhoneNumber(value);
    if (detectedCountry && detectedCountry !== selectedCountry) {
      setSelectedCountry(detectedCountry);
    }
  };

  const [searchParams] = useSearchParams();
  const auth = searchParams.get('auth');

  useEffect(() => {
    changePassword('');
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          full_name: '',
          email: '',
          password: '',
          repeatPassword: '',
          country: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          full_name: Yup.string()
            .max(100, 'Name must be less than 100 characters')
            .matches(/^[a-zA-Z\s]*$/, 'Name can only contain letters and spaces'),
          email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
          password: Yup.string()
            .required('Password is required')
            .test('no-leading-trailing-whitespace', 'Password cannot start or end with spaces', (value) => value === value.trim())
            .max(64, 'Password must be less than 64 characters'),
          repeatPassword: Yup.string()
            .required('Repeat Password is required')
            .oneOf([Yup.ref('password'), null], 'Passwords must match'),
          country: Yup.string()
        })}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          setApiError('');
          setSuccessMsg('');
          setLoading(true);
          try {
            const requestData = {
              email: values.email,
              password: values.password,
              phone_number: phoneValue
            };

            // Add optional fields only if they have values
            if (values.full_name && values.full_name.trim()) {
              requestData.full_name = values.full_name.trim();
            }
            if (selectedCountry) {
              requestData.country_code = selectedCountry;
            }

            const res = await axios.post(`${API_BASE_URL}/auth/signup`, requestData);
            console.log('Register server response:', res.data);
            const sessionTokenValid =
              res.data?.session_token && (res.data?.message === 'Registration successful' || res.data?.message === 'Login successful');
            const accessTokenValid = res.data?.access_token && (res.data?.status === 'created' || res.data?.status === 'logged in');
            const signupSuccessful = res.data?.message === 'Signup successful';

            if (sessionTokenValid || accessTokenValid || signupSuccessful) {
              localStorage.setItem('isAuthenticated', 'true');
              localStorage.setItem('token', res.data.session_token || res.data.access_token || 'signup_successful');
              localStorage.setItem('email', values.email);
              setSuccessMsg('Signup successful! Redirecting...');
              resetForm();
              navigate('/dashboard');
            } else {
              setApiError(res.data?.message || 'Signup failed: Unexpected server response');
              console.error('Signup failed: Unexpected server response', res.data);
            }
          } catch (err) {
            if (err.response?.data?.message) {
              setApiError(err.response.data.message);
              console.error('Signup error:', err.response.data.message, err.response);
            } else {
              setApiError(err.message || 'Signup failed');
              console.error('Signup error:', err, err?.response);
            }
          } finally {
            setLoading(false);
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, touched, values, handleSubmit }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {apiError && (
                <Grid size={12}>
                  <FormHelperText error>{apiError}</FormHelperText>
                </Grid>
              )}
              {successMsg && (
                <Grid size={12}>
                  <FormHelperText sx={{ color: 'success.main' }}>{successMsg}</FormHelperText>
                </Grid>
              )}
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="name-signup">Name</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.full_name && errors.full_name)}
                    id="name-signup"
                    type="text"
                    value={values.full_name}
                    name="full_name"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter your name"
                  />
                </Stack>
                {touched.full_name && errors.full_name && (
                  <FormHelperText error id="helper-text-name-signup">
                    {errors.full_name}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="email-signup">Email*</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    id="email-signup"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email"
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error id="helper-text-email-signup">
                    {errors.email}
                  </FormHelperText>
                )}
              </Grid>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="phone-signup">Phone Number (Optional)</InputLabel>
                  <Box
                    sx={{
                      '& .PhoneInput': {
                        border: '1px solid #d3d4d5',
                        borderRadius: '4px',
                        padding: '8px 12px',
                        fontSize: '14px',
                        '&:focus-within': {
                          borderColor: '#1976d2',
                          borderWidth: '2px'
                        }
                      },
                      '& .PhoneInputInput': {
                        border: 'none',
                        outline: 'none',
                        fontSize: '14px',
                        marginLeft: '8px'
                      },
                      '& .PhoneInputCountrySelect': {
                        border: 'none',
                        outline: 'none',
                        marginRight: '8px'
                      }
                    }}
                  >
                    <PhoneInput
                      id="phone-signup"
                      placeholder="Enter phone number"
                      value={phoneValue}
                      onChange={handlePhoneChange}
                      defaultCountry="CM"
                      international
                      countryCallingCodeEditable={false}
                    />
                  </Box>
                </Stack>
              </Grid>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="country-signup">Country (Optional)</InputLabel>
                  <FormControl fullWidth>
                    <Select
                      id="country-signup"
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      displayEmpty
                      sx={{
                        '& .MuiSelect-select': {
                          fontSize: '14px'
                        }
                      }}
                    >
                      <MenuItem value="">
                        <em>Select a country</em>
                      </MenuItem>
                      {countryList.map((country) => (
                        <MenuItem key={country.code} value={country.code}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Typography variant="caption" color="textSecondary">
                    Auto-fills based on your phone number, but you can change it manually
                  </Typography>
                </Stack>
              </Grid>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="password-signup">Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-signup"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      changePassword(e.target.value);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="******"
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error id="helper-text-password-signup">
                    {errors.password}
                  </FormHelperText>
                )}
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid>
                      <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
                    </Grid>
                    <Grid>
                      <Typography variant="subtitle1" fontSize="0.75rem">
                        {level?.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </FormControl>
              </Grid>
              <Grid size={12}>
                <Stack sx={{ gap: 1 }}>
                  <InputLabel htmlFor="repeat-password-signup">Repeat Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.repeatPassword && errors.repeatPassword)}
                    id="repeat-password-signup"
                    type={showPassword ? 'text' : 'password'}
                    value={values.repeatPassword}
                    name="repeatPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="******"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </Stack>
                {touched.repeatPassword && errors.repeatPassword && (
                  <FormHelperText error id="helper-text-repeat-password-signup">
                    {errors.repeatPassword}
                  </FormHelperText>
                )}
              </Grid>
              {/* <Grid size={12}>
                <Typography variant="body2">
                  By Signing up, you agree to our &nbsp;
                  <Link variant="subtitle2" component={RouterLink} to="#">
                    Terms of Service
                  </Link>
                  &nbsp; and &nbsp;
                  <Link variant="subtitle2" component={RouterLink} to="#">
                    Privacy Policy
                  </Link>
                </Typography>
              </Grid> */}
              {errors.submit && (
                <Grid size={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid size={12}>
                <AnimateButton>
                  <Button fullWidth size="large" variant="contained" color="primary" type="submit" disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
}
