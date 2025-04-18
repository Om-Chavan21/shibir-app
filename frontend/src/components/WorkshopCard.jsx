import { Link as RouterLink } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';

const WorkshopCard = ({ workshop }) => {
  // Check if registration is open
  const isRegistrationOpen = () => {
    const today = new Date();
    const deadline = new Date(workshop.registrationDeadline);
    return today <= deadline;
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
      }
    }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {workshop.title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <EventIcon fontSize="small" sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {formatDate(workshop.date)}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <AccessTimeIcon fontSize="small" sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {workshop.time}
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocationOnIcon fontSize="small" sx={{ color: 'primary.main', mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {workshop.location}
          </Typography>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {workshop.description.length > 150 ? 
            `${workshop.description.substring(0, 150)}...` : 
            workshop.description}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          <Chip 
            label={`₹${workshop.fee}`} 
            color="primary" 
            variant="outlined" 
            size="small" 
          />
          <Chip 
            label={isRegistrationOpen() ? 'Registration Open' : 'Registration Closed'} 
            color={isRegistrationOpen() ? 'success' : 'error'} 
            size="small" 
          />
        </Box>
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'space-between', p: 2, pt: 0 }}>
        <Button 
          size="small" 
          component={RouterLink} 
          to={`/workshops/${workshop.id}`}
        >
          Learn More
        </Button>
        
        <Button 
          size="small" 
          color="primary" 
          variant="contained" 
          component={RouterLink} 
          to={`/register/${workshop.id}`}
          disabled={!isRegistrationOpen()}
        >
          Register
        </Button>
      </CardActions>
    </Card>
  );
};

export default WorkshopCard;