import { useEffect, useState } from 'react';
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
import SchoolIcon from '@mui/icons-material/School';
import ScienceIcon from '@mui/icons-material/Science';
import EventIcon from '@mui/icons-material/Event';
import { getWorkshops } from '../utils/api';
import heroBg from '../assets/hero-bg.png';

const Home = () => {
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

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          backgroundImage: `url(${heroBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          height: '60vh',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Box sx={{ maxWidth: 600, color: 'white', textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
              Discover the Wonder of Science
            </Typography>
            <Typography variant="h5" sx={{ mb: 4 }}>
              Join our immersive science workshops and ignite your curiosity
            </Typography>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large"
              component={RouterLink}
              to="/register"
            >
              Register Now
            </Button>
          </Box>
        </Container>
      </Box>
      
      {/* Intro Section */}
      <Box sx={{ py: 8, backgroundColor: '#f9f9f9' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h2" gutterBottom>
              Upcoming Science Workshops
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 800, mx: 'auto' }}>
              Our interactive workshops are designed to inspire curiosity, critical thinking, 
              and a love for scientific discovery in participants of all ages.
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            {loading ? (
              <Typography variant="body1" sx={{ mx: 'auto', my: 4 }}>
                Loading workshops...
              </Typography>
            ) : (
              workshops.map((workshop) => (
                <Grid item xs={12} md={6} key={workshop.id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="h3" gutterBottom>
                        {workshop.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <EventIcon sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2">
                          {new Date(workshop.date).toLocaleDateString()} at {workshop.time}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="body1" paragraph>
                        {workshop.description}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Audience:</strong> {workshop.audience}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Duration:</strong> {workshop.duration}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        component={RouterLink}
                        to="/workshops"
                      >
                        Learn More
                      </Button>
                      <Button 
                        size="small" 
                        color="primary" 
                        variant="contained"
                        component={RouterLink}
                        to="/register"
                        sx={{ ml: 'auto' }}
                      >
                        Register
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Container>
      </Box>
      
      {/* Features Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Why Join Our Workshops?
          </Typography>
          
          <Grid container spacing={4} sx={{ mt: 4 }}>
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <ScienceIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Hands-on Experience
                </Typography>
                <Typography>
                  Engage in practical experiments and activities that bring scientific concepts to life.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <SchoolIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Expert Instructors
                </Typography>
                <Typography>
                  Learn from passionate scientists and educators with years of experience in their fields.
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <EventIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Exciting Topics
                </Typography>
                <Typography>
                  Explore fascinating subjects from astronomy to zoology in an engaging, accessible way.
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ textAlign: 'center', mt: 6 }}>
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
    </Box>
  );
};

export default Home;