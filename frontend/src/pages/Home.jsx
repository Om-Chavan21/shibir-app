import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import { getWorkshops } from '../utils/api';
import WorkshopCarousel from '../components/WorkshopCarousel';
import WorkshopCard from '../components/WorkshopCard';
import TestimonialSlider from '../components/TestimonialSlider';
import ScienceIcon from '@mui/icons-material/Science';
import SchoolIcon from '@mui/icons-material/School';
import GroupsIcon from '@mui/icons-material/Groups';

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

  // Mock testimonials (in a real app, these would come from an API)
  const testimonials = [
    {
      name: "Arjun Patel",
      testimonial: "The astronomy workshop was amazing! I learned so much about stars and planets. The hands-on telescope session was the highlight for me.",
      workshop: "Astronomy Workshop",
      year: 2022,
      rating: 5
    },
    {
      name: "Priya Sharma",
      testimonial: "I never thought chemistry could be so fun! The experiments were exciting and the instructors explained complex concepts in a way that was easy to understand.",
      workshop: "Chemistry Lab Experience",
      year: 2022,
      rating: 5
    },
    {
      name: "Rohit Verma",
      testimonial: "The biology workshop gave me a new appreciation for how intricate living organisms are. I especially enjoyed the microscope activities.",
      workshop: "Biology Workshop",
      year: 2021,
      rating: 4.5
    },
    {
      name: "Ananya Desai",
      testimonial: "This workshop helped me understand physics concepts that I was struggling with in school. Now I'm excited about pursuing science further.",
      workshop: "Physics Fundamentals",
      year: 2022,
      rating: 5
    },
    {
      name: "Vikram Singh",
      testimonial: "The robotics workshop was challenging but incredibly rewarding. I built my first robot and learned programming basics too!",
      workshop: "Robotics Workshop",
      year: 2021,
      rating: 4.5
    }
  ];

  // Filter for upcoming workshops only
  const upcomingWorkshops = workshops.filter(workshop => new Date(workshop.date) > new Date());

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero Carousel Section */}
      <WorkshopCarousel />
      
      {/* Introduction Section */}
      <Box sx={{ py: 6 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" component="h1" gutterBottom>
                Vijnana Dals Workshop Series
              </Typography>
              <Typography variant="h5" color="primary.main" gutterBottom>
                Ignite Scientific Curiosity
              </Typography>
              <Typography variant="body1" paragraph>
                Welcome to Jnana Prabodhini's Yuvak Vibhag Vijnana Dals Workshop Series - where young minds explore the wonders of science through hands-on investigation and discovery.
              </Typography>
              <Typography variant="body1" paragraph>
                Our Investigatory Research Methodology Workshops are designed for students in grades 8-10 who are passionate about science and eager to develop critical thinking and research skills.
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                size="large"
                component={RouterLink}
                to="/workshops"
                sx={{ mt: 2 }}
              >
                Explore Workshops
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper 
                elevation={6} 
                sx={{ 
                  p: { xs: 2, md: 4 },
                  bgcolor: 'primary.light',
                  color: 'white',
                  borderRadius: 3
                }}
              >
                <Typography variant="h5" gutterBottom align="center" fontWeight="bold">
                  Why Choose Our Workshops?
                </Typography>
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.3)', my: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <ScienceIcon sx={{ fontSize: 40, mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Hands-on Experiments
                        </Typography>
                        <Typography variant="body2">
                          Apply scientific methods through practical, interactive experiments
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <SchoolIcon sx={{ fontSize: 40, mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Expert Mentorship
                        </Typography>
                        <Typography variant="body2">
                          Learn from experienced educators and scientists in the field
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <GroupsIcon sx={{ fontSize: 40, mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Collaborative Learning
                        </Typography>
                        <Typography variant="body2">
                          Work with peers to solve problems and share discoveries
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Upcoming Workshops Section */}
      <Box sx={{ py: 6, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom align="center">
            Upcoming Workshops
          </Typography>
          <Typography variant="body1" paragraph align="center" sx={{ maxWidth: 800, mx: 'auto', mb: 4 }}>
            Register now for our upcoming science workshops designed to inspire curiosity, 
            critical thinking, and a love for scientific investigation.
          </Typography>
          
          {loading ? (
            <Typography align="center">Loading workshops...</Typography>
          ) : (
            <Grid container spacing={3}>
              {upcomingWorkshops.length > 0 ? (
                upcomingWorkshops.slice(0, 3).map((workshop) => (
                  <Grid item xs={12} sm={6} md={4} key={workshop.id}>
                    <WorkshopCard workshop={workshop} />
                  </Grid>
                ))
              ) : (
                <Grid item xs={12}>
                  <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" paragraph>
                      No upcoming workshops at the moment.
                    </Typography>
                    <Typography variant="body1" paragraph>
                      Please check back later for new workshop announcements.
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary"
                      component={RouterLink}
                      to="/register"
                    >
                      Join Our Mailing List
                    </Button>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
          
          {upcomingWorkshops.length > 3 && (
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button 
                variant="outlined" 
                color="primary"
                component={RouterLink}
                to="/workshops"
              >
                View All Workshops
              </Button>
            </Box>
          )}
        </Container>
      </Box>
      
      {/* Testimonials Section */}
      <TestimonialSlider testimonials={testimonials} />
      
      {/* Call to Action */}
      <Box sx={{ py: 8, bgcolor: 'primary.dark', color: 'white', textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to Begin Your Scientific Journey?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Join our workshops and discover the joy of scientific exploration and investigation.
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
        </Container>
      </Box>
    </Box>
  );
};

export default Home;