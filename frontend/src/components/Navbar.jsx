import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import ScienceIcon from '@mui/icons-material/Science';
import PersonIcon from '@mui/icons-material/Person';
import Divider from '@mui/material/Divider';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    handleCloseUserMenu();
    navigate('/');
  };
  
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Define navigation items based on user role
  const publicPages = [
    { title: 'Home', path: '/' },
    { title: 'Workshops', path: '/workshops' }
  ];
  
  const userPages = isAuthenticated ? [
    ...publicPages,
    { title: 'My Dashboard', path: '/dashboard' }
  ] : publicPages;
  
  const adminItems = [
    { title: 'Dashboard', path: '/admin/dashboard' },
    { title: 'Registrations', path: '/admin/registrations' },
    { title: 'Workshops', path: '/admin/workshops' },
    { title: 'Users', path: '/admin/users' }
  ];
  
  const userItems = [
    { title: 'My Dashboard', path: '/dashboard' },
    { title: 'My Registrations', path: '/my-registrations' },
    { title: 'Edit Profile', path: '/profile' }
  ];

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop Logo */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', mr: 2 }}>
            <ScienceIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Vijnana Dals
            </Typography>
          </Box>

          {/* Mobile Menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {userPages.map((page) => (
                <MenuItem 
                  key={page.title} 
                  onClick={handleCloseNavMenu} 
                  component={RouterLink} 
                  to={page.path}
                >
                  <Typography textAlign="center">{page.title}</Typography>
                </MenuItem>
              ))}
              {!isAuthenticated && (
                <MenuItem 
                  onClick={handleCloseNavMenu} 
                  component={RouterLink} 
                  to="/register"
                >
                  <Typography textAlign="center">Register</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>

          {/* Mobile Logo */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}>
            <ScienceIcon sx={{ mr: 1 }} />
            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Vijnana Dals
            </Typography>
          </Box>
          
          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {userPages.map((page) => (
              <Button
                key={page.title}
                component={RouterLink}
                to={page.path}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block', mx: 1 }}
              >
                {page.title}
              </Button>
            ))}
            {!isAuthenticated && (
              <Button
                component={RouterLink}
                to="/register"
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block', mx: 1 }}
              >
                Register
              </Button>
            )}
          </Box>

          {/* User Menu */}
          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated ? (
              <>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar sx={{ bgcolor: user?.role === 'admin' ? 'secondary.main' : 'primary.main' }}>
                      {getInitials(user?.name)}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem disabled>
                    <Typography textAlign="center" fontWeight="bold">
                      {user?.name}
                    </Typography>
                  </MenuItem>
                  <Divider />
                  
                  {/* Show admin items if user is admin or organizer */}
                  {(user?.role === 'admin' || user?.role === 'organizer') && (
                    adminItems.map((item) => (
                      <MenuItem
                        key={item.title}
                        component={RouterLink}
                        to={item.path}
                        onClick={handleCloseUserMenu}
                      >
                        <Typography textAlign="center">{item.title}</Typography>
                      </MenuItem>
                    ))
                  )}
                  
                  {/* Show user items for all authenticated users */}
                  {user?.role === 'user' && (
                    userItems.map((item) => (
                      <MenuItem
                        key={item.title}
                        component={RouterLink}
                        to={item.path}
                        onClick={handleCloseUserMenu}
                      >
                        <Typography textAlign="center">{item.title}</Typography>
                      </MenuItem>
                    ))
                  )}
                  
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex' }}>
                <Button
                  component={RouterLink}
                  to="/auth/login"
                  sx={{
                    color: 'white',
                    mr: 1,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  startIcon={<AccountCircleIcon />}
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/admin"
                  sx={{
                    color: 'white',
                    border: '1px solid white',
                    borderRadius: 1,
                    ml: 1
                  }}
                >
                  Admin
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;