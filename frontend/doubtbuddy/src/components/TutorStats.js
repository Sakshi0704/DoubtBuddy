import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Tooltip,
  LinearProgress,
  Skeleton,
} from '@mui/material';
import {
  EmojiEvents,
  Speed,
  Timer,
  TrendingUp,
} from '@mui/icons-material';

const StatCard = ({ icon, title, value, subtitle, color, progress, loading }) => (
  <Paper
    elevation={0}
    sx={{
      p: 2,
      height: '100%',
      border: '1px solid',
      borderColor: 'grey.200',
      borderRadius: 3,
      background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
    }}
  >
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: `${color}15`,
          color: color,
          mr: 2,
        }}
      >
        {icon}
      </Box>
      <Box>
        {loading ? (
          <Skeleton width={60} height={32} />
        ) : (
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {value}
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>
    </Box>
    {subtitle && (
      loading ? (
        <Skeleton width={140} height={20} />
      ) : (
        <Typography variant="caption" color="text.secondary" display="block">
          {subtitle}
        </Typography>
      )
    )}
    {progress !== undefined && (
      <Box sx={{ mt: 1 }}>
        {loading ? (
          <Skeleton height={6} />
        ) : (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: `${color}15`,
              '& .MuiLinearProgress-bar': {
                bgcolor: color,
              },
            }}
          />
        )}
      </Box>
    )}
  </Paper>
);

const TutorStats = ({ stats, loading = false }) => {
  const cardColors = {
    resolved: '#2196f3',
    response: '#4caf50',
    streak: '#ff9800',
    satisfaction: '#e91e63'
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
        Your Impact
      </Typography>
      <Grid container spacing={3}>
        <Grid item gridSize={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<EmojiEvents />}
            title="Doubts Resolved"
            value={stats?.resolvedCount || 0}
            subtitle={`Helped ${stats?.totalStudentsHelped || 0} students`}
            color={cardColors.resolved}
            loading={loading}
          />
        </Grid>
        <Grid item gridSize={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<Speed />}
            title="Avg. Response Time"
            value={stats?.averageTime || "N/A"}
            subtitle={stats?.responseTimeRank || "Building your stats..."}
            color={cardColors.response}
            loading={loading}
          />
        </Grid>
        <Grid item gridSize={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<Timer />}
            title="Active Streak"
            value={stats?.activeStreak ? `${stats.activeStreak} days` : "0 days"}
            subtitle={stats?.streakMessage || "Start helping students!"}
            color={cardColors.streak}
            loading={loading}
          />
        </Grid>
        <Grid item gridSize={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            icon={<TrendingUp />}
            title="Response Rate"
            value={`${stats?.responseRate || 0}%`}
            subtitle="Student satisfaction rate"
            color={cardColors.satisfaction}
            progress={stats?.responseRate || 0}
            loading={loading}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default TutorStats;
