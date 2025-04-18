import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import { getUserRegistrations } from '../../utils/api';

const statusColors = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error'
};

const UserDashboard = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
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
          Welcome, {user?.name}!
        </Typography>
        
        <Grid container spacing={4}>
          {/* User Info Card */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Your Profile
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Name" 
                    secondary={user?.name} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Email" 
                    secondary={user?.email} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Phone" 
                    secondary={user?.phone} 
                  />
                </ListItem>
              </List>
              <Button 
                component={RouterLink} 
                to="/profile" 
                variant="outlined" 
                fullWidth
                sx={{ mt: 2 }}
              >
                Edit Profile
              </Button>
            </Paper>
          </Grid>
          
          {/* Registrations */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Your Workshop Registrations
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {error && (
                <Typography color="error">{error}</Typography>
              )}
              
              {!error && registrations.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" paragraph>
                    You haven't registered for any workshops yet.
                  </Typography>
                  <Button 
                    component={RouterLink} 
                    to="/workshops" 
                    variant="contained" 
                    color="primary"
                  >
                    Browse Workshops
                  </Button>
                </Box>
              ) : (
                <>
                  <Grid container spacing={3}>
                    {registrations.map((registration) => (
                      <Grid item xs={12} key={registration.id}>
                        <Card variant="outlined">
                          <CardContent>
                            <Grid container spacing={2}>
                              <Grid item xs={8}>
                                <Typography variant="h6">
                                  {registration.workshopInterest}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {new Date(registration.created_at).toLocaleDateString()}
                                </Typography>
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="body2">
                                    <strong>Student:</strong> {registration.studentName}
                                  </Typography>
                                  <Typography variant="body2">
                                    <strong>School:</strong> {registration.schoolName}
                                  </Typography>
                                </Box>
                              </Grid>
                              <Grid item xs={4} sx={{ textAlign: 'right' }}>
                                <Chip 
                                  label={registration.registrationStatus.toUpperCase()} 
                                  color={statusColors[registration.registrationStatus] || 'default'} 
                                  size="small"
                                  sx={{ mb: 1 }}
                                />
                                <Typography variant="body2">
                                  <strong>Payment:</strong> {registration.paymentStatus}
                                </Typography>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  
                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Button 
                      component={RouterLink} 
                      to="/my-registrations" 
                      variant="outlined"
                    >
                      View All Registrations
                    </Button>
                  </Box>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default UserDashboard;