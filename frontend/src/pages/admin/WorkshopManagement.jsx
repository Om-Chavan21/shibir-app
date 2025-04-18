import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Chip from '@mui/material/Chip';
import { getWorkshops, createWorkshop, updateWorkshop, deleteWorkshop } from '../../utils/api';

const WorkshopManagement = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    audience: '',
    duration: '',
    fee: '',
    registrationDeadline: '',
    eligibility: {
      minStd: 8,
      maxStd: 10
    },
    capacity: 50,
    learningOutcomes: [''],
    status: 'upcoming'
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [workshopToDelete, setWorkshopToDelete] = useState(null);
  
  useEffect(() => {
    fetchWorkshops();
  }, []);
  
  const fetchWorkshops = async () => {
    try {
      setLoading(true);
      const data = await getWorkshops();
      setWorkshops(data);
    } catch (err) {
      console.error("Error fetching workshops:", err);
      setError('Failed to load workshops. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleOpenDialog = (mode, workshop = null) => {
    setDialogMode(mode);
    setFormErrors({});
    
    if (mode === 'edit' && workshop) {
      setSelectedWorkshop(workshop);
      setFormData({
        ...workshop,
        fee: workshop.fee?.toString() || '',
        eligibility: workshop.eligibility || { minStd: 8, maxStd: 10 },
        capacity: workshop.capacity || 50,
        learningOutcomes: workshop.learningOutcomes || ['']
      });
    } else {
      setSelectedWorkshop(null);
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        audience: '',
        duration: '',
        fee: '',
        registrationDeadline: '',
        eligibility: {
          minStd: 8,
          maxStd: 10
        },
        capacity: 50,
        learningOutcomes: [''],
        status: 'upcoming'
      });
    }
    
    setOpenDialog(true);
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedWorkshop(null);
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  const handleEligibilityChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      eligibility: {
        ...formData.eligibility,
        [name]: parseInt(value)
      }
    });
  };
  
  const handleLearningOutcomeChange = (index, value) => {
    const updatedOutcomes = [...formData.learningOutcomes];
    updatedOutcomes[index] = value;
    
    setFormData({
      ...formData,
      learningOutcomes: updatedOutcomes
    });
  };
  
  const addLearningOutcome = () => {
    setFormData({
      ...formData,
      learningOutcomes: [...formData.learningOutcomes, '']
    });
  };
  
  const removeLearningOutcome = (indexToRemove) => {
    if (formData.learningOutcomes.length > 1) {
      setFormData({
        ...formData,
        learningOutcomes: formData.learningOutcomes.filter((_, index) => index !== indexToRemove)
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.time) errors.time = 'Time is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.audience.trim()) errors.audience = 'Target audience is required';
    if (!formData.duration.trim()) errors.duration = 'Duration is required';
    if (!formData.registrationDeadline) errors.registrationDeadline = 'Registration deadline is required';
    
    if (formData.eligibility.minStd > formData.eligibility.maxStd) {
      errors.eligibility = 'Minimum standard cannot be greater than maximum standard';
    }
    
    // Check if all learning outcomes are filled
    const emptyOutcomes = formData.learningOutcomes.some(outcome => !outcome.trim());
    if (emptyOutcomes) {
      errors.learningOutcomes = 'All learning outcomes must be filled';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      // Format data
      const workshopData = {
        ...formData,
        fee: formData.fee ? parseFloat(formData.fee) : 0,
        capacity: parseInt(formData.capacity)
      };
      
      if (dialogMode === 'add') {
        await createWorkshop(workshopData);
        setSuccess('Workshop created successfully!');
      } else {
        await updateWorkshop(selectedWorkshop.id, workshopData);
        setSuccess('Workshop updated successfully!');
      }
      
      fetchWorkshops();
      handleCloseDialog();
    } catch (err) {
      console.error("Error saving workshop:", err);
      setError(`Failed to ${dialogMode === 'add' ? 'create' : 'update'} workshop: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleOpenDeleteDialog = (workshop) => {
    setWorkshopToDelete(workshop);
    setDeleteDialogOpen(true);
  };
  
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setWorkshopToDelete(null);
  };
  
  const handleDeleteWorkshop = async () => {
    if (!workshopToDelete) return;
    
    setIsSubmitting(true);
    
    try {
      await deleteWorkshop(workshopToDelete.id);
      setSuccess('Workshop deleted successfully!');
      fetchWorkshops();
      handleCloseDeleteDialog();
    } catch (err) {
      console.error("Error deleting workshop:", err);
      setError(`Failed to delete workshop: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'primary';
      case 'ongoing':
        return 'secondary';
      case 'completed':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ py: 8, backgroundColor: '#f9f9f9', minHeight: '80vh' }}>
      <Container>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1">
            Workshop Management
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => handleOpenDialog('add')}
          >
            Add Workshop
          </Button>
        </Box>
        
        {success && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : workshops.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" paragraph>
              No workshops found
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={() => handleOpenDialog('add')}
            >
              Create Your First Workshop
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {workshops.map((workshop) => (
              <Grid item xs={12} md={6} key={workshop.id}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Typography variant="h6" gutterBottom>
                        {workshop.title}
                      </Typography>
                      <Chip 
                        label={workshop.status} 
                        color={getStatusColor(workshop.status)} 
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {new Date(workshop.date).toLocaleDateString()} at {workshop.time}
                    </Typography>
                    
                    <Typography variant="body2" noWrap paragraph>
                      {workshop.description}
                    </Typography>
                    
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2">
                        <strong>Location:</strong> {workshop.location}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Fee:</strong> ₹{workshop.fee || 0}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Capacity:</strong> {workshop.capacity || 'Unlimited'}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Eligibility:</strong> Std {workshop.eligibility?.minStd}-{workshop.eligibility?.maxStd}
                      </Typography>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenDialog('edit', workshop)}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleOpenDeleteDialog(workshop)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        
        {/* Workshop Form Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>
            {dialogMode === 'add' ? 'Create New Workshop' : 'Edit Workshop'}
          </DialogTitle>
          <DialogContent dividers>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="Workshop Title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    error={!!formErrors.title}
                    helperText={formErrors.title}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    error={!!formErrors.description}
                    helperText={formErrors.description}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    error={!!formErrors.date}
                    helperText={formErrors.date}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    error={!!formErrors.time}
                    helperText={formErrors.time}
                    placeholder="e.g., 10:00 AM - 1:00 PM"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Registration Deadline"
                    name="registrationDeadline"
                    type="date"
                    value={formData.registrationDeadline}
                    onChange={handleInputChange}
                    error={!!formErrors.registrationDeadline}
                    helperText={formErrors.registrationDeadline}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    error={!!formErrors.location}
                    helperText={formErrors.location}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Target Audience"
                    name="audience"
                    value={formData.audience}
                    onChange={handleInputChange}
                    error={!!formErrors.audience}
                    helperText={formErrors.audience}
                    placeholder="e.g., Ages 12-15"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    label="Duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    error={!!formErrors.duration}
                    helperText={formErrors.duration}
                    placeholder="e.g., 3 hours"
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Fee (₹)"
                    name="fee"
                    type="number"
                    value={formData.fee}
                    onChange={handleInputChange}
                    inputProps={{ min: 0 }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Capacity"
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    inputProps={{ min: 1 }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <FormLabel>Status</FormLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      displayEmpty
                    >
                      <MenuItem value="upcoming">Upcoming</MenuItem>
                      <MenuItem value="ongoing">Ongoing</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Eligibility
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Minimum Standard"
                        name="minStd"
                        type="number"
                        value={formData.eligibility.minStd}
                        onChange={handleEligibilityChange}
                        inputProps={{ min: 1, max: 12 }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label="Maximum Standard"
                        name="maxStd"
                        type="number"
                        value={formData.eligibility.maxStd}
                        onChange={handleEligibilityChange}
                        inputProps={{ min: 1, max: 12 }}
                      />
                    </Grid>
                  </Grid>
                  {formErrors.eligibility && (
                    <FormControl error>
                      <FormLabel>{formErrors.eligibility}</FormLabel>
                    </FormControl>
                  )}
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    Learning Outcomes
                    <IconButton 
                      size="small" 
                      color="primary" 
                      onClick={addLearningOutcome}
                      sx={{ ml: 1 }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Typography>
                  
                  {formData.learningOutcomes.map((outcome, index) => (
                    <Box key={index} sx={{ display: 'flex', mb: 2, alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        label={`Outcome ${index + 1}`}
                        value={outcome}
                        onChange={(e) => handleLearningOutcomeChange(index, e.target.value)}
                        margin="dense"
                      />
                      <IconButton 
                        color="error" 
                        onClick={() => removeLearningOutcome(index)}
                        disabled={formData.learningOutcomes.length <= 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  ))}
                  
                  {formErrors.learningOutcomes && (
                    <FormControl error fullWidth sx={{ mt: -1 }}>
                      <FormLabel>{formErrors.learningOutcomes}</FormLabel>
                    </FormControl>
                  )}
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : dialogMode === 'add' ? 'Create' : 'Update'}
            </Button>
          </DialogActions>
        </Dialog>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the workshop "{workshopToDelete?.title}"? This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
            <Button 
              onClick={handleDeleteWorkshop} 
              color="error" 
              variant="contained"
              disabled={isSubmitting}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Delete'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default WorkshopManagement;