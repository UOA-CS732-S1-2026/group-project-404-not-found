import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, BookOpen } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

type AuthUser = {
  id: number;
  email: string;
  firstname?: string;
  lastname?: string;
};

export default function AuthPage({ onAuthSuccess }: { onAuthSuccess: (user: AuthUser) => void }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'login';
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode as any);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup State
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [upi, setUpi] = useState('');
  const [phone, setPhone] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  const handleLogin = async () => {
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginEmail.trim().toLowerCase(),
          password: loginPassword,
        }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setErrorMessage(data?.error ?? data?.message ?? 'Unable to log in.');
        return;
      }

      onAuthSuccess(data.user);
      navigate('/');
    } catch {
      setErrorMessage('Unable to connect to the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async () => {
    if (signupPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // 1. Register User
      const registerResponse = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signupEmail.trim().toLowerCase(),
          password: signupPassword,
          upi: upi.trim(),
          phone: phone.trim()
        }),
      });

      const registerData = await registerResponse.json().catch(() => null);
      if (!registerResponse.ok) {
        setErrorMessage(registerData?.error ?? registerData?.message ?? 'Unable to create your account.');
        setIsSubmitting(false);
        return;
      }

      onAuthSuccess(registerData.user);
      navigate('/');
    } catch {
      setErrorMessage('Unable to connect to the server.');
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-black text-white p-1.5 rounded-md">
            <BookOpen size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight">UoA Swap</span>
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-[480px]">
          <AnimatePresence mode="wait">
            {mode === 'login' ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-none shadow-none">
                  <CardHeader className="space-y-1 pb-8">
                    <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {errorMessage ? <p className="text-sm text-red-500">{errorMessage}</p> : null}
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="e.g., j.smith@aucklanduni.ac.nz"
                        className="h-12 border-gray-300"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <div className="relative">
                        <Input 
                          id="password" 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Enter your password" 
                          className="h-12 border-gray-300 pr-10"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        />
                        <button 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <div className="flex justify-end">
                        <button className="text-sm font-medium text-gray-600 hover:underline">Forgot Password?</button>
                      </div>
                    </div>
                    <Button
                      className="w-full h-12 bg-black text-white hover:bg-gray-800 text-base font-bold"
                      onClick={handleLogin}
                      disabled={isSubmitting || !loginEmail.trim() || !loginPassword}
                    >
                      {isSubmitting ? 'Logging In...' : 'Log In'}
                    </Button>
                    <div className="text-center text-sm">
                      Don't have an account?{' '}
                      <button onClick={() => { setErrorMessage(''); setMode('signup'); }} className="font-bold hover:underline">Create Account</button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-none shadow-none">
                  <CardHeader className="space-y-1 pb-8">
                    <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {errorMessage ? <p className="text-sm text-red-500">{errorMessage}</p> : null}

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="e.g., student@aucklanduni.ac.nz"
                        className="h-12 border-gray-300"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-upi">UPI</Label>
                        <Input
                          id="signup-upi"
                          type="text"
                          placeholder="e.g., jcmi000"
                          className="h-12 border-gray-300"
                          value={upi}
                          onChange={(e) => setUpi(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-phone">Phone</Label>
                        <Input
                          id="signup-phone"
                          type="tel"
                          placeholder="+64..."
                          className="h-12 border-gray-300"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Input 
                          id="signup-password" 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Create a password" 
                          className="h-12 border-gray-300 pr-10"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                        />
                        <button 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Re-enter your password"
                        className="h-12 border-gray-300"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSignup()}
                      />
                    </div>
                    
                    <Button
                      className="w-full h-12 bg-black text-white hover:bg-gray-800 text-base font-bold flex items-center justify-center gap-2"
                      onClick={handleSignup}
                      disabled={isSubmitting || !signupEmail.trim() || !signupPassword || !confirmPassword || !upi.trim() || !phone.trim()}
                    >
                      {isSubmitting && <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                      {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </Button>
                    <div className="text-center text-sm">
                      Already have an account?{' '}
                      <button onClick={() => { setErrorMessage(''); setMode('login'); }} className="font-bold hover:underline">Log In</button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 border-t">
        <p className="text-xs text-center text-gray-400">
          UoA Swap • University of Auckland student marketplace — Terms & Privacy
        </p>
      </footer>
    </div>
  );
}
