import { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { getWorkshopById } from '../utils/api';

const WorkshopDetail = () => {
  const { id } = useParams();
  const [workshop, setWorkshop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWorkshop = async () => {
      try {
        setLoading(true);
        const data = await getWorkshopById(id);
        setWorkshop(data);
      } catch (error) {
        console.error("Error fetching workshop:", error);
        setError('Workshop not found or error loading workshop details.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkshop();
  }, [id]);

  // Check if registration is open
  const isRegistrationOpen = () => {
    if (!workshop) return false;
    const today = new Date();
    const deadline = new Date(workshop.registrationDeadline);
    return today <= deadline;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !workshop) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">{error || 'Workshop not found'}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 8, backgroundColor: '#f9f9f9', minHeight: '80vh' }}>
      <Container>
        {/* Workshop Header */}
        <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h3" component="h1" gutterBottom>
                {workshop.title}
              </Typography>
              
              <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<EventIcon />}
                  label={`Date: ${new Date(workshop.date).toLocaleDateString()}`}
                  variant="outlined"
                  color="primary"
                />
                <Chip 
                  icon={<AccessTimeIcon />}
                  label={`Time: ${workshop.time}`}
                  variant="outlined"
                  color="primary"
                />
                <Chip 
                  icon={<PeopleIcon />}
                  label={`Eligibility: Std ${workshop.eligibility?.minStd}-${workshop.eligibility?.maxStd}`}
                  variant="outlined"
                  color="primary"
                />
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Workshop Details
              </Typography>
              <Typography variant="body1" paragraph>
                {workshop.description}
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AccessTimeIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body1">
                      <strong>Duration:</strong> {workshop.duration}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOnIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body1">
                      <strong>Location:</strong> {workshop.location}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body1">
                      <strong>Audience:</strong> {workshop.audience}
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <AttachMoneyIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="body1">
                      <strong>Fee:</strong> ₹{workshop.fee}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Learning Outcomes */}
        <Paper sx={{ p: 4, mb: 4, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            What You Will Learn
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={2}>
            {workshop.learningOutcomes.map((outcome, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                  <Box 
                    sx={{ 
                      width: 24, 
                      height: 24, 
                      borderRadius: '50%', 
                      bgcolor: 'primary.main', 
                      color: 'white', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mr: 2,
                      mt: 0.5,
                      flexShrink: 0
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Typography variant="body1">{outcome}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
        
        {/* Registration Status and CTA */}
        <Paper sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Registration {isRegistrationOpen() ? 'Open' : 'Closed'}
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            {isRegistrationOpen() 
              ? `Registration deadline: ${new Date(workshop.registrationDeadline).toLocaleDateString()}`
              : 'Registration for this workshop has ended.'
            }
          </Typography>
          
          <Box sx={{ mt: 3 }}>
            {isRegistrationOpen() ? (
              <Button 
                variant="contained" 
                color="primary" 
                size="large" 
                component={RouterLink}
                to={`/register/${workshop.id}`}
              >
                Register Now
              </Button>
            ) : (
              <Button 
                variant="outlined" 
                color="primary" 
                size="large" 
                component={RouterLink}
                to="/workshops"
              >
                Explore Other Workshops
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default WorkshopDetail;