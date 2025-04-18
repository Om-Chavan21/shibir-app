import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

const getInitials = (name) => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Function to generate a deterministic color based on name
const getAvatarColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const colors = [
    '#1976d2', '#388e3c', '#f57c00', '#d32f2f', 
    '#7b1fa2', '#c2185b', '#0097a7', '#fbc02d'
  ];
  
  return colors[Math.abs(hash) % colors.length];
};

const Testimonial = ({ name, testimonial, workshop, year = null, rating = 5 }) => {
  const [expanded, setExpanded] = useState(false);
  
  const toggleExpand = () => {
    if (testimonial.length > 150) {
      setExpanded(!expanded);
    }
  };
  
  const displayText = expanded || testimonial.length <= 150 
    ? testimonial 
    : `${testimonial.substring(0, 150)}...`;

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative',
        pt: 3,
      }}
    >
      <Box 
        sx={{
          position: 'absolute',
          top: -20,
          left: 24,
          bgcolor: 'white',
          borderRadius: '50%',
          padding: 0.5,
        }}
      >
        <Avatar 
          sx={{ 
            width: 50, 
            height: 50, 
            bgcolor: getAvatarColor(name),
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
          }}
        >
          {getInitials(name)}
        </Avatar>
      </Box>
      
      <CardContent sx={{ pt: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ opacity: 0.3, mb: 1 }}>
          <FormatQuoteIcon sx={{ fontSize: 40, transform: 'scaleX(-1)' }} />
        </Box>
        
        <Typography 
          variant="body1" 
          paragraph 
          sx={{ 
            flexGrow: 1, 
            cursor: testimonial.length > 150 ? 'pointer' : 'default'
          }}
          onClick={toggleExpand}
        >
          {displayText}
        </Typography>
        
        <Box sx={{ mt: 'auto' }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            {name}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {workshop} {year && `• ${year}`}
            </Typography>
            <Rating value={rating} precision={0.5} readOnly size="small" />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default Testimonial;