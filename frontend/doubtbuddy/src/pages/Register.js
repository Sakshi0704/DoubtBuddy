import React, { useState } from 'react';
import { 
  Container, 
  Paper, 
  Typography, 
  TextField, 
  Button, 
  Box,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    expertise: []
  });
  const [error, setError] = useState('');
  const [expertiseInput, setExpertiseInput] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleExpertiseKeyPress = (e) => {
    if (e.key === 'Enter' && expertiseInput.trim()) {
      e.preventDefault();
      if (!formData.expertise.includes(expertiseInput.trim())) {
        setFormData({
          ...formData,
          expertise: [...formData.expertise, expertiseInput.trim()]
        });
      }
      setExpertiseInput('');
    }
  };

  const handleDeleteExpertise = (expertiseToDelete) => {
    setFormData({
      ...formData,
      expertise: formData.expertise.filter(exp => exp !== expertiseToDelete)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.role === 'tutor' && formData.expertise.length === 0) {
      const errorMsg = 'Tutors must specify at least one area of expertise';
      setError(errorMsg);
      setSnackbar({
        open: true,
        message: errorMsg,
        severity: 'error'
      });
      return;
    }

    const result = await register(formData);
    if (result.success && result.user) {
      const roleText = result.user.role === 'tutor' ? 'Tutor' : 'Student';
      setSnackbar({
        open: true,
        message: `Welcome ${result.user.name}! Registration successful as ${roleText}`,
        severity: 'success'
      });
      // Give time for the success message to show
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } else {
      const errorMsg = result.error || 'Registration failed. Please try again.';
      setError(errorMsg);
      setSnackbar({
        open: true,
        message: errorMsg,
        severity: 'error'
      });
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Register
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          
          <TextField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />
          
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
            margin="normal"
          />

          <FormControl component="fieldset" margin="normal">
            <RadioGroup
              row
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <FormControlLabel value="student" control={<Radio />} label="Student" />
              <FormControlLabel value="tutor" control={<Radio />} label="Tutor" />
            </RadioGroup>
          </FormControl>

          {formData.role === 'tutor' && (
            <Box sx={{ mt: 2 }}>
              <TextField
                label="Add areas of expertise (press Enter)"
                value={expertiseInput}
                onChange={(e) => setExpertiseInput(e.target.value)}
                onKeyPress={handleExpertiseKeyPress}
                fullWidth
                margin="normal"
              />
              <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {formData.expertise.map((exp) => (
                  <Chip
                    key={exp}
                    label={exp}
                    onDelete={() => handleDeleteExpertise(exp)}
                    color="primary"
                  />
                ))}
              </Box>
            </Box>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
          >
            Register
          </Button>

          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{' '}
              <Button color="primary" onClick={() => navigate('/login')}>
                Login
              </Button>
            </Typography>
          </Box>
        </form>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          elevation={6}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register;
