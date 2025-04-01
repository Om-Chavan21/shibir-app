import { useState } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import Paper from '@mui/material/Paper';
import { registerForWorkshop } from '../utils/api';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    workshopInterest: '',
    message: '',
    agreeToTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.age) newErrors.age = 'Age group is required';
    if (!formData.workshopInterest) newErrors.workshopInterest = 'Please select your interest';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setSubmitting(true);
    
    try {
      await registerForWorkshop(formData);
      setSubmitSuccess(true);
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        age: '',
        workshopInterest: '',
        message: '',
        agreeToTerms: false
      });
    } catch (error) {
      console.error("Registration error:", error);
      setSubmitError(error.message || 'An error occurred during registration. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSubmitSuccess(false);
    setSubmitError('');
  };

  return (
    <Box sx={{ py: 8, backgroundColor: '#f9f9f9', minHeight: '80vh' }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 2 }}>
          <Typography variant="h3" component="h1" align="center" gutterBottom>
            Register for Workshops
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 4 }}>
            Fill out this form to register your interest in our upcoming science workshops.
            We'll send you updates and registration information.
          </Typography>
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="phone"
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={!!errors.phone}
                  helperText={errors.phone}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="age"
                  select
                  label="Age Group"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  error={!!errors.age}
                  helperText={errors.age || 'Please select your age group'}
                >
                  <MenuItem value="under12">Under 12 years</MenuItem>
                  <MenuItem value="12-17">12-17 years</MenuItem>
                  <MenuItem value="18-25">18-25 years</MenuItem>
                  <MenuItem value="26-40">26-40 years</MenuItem>
                  <MenuItem value="over40">Over 40 years</MenuItem>
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="workshopInterest"
                  select
                  label="Workshop Interest"
                  name="workshopInterest"
                  value={formData.workshopInterest}
                  onChange={handleChange}
                  error={!!errors.workshopInterest}
                  helperText={errors.workshopInterest || 'Which workshop are you interested in?'}
                >
                  <MenuItem value="astronomy">Astronomy and Space Exploration</MenuItem>
                  <MenuItem value="chemistry">Chemistry Lab Experience</MenuItem>
                  <MenuItem value="both">Both Workshops</MenuItem>
                  <MenuItem value="undecided">Undecided / Need more information</MenuItem>
                </TextField>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="message"
                  label="Additional Comments or Questions"
                  name="message"
                  multiline
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl error={!!errors.agreeToTerms} required>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="agreeToTerms"
                        color="primary"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                      />
                    }
                    label="I agree to receive emails about workshop updates and related events."
                  />
                  {errors.agreeToTerms && (
                    <FormHelperText>{errors.agreeToTerms}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={submitting}
                  sx={{ py: 1.5 }}
                >
                  {submitting ? 'Submitting...' : 'Register Now'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
        
        <Snackbar open={!!submitSuccess} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            Registration successful! We'll send you updates about the workshops.
          </Alert>
        </Snackbar>
        
        <Snackbar open={!!submitError} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {submitError}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default RegisterForm;