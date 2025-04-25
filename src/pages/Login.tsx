import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
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
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/hooks/use-theme';
import { motion } from 'framer-motion';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, resolvedTheme } = useTheme();
  
  const isLightTheme = resolvedTheme === 'light';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!showTwoFactor) {
        const result = await mockApi.login(email, password);
        if (result.success) {
          setShowTwoFactor(true);
          localStorage.setItem('user-email', email);
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
          localStorage.setItem('auth-token', result.token || 'mock-jwt-token-' + Math.random().toString(36).substring(2, 15));
          localStorage.setItem('user-role', result.userRole || 'user');
          localStorage.setItem('user-email', email);
          window.dispatchEvent(new Event('auth-state-changed'));
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1,
        duration: 0.5
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        when: "afterChildren",
        staggerChildren: 0.05,
        staggerDirection: -1,
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    exit: { y: -20, opacity: 0 }
  };

  const navigateToSignup = () => {
    navigate('/signup');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="min-h-screen flex flex-col md:flex-row relative overflow-hidden"
    >
      {/* Theme toggle in the top-right corner */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
      
      {/* Animated gradient background */}
      <div className="absolute inset-0 w-full h-full -z-10">
        <div className={`absolute inset-0 bg-gradient-to-br ${isLightTheme 
          ? 'from-blue-50 via-indigo-50/50 to-cyan-50/80' 
          : 'from-slate-900 via-indigo-950/50 to-blue-950/80'} animate-gradient-slow`}></div>
        <div className={`absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] ${isLightTheme 
          ? 'from-blue-200/30 via-transparent to-transparent' 
          : 'from-blue-800/20 via-transparent to-transparent'}`}></div>
      </div>
      
      {/* Left panel */}
      <motion.div 
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="md:w-1/2 p-8 flex items-center justify-center backdrop-blur-sm"
      >
        <div className="max-w-md w-full space-y-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div
              variants={itemVariants}
              className="flex justify-center"
            >
              <svg 
                className={`h-20 w-20 ${isLightTheme ? 'text-blue-500' : 'text-blue-400'} animate-shield-appear-glow`}
                viewBox="0 0 24 24" 
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path fillRule="evenodd" clipRule="evenodd" d="M3.37752 5.08241C3 5.62028 3 7.21907 3 10.4167V11.9914C3 17.6294 7.23896 20.3655 9.89856 21.5273C10.62 21.8424 10.9807 22 12 22C13.0193 22 13.38 21.8424 14.1014 21.5273C16.761 20.3655 21 17.6294 21 11.9914V10.4167C21 7.21907 21 5.62028 20.6225 5.08241C20.245 4.54454 18.7417 4.02996 15.7351 3.00079L15.1623 2.80472C13.595 2.26824 12.8114 2 12 2C11.1886 2 10.405 2.26824 8.83772 2.80472L8.26491 3.00079C5.25832 4.02996 3.75503 4.54454 3.37752 5.08241ZM10.8613 8.36335L10.7302 8.59849C10.5862 8.85677 10.5142 8.98591 10.402 9.07112C10.2897 9.15633 10.1499 9.18796 9.87035 9.25122L9.61581 9.30881C8.63194 9.53142 8.14001 9.64273 8.02297 10.0191C7.90593 10.3955 8.2413 10.7876 8.91204 11.572L9.08557 11.7749C9.27617 11.9978 9.37147 12.1092 9.41435 12.2471C9.45722 12.385 9.44281 12.5336 9.41399 12.831L9.38776 13.1018C9.28635 14.1482 9.23565 14.6715 9.54206 14.9041C9.84847 15.1367 10.3091 14.9246 11.2303 14.5005L11.4686 14.3907C11.7304 14.2702 11.8613 14.2099 12 14.2099C12.1387 14.2099 12.2696 14.2702 12.5314 14.3907L12.7697 14.5005C13.6909 14.9246 14.1515 15.1367 14.4579 14.9041C14.7644 14.6715 14.7136 14.1482 14.6122 13.1018L14.586 12.831C14.5572 12.5337 14.5428 12.385 14.5857 12.2471C14.6285 12.1092 14.7238 11.9978 14.9144 11.7749L15.088 11.572C15.7587 10.7876 16.0941 10.3955 15.977 10.0191C15.86 9.64273 15.3681 9.53142 14.3842 9.30881L14.1296 9.25122C13.8501 9.18796 13.7103 9.15633 13.598 9.07112C13.4858 8.98592 13.4138 8.85678 13.2698 8.5985L13.1387 8.36335C12.6321 7.45445 12.3787 7 12 7C11.6213 7 11.3679 7.45445 10.8613 8.36335Z" />
              </svg>
            </motion.div>
            <motion.h1 
              variants={itemVariants}
              className={`mt-4 text-3xl font-bold ${isLightTheme ? 'text-blue-600' : 'text-white'}`}
            >
              Kavach
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className={`mt-2 ${isLightTheme ? 'text-cyan-600' : 'text-security-info'}`}
            >
              Advanced security for your digital identity
            </motion.p>
          </motion.div>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`rounded-xl ${isLightTheme 
              ? 'bg-white/70 border border-blue-100/80 shadow-lg shadow-blue-100/30' 
              : 'bg-slate-800/70 border border-slate-700/80 shadow-lg shadow-black/20'} 
              backdrop-blur-md p-6 space-y-4 transition-all duration-500 hover:shadow-xl hover:scale-[1.02]`}
          >
            <motion.div variants={itemVariants} className="flex items-start">
              <div className="flex-shrink-0">
                <Lock className={`h-6 w-6 ${isLightTheme ? 'text-blue-500' : 'text-security-primary'}`} />
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${isLightTheme ? 'text-blue-700' : 'text-white'}`}>End-to-End Encryption</h3>
                <p className={`mt-1 text-xs ${isLightTheme ? 'text-blue-600' : 'text-slate-400'}`}>
                  Your data is encrypted and only accessible by you
                </p>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="flex items-start">
              <div className="flex-shrink-0">
                <Fingerprint className={`h-6 w-6 ${isLightTheme ? 'text-green-500' : 'text-security-secondary'}`} />
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${isLightTheme ? 'text-blue-700' : 'text-white'}`}>Biometric Authentication</h3>
                <p className={`mt-1 text-xs ${isLightTheme ? 'text-blue-600' : 'text-slate-400'}`}>
                  Use your fingerprint or face for secure access
                </p>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="flex items-start">
              <div className="flex-shrink-0">
                <Smartphone className={`h-6 w-6 ${isLightTheme ? 'text-orange-500' : 'text-security-warning'}`} />
              </div>
              <div className="ml-3">
                <h3 className={`text-sm font-medium ${isLightTheme ? 'text-blue-700' : 'text-white'}`}>Cross-Device Protection</h3>
                <p className={`mt-1 text-xs ${isLightTheme ? 'text-blue-600' : 'text-slate-400'}`}>
                  Secure across all your devices and platforms
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Right panel */}
      <motion.div 
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className={`flex-1 p-8 flex items-center justify-center ${isLightTheme 
          ? 'bg-gradient-to-br from-white/80 to-white/40' 
          : 'bg-gradient-to-br from-slate-900/80 to-slate-800/40'} 
          backdrop-blur-md relative`}
      >
        {/* Connecting gradient between panels */}
        <div className="absolute left-0 inset-y-0 w-16 md:block hidden">
          <div className={`h-full w-full ${isLightTheme 
            ? 'bg-gradient-to-r from-blue-100/10 via-indigo-100/5 to-transparent' 
            : 'bg-gradient-to-r from-blue-900/10 via-indigo-900/5 to-transparent'}`}></div>
        </div>
        
        <div className="max-w-md w-full space-y-8 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h2 
              variants={itemVariants}
              className="text-3xl font-bold"
            >
              {showTwoFactor ? 'Verify Identity' : 'Sign in to Kavach'}
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="mt-2 text-muted-foreground"
            >
              {showTwoFactor 
                ? 'Enter the verification code from your authenticator app' 
                : 'Enter your credentials to access your secure vault'}
            </motion.p>
          </motion.div>
          
          <motion.form 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6" 
            onSubmit={handleSubmit}
          >
            {!showTwoFactor ? (
              <>
                <motion.div variants={itemVariants} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium">
                      Email address
                    </label>
                    <div className="relative group">
                      <Mail className="input-icon" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className={`input-with-icon form-input transition-all duration-300
                          ${isLightTheme 
                            ? 'hover:border-blue-300 focus:ring-blue-200 group-hover:border-blue-300' 
                            : 'hover:border-blue-500 focus:ring-blue-700 group-hover:border-blue-500'}`}
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
                    <div className="relative group">
                      <Lock className="input-icon" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        className={`input-with-icon form-input transition-all duration-300
                          ${isLightTheme 
                            ? 'hover:border-blue-300 focus:ring-blue-200 group-hover:border-blue-300' 
                            : 'hover:border-blue-500 focus:ring-blue-700 group-hover:border-blue-500'}`}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground z-10 transition-colors duration-200 hover:text-primary"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="flex items-center justify-between">
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
                </motion.div>
              </>
            ) : (
              <motion.div 
                variants={itemVariants} 
                className="space-y-4"
              >
                <div className={`rounded-lg border ${isLightTheme 
                  ? 'border-blue-100 bg-blue-50/50' 
                  : 'border-slate-700 bg-slate-800/50'} 
                  p-4 flex flex-col items-center justify-center backdrop-blur-sm`}
                >
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
                    className={`form-input text-center tracking-widest font-mono text-lg transition-all duration-300
                      ${isLightTheme 
                        ? 'hover:border-blue-300 focus:ring-blue-200' 
                        : 'hover:border-blue-500 focus:ring-blue-700'}`}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    maxLength={6}
                    required
                  />
                </div>
              </motion.div>
            )}
            
            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                className={`w-full relative overflow-hidden group ${isLightTheme 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]`}
                disabled={isLoading}
              >
                <span className="relative z-10">
                  {isLoading ? 'Processing...' : showTwoFactor ? 'Verify Identity' : 'Sign in'}
                </span>
                <span className={`absolute bottom-0 left-0 w-full h-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ${isLightTheme 
                  ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700' 
                  : 'bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-600'}`}></span>
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center mt-6">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={navigateToSignup}
                  className={`font-medium ${isLightTheme 
                    ? 'text-blue-600 hover:text-blue-700' 
                    : 'text-blue-400 hover:text-blue-300'} hover:underline focus:outline-none focus:underline transition-colors duration-200`}
                >
                  Create one now
                </button>
              </p>
            </motion.div>
          </motion.form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
