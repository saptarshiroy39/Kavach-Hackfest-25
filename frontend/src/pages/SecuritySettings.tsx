import React, { useState, useEffect, useContext } from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Box, 
  Switch, 
  FormControlLabel,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { AuthContext } from '../contexts/AuthContext';
import { getSecuritySettings, updateSecuritySettings, requestNewTOTP } from '../services/security';
import { QRCodeSVG } from 'qrcode.react';

interface SecuritySettingsData {
  twoFactorEnabled: boolean;
  emailNotificationsEnabled: boolean;
  loginAlertsEnabled: boolean;
  ipRestrictionEnabled: boolean;
}

const SecuritySettings = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showTOTP, setShowTOTP] = useState(false);
  const [totpSecret, setTotpSecret] = useState('');
  const [totpQrUrl, setTotpQrUrl] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [settings, setSettings] = useState<SecuritySettingsData>({
    twoFactorEnabled: false,
    emailNotificationsEnabled: false,
    loginAlertsEnabled: false,
    ipRestrictionEnabled: false
  });

  useEffect(() => {
    const fetchSecuritySettings = async () => {
      try {
        setLoading(true);
        const data = await getSecuritySettings();
        setSettings({
          twoFactorEnabled: data.twoFactorEnabled || false,
          emailNotificationsEnabled: data.emailNotificationsEnabled || false,
          loginAlertsEnabled: data.loginAlertsEnabled || false,
          ipRestrictionEnabled: data.ipRestrictionEnabled || false
        });
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load security settings');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSecuritySettings();
    }
  }, [user]);

  const handleToggleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [event.target.name]: event.target.checked
    });
  };

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    
    try {
      setSaving(true);
      await updateSecuritySettings(settings);
      setSuccess('Security settings updated successfully');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update security settings');
    } finally {
      setSaving(false);
    }
  };

  const handleEnableTwoFactor = async () => {
    try {
      setLoading(true);
      const response = await requestNewTOTP();
      setTotpSecret(response.secret);
      setTotpQrUrl(response.qrUrl);
      setShowTOTP(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate 2FA credentials');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <SecurityIcon sx={{ mr: 1 }} fontSize="large" /> Security Settings
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid component="div" item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Account Security
            </Typography>
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.twoFactorEnabled}
                    onChange={handleToggleChange}
                    name="twoFactorEnabled"
                    color="primary"
                  />
                }
                label="Two-Factor Authentication (2FA)"
              />
              {!settings.twoFactorEnabled && (
                <Button 
                  variant="outlined" 
                  size="small" 
                  sx={{ ml: 2 }}
                  onClick={handleEnableTwoFactor}
                >
                  Set Up
                </Button>
              )}
            </Box>

            {showTOTP && (
              <Card variant="outlined" sx={{ mb: 3 }}>
                <CardContent>                  <Typography variant="subtitle1" gutterBottom>
                    Scan this QR code with your authenticator app
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <QRCodeSVG value={totpQrUrl} size={180} />
                  </Box>
                  <Typography variant="body2">
                    Or enter this code manually: <strong>{totpSecret}</strong>
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    variant="contained" 
                    onClick={() => {
                      setSettings({...settings, twoFactorEnabled: true});
                      setShowTOTP(false);
                    }}
                  >
                    I've scanned the code
                  </Button>
                </CardActions>
              </Card>
            )}

            <FormControlLabel
              control={
                <Switch
                  checked={settings.ipRestrictionEnabled}
                  onChange={handleToggleChange}
                  name="ipRestrictionEnabled"
                  color="primary"
                />
              }
              label="IP Address Restriction"
            />
          </Paper>
        </Grid>

        <Grid component="div" item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Notifications
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={settings.emailNotificationsEnabled}
                  onChange={handleToggleChange}
                  name="emailNotificationsEnabled"
                  color="primary"
                />
              }
              label="Email Security Notifications"
            />
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.loginAlertsEnabled}
                    onChange={handleToggleChange}
                    name="loginAlertsEnabled"
                    color="primary"
                  />
                }
                label="Login Attempt Alerts"
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={saving}
          size="large"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </Box>
    </Container>
  );
};

export default SecuritySettings;
