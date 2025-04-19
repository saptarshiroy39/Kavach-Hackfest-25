import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box,
  TextField, 
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import WarningIcon from '@mui/icons-material/Warning';
import LinkIcon from '@mui/icons-material/Link';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { checkPhishingUrl } from '../services/security';

interface PhishingCheckResult {
  isPhishing: boolean;
  score: number;
  confidence: number;
  reasons: string[];
  recommendations: string[];
}

const PhishingCheck = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<PhishingCheckResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      setError('Please enter a URL to check');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setResult(null);
      
      const data = await checkPhishingUrl(url);
      setResult(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to check URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <VerifiedUserIcon sx={{ mr: 1 }} fontSize="large" /> 
        Phishing URL Check
      </Typography>
      
      <Typography variant="body1" paragraph>
        Enter a URL to check if it's potentially a phishing website. Our AI will analyze the URL 
        and provide an assessment of its safety.
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Enter URL to check"
            placeholder="https://example.com"
            variant="outlined"
            value={url}
            onChange={handleInputChange}
            InputProps={{
              startAdornment: <LinkIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            sx={{ mb: 2 }}
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            size="large"
            disabled={loading}
            sx={{ minWidth: 150 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Check URL'}
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {result && (
        <Card variant="outlined">
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {result.isPhishing ? (
                <WarningIcon color="error" fontSize="large" sx={{ mr: 1 }} />
              ) : (
                <CheckCircleIcon color="success" fontSize="large" sx={{ mr: 1 }} />
              )}
              <Typography variant="h5">
                {result.isPhishing ? 'Potential Phishing Detected' : 'URL Appears Safe'}
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Risk Score:</strong> {result.score}/10
              {' '}
              <strong>Confidence:</strong> {(result.confidence * 100).toFixed(1)}%
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Analysis Details
            </Typography>

            <List dense>
              {result.reasons.map((reason, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {result.isPhishing ? <CancelIcon color="error" /> : <CheckCircleIcon color="success" />}
                  </ListItemIcon>
                  <ListItemText primary={reason} />
                </ListItem>
              ))}
            </List>

            {result.recommendations.length > 0 && (
              <>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Recommendations
                </Typography>
                <List dense>
                  {result.recommendations.map((recommendation, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <VerifiedUserIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText primary={recommendation} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default PhishingCheck;
