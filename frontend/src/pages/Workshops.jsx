import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import WorkshopCard from '../components/WorkshopCard';
import { getWorkshops } from '../utils/api';

const Workshops = () => {
  const [workshops, setWorkshops] = useState([]);
  const [filteredWorkshops, setFilteredWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        setLoading(true);
        const data = await getWorkshops();
        setWorkshops(data);
        setFilteredWorkshops(data);
      } catch (error) {
        console.error("Error fetching workshops:", error);
        setError("Failed to load workshops. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchWorkshops();
  }, []);
  
  useEffect(() => {
    // Apply filters whenever filter states change
    applyFilters();
  }, [searchQuery, statusFilter, workshops]);
  
  const applyFilters = () => {
    let result = [...workshops];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(workshop => 
        workshop.title.toLowerCase().includes(query) || 
        workshop.description.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      const today = new Date();
      const deadlineFilter = workshop => {
        const deadline = new Date(workshop.registrationDeadline);
        return today <= deadline;
      };
      
      if (statusFilter === 'open') {
        result = result.filter(deadlineFilter);
      } else if (statusFilter === 'closed') {
        result = result.filter(workshop => !deadlineFilter(workshop));
      }
    }
    
    setFilteredWorkshops(result);
  };
  
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  return (
    <Box sx={{ py: 8, backgroundColor: '#f9f9f9', minHeight: '80vh' }}>
      <Container>
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          Science Workshops
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
          Explore our past and upcoming workshops designed to inspire scientific curiosity and critical thinking in young minds.
        </Typography>
        
        {/* Filters */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search Workshops"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Registration Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  label="Registration Status"
                >
                  <MenuItem value="all">All Workshops</MenuItem>
                  <MenuItem value="open">Registration Open</MenuItem>
                  <MenuItem value="closed">Registration Closed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        ) : filteredWorkshops.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" paragraph>
              No workshops match your filters.
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
            >
              Clear Filters
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredWorkshops.map((workshop) => (
              <Grid item xs={12} sm={6} md={4} key={workshop.id}>
                <WorkshopCard workshop={workshop} />
              </Grid>
            ))}
          </Grid>
        )}
        
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Typography variant="h4" gutterBottom>
            Want to stay updated?
          </Typography>
          <Typography variant="body1" paragraph sx={{ maxWidth: 600, mx: 'auto' }}>
            Register now to receive notifications about upcoming workshops and special events.
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            component={RouterLink}
            to="/auth/register"
          >
            Create an Account
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Workshops;