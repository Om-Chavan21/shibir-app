import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Testimonial from '../components/Testimonial';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, fetch testimonials from API
    // Simulating API call with setTimeout
    const fetchTestimonials = () => {
      setTimeout(() => {
        const mockTestimonials = [
          {
            name: "Arjun Patel",
            testimonial: "The astronomy workshop was amazing! I learned so much about stars and planets. The hands-on telescope session was the highlight for me. I never thought I would be able to see Saturn's rings with my own eyes! The instructors were knowledgeable and made complex concepts easy to understand.",
            workshop: "Astronomy Workshop",
            year: 2022,
            rating: 5
          },
          {
            name: "Priya Sharma",
            testimonial: "I never thought chemistry could be so fun! The experiments were exciting and the instructors explained complex concepts in a way that was easy to understand. This workshop ignited my passion for chemistry and helped improve my school grades significantly.",
            workshop: "Chemistry Lab Experience",
            year: 2022,
            rating: 5
          },
          {
            name: "Rohit Verma",
            testimonial: "The biology workshop gave me a new appreciation for how intricate living organisms are. I especially enjoyed the microscope activities and DNA extraction experiment. It helped me understand concepts I was struggling with in school.",
            workshop: "Biology Workshop",
            year: 2021,
            rating: 4.5
          },
          {
            name: "Ananya Desai",
            testimonial: "This workshop helped me understand physics concepts that I was struggling with in school. Now I'm excited about pursuing science further. The practical demonstrations of Newton's laws were particularly enlightening.",
            workshop: "Physics Fundamentals",
            year: 2022,
            rating: 5
          },
          {
            name: "Vikram Singh",
            testimonial: "The robotics workshop was challenging but incredibly rewarding. I built my first robot and learned programming basics too! The teachers were patient and helped us through every step of the process.",
            workshop: "Robotics Workshop",
            year: 2021,
            rating: 4.5
          },
          {
            name: "Neha Gupta",
            testimonial: "My son came home from the workshop every day bursting with excitement about what he had learned. The hands-on approach really worked for him, and I noticed his interest in science grew significantly after attending.",
            workshop: "Young Scientists Program",
            year: 2022,
            rating: 5
          },
          {
            name: "Rahul Kapoor",
            testimonial: "As a teacher, I was impressed by the curriculum and teaching methods used in this workshop. My students who attended showed improved understanding of scientific concepts and greater enthusiasm for experiments.",
            workshop: "Science Teacher Workshop",
            year: 2021,
            rating: 5
          },
          {
            name: "Shreya Patel",
            testimonial: "The mathematics workshop changed my perspective completely. I used to dread math, but the interactive puzzles and real-world applications made it fascinating. Now it's my favorite subject!",
            workshop: "Mathematical Thinking",
            year: 2022,
            rating: 5
          },
          {
            name: "Aditya Kumar",
            testimonial: "Learning about environmental science in such a hands-on way was incredible. We conducted water quality tests in local streams and learned about conservation. This workshop inspired me to start an eco-club at my school.",
            workshop: "Environmental Science",
            year: 2021,
            rating: 5
          }
        ];
        
        setTestimonials(mockTestimonials);
        setLoading(false);
      }, 1000);
    };
    
    fetchTestimonials();
  }, []);

  return (
    <Box sx={{ py: 8, backgroundColor: '#f9f9f9', minHeight: '80vh' }}>
      <Container>
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          Student Testimonials
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
          Hear what past participants have to say about our science workshops.
          These testimonials reflect the transformative experiences our students have had.
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={6} lg={4} key={index}>
                <Testimonial
                  name={testimonial.name}
                  testimonial={testimonial.testimonial}
                  workshop={testimonial.workshop}
                  year={testimonial.year}
                  rating={testimonial.rating}
                />
              </Grid>
            ))}
          </Grid>
        )}
        
        <Divider sx={{ my: 8 }} />
        
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Join Our Next Workshop
          </Typography>
          <Typography variant="body1" paragraph sx={{ maxWidth: 700, mx: 'auto' }}>
            Be part of our growing community of young scientists and explorers.
            Register for an upcoming workshop and start your scientific journey today.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            component={RouterLink}
            to="/workshops"
            sx={{ mt: 2 }}
          >
            View Upcoming Workshops
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Testimonials;