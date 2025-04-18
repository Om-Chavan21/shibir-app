import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { getUserRegistrations } from '../../utils/api';

const statusColors = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error'
};

const paymentStatusColors = {
  pending: 'warning',
  completed: 'success',
  failed: 'error'
};

const UserRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Dialog for viewing registration details
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const data = await getUserRegistrations();
        setRegistrations(data);
      } catch (err) {
        console.error("Error fetching registrations:", err);
        setError('Failed to load your registrations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRegistrations();
  }, []);
  
  const handleOpenDetails = (registration) => {
    setSelectedRegistration(registration);
    setDetailsDialogOpen(true);
  };
  
  const handleCloseDetails = () => {
    setDetailsDialogOpen(false);
    setSelectedRegistration(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 8, backgroundColor: '#f9f9f9', minHeight: '80vh' }}>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Your Workshop Registrations
        </Typography>
        <Typography variant="body1" paragraph>
          View all your workshop registration history and status.
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}
        
        {!error && registrations.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" paragraph>
              You haven't registered for any workshops yet.
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              href="/workshops"
            >
              Browse Available Workshops
            </Button>
          </Paper>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Workshop</TableCell>
                  <TableCell>Registration Date</TableCell>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Payment</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {registrations.map((registration) => (
                  <TableRow key={registration.id} hover>
                    <TableCell>{registration.workshopInterest}</TableCell>
                    <TableCell>
                      {new Date(registration.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{registration.studentName}</TableCell>
                    <TableCell>
                      <Chip 
                        label={registration.registrationStatus.toUpperCase()} 
                        color={statusColors[registration.registrationStatus] || 'default'} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={registration.paymentStatus.toUpperCase()} 
                        color={paymentStatusColors[registration.paymentStatus] || 'default'} 
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button 
                        size="small" 
                        variant="outlined"
                        onClick={() => handleOpenDetails(registration)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
        
        {/* Registration Details Dialog */}
        <Dialog 
          open={detailsDialogOpen} 
          onClose={handleCloseDetails}
          maxWidth="md"
          fullWidth
        >
          {selectedRegistration && (
            <>
              <DialogTitle>
                Registration Details
              </DialogTitle>
              <DialogContent dividers>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Workshop Information
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                      <Typography variant="subtitle1" gutterBottom>
                        {selectedRegistration.workshopInterest}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Registration Date:</strong> {new Date(selectedRegistration.created_at).toLocaleDateString()}
                      </Typography>
                      {selectedRegistration.message && (
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="body2">
                            <strong>Additional Notes:</strong>
                          </Typography>
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {selectedRegistration.message}
                          </Typography>
                        </Box>
                      )}
                    </Paper>
                    
                    <Typography variant="h6" gutterBottom>
                      Status Information
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="body1">
                          Registration Status:
                        </Typography>
                        <Chip 
                          label={selectedRegistration.registrationStatus.toUpperCase()} 
                          color={statusColors[selectedRegistration.registrationStatus] || 'default'} 
                        />
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body1">
                          Payment Status:
                        </Typography>
                        <Chip 
                          label={selectedRegistration.paymentStatus.toUpperCase()} 
                          color={paymentStatusColors[selectedRegistration.paymentStatus] || 'default'} 
                        />
                      </Box>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" gutterBottom>
                      Student Information
                    </Typography>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        <strong>Name:</strong> {selectedRegistration.studentName}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>School:</strong> {selectedRegistration.schoolName}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Class/Standard:</strong> {selectedRegistration.std}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="body2" gutterBottom>
                        <strong>Phone:</strong> {selectedRegistration.mobileNumber}
                      </Typography>
                      {selectedRegistration.alternateNumber && (
                        <Typography variant="body2" gutterBottom>
                          <strong>Alternate Phone:</strong> {selectedRegistration.alternateNumber}
                        </Typography>
                      )}
                      <Typography variant="body2" gutterBottom>
                        <strong>Email:</strong> {selectedRegistration.email}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Address:</strong> {selectedRegistration.address}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Pune Resident:</strong> {selectedRegistration.isPuneResident ? 'Yes' : 'No'}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDetails}>Close</Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default UserRegistrations;