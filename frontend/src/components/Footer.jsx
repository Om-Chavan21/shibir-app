import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import ScienceIcon from '@mui/icons-material/Science';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'primary.dark', 
        color: 'white',
        py: 6,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ScienceIcon sx={{ mr: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Vijnana Dals
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Join our Investigatory Research Methodology Workshops designed for students in standards 8-10 
              to develop scientific curiosity and critical thinking skills.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Link href="#" color="inherit">
                <FacebookIcon />
              </Link>
              <Link href="#" color="inherit">
                <TwitterIcon />
              </Link>
              <Link href="#" color="inherit">
                <InstagramIcon />
              </Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            <Link component={RouterLink} to="/" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Home
            </Link>
            <Link component={RouterLink} to="/workshops" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Workshops
            </Link>
            <Link component={RouterLink} to="/register" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Register for Workshop
            </Link>
            <Link component={RouterLink} to="/auth/login" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Login
            </Link>
            <Link component={RouterLink} to="/auth/register" color="inherit" sx={{ display: 'block', mb: 1 }}>
              Create Account
            </Link>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
              Contact Us
            </Typography>
            
            <Box sx={{ display: 'flex', mb: 1.5, alignItems: 'flex-start' }}>
              <LocationOnIcon sx={{ mr: 1, fontSize: '20px', mt: 0.3 }} />
              <Typography variant="body2">
                Jnana Prabodhini, 510 Sadashiv Peth, Pune 411030, Maharashtra, India
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', mb: 1.5, alignItems: 'center' }}>
              <PhoneIcon sx={{ mr: 1, fontSize: '20px' }} />
              <Typography variant="body2">
                +91 20 2445 6867
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', mb: 1.5, alignItems: 'center' }}>
              <EmailIcon sx={{ mr: 1, fontSize: '20px' }} />
              <Typography variant="body2">
                vijnana.dals@jnanaprabodhini.org
              </Typography>
            </Box>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid rgba(255, 255, 255, 0.2)', textAlign: 'center' }}>
          <Typography variant="body2">
            © {new Date().getFullYear()} Jnana Prabodhini Vijnana Dals. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;