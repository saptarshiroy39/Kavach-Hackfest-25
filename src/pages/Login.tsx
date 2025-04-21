import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Fingerprint, 
  Smartphone 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockApi } from '@/lib/mockDb';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!showTwoFactor) {
        const result = await mockApi.login(email, password);
        if (result.success) {
          setShowTwoFactor(true);
          toast({
            title: "Login successful",
            description: "Please verify your identity with two-factor authentication.",
          });
        } else {
          toast({
            title: "Login failed",
            description: result.error || "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        }
      } else {
        const result = await mockApi.verifyTwoFactor(verificationCode);
        if (result.success) {
          toast({
            title: "Authentication successful",
            description: "Welcome back to Kavach.",
          });
          
          // Store the authentication token and role in localStorage
          localStorage.setItem('auth-token', result.token || 'mock-jwt-token-' + Math.random().toString(36).substring(2, 15));
          localStorage.setItem('user-role', 'user');
          
          // Dispatch event to notify App component about auth state change
          window.dispatchEvent(new Event('auth-state-changed'));
          
          // Navigate programmatically using navigate function
          navigate('/');
        } else {
          toast({
            title: "Verification failed",
            description: result.error || "Invalid verification code. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative">
      <div className="bg-sidebar md:w-1/2 p-8 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto text-6xl text-security-primary">🌀</div>
            <h1 className="mt-4 text-3xl font-bold text-white">Kavach</h1>
            <p className="mt-2 text-security-info">
              Advanced security for your digital identity
            </p>
          </div>
          <div className="rounded-lg bg-sidebar-accent p-6 space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Lock className="h-6 w-6 text-security-primary" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-white">End-to-End Encryption</h3>
                <p className="mt-1 text-xs text-sidebar-foreground/70">
                  Your data is encrypted and only accessible by you
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Fingerprint className="h-6 w-6 text-security-secondary" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-white">Biometric Authentication</h3>
                <p className="mt-1 text-xs text-sidebar-foreground/70">
                  Use your fingerprint or face for secure access
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Smartphone className="h-6 w-6 text-security-warning" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-white">Cross-Device Protection</h3>
                <p className="mt-1 text-xs text-sidebar-foreground/70">
                  Secure across all your devices and platforms
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 p-8 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-3xl font-bold">{showTwoFactor ? 'Verify Identity' : 'Sign in to Kavach'}</h2>
            <p className="mt-2 text-muted-foreground">
              {showTwoFactor 
                ? 'Enter the verification code from your authenticator app' 
                : 'Enter your credentials to access your secure vault'}
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!showTwoFactor ? (
              <>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className="pl-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-security-primary focus:ring-security-primary"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-muted-foreground">
                      Remember me
                    </label>
                  </div>
                  
                  <a href="#" className="text-sm text-security-primary hover:underline">
                    Forgot password?
                  </a>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="rounded-lg border border-muted p-4 flex flex-col items-center justify-center">
                  <Smartphone className="w-16 h-16 text-security-primary mb-4" />
                  <p className="text-sm text-center text-muted-foreground">
                    Open your authenticator app and enter the 6-digit verification code
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="verification-code" className="block text-sm font-medium">
                    Verification Code
                  </label>
                  <Input
                    id="verification-code"
                    name="verification-code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                    className="text-center text-lg font-mono tracking-widest"
                    required
                  />
                </div>
                
                <div className="flex items-center">
                  <button
                    type="button"
                    className="text-sm text-security-primary hover:underline"
                    onClick={() => setShowTwoFactor(false)}
                  >
                    Back to login
                  </button>
                </div>
              </div>
            )}
            
            <Button
              type="submit"
              className="w-full bg-security-primary hover:bg-security-primary/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                  {showTwoFactor ? 'Verifying...' : 'Signing in...'}
                </>
              ) : (
                <>{showTwoFactor ? 'Verify Identity' : 'Sign in'}</>
              )}
            </Button>
          </form>
          
          <div className="mt-6">
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{' '}
              <a href="#" className="text-security-primary hover:underline">
                Create an account
              </a>
            </p>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 py-4 text-center text-sm text-muted-foreground">
        <p>🌀 Made with ❤️ by Team Code Crafters</p>
      </div>
    </div>
  );
};

export default Login;
