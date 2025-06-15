import React, { useState, useEffect, useCallback } from 'react';
import {
    Container,
    Typography,
    Box,
    Tabs,
    Tab,
    Alert,
    CircularProgress,
    Paper,
    useTheme,
    Divider,
    Stack,
    Badge,
} from '@mui/material';
import QuestionCard from '../components/QuestionCard';
import TutorStats from '../components/TutorStats';
import * as api from '../services/api';

const AssignedDoubts = () => {
    const theme = useTheme();
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('assigned');
    const [stats, setStats] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const fetchQuestions = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await api.getAssignedQuestions();
            const fetchedQuestions = response.data || [];
            setQuestions(fetchedQuestions);

            // Calculate stats
            const resolvedQuestions = fetchedQuestions.filter(q => q.status === 'resolved');
            const assignedQuestions = fetchedQuestions.filter(q => q.status === 'assigned');
            const uniqueStudents = new Set(fetchedQuestions.map(q => q.student?._id));

            setStats({
                resolvedCount: resolvedQuestions.length,
                totalStudentsHelped: uniqueStudents.size,
                averageTime: "25 mins",
                activeStreak: 7,
                satisfactionRate: 98,
                responseRate: 94
            });

            return true;
        } catch (err) {
            console.error('Error fetching questions:', err);
            setError(err.response?.data?.message || 'Failed to fetch assigned doubts');
            setSnackbar({
                open: true,
                message: err.response?.data?.message || 'Failed to fetch assigned doubts',
                severity: 'error'
            });
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    // Handle status updates
    const handleStatusUpdate = useCallback(async () => {
        const success = await fetchQuestions();
        if (success) {
            setSnackbar({
                open: true,
                message: 'Doubt status updated successfully!',
                severity: 'success'
            });
        }
    }, [fetchQuestions]);

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    useEffect(() => {
        fetchQuestions();
    }, [fetchQuestions]);

    const filteredQuestions = questions.filter(q =>
        activeTab === 'all' ? true : q.status === activeTab
    );

    // Count questions by status
    const getCounts = () => {
        const all = questions.length;
        const inProgress = questions.filter(q => q.status === 'assigned').length;
        const resolved = questions.filter(q => q.status === 'resolved').length;
        return { all, inProgress, resolved };
    };

    const counts = getCounts();

    // Custom Tab with count
    const TabWithCount = ({ label, count }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {label}
            <Box
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
            </Box>
        </Box>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Tutor Stats Section */}
            <TutorStats stats={stats} loading={loading} />

            {/* Tabs and Content */}
            <Paper
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'grey.200',
                    mb: 3
                }}
            >
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                    Your Doubts
                </Typography>

                <Tabs
                    value={activeTab}
                    onChange={(e, newValue) => setActiveTab(newValue)}
                    sx={{
                        mb: 3,
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 500,
                            minHeight: 48,
                        },
                    }}
                >
                    <Tab
                        label={<TabWithCount label="All Doubts" count={counts.all} />}
                        value="all"
                    />
                    <Tab
                        label={<TabWithCount label="In Progress" count={counts.inProgress} />}
                        value="assigned"
                    />
                    <Tab
                        label={<TabWithCount label="Resolved" count={counts.resolved} />}
                        value="resolved"
                    />
                </Tabs>

                <Divider sx={{ mb: 3 }} />

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

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
                            {activeTab === 'assigned'
                                ? "You haven't taken any doubts yet. Check the available doubts section to help students!"
                                : activeTab === 'resolved'
                                    ? "You haven't resolved any doubts yet. Keep helping students to build your impact!"
                                    : "No doubts found for the selected filter."}
                        </Typography>
                    </Box>
                ) : (
                    <Stack spacing={2}>
                        {filteredQuestions.map((question) => (
                            <QuestionCard
                                key={question._id}
                                question={question}
                                onStatusUpdate={handleStatusUpdate}
                            />
                        ))}
                    </Stack>
                )}
            </Paper>
        </Container>
    );
};

export default AssignedDoubts;
