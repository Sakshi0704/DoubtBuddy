import React, { useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  Avatar,
  Paper,
  Tooltip,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  CommentOutlined, 
  AccessTime, 
  Person, 
  CheckCircle, 
  Refresh,
  Timer,
  Star,
  EmojiEvents,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/api';
import RatingDialog from './RatingDialog';
import CommentDialog from './CommentDialog';

// Styled components
const StyledCard = styled(Card)(({ theme, status }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
  },
  position: 'relative',
  overflow: 'visible',
  borderLeft: '4px solid',
  borderLeftColor: 
    status === 'resolved' ? theme.palette.success.main :
    status === 'assigned' ? theme.palette.primary.main :
    theme.palette.error.main,
  background: status === 'resolved' ? 
    'linear-gradient(145deg, rgba(76, 175, 80, 0.05) 0%, rgba(76, 175, 80, 0) 100%)' :
    'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  fontWeight: 500,
  borderRadius: '8px',
  '&.MuiChip-topic': {
    background: theme.palette.error.main,
    color: theme.palette.common.white,
    '&:hover': {
      background: theme.palette.error.dark,
    }
  }
}));

const StatusBadge = styled(Box)(({ theme, status }) => ({
  position: 'absolute',
  top: -10,
  right: 16,
  padding: '4px 12px',
  borderRadius: '12px',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: theme.palette.common.white,
  background: 
    status === 'resolved' ? theme.palette.success.main :
    status === 'assigned' ? theme.palette.primary.main :
    theme.palette.error.main,
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  zIndex: 1,
}));

// Status configurations
const statusConfig = {
  unassigned: {
    color: 'crimson',
    label: 'Open',
    icon: <Timer fontSize="small" />,
  },
  open: {
    color: 'crimson',
    label: 'Open',
    icon: <Timer fontSize="small" />,
  },
  assigned: {
    color: 'primary',
    label: 'In Progress',
    icon: <Person fontSize="small" />,
  },
  resolved: {
    color: 'success',
    label: 'Resolved',
    icon: <CheckCircle fontSize="small" />,
  },
  closed: {
    color: 'error',
    label: 'Closed',
    icon: null,
  },
};

