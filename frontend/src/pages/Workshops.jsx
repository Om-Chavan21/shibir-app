import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Divider from '@mui/material/Divider';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { getWorkshops } from '../utils/api';

const Workshops = () => {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const data = await getWorkshops();
        setWorkshops(data);
      } catch (error) {
        console.error("Error fetching workshops:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkshops();
  }, []);

  if (loading) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography>Loading workshops...</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 8, backgroundColor: '#f9f9f9', minHeight: '80vh' }}>
      <Container>
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          Our Science Workshops
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
          Explore our upcoming workshops and choose the ones that spark your interest.
          Each workshop is designed to deliver an engaging, hands-on experience.
        </Typography>

        <Grid container spacing={4}>
          {workshops.map((workshop) => (
            <Grid item xs={12} key={workshop.id}>
              <Card sx={{ overflow: 'hidden' }}>
                <Grid container>
                  <Grid item xs={12} md={4} sx={{ 
                    backgroundColor: 'primary.main', 
                    color: 'white',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    p: 3,
                    textAlign: 'center'
                  }}>
                    <Typography variant="h4" component="h2" gutterBottom>
                      {workshop.title}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      {new Date(workshop.date).toLocaleDateString()}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 1 }}>
                      <AccessTimeIcon sx={{ mr: 1 }} />
                      <Typography>{workshop.time}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <LocationOnIcon sx={{ mr: 1 }} />
                      <Typography>{workshop.location}</Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={8}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="body1" paragraph>
                        {workshop.description}
                      </Typography>
                      <Divider sx={{ my: 2 }} />
                      
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="body2">
                              <strong>Audience:</strong> {workshop.audience}
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="body2">
                              <strong>Duration:</strong> {workshop.duration}
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <AttachMoneyIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="body2">
                              <strong>Fee:</strong> {workshop.fee ? `$${workshop.fee}` : 'Free'}
                            </Typography>
                          </Box>
                        </Grid>
                        
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
                            <Typography variant="body2">
                              <strong>Registration Deadline:</strong> {new Date(workshop.registrationDeadline).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      
                      <Typography variant="body1" sx={{ mt: 2 }}>
                        <strong>What You Will Learn:</strong>
                      </Typography>
                      <ul>
                        {workshop.learningOutcomes.map((outcome, index) => (
                          <li key={index}>{outcome}</li>
                        ))}
                      </ul>
                    </CardContent>
                    
                    <CardActions sx={{ px: 3, pb: 3 }}>
                      <Button 
                        variant="contained" 
                        color="primary"
                        component={RouterLink}
                        to="/register"
                      >
                        Register Now
                      </Button>
                    </CardActions>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="h4" gutterBottom>
            Interested in our workshops?
          </Typography>
          <Typography variant="body1" paragraph sx={{ maxWidth: 600, mx: 'auto' }}>
            Sign up to receive updates about upcoming workshops and special events.
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            component={RouterLink}
            to="/register"
          >
            Register for Updates
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Workshops;