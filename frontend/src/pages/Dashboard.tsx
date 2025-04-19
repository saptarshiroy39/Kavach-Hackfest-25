import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  CircularProgress, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon,
  Divider,
  Button,
  Alert
} from '@mui/material';
import {
  Security as SecurityIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Phishing as PhishingIcon
} from '@mui/icons-material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import UserService from '../services/user';
import { useNavigate } from 'react-router-dom';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await UserService.getDashboard();
        setDashboardData(data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Prepare chart data
  const securityScoreChartData = {
    labels: ['Secure', 'At Risk'],
    datasets: [
      {
        data: dashboardData ? [dashboardData.securityScore, 100 - dashboardData.securityScore] : [0, 100],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Digital Persona Guardian Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Security Score Card */}
        <Grid xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Security Score
            </Typography>
            <Box sx={{ height: 200, width: 200, position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Doughnut data={securityScoreChartData} options={chartOptions} />
              <Typography variant="h4" sx={{ position: 'absolute' }}>
                {dashboardData.securityScore}%
              </Typography>
            </Box>
            <Typography 
              variant="body1" 
              sx={{ 
                mt: 2, 
                color: dashboardData.securityScore >= 80
                  ? 'success.main'
                  : dashboardData.securityScore >= 60
                  ? 'warning.main'
                  : 'error.main'
              }}
            >
              {dashboardData.securityScore >= 80
                ? 'Excellent'
                : dashboardData.securityScore >= 60
                ? 'Good'
                : 'Needs Improvement'}
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              sx={{ mt: 2 }}
              onClick={() => navigate('/security-settings')}
            >
              Improve Security
            </Button>
          </Paper>
        </Grid>
        {/* Recent Security Events */}
        <Grid xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Recent Security Events
            </Typography>
            {dashboardData.recentEvents.length === 0 ? (
              <Typography variant="body1">No recent security events</Typography>
            ) : (
              <List>
                {dashboardData.recentEvents.slice(0, 5).map((event: any, index: number) => (
                  <React.Fragment key={event.id || index}>
                    <ListItem>
                      <ListItemIcon>
                        {event.riskLevel === 'high' || event.riskLevel === 'critical' ? (
                          <WarningIcon color="error" />
                        ) : event.riskLevel === 'medium' ? (
                          <InfoIcon color="warning" />
                        ) : (
                          <CheckCircleIcon color="success" />
                        )}
                      </ListItemIcon>
                      <ListItemText 
                        primary={event.description} 
                        secondary={new Date(event.createdAt).toLocaleString()}
                      />
                    </ListItem>
                    {index < dashboardData.recentEvents.slice(0, 5).length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
            <Button 
              variant="outlined" 
              sx={{ mt: 2 }}
              onClick={() => navigate('/security-events')}
            >
              View All Events
            </Button>
          </Paper>
        </Grid>

        {/* Security Metrics & Recommendations */}
        <Grid xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Security Status
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                <Grid xs={6}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2, 
                      bgcolor: 'error.light', 
                      color: 'error.contrastText',
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="h4">{dashboardData.metrics.highRiskEvents}</Typography>
                    <Typography variant="body2">High Risk Events</Typography>
                  </Paper>
                </Grid>
                <Grid xs={6}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2, 
                      bgcolor: 'warning.light', 
                      color: 'warning.contrastText',
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="h4">{dashboardData.metrics.phishingAttempts}</Typography>
                    <Typography variant="body2">Phishing Attempts</Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
              Recommendations
            </Typography>
            <List>
              {dashboardData.recommendations.map((recommendation: string, index: number) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <SecurityIcon color="primary" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={recommendation} />
                </ListItem>
              ))}
            </List>

            <Button 
              variant="contained" 
              color="secondary" 
              startIcon={<PhishingIcon />}
              sx={{ mt: 2 }}
              onClick={() => navigate('/phishing-check')}
            >
              Check for Phishing
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
