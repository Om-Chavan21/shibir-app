import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Testimonial from './Testimonial';
import CircularProgress from '@mui/material/CircularProgress';

const TestimonialSlider = ({ testimonials = [], loading }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  
  // Calculate total number of pages
  const totalPages = Math.ceil(testimonials.length / itemsPerPage);
  
  // Reset page when testimonials change
  useEffect(() => {
    setCurrentPage(0);
  }, [testimonials]);
  
  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };
  
  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1));
  };
  
  // Get current testimonials for this page
  const currentTestimonials = testimonials.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (testimonials.length === 0) {
    return null;
  }

  return (
    <Box sx={{ py: 6, bgcolor: 'background.paper' }}>
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h2">
            What Students Say
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton 
              onClick={handlePrevious} 
              disabled={currentPage === 0}
              color="primary"
              sx={{ 
                bgcolor: 'rgba(25, 118, 210, 0.1)', 
                '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.2)' } 
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>
            
            <Typography variant="body1">
              {currentPage + 1} / {totalPages}
            </Typography>
            
            <IconButton 
              onClick={handleNext} 
              disabled={currentPage === totalPages - 1}
              color="primary"
              sx={{ 
                bgcolor: 'rgba(25, 118, 210, 0.1)', 
                '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.2)' } 
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </Box>
        
        <Grid container spacing={3}>
          {currentTestimonials.map((testimonial, index) => (
            <Grid item xs={12} md={4} key={index}>
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
      </Container>
    </Box>
  );
};

export default TestimonialSlider;