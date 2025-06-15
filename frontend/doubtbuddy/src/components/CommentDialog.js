import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Alert,
  Avatar,
  Paper,
} from '@mui/material';
import * as api from '../services/api';

const CommentDialog = ({ open, onClose, questionId, question }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchComments = useCallback(async () => {
    if (!questionId) {
      console.error('No question ID provided');
      setError('Unable to load comments');
      return;
    }
  
    setLoading(true);
    setError('');
    try {
      const response = await api.getComments(questionId);
      setComments(response.data);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  }, [questionId]);

  useEffect(() => {
    if (open && questionId) {
      fetchComments();
    }
  }, [open, questionId, fetchComments]);
  const handleAddComment = async () => {
    if (!questionId) {
      setError('Cannot add comment - invalid question');
      return;
    }
    
    if (!newComment.trim()) return;

    setLoading(true);
    setError('');
    try {
      await api.addComment(questionId, newComment.trim());
      setNewComment('');
      await fetchComments();
    } catch (err) {
      console.error('Error adding comment:', err);
      setError(err.response?.data?.msg || 'Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleAddComment();
    }
  };
  // Early return if no question ID to prevent undefined errors
  if (!questionId) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Discussion: {question?.title}
      </DialogTitle>
      <DialogContent>
        {/* Question Details */}
        <Box mb={3}>
          <Typography variant="subtitle1" color="text.secondary">
            Description:
          </Typography>
          <Typography variant="body1" paragraph>
            {question?.description}
          </Typography>
          <Divider />
        </Box>

        {/* Comments List */}
        <List sx={{ py: 0 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 3 }}>
              <CircularProgress />
            </Box>
          )}
          
          {comments.length === 0 && !loading && (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <Typography color="text.secondary">
                No comments yet
              </Typography>
            </Box>
          )}
          
          {comments.map((comment) => (
            <Paper 
              key={comment._id} 
              variant="outlined" 
              sx={{ mb: 2, p: 2, bgcolor: 'background.paper' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {comment.user?.name?.[0] || 'A'}
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" component="div" gutterBottom>
                    {comment.user?.name || 'Anonymous'}
                  </Typography>
                  <Typography variant="body1" color="text.primary" paragraph sx={{ whiteSpace: 'pre-wrap' }}>
                    {comment.text}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(comment.createdAt).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </List>
      </DialogContent>
      
      <DialogActions sx={{ flexDirection: 'column', p: 2, gap: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={loading}
        />
        <Box sx={{ display: 'flex', gap: 1, alignSelf: 'flex-end' }}>
          <Button onClick={onClose} color="inherit">
            Close
          </Button>
          <Button
            onClick={handleAddComment}
            variant="contained"
            disabled={!newComment.trim() || loading}
          >
            {loading ? 'Adding...' : 'Add Comment'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default CommentDialog;
