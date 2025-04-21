import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Shield, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User,
  Phone,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { mockApi } from '@/lib/mockDb';
import { useToast } from '@/hooks/use-toast';

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      if (!fullName || !email) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep(2);
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await mockApi.register({
        name: fullName,
        email,
        phone,
        password
      });
      
      if (result.success) {
        toast({
          title: "Account created",
          description: "Your account has been created successfully.",
        });
        localStorage.setItem('auth-token', result.token);
        localStorage.setItem('user-role', 'user');
        navigate('/');
      } else {
        toast({
          title: "Registration failed",
          description: result.error || "Could not create your account. Please try again.",
          variant: "destructive",
        });
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
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
    exit: { 
      opacity: 0,
      transition: { when: "afterChildren" }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="bg-sidebar md:w-1/2 p-8 flex items-center justify-center">
        <motion.div 
          className="max-w-md w-full space-y-8"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
        >
          <motion.div className="text-center" variants={itemVariants}>
            <Shield className="mx-auto h-20 w-20 text-security-primary animate-shield-glow" />
            <h1 className="mt-4 text-3xl font-bold text-white">Kavach</h1>
            <p className="mt-2 text-security-info">
              Advanced security for your digital identity
            </p>
          </motion.div>
          <motion.div 
            className="glass-card rounded-lg p-6 space-y-4"
            variants={itemVariants}
          >
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
                <motion.div 
                  className="animate-bob"
                  initial={{ y: 0 }}
                  animate={{ y: [-3, 3, -3] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <User className="h-6 w-6 text-security-secondary" />
                </motion.div>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-white">Personalized Protection</h3>
                <p className="mt-1 text-xs text-sidebar-foreground/70">
                  Security tailored to your unique digital footprint
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Phone className="h-6 w-6 text-security-warning" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-white">Cross-Device Protection</h3>
                <p className="mt-1 text-xs text-sidebar-foreground/70">
                  Secure across all your devices and platforms
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      <div className="flex-1 p-8 flex items-center justify-center glass-effect">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-3xl font-bold">Create your account</h2>
            <p className="mt-2 text-muted-foreground">
              Join Kavach for comprehensive digital protection
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <AnimatedFormStep 
              isVisible={currentStep === 1}
              onBack={() => navigate('/login')}
              backText="Back to login"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="block text-sm font-medium">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      className="pl-10"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
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
                  <label htmlFor="phone" className="block text-sm font-medium">
                    Phone Number (optional)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      className="pl-10"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
              <Button
                type="button"
                className="w-full bg-security-primary hover:bg-security-primary/90 bounce-hover"
                onClick={() => setCurrentStep(2)}
              >
                Continue
              </Button>
            </AnimatedFormStep>
            
            <AnimatedFormStep 
              isVisible={currentStep === 2}
              onBack={() => setCurrentStep(1)}
              backText="Back to personal info"
            >
              <div className="space-y-4">
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
                      placeholder="Create a password"
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
                
                <div className="space-y-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      className="pl-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        password.length === 0 ? 'w-0 bg-security-danger' :
                        password.length < 8 ? 'w-1/4 bg-security-danger' :
                        password.length < 12 ? 'w-1/2 bg-security-warning' :
                        password.length < 16 ? 'w-3/4 bg-security-secondary' :
                        'w-full bg-security-secondary'
                      } transition-all duration-300`}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {password.length === 0 ? 'Enter a password' :
                     password.length < 8 ? 'Weak: Add more characters' :
                     password.length < 12 ? 'Fair: Add more characters for stronger protection' :
                     password.length < 16 ? 'Good: Password length is adequate' :
                     'Strong: Excellent password length'}
                  </p>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-security-primary focus:ring-security-primary"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-muted-foreground">
                    I agree to the <a href="#" className="text-security-primary hover:underline">Terms of Service</a> and <a href="#" className="text-security-primary hover:underline">Privacy Policy</a>
                  </label>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-security-primary hover:bg-security-primary/90 bounce-hover"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                    Creating Account...
                  </>
                ) : (
                  <>Create Account</>
                )}
              </Button>
            </AnimatedFormStep>
          </form>
          
          <div className="mt-6">
            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-security-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper component for animated form steps
const AnimatedFormStep = ({ 
  children, 
  isVisible, 
  onBack, 
  backText 
}: { 
  children: React.ReactNode; 
  isVisible: boolean;
  onBack: () => void;
  backText: string;
}) => {
  if (!isVisible) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center mb-4">
        <button
          type="button"
          onClick={onBack}
          className="text-sm text-security-primary hover:underline flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {backText}
        </button>
      </div>
      {children}
    </motion.div>
  );
};

export default SignUp;
