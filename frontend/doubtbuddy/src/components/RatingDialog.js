import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Rating,
    TextField,
    Box,
    Alert,
} from '@mui/material';
import { Star } from '@mui/icons-material';
import * as api from '../services/api';

const RatingDialog = ({ open, onClose, question, onRatingSubmit }) => {
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await api.rateDoubt(question._id, rating, feedback);
            onRatingSubmit();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit rating');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading) {
            setRating(0);
            setFeedback('');
            setError('');
            onClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    p: 1
                }
            }}
        >
            <form onSubmit={handleSubmit}>
                <DialogTitle>
                    <Typography variant="h6" sx={{ mb: 1 }}>
                        Rate Resolution
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        How satisfied are you with the resolution?
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
                    )}          <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        py: 2
                    }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            mb: 3
                        }}>
                            <Rating
                                value={rating}
                                onChange={(e, newValue) => {
                                    setRating(newValue);
                                    if (error) setError('');
                                }}
                                size="large"
                                emptyIcon={<Star style={{ opacity: 0.3 }} fontSize="inherit" />}
                                sx={{
                                    mb: 1,
                                    '& .MuiRating-iconFilled': {
                                        color: 'primary.main',
                                    },
                                    '& .MuiRating-iconHover': {
                                        color: 'primary.light',
                                    }
                                }}
                            />
                            <Typography variant="h6" color={rating > 0 ? 'primary.main' : 'text.secondary'} sx={{ mt: 1 }}>
                                {rating === 0 && 'Rate your experience'}
                                {rating === 1 && 'Poor'}
                                {rating === 2 && 'Fair'}
                                {rating === 3 && 'Good'}
                                {rating === 4 && 'Very Good'}
                                {rating === 5 && 'Excellent'}
                            </Typography>
                        </Box>
                        <TextField
                            margin="dense"
                            label="Additional Feedback (Optional)"
                            fullWidth
                            multiline
                            rows={4}
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            disabled={loading}
                            placeholder="Tell us more about your experience..."
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 1 }}>
                    <Button
                        type="button"
                        onClick={handleClose}
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
                        disabled={loading || rating === 0}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            minWidth: 100
                        }}
                    >
                        {loading ? 'Submitting...' : 'Submit Rating'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default RatingDialog;
