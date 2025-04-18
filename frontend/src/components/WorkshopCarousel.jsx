import { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MobileStepper from '@mui/material/MobileStepper';
import Button from '@mui/material/Button';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';

const WorkshopCarousel = ({ images = [] }) => {
  const [activeStep, setActiveStep] = useState(0);
  
  // Default images in case none are provided
  const defaultImages = [
    {
      url: 'https://plus.unsplash.com/premium_photo-1744888432880-1b9c6fb1f612?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dhttps://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Science Workshops',
      description: 'Explore the wonders of science through our interactive workshops'
    },
    {
      url: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Astronomy & Space',
      description: 'Discover the mysteries of the universe'
    },
    {
      url: 'https://images.unsplash.com/photo-1693919653649-27492e78899d?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      title: 'Chemistry Experiments',
      description: 'Hands-on laboratory experiences for young scientists'
    }
  ];
  
  // Use provided images or defaults
  const carouselImages = images.length > 0 ? images : defaultImages;
  const maxSteps = carouselImages.length;

  const handleNext = useCallback(() => {
    setActiveStep((prevActiveStep) => 
      prevActiveStep === maxSteps - 1 ? 0 : prevActiveStep + 1);
  }, [maxSteps]);

  const handleBack = () => {
    setActiveStep((prevActiveStep) => 
      prevActiveStep === 0 ? maxSteps - 1 : prevActiveStep - 1);
  };

  // Auto-play functionality
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    
    return () => clearInterval(timer);
  }, [handleNext]);
  
  return (
    <Box sx={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      {carouselImages.map((image, index) => (
        <Box
          key={index}
          sx={{
            height: { xs: '40vh', md: '60vh' },
            width: '100%',
            display: activeStep === index ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            position: 'relative',
            transition: 'opacity 500ms ease',
          }}
        >
          <Box
            component="img"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
            }}
            src={image.url}
            alt={image.title}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0, 0, 0, 0.4)',
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              p: 2,
              textAlign: 'center',
              color: 'white',
            }}
          >
            <Typography variant="h4" component="h2" gutterBottom>
              {image.title}
            </Typography>
            <Typography variant="body1">
              {image.description}
            </Typography>
          </Box>
        </Box>
      ))}
      
      <MobileStepper
        steps={maxSteps}
        position="bottom"
        activeStep={activeStep}
        sx={{
          bgcolor: 'transparent',
          position: 'absolute',
          bottom: 0,
          width: '100%',
          '& .MuiMobileStepper-dot': {
            bgcolor: 'rgba(255, 255, 255, 0.5)',
          },
          '& .MuiMobileStepper-dotActive': {
            bgcolor: 'white',
          },
        }}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            sx={{ color: 'white' }}
          >
            Next
            <KeyboardArrowRight />
          </Button>
        }
        backButton={
          <Button
            size="small"
            onClick={handleBack}
            sx={{ color: 'white' }}
          >
            <KeyboardArrowLeft />
            Back
          </Button>
        }
      />
    </Box>
  );
};

export default WorkshopCarousel;