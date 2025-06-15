import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Chip,
  Snackbar,
  Paper,
  Stack,
} from '@mui/material';
import { School as SchoolIcon } from '@mui/icons-material';
import QuestionCard from '../components/QuestionCard';
import * as api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AvailableDoubts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDoubt, setSelectedDoubt] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [updateTrigger, setUpdateTrigger] = useState(0); // Add a trigger for re-render
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Memoize the doubts update function
  const updateDoubts = useCallback((doubtId) => {
    setDoubts(currentDoubts => currentDoubts.filter(doubt => doubt._id !== doubtId));
  }, []);

  const fetchAvailableDoubts = useCallback(async () => {
    if (!user || user.role !== 'tutor') {
      setError('Access denied. Only tutors can view this page.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.getAvailableDoubts();
      setDoubts(response.data || []);
    } catch (err) {
      console.error('Error fetching doubts:', err);
      setError('Failed to fetch available doubts');
    }
    setLoading(false);
  }, [user]);

  // Re-fetch doubts when updateTrigger changes
  useEffect(() => {
    fetchAvailableDoubts();
  }, [fetchAvailableDoubts, updateTrigger]);

  const handleQuestionClick = (question) => {
    setSelectedDoubt(question);
    setOpenDialog(true);
  }; 
  
  const handleAssign = async () => {
    if (!selectedDoubt) return;

    setAssigning(true);
    setError('');

    try {
      await api.assignTutor(selectedDoubt._id);

      // Fetch the updated list of doubts
      await fetchAvailableDoubts();

      setOpenDialog(false);
      setSelectedDoubt(null);

      // Show toast message after successful assignment
      setSnackbar({
        open: true,
        message: 'Doubt assigned successfully!',
        severity: 'success',
      });
    } catch (err) {
      console.error('Error assigning tutor:', err);
      setError(err.response?.data?.msg || 'Failed to assign tutor to doubt');
      setSnackbar({
        open: true,
        message: 'Failed to assign doubt. Please try again.',
        severity: 'error',
      });
    } finally {
      setAssigning(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDoubt(null);
    setError('');
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading && doubts.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={0} sx={{ p: 3, mb: 4, backgroundColor: 'primary.main', color: 'white' }}>
        <Box display="flex" alignItems="center" gap={2}>
          <SchoolIcon fontSize="large" />
          <Box>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Available Doubts
            </Typography>
            <Typography variant="subtitle1">
              Help students by taking up their doubts
            </Typography>
          </Box>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {doubts.length === 0 && !loading && !error && (
        <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'grey.50' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Available Doubts
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Check back later for new doubts from students.
          </Typography>
        </Paper>
      )}      <Stack spacing={2}>
        {doubts.map((doubt) => (
          <QuestionCard
            key={doubt._id}
            question={doubt}
            onClick={() => handleQuestionClick(doubt)} // Trigger modal on card click
            showAssignButton={true}
          />
        ))}
      </Stack>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider' }}>
          Confirm Assignment
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText>
            Are you sure you want to take this doubt?
          </DialogContentText>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              {selectedDoubt?.title}
            </Typography>
            <Typography variant="body2" paragraph>
              {selectedDoubt?.description}
            </Typography>
            <Box display="flex" gap={1}>
              <Chip label={selectedDoubt?.topic} size="small" color="primary" variant="outlined" />
              <Chip label={`By ${selectedDoubt?.student?.name}`} size="small" variant="outlined" />
            </Box>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Button
            onClick={handleCloseDialog}
            disabled={assigning}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAssign}
            color="primary"
            variant="contained"
            disabled={assigning}
          >
            {assigning ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={20} color="inherit" />
                Assigning...
              </Box>
            ) : (
              'Take Doubt'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AvailableDoubts;
