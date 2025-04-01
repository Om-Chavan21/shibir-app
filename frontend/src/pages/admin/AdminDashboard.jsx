import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CircularProgress from '@mui/material/CircularProgress';
import { getAdminDashboardStats } from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getAdminDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography color="error" align="center">{error}</Typography>
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Button variant="contained" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 4, backgroundColor: '#f9f9f9', minHeight: '80vh' }}>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          Welcome back! Here's an overview of your workshop registrations and statistics.
        </Typography>
        
        <Grid container spacing={4} sx={{ mb: 4, mt: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5" component="div">
                  Total Registrations
                </Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                {stats.totalRegistrations}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 'auto', pt: 2 }}>
                {stats.recentRegistrations} new in the last 7 days
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EventIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5" component="div">
                  Upcoming Workshops
                </Typography>
              </Box>
              <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                {stats.upcomingWorkshops.length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 'auto', pt: 2 }}>
                Next workshop: {stats.nextWorkshopDate}
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h5" component="div">
                  Popular Workshop
                </Typography>
              </Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                {stats.mostPopularWorkshop}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 'auto', pt: 2 }}>
                {stats.popularWorkshopRegistrations} registrations
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Registrations
                </Typography>
                <List>
                  {stats.recentRegistrationsList.length > 0 ? (
                    stats.recentRegistrationsList.map((registration, index) => (
                      <div key={registration.id}>
                        <ListItem>
                          <ListItemText 
                            primary={registration.name} 
                            secondary={
                              <>
                                {registration.email} • {new Date(registration.registrationDate).toLocaleDateString()}
                                <br />
                                Interest: {registration.workshopInterest}
                              </>
                            } 
                          />
                        </ListItem>
                        {index < stats.recentRegistrationsList.length - 1 && <Divider />}
                      </div>
                    ))
                  ) : (
                    <ListItem>
                      <ListItemText primary="No recent registrations" />
                    </ListItem>
                  )}
                </List>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Workshop Interest Breakdown
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {Object.entries(stats.workshopInterestBreakdown).map(([workshop, count]) => (
                    <Box key={workshop} sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography sx={{ minWidth: 150 }}>{workshop}:</Typography>
                      <Box
                        sx={{
                          flexGrow: 1,
                          bgcolor: 'primary.light',
                          height: 24,
                          borderRadius: 1,
                          position: 'relative',
                        }}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            bgcolor: 'primary.main',
                            width: `${(count / stats.totalRegistrations) * 100}%`,
                            borderRadius: 1,
                          }}
                        />
                      </Box>
                      <Typography sx={{ ml: 2, minWidth: 30 }}>{count}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            color="primary"
            size="large"
            component={RouterLink}
            to="/admin/registrations"
            sx={{ mx: 1 }}
          >
            View All Registrations
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminDashboard;