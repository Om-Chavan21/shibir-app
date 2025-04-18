import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';

// Import placeholder images
import aboutImg from '../assets/about.jpg';
import missionImg from '../assets/mission.jpg';

const About = () => {
  // Team members data
  const teamMembers = [
    { name: 'Dr. Anand Joshi', role: 'Program Director', image: 'https://via.placeholder.com/150' },
    { name: 'Prof. Radha Desai', role: 'Lead Educator', image: 'https://via.placeholder.com/150' },
    { name: 'Vijay Sharma', role: 'Workshop Coordinator', image: 'https://via.placeholder.com/150' }
  ];
  
  // History/Timeline data
  const historyData = [
    { year: 1985, event: 'Jnana Prabodhini founded with a vision to nurture leadership qualities in students' },
    { year: 1992, event: 'Launched first science club for students' },
    { year: 2005, event: 'Established dedicated Science Education Department' },
    { year: 2010, event: 'Started regular science workshops during vacations' },
    { year: 2015, event: 'Restructured as Vijnana Dals under Yuvak Vibhag' },
    { year: 2023, event: 'Expanded program to reach more students across Maharashtra' }
  ];

  return (
    <Box sx={{ py: 8, backgroundColor: '#f9f9f9', minHeight: '80vh' }}>
      <Container>
        <Typography variant="h3" component="h1" align="center" gutterBottom>
          About Vijnana Dals
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 6, maxWidth: 800, mx: 'auto' }}>
          Discover the story behind our science workshop initiative and learn about our mission to foster
          scientific curiosity and critical thinking in young minds.
        </Typography>

        {/* About Section */}
        <Grid container spacing={6} sx={{ mb: 8 }} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              Our Story
            </Typography>
            <Typography variant="body1" paragraph>
              Vijnana Dals (Science Groups) is an initiative by the Yuvak Vibhag (Youth Wing) of Jnana Prabodhini, 
              dedicated to promoting scientific education through hands-on workshops and experiential learning.
            </Typography>
            <Typography variant="body1" paragraph>
              Founded with the belief that science education should be engaging, accessible, and inspiring, 
              our workshops are designed to complement school education by providing practical, 
              investigatory experiences that foster curiosity and critical thinking.
            </Typography>
            <Typography variant="body1">
              We focus on students in standards 8-10, a crucial age when scientific interests and career 
              aspirations begin to take shape, offering programs during summer (May) and winter (December) vacations.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={aboutImg || "https://source.unsplash.com/random/600x400/?science,education"}
              alt="Students in science workshop"
              sx={{
                width: '100%',
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </Grid>
        </Grid>

        {/* Mission & Vision */}
        <Paper sx={{ p: 4, mb: 8, borderRadius: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={missionImg || "https://source.unsplash.com/random/600x400/?research,laboratory"}
                alt="Mission and vision"
                sx={{
                  width: '100%',
                  borderRadius: 2,
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                Our Mission & Vision
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Mission:</strong> To cultivate scientific temper and research skills in young students through 
                hands-on investigatory workshops that complement formal education.
              </Typography>
              <Typography variant="body1" paragraph>
                <strong>Vision:</strong> To create a generation of scientifically literate citizens who approach 
                problems with curiosity, critical thinking, and methodical inquiry.
              </Typography>
              <Typography variant="body1">
                We believe that every student has the potential to be a scientist, inventor, or innovator. 
                Our goal is to unlock this potential through engaging, hands-on learning experiences that 
                make science accessible and exciting.
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        {/* Our History Timeline */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Our Journey
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}>
            From humble beginnings to a structured program reaching hundreds of students each year, 
            explore key milestones in our development.
          </Typography>
          
          <Timeline position="alternate">
            {historyData.map((item, index) => (
              <TimelineItem key={index}>
                <TimelineOppositeContent color="text.secondary">
                  {item.year}
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot color="primary" />
                  {index < historyData.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Paper elevation={1} sx={{ p: 2, bgcolor: 'background.paper' }}>
                    <Typography variant="body1">{item.event}</Typography>
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        </Box>

        {/* Our Team */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Our Team
          </Typography>
          <Typography variant="body1" align="center" sx={{ mb: 4, maxWidth: 700, mx: 'auto' }}>
            Meet the dedicated educators and coordinators who make our science workshops possible.
          </Typography>
          
          <Grid container spacing={4} justifyContent="center">
            {teamMembers.map((member, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="240"
                    image={member.image}
                    alt={member.name}
                  />
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                      {member.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {member.role}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* Call to Action */}
        <Divider sx={{ mb: 8 }} />
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Join Us in This Journey
          </Typography>
          <Typography variant="body1" paragraph sx={{ maxWidth: 700, mx: 'auto' }}>
            Ready to explore the wonders of science with us? Register for an upcoming workshop
            or contact us to learn more about our programs.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              component={RouterLink}
              to="/workshops"
              sx={{ mr: 2, mb: { xs: 2, sm: 0 } }}
            >
              Explore Workshops
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              size="large"
              component={RouterLink}
              to="/register"
            >
              Register Now
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default About;