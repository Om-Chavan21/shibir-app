import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import CircularProgress from '@mui/material/CircularProgress';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import Divider from '@mui/material/Divider';
import { getWorkshopById, getWorkshops, registerForWorkshop, registerWithAccount } from '../utils/api';

const steps = ['Student Information', 'Contact Details', 'Workshop Selection', 'Payment Information'];

const RegisterForm = () => {
  const { workshopId } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    studentName: '',
    schoolName: '',
    std: '',
    mobileNumber: '',
    alternateNumber: '',
    email: '',
    address: '',
    isPuneResident: true,
    referralSource: '',
    workshopId: workshopId || '',
    workshopInterest: '',
    message: '',
    agreeToTerms: false,
    paymentStatus: 'pending',
    paymentProofUrl: '',
    registrationStatus: 'pending'
  });
  
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    // If user is logged in, pre-fill some details
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        mobileNumber: user.phone || '',
      }));
    }
    
    // If workshopId is provided in URL, fetch that workshop
    if (workshopId) {
      fetchWorkshop();
    } else {
      fetchAllWorkshops();
    }
  }, [isAuthenticated, user, workshopId]);
  
  const fetchWorkshop = async () => {
    try {
      setLoading(true);
      const workshop = await getWorkshopById(workshopId);
      setWorkshops([workshop]);
      setSelectedWorkshop(workshop);
      setFormData(prev => ({
        ...prev,
        workshopId: workshop.id,
        workshopInterest: workshop.title
      }));
    } catch (error) {
      console.error("Error fetching workshop:", error);
      setSubmitError('Failed to load workshop details. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAllWorkshops = async () => {
    try {
      setLoading(true);
      const data = await getWorkshops();
      
      // Filter to only show workshops with open registration
      const today = new Date();
      const openWorkshops = data.filter(workshop => {
        const deadline = new Date(workshop.registrationDeadline);
        return today <= deadline;
      });
      
      setWorkshops(openWorkshops);
    } catch (error) {
      console.error("Error fetching workshops:", error);
      setSubmitError('Failed to load workshops. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real implementation, you would upload this to a server/storage
      // For now, we'll just store the file name
      setFormData(prev => ({
        ...prev,
        paymentProofUrl: file.name
      }));
      
      // Clear error
      if (errors.paymentProofUrl) {
        setErrors(prev => ({
          ...prev,
          paymentProofUrl: ''
        }));
      }
    }
  };

  const validateCurrentStep = () => {
    const newErrors = {};
    
    switch (activeStep) {
      case 0: // Student Information
        if (!formData.studentName.trim()) newErrors.studentName = 'Student name is required';
        if (!formData.schoolName.trim()) newErrors.schoolName = 'School name is required';
        if (!formData.std) {
          newErrors.std = 'Standard is required';
        } else {
          const stdNum = parseInt(formData.std);
          if (isNaN(stdNum) || stdNum < 8 || stdNum > 10) {
            newErrors.std = 'Standard must be between 8 and 10';
          }
        }
        break;
        
      case 1: // Contact Details
        if (!formData.mobileNumber.trim()) {
          newErrors.mobileNumber = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(formData.mobileNumber.replace(/[^0-9]/g, ''))) {
          newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
        }
        
        if (!formData.email.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          newErrors.email = 'Email is invalid';
        }
        
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.referralSource) newErrors.referralSource = 'Please select how you heard about us';
        break;
        
      case 2: // Workshop Selection
        if (!formData.workshopId) newErrors.workshopId = 'Please select a workshop';
        break;
        
      case 3: // Payment Information
        if (!formData.paymentProofUrl) newErrors.paymentProofUrl = 'Payment proof is required';
        if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to the terms';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    const isValid = validateCurrentStep();
    
    if (isValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleSubmit = async () => {
    const isValid = validateCurrentStep();
    
    if (!isValid) {
      return;
    }
    
    setSubmitting(true);
    
    try {
      let registrationResult;
      
      if (isAuthenticated) {
        registrationResult = await registerWithAccount(formData);
      } else {
        registrationResult = await registerForWorkshop(formData);
      }
      
      setSubmitSuccess(true);
      setActiveStep(steps.length); // Move to completion step
    } catch (error) {
      console.error("Registration error:", error);
      setSubmitError(error.message || 'An error occurred during registration. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="studentName"
                label="Student's Full Name"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                error={!!errors.studentName}
                helperText={errors.studentName}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="schoolName"
                label="School Name"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                error={!!errors.schoolName}
                helperText={errors.schoolName}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="std"
                label="Standard/Class (8-10)"
                name="std"
                type="number"
                inputProps={{ min: 8, max: 10 }}
                value={formData.std}
                onChange={handleChange}
                error={!!errors.std}
                helperText={errors.std || "Enter a number between 8-10"}
              />
            </Grid>
          </Grid>
        );
      
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="mobileNumber"
                label="Primary Mobile Number"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                error={!!errors.mobileNumber}
                helperText={errors.mobileNumber}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="alternateNumber"
                label="Alternate Mobile Number (Optional)"
                name="alternateNumber"
                value={formData.alternateNumber}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12}>
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
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="address"
                label="Address"
                name="address"
                multiline
                rows={3}
                value={formData.address}
                onChange={handleChange}
                error={!!errors.address}
                helperText={errors.address}
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Are you a resident of Pune?</FormLabel>
                <RadioGroup
                  name="isPuneResident"
                  value={formData.isPuneResident}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    isPuneResident: e.target.value === 'true'
                  }))}
                  row
                >
                  <FormControlLabel value={true} control={<Radio />} label="Yes" />
                  <FormControlLabel value={false} control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="referralSource"
                select
                label="How did you hear about us?"
                name="referralSource"
                value={formData.referralSource}
                onChange={handleChange}
                error={!!errors.referralSource}
                helperText={errors.referralSource}
              >
                <MenuItem value="friend">Friend or Family</MenuItem>
                <MenuItem value="school">School</MenuItem>
                <MenuItem value="newspaper">Newspaper</MenuItem>
                <MenuItem value="online">Online/Social Media</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        );
      
      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              {loading ? (
                <Box display="flex" justifyContent="center">
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  {workshopId ? (
                    <>
                      <Typography variant="h6" gutterBottom>
                        Selected Workshop:
                      </Typography>
                      {selectedWorkshop && (
                        <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                          <Typography variant="h5" gutterBottom>
                            {selectedWorkshop.title}
                          </Typography>
                          <Typography variant="body1" paragraph>
                            {selectedWorkshop.description}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Date:</strong> {selectedWorkshop.date} at {selectedWorkshop.time}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Eligibility:</strong> Standard {selectedWorkshop.eligibility?.minStd} to {selectedWorkshop.eligibility?.maxStd}
                          </Typography>
                          <Typography variant="body2">
                            <strong>Fee:</strong> ₹{selectedWorkshop.fee || 0}
                          </Typography>
                        </Paper>
                      )}
                    </>
                  ) : (
                    <>
                      <Typography variant="h6" gutterBottom>
                        Select a Workshop:
                      </Typography>
                      
                      {workshops.length === 0 ? (
                        <Alert severity="info" sx={{ mb: 2 }}>
                          No workshops are currently open for registration.
                        </Alert>
                      ) : (
                        <TextField
                          required
                          fullWidth
                          id="workshopId"
                          select
                          label="Select Workshop"
                          name="workshopId"
                          value={formData.workshopId}
                          onChange={(e) => {
                            const selected = workshops.find(w => w.id === e.target.value);
                            setSelectedWorkshop(selected);
                            setFormData(prev => ({
                              ...prev,
                              workshopId: e.target.value,
                              workshopInterest: selected ? selected.title : ''
                            }));
                          }}
                          error={!!errors.workshopId}
                          helperText={errors.workshopId}
                        >
                          {workshops.map((workshop) => (
                            <MenuItem key={workshop.id} value={workshop.id}>
                              {workshop.title} - {workshop.date}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                      
                      {selectedWorkshop && (
                        <Paper variant="outlined" sx={{ p: 3, mt: 3 }}>
                          <Typography variant="h6" gutterBottom>
                            Workshop Details:
                          </Typography>
                          <Typography variant="body1" paragraph>
                            {selectedWorkshop.description}
                          </Typography>
                          <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2">
                                <strong>Date:</strong> {selectedWorkshop.date}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Time:</strong> {selectedWorkshop.time}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Location:</strong> {selectedWorkshop.location}
                              </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Typography variant="body2">
                                <strong>Fee:</strong> ₹{selectedWorkshop.fee || 0}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Eligibility:</strong> Standard {selectedWorkshop.eligibility?.minStd}-{selectedWorkshop.eligibility?.maxStd}
                              </Typography>
                              <Typography variant="body2">
                                <strong>Registration Deadline:</strong> {new Date(selectedWorkshop.registrationDeadline).toLocaleDateString()}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Paper>
                      )}
                    </>
                  )}
                </>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="message"
                label="Additional Comments or Questions (Optional)"
                name="message"
                multiline
                rows={4}
                value={formData.message}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      
      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Workshop Fee: ₹{selectedWorkshop?.fee || 0}
              </Typography>
              
              <Alert severity="info" sx={{ mb: 3 }}>
                Please transfer the fee to the account below and upload proof of payment.
              </Alert>
              
              <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Typography variant="body1">
                  <strong>Account Name:</strong> Jnana Prabodhini
                </Typography>
                <Typography variant="body1">
                  <strong>Account Number:</strong> 123456789012
                </Typography>
                <Typography variant="body1">
                  <strong>IFSC Code:</strong> BANK0123456
                </Typography>
                <Typography variant="body1">
                  <strong>UPI ID:</strong> jnanaprabodhini@upi
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="body1" gutterBottom>
                Upload payment proof:
              </Typography>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                style={{ marginBottom: '8px' }}
              />
              {errors.paymentProofUrl && (
                <FormHelperText error>{errors.paymentProofUrl}</FormHelperText>
              )}
              <Typography variant="body2" color="text.secondary">
                Accepted formats: JPG, PNG, PDF (Max size: 2MB)
              </Typography>
            </Grid>
            
            {!isAuthenticated && (
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1" gutterBottom>
                  Want to track your registrations?
                </Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  component={RouterLink}
                  to="/auth/register"
                  sx={{ mr: 2 }}
                >
                  Create an Account
                </Button>
                <Button
                  variant="text"
                  component={RouterLink}
                  to="/auth/login"
                >
                  Login
                </Button>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
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
                  label="I agree to the terms and conditions of the workshop."
                />
                {errors.agreeToTerms && (
                  <FormHelperText>{errors.agreeToTerms}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        );
      
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ py: 8, backgroundColor: '#f9f9f9', minHeight: '80vh' }}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: { xs: 3, md: 5 }, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Workshop Registration
          </Typography>
          
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          
          {activeStep === steps.length ? (
            // Registration complete step
            <Box>
              <Typography variant="h5" align="center" gutterBottom>
                Thank you for your registration!
              </Typography>
              <Typography align="center" paragraph>
                Your registration has been submitted successfully. We will review it and get back to you soon.
              </Typography>
              {!isAuthenticated && (
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography variant="body1" paragraph>
                    Create an account to track your registration and receive updates.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    to="/auth/register"
                    sx={{ mr: 2 }}
                  >
                    Create Account
                  </Button>
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => navigate('/')}
                >
                  Return to Home
                </Button>
              </Box>
            </Box>
          ) : (
            <>
              {submitError && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setSubmitError('')}>
                  {submitError}
                </Alert>
              )}
              
              {getStepContent(activeStep)}
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={activeStep === steps.length - 1 ? handleSubmit : handleNext}
                  disabled={submitting}
                >
                  {activeStep === steps.length - 1 ? 
                    (submitting ? <CircularProgress size={24} /> : 'Submit Registration') : 
                    'Next'}
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterForm;