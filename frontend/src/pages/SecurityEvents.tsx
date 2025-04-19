import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { getSecurityEvents } from '../services/security';

interface SecurityEvent {
  id: string;
  timestamp: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  ipAddress: string;
  isResolved: boolean;
  userId: string;
}

interface SecurityEventSummary {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

const SecurityEvents = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [summary, setSummary] = useState<SecurityEventSummary>({
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchSecurityEvents = async () => {
      try {
        setLoading(true);
        const data = await getSecurityEvents();
        setEvents(data.events);
        
        // Calculate summary
        const summaryData = {
          total: data.events.length,
          critical: data.events.filter((e: SecurityEvent) => e.severity === 'critical').length,
          high: data.events.filter((e: SecurityEvent) => e.severity === 'high').length,
          medium: data.events.filter((e: SecurityEvent) => e.severity === 'medium').length,
          low: data.events.filter((e: SecurityEvent) => e.severity === 'low').length
        };
        setSummary(summaryData);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load security events');
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityEvents();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <ErrorIcon color="error" />;
      case 'high':
        return <WarningIcon sx={{ color: 'orange' }} />;
      case 'medium':
        return <WarningIcon color="warning" />;
      case 'low':
        return <InfoIcon color="info" />;
      default:
        return <InfoIcon />;
    }
  };

  const getSeverityChip = (severity: string) => {
    let color: 'error' | 'warning' | 'info' | 'success' = 'info';
    
    switch (severity) {
      case 'critical':
        color = 'error';
        break;
      case 'high':
        color = 'error';
        break;
      case 'medium':
        color = 'warning';
        break;
      case 'low':
        color = 'info';
        break;
    }
    
    return (
      <Chip 
        icon={getSeverityIcon(severity)} 
        label={severity.toUpperCase()} 
        color={color} 
        size="small" 
        variant="outlined"
      />
    );
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Security Events
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid component="div" item xs={6} md={3}>
            <Card sx={{ bgcolor: 'primary.light' }}>
              <CardContent>
                <Typography color="primary.contrastText" variant="h6">Total Events</Typography>
                <Typography color="primary.contrastText" variant="h3">{summary.total}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid component="div" item xs={6} md={3}>
            <Card sx={{ bgcolor: 'error.light' }}>
              <CardContent>
                <Typography color="error.contrastText" variant="h6">Critical</Typography>
                <Typography color="error.contrastText" variant="h3">{summary.critical}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid component="div" item xs={6} md={3}>
            <Card sx={{ bgcolor: 'warning.light' }}>
              <CardContent>
                <Typography color="warning.contrastText" variant="h6">High/Medium</Typography>
                <Typography color="warning.contrastText" variant="h3">{summary.high + summary.medium}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid component="div" item xs={6} md={3}>
            <Card sx={{ bgcolor: 'info.light' }}>
              <CardContent>
                <Typography color="info.contrastText" variant="h6">Low</Typography>
                <Typography color="info.contrastText" variant="h3">{summary.low}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader aria-label="security events table">
            <TableHead>
              <TableRow>
                <TableCell>Time</TableCell>
                <TableCell>Event Type</TableCell>
                <TableCell>Severity</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>IP Address</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((event) => (
                  <TableRow hover key={event.id}>
                    <TableCell>
                      {new Date(event.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>{event.type}</TableCell>
                    <TableCell>{getSeverityChip(event.severity)}</TableCell>
                    <TableCell>{event.description}</TableCell>
                    <TableCell>{event.ipAddress}</TableCell>
                    <TableCell>
                      <Chip 
                        icon={event.isResolved ? <CheckCircleIcon /> : <WarningIcon />}
                        label={event.isResolved ? 'Resolved' : 'Open'}
                        color={event.isResolved ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              {events.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No security events found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={events.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default SecurityEvents;