const QuestionCard = ({ question, onClick, onStatusUpdate, showAssignButton = false }) => {
  const { user } = useAuth();
  const [openResolutionDialog, setOpenResolutionDialog] = useState(false);
  const [openReopenDialog, setOpenReopenDialog] = useState(false);
  const [resolution, setResolution] = useState('');
  const [reopenReason, setReopenReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [openRatingDialog, setOpenRatingDialog] = useState(false);
  const [openCommentsDialog, setOpenCommentsDialog] = useState(false);

  const handleCardClick = useCallback((e) => {
    if (onClick) {
      onClick(question);
    }
  }, [onClick, question]);

  const handleChipClick = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const handleResolveClick = async (e) => {
    e.stopPropagation();
    setOpenResolutionDialog(true);
  };

  const handleReopenClick = useCallback((e) => {
    e.stopPropagation();
    setReopenReason('');
    setError('');
    setOpenReopenDialog(true);
  }, []);

  const handleResolutionSubmit = async () => {
    if (!resolution.trim()) return;
    setLoading(true);
    setError('');
    try {
      await api.updateQuestionStatus(question._id, 'resolved', { resolution });
      setSnackbar({
        open: true,
        message: 'Great job! The doubt has been marked as resolved.',
        severity: 'success'
      });
      if (onStatusUpdate) onStatusUpdate();
      setOpenResolutionDialog(false);
      setResolution('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resolve doubt');
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to resolve doubt. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReopenSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!reopenReason.trim()) {
      setError('Please provide a reason for reopening');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.reopenDoubt(question._id, reopenReason.trim());
      if (response.status === 200) {
        setSnackbar({
          open: true,
          message: 'Doubt has been reopened. A tutor will assist you soon.',
          severity: 'info'
        });
        if (onStatusUpdate) {
          await onStatusUpdate();
        }
        setOpenReopenDialog(false);
        setReopenReason('');
      }
    } catch (err) {
      console.error('Error reopening doubt:', err);
      setError(err.response?.data?.message || 'Failed to reopen doubt');
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Failed to reopen doubt. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [question._id, reopenReason, onStatusUpdate]);

  const handleCloseReopenDialog = useCallback(() => {
    if (!loading) {
      setOpenReopenDialog(false);
      setReopenReason('');
      setError('');
    }
  }, [loading]);

  const handleRatingSubmit = useCallback(async () => {
    setSnackbar({
      open: true,
      message: 'Rating submitted successfully!',
      severity: 'success'
    });
    if (onStatusUpdate) {
      await onStatusUpdate();
    }
  }, [onStatusUpdate]);

  const handleCommentClick = useCallback((e) => {
    e.stopPropagation();
    setOpenCommentsDialog(true);
  }, []);

  const status = statusConfig[question.status] || statusConfig.closed;
  const isAvailableForAssignment = question.status === 'unassigned' || question.status === 'open';
  const canReopen = user?.id === question.student?._id && question.status === 'resolved';
  const canRate = user?.id === question.student?._id && 
                 question.status === 'resolved' && 
                 !question.rating?.score;

  return (
    <>
      <StyledCard 
        onClick={handleCardClick}
        status={question.status}
        elevation={1}
        sx={{
          width: '100%',
          mb: 2,
          '& .MuiCardContent-root': {
            p: 3
          }
        }}
      >
        <StatusBadge status={question.status}>
          {statusConfig[question.status]?.label || 'Unknown'}
        </StatusBadge>
        <CardContent sx={{ flexGrow: 1, pb: 1, pt: 3 }}>
          <Typography 
            variant="h6" 
            component="h2" 
            gutterBottom
            sx={{ 
              fontWeight: 600,
              color: (theme) => theme.palette.text.primary,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.3,
            }}
          >
            {question.title}
          </Typography>
          
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              minHeight: '3em',
            }}
          >
            {question.description}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', alignItems: 'center', mb: 2 }}>
            <StyledChip
              label={question.topic}
              color="topic"
              size="small"
              variant="filled"
              onClick={handleChipClick}
              sx={{
                cursor: 'default'
              }}
            />
            <Tooltip title={new Date(question.createdAt).toLocaleString()}>
              <StyledChip
                icon={<AccessTime fontSize="small" />}
                label={`Posted ${new Date(question.createdAt).toLocaleDateString()}`}
                size="small"
                variant="outlined"
                onClick={handleChipClick}
                sx={{
                  cursor: 'default'
                }}
              />
            </Tooltip>
          </Box>

          {question.assignedTo && (
            <Paper 
              elevation={0} 
              sx={{ 
                p: 1.5,
                bgcolor: (theme) => theme.palette.grey[50],
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                borderRadius: 2,
                border: '1px solid',
                borderColor: (theme) => theme.palette.grey[200],
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: (theme) => theme.palette.primary.main,
                  fontSize: '1.1rem',
                }}
              >
                {question.assignedTo.name[0]}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" color="text.primary">
                  {question.assignedTo.name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Assigned Tutor • {question.assignedTo.expertise || 'Expert Tutor'}
                </Typography>
              </Box>
              {question.status === 'resolved' && (
                <Tooltip title="Successfully Resolved">
                  <IconButton size="small" sx={{ ml: 'auto', color: 'success.main' }}>
                    <EmojiEvents />
                  </IconButton>
                </Tooltip>
              )}
            </Paper>
          )}
        </CardContent>
        
        <CardActions sx={{ justifyContent: 'center', p: 2, pt: 0 }}>
          <Button
            variant="outlined"
            color="info"
            onClick={handleCommentClick}
            startIcon={<CommentOutlined />}
            sx={{
              minWidth: 100,
              fontWeight: 500,
              borderRadius: '8px',
              textTransform: 'none',
              mr: 1
            }}
          >
            Comments
          </Button>

          {showAssignButton && isAvailableForAssignment && (
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                if (onClick) onClick(); // Trigger modal
              }}
              disabled={loading}
              sx={{
                minWidth: 120,
                fontWeight: 500,
                borderRadius: '8px',
                textTransform: 'none',
              }}
            >
              Take this doubt
            </Button>
          )}
          
          {question.assignedTo?._id === user?.id && question.status === 'assigned' && (
            <Button
              variant="contained"
              color="success"
              onClick={handleResolveClick}
              disabled={loading}
              startIcon={<CheckCircle />}
              sx={{
                minWidth: 100,
                fontWeight: 500,
                borderRadius: '8px',
                textTransform: 'none',
              }}
            >
              Resolve
            </Button>
          )}
          
          {canReopen && (
            <Button
              variant="outlined"
              color="primary"
              onClick={handleReopenClick}
              disabled={loading}
              startIcon={<Refresh />}
              sx={{
                minWidth: 100,
                fontWeight: 500,
                borderRadius: '8px',
                textTransform: 'none',
              }}
            >
              Reopen
            </Button>
          )}

          {canRate && (
            <Button
              variant="outlined"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                setOpenRatingDialog(true);
              }}
              startIcon={<Star />}
              sx={{
                minWidth: 100,
                fontWeight: 500,
                borderRadius: '8px',
                textTransform: 'none',
              }}
            >
              Rate Resolution
            </Button>
          )}          {question.rating?.score && (
            <Chip
              icon={<Star sx={{ fontSize: '1.1rem !important' }} />}
              label={`${question.rating.score}/5 stars`}
              size="small"
              variant="outlined"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                if (question.rating.feedback) {
                  setSnackbar({
                    open: true,
                    message: `Feedback: ${question.rating.feedback}`,
                    severity: 'info'
                  });
                }
              }}
              sx={{
                borderRadius: '16px',
                '& .MuiChip-icon': {
                  color: 'primary.main',
                },
                cursor: question.rating.feedback ? 'pointer' : 'default',
                fontWeight: 500,
                ml: 1
              }}
            />
          )}
        </CardActions>
      </StyledCard>

      {/* Resolution Dialog */}
      <Dialog 
        open={openResolutionDialog} 
        onClose={() => setOpenResolutionDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            maxWidth: 500,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" component="div">
            Resolve Doubt
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please provide a detailed resolution for the student's doubt.
          </Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Resolution"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
          <Button 
            onClick={() => setOpenResolutionDialog(false)}
            color="inherit"
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleResolutionSubmit} 
            disabled={!resolution.trim() || loading}
            variant="contained"
            color="success"
            sx={{ borderRadius: 2, textTransform: 'none' }}
          >
            {loading ? 'Submitting...' : 'Mark as Resolved'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reopen Dialog */}
      <Dialog
        open={openReopenDialog}
        onClose={() => !loading && handleCloseReopenDialog()}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1
          }
        }}
      >
        <form onSubmit={handleReopenSubmit}>
          <DialogTitle>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Reopen Doubt
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please provide a reason for reopening this doubt
            </Typography>
          </DialogTitle>
          <DialogContent>
            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 2 }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            )}
            <TextField
              autoFocus
              margin="dense"
              label="Reason for reopening"
              fullWidth
              multiline
              rows={4}
              value={reopenReason}
              onChange={(e) => {
                setReopenReason(e.target.value);
                if (error) setError('');
              }}
              disabled={loading}
              error={!!error}
              placeholder="Explain why you need to reopen this doubt..."
              sx={{ mt: 1 }}
              required
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 1 }}>
            <Button
              type="button"
              onClick={() => handleCloseReopenDialog()}
              disabled={loading}
              sx={{ 
                borderRadius: 2, 
                textTransform: 'none',
                color: 'text.secondary'
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !reopenReason.trim()}
              sx={{ 
                borderRadius: 2, 
                textTransform: 'none',
                minWidth: 120
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={16} color="inherit" />
                  <span>Reopening...</span>
                </Box>
              ) : (
                'Reopen Doubt'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <RatingDialog
        open={openRatingDialog}
        onClose={() => setOpenRatingDialog(false)}
        question={question}
        onRatingSubmit={handleRatingSubmit}
      />

      <CommentDialog
        open={openCommentsDialog}
        onClose={() => setOpenCommentsDialog(false)}
        questionId={question._id}
        question={question}
      />

      {/* Snackbar for notifications */}
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
    </>
  );
};

export default React.memo(QuestionCard);
