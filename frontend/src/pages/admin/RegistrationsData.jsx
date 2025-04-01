import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import DownloadIcon from '@mui/icons-material/Download';
import FilterListIcon from '@mui/icons-material/FilterList';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import { getAllRegistrations } from '../../utils/api';

const RegistrationsData = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filters
  const [nameFilter, setNameFilter] = useState('');
  const [workshopFilter, setWorkshopFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        const data = await getAllRegistrations();
        setRegistrations(data);
      } catch (err) {
        console.error("Error fetching registrations:", err);
        setError('Failed to load registrations data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRegistrations();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleExportCsv = () => {
    const filteredData = applyFilters(registrations);
    
    // Create CSV content
    const headers = ['Name', 'Email', 'Phone', 'Age Group', 'Workshop Interest', 'Registration Date', 'Message'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => [
        `"${row.name}"`,
        `"${row.email}"`,
        `"${row.phone}"`,
        `"${row.age}"`,
        `"${row.workshopInterest}"`,
        `"${new Date(row.registrationDate).toLocaleDateString()}"`,
        `"${row.message || ''}"`
      ].join(','))
    ].join('\n');
    
    // Create a download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `workshop-registrations-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const applyFilters = (data) => {
    return data.filter(registration => {
      // Apply name filter
      if (nameFilter && !registration.name.toLowerCase().includes(nameFilter.toLowerCase())) {
        return false;
      }
      
      // Apply workshop filter
      if (workshopFilter !== 'all' && registration.workshopInterest !== workshopFilter) {
        return false;
      }
      
      // Apply date filter
      if (dateFilter !== 'all') {
        const regDate = new Date(registration.registrationDate);
        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        const lastMonth = new Date();
        lastMonth.setDate(lastMonth.getDate() - 30);
        
        if (dateFilter === 'today' && regDate.toDateString() !== today.toDateString()) {
          return false;
        }
        
        if (dateFilter === 'week' && regDate < lastWeek) {
          return false;
        }
        
        if (dateFilter === 'month' && regDate < lastMonth) {
          return false;
        }
      }
      
      return true;
    });
  };
  
  const filteredRegistrations = applyFilters(registrations);
  
  // Get stats for the filtered results
  const getStatsByWorkshop = () => {
    const stats = {};
    filteredRegistrations.forEach(reg => {
      stats[reg.workshopInterest] = (stats[reg.workshopInterest] || 0) + 1;
    });
    return stats;
  };
  
  const getStatsByAge = () => {
    const stats = {};
    filteredRegistrations.forEach(reg => {
      stats[reg.age] = (stats[reg.age] || 0) + 1;
    });
    return stats;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ py: 8 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ py: 4, backgroundColor: '#f9f9f9', minHeight: '80vh' }}>
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Workshop Registrations
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" paragraph>
          View and manage all workshop registration submissions.
        </Typography>
        
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Registrations
                </Typography>
                <Typography variant="h4">{filteredRegistrations.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Astronomy Workshop
                </Typography>
                <Typography variant="h4">{filteredRegistrations.filter(r => r.workshopInterest === 'astronomy').length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Chemistry Workshop
                </Typography>
                <Typography variant="h4">{filteredRegistrations.filter(r => r.workshopInterest === 'chemistry').length}</Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Both Workshops
                </Typography>
                <Typography variant="h4">{filteredRegistrations.filter(r => r.workshopInterest === 'both').length}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <FilterListIcon sx={{ mr: 1 }} /> Filters
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Search by Name"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                fullWidth
                variant="outlined"
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Workshop</InputLabel>
                <Select
                  value={workshopFilter}
                  onChange={(e) => setWorkshopFilter(e.target.value)}
                  label="Workshop"
                >
                  <MenuItem value="all">All Workshops</MenuItem>
                  <MenuItem value="astronomy">Astronomy and Space Exploration</MenuItem>
                  <MenuItem value="chemistry">Chemistry Lab Experience</MenuItem>
                  <MenuItem value="both">Both Workshops</MenuItem>
                  <MenuItem value="undecided">Undecided</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Registration Date</InputLabel>
                <Select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  label="Registration Date"
                >
                  <MenuItem value="all">All Time</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="week">Last 7 Days</MenuItem>
                  <MenuItem value="month">Last 30 Days</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2">
              {filteredRegistrations.length} registrations found
            </Typography>
            
            <Button 
              variant="outlined" 
              startIcon={<DownloadIcon />} 
              onClick={handleExportCsv}
            >
              Export to CSV
            </Button>
          </Box>
        </Paper>
        
        {/* Data Table */}
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader aria-label="registrations table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Age Group</TableCell>
                  <TableCell>Workshop Interest</TableCell>
                  <TableCell>Registration Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRegistrations
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((registration) => (
                    <TableRow key={registration.id} hover>
                      <TableCell>{registration.name}</TableCell>
                      <TableCell>{registration.email}</TableCell>
                      <TableCell>{registration.phone}</TableCell>
                      <TableCell>{registration.age}</TableCell>
                      <TableCell>
                        <Chip 
                          label={registration.workshopInterest === 'astronomy' 
                            ? 'Astronomy' 
                            : registration.workshopInterest === 'chemistry'
                            ? 'Chemistry'
                            : registration.workshopInterest === 'both'
                            ? 'Both Workshops'
                            : 'Undecided'
                          } 
                          color={
                            registration.workshopInterest === 'astronomy' || registration.workshopInterest === 'chemistry'
                              ? 'primary'
                              : registration.workshopInterest === 'both'
                              ? 'secondary'
                              : 'default'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{new Date(registration.registrationDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                
                {filteredRegistrations.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No registrations found with the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={filteredRegistrations.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Container>
    </Box>
  );
};

export default RegistrationsData;