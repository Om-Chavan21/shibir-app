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
import SchoolIcon from '@mui/icons-material/School';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
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
        <Alert severity="error">{error}</Alert>
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
          Welcome back! Here's an overview of workshop registrations and statistics.
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h6" component="div">
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
          
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <EventIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h6" component="div">
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
          
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h6" component="div">
                  Popular Workshop
                </Typography>
              </Box>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                {stats.mostPopularWorkshop}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 'auto', pt: 2 }}>
                {stats.popularWorkshopRegistrations} registrations
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'primary.dark', color: 'white' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h6" component="div">
                  Quick Actions
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button 
                  variant="contained" 
                  color="secondary" 
                  component={RouterLink} 
                  to="/admin/workshops"
                  fullWidth
                >
                  Manage Workshops
                </Button>
                <Button 
                  variant="outlined" 
                  sx={{ 
                    color: 'white', 
                    borderColor: 'white',
                    '&:hover': { 
                      borderColor: 'white', 
                      backgroundColor: 'rgba(255,255,255,0.08)' 
                    } 
                  }}
                  component={RouterLink} 
                  to="/admin/registrations"
                  fullWidth
                >
                  View Registrations
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Workshop Interest Breakdown
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                {Object.entries(stats.workshopInterestBreakdown).map(([workshop, count]) => (
                  <Box key={workshop} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ minWidth: 150, fontWeight: 'bold' }}>{workshop}:</Typography>
                    <Box sx={{ flexGrow: 1, mr: 2 }}>
                      <Box
                        sx={{
                          bgcolor: 'primary.main',
                          height: 8,
                          borderRadius: 1,
                          width: `${(count / stats.totalRegistrations) * 100}%`,
                          minWidth: 10,
                        }}
                      />
                    </Box>
                    <Typography>{count} registrations</Typography>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recent Registrations
              </Typography>
              <List>
                {stats.recentRegistrationsList.length > 0 ? (
                  stats.recentRegistrationsList.map((registration, index) => (
                    <div key={registration.id}>
                      <ListItem>
                        <ListItemText 
                          primary={registration.studentName} 
                          secondary={
                            <>
                              {registration.workshopInterest} <br />
                              {new Date(registration.created_at).toLocaleDateString()}
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
              
              <Box sx={{ mt: 2 }}>
                <Button 
                  variant="outlined" 
                  fullWidth
                  component={RouterLink}
                  to="/admin/registrations"
                >
                  View All Registrations
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboard;