import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    handleClose();
    logout();
    // Show logout notification
    setSnackbar({
      open: true,
      message: 'You have been logged out successfully',
      severity: 'success'
    });
    // Navigate after showing the message
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const getFirstName = () => {
    return user?.name?.split(' ')[0] || 'User';
  };

  return (
    <>
      <AppBar position="sticky" sx={{ backgroundColor: '#1976d2' }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 0 } }}>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 700
              }}
            >
              DoubtBuddy
            </Typography>

            {user && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {user.role === 'student' && (
                  <Button
                    color="inherit"
                    component={RouterLink}
                    to="/dashboard"
                  >
                    My Doubts
                  </Button>
                )}
                
                {user.role === 'tutor' && (
                  <>
                    <Button
                      color="inherit"
                      component={RouterLink}
                      to="/available-doubts"
                    >
                      Available Doubts
                    </Button>
                    <Button
                      color="inherit"
                      component={RouterLink}
                      to="/assigned-doubts"
                    >
                      My Doubts
                    </Button>
                  </>
                )}

                <Box sx={{ ml: 2 }}>
                  <IconButton
                    onClick={handleMenu}
                    sx={{ p: 0 }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: '#1565c0',
                        width: 36,
                        height: 36,
                        fontSize: '1rem',
                        fontWeight: 500
                      }}
                    >
                      {getFirstName()[0]}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    <MenuItem sx={{ minWidth: 150 }}>
                      <Typography variant="body2">
                        Hello, {getFirstName()}
                      </Typography>
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </Box>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Navbar;
