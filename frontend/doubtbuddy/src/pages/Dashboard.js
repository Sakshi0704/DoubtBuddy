import React, { useState, useEffect, useCallback } from 'react';
import {
    Container,
    Typography,
    Button,
    Box,
    TextField,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert,
    Paper,
    Tabs,
    Tab,
    Stack
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import QuestionCard from '../components/QuestionCard';
import CommentDialog from '../components/CommentDialog';
import * as api from '../services/api';
import { useNavigate } from 'react-router-dom';
import InterChat from '../components/InterChat';

const ALL_STATUS = 'all';
const STATUS_TABS = [
    { value: ALL_STATUS, label: 'All Doubts' },
    { value: 'unassigned', label: 'Open' },
    { value: 'assigned', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' }
];

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [activeStatus, setActiveStatus] = useState(ALL_STATUS);
    const [newQuestion, setNewQuestion] = useState({
        title: '',
        description: '',
        topic: ''
    });
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const topics = [
        'Web Development',
        'JavaScript',
        'Python',
        'React',
        'Node.js',
        'Database',
        'Data Structures',
        'Java',
        'Machine Learning',
        'DevOps',
        'Cloud Computing',
        'Cybersecurity',
        'Mobile Development',
        'UI/UX Design'
    ];

    // Redirect tutors to their assigned doubts page
    useEffect(() => {
        if (user?.role === 'tutor') {
            navigate('/assigned-doubts');
        }
    }, [user, navigate]);

    const fetchQuestions = useCallback(async () => {
        if (!user) return;

        setLoading(true);
        setError('');
        try {
            const response = await api.getMyQuestions();
            setQuestions(response.data || []);
        } catch (err) {
            console.error('Error fetching questions:', err);
            setError(err.response?.data?.message || 'Failed to fetch questions');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);    const handleQuestionClick = useCallback((question) => {
        if (!question?._id) {
            console.error('Invalid question selected');
            return;
        }
        setSelectedQuestion(question);
        setShowComments(true);
    }, []);

    const handleStatusUpdate = useCallback(async () => {
        const success = await fetchQuestions();
        if (success) {
            setSnackbar({
                open: true,
                message: 'Question status updated successfully!',
                severity: 'success'
            });
        }
    }, [fetchQuestions]);

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    // Update status notifications
    const getStatusUpdateMessage = (status) => {
        switch(status) {
            case 'resolved':
                return 'Question marked as resolved';
            case 'reopened':
                return 'Question has been reopened';
            case 'assigned':
                return 'Question is now in progress';
            default:
                return 'Question status updated';
        }
    };

    const handleAskDoubt = () => {
        setOpenDialog(true);
    };

    const handleSubmit = async () => {
        if (!newQuestion.title.trim() || !newQuestion.description.trim() || !newQuestion.topic) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        setError('');
        try {
            await api.createQuestion(newQuestion);
            setOpenDialog(false);
            setNewQuestion({ title: '', description: '', topic: '' });
            fetchQuestions();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create question');
        } finally {
            setLoading(false);
        }
    };

    const filteredQuestions = questions.filter(q =>
        activeStatus === ALL_STATUS ? true : q.status === activeStatus
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>  {/* Changed to lg for better readability */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
                    My Learning Journey
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleAskDoubt}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 500,
                    }}
                >
                    Ask Your Doubt
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}      <Tabs
                value={activeStatus}
                onChange={(e, newValue) => setActiveStatus(newValue)}
                sx={{ mb: 3 }}
            >
                {STATUS_TABS.map(tab => {
                    const count = tab.value === ALL_STATUS
                        ? questions.length
                        : questions.filter(q => q.status === tab.value).length;
                    return (
                        <Tab
                            key={tab.value}
                            value={tab.value}
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    {tab.label}
                                    {count > 0 && (
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            sx={{
                                                bgcolor: 'action.selected',
                                                borderRadius: '12px',
                                                px: 1,
                                                py: 0.5,
                                                fontSize: '0.75rem',
                                                lineHeight: 1,
                                                fontWeight: 500,
                                                minWidth: 24,
                                                textAlign: 'center',
                                            }}
                                        >
                                            {count}
                                        </Typography>
                                    )}
                                </Box>
                            }
                            sx={{
                                textTransform: 'none',
                                fontWeight: tab.value === activeStatus ? 600 : 500,
                                color: tab.value === activeStatus ? 'primary.main' : 'text.secondary'
                            }}
                        />
                    );
                })}
            </Tabs>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : filteredQuestions.length === 0 ? (
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 8,
                        px: 2,
                        bgcolor: 'grey.50',
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No doubts found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {activeStatus === 'unassigned'
                            ? "You don't have any open doubts. Feel free to ask one!"
                            : `No doubts in ${activeStatus} status.`}
                    </Typography>
                </Box>
            ) : (
                <Stack spacing={2}>  {/* Changed from Grid to Stack for vertical layout */}
                    {filteredQuestions.map((question) => (
                        <QuestionCard
                            key={question._id}
                            question={question}
                            onClick={handleQuestionClick}
                            onStatusUpdate={handleStatusUpdate}
                        />
                    ))}
                </Stack>
            )}

            {/* New Question Dialog */}
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                    }
                }}
            >
                <DialogTitle>Ask a Doubt</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="normal"
                        label="Title"
                        fullWidth
                        value={newQuestion.title}
                        onChange={(e) => setNewQuestion(prev => ({ ...prev, title: e.target.value }))}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="normal"
                        label="Description"
                        fullWidth
                        multiline
                        rows={4}
                        value={newQuestion.description}
                        onChange={(e) => setNewQuestion(prev => ({ ...prev, description: e.target.value }))}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        select
                        margin="normal"
                        label="Topic"
                        fullWidth
                        value={newQuestion.topic}
                        onChange={(e) => setNewQuestion(prev => ({ ...prev, topic: e.target.value }))}
                    >
                        {topics.map((topic) => (
                            <MenuItem key={topic} value={topic}>
                                {topic}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
                    <Button
                        onClick={() => setOpenDialog(false)}
                        color="inherit"
                        sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading}
                        sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Comments Dialog */}
            {selectedQuestion && (
                <CommentDialog
                    open={showComments}
                    onClose={() => {
                        setShowComments(false);
                        setSelectedQuestion(null);
                    }}
                    question={selectedQuestion}
                    onStatusUpdate={handleStatusUpdate}
                />
            )}
            {/* InterChat only for students */}
            {user?.role === 'student' && <InterChat />}
        </Container>
    );
};

export default Dashboard;
