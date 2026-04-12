import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, BookOpen, Check } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const API_BASE_URL = 'http://localhost:3001';

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
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const avatars = [
    'https://picsum.photos/seed/avatar1/200',
    'https://picsum.photos/seed/avatar2/200',
    'https://picsum.photos/seed/avatar3/200',
    'https://picsum.photos/seed/avatar4/200',
    'https://picsum.photos/seed/avatar5/200',
  ];

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
        setErrorMessage(data?.error ?? 'Unable to log in.');
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
      const registerResponse = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signupEmail.trim().toLowerCase(),
          password: signupPassword,
          avatar_id: selectedAvatar + 1,
        }),
      });

      const registerData = await registerResponse.json().catch(() => null);
      if (!registerResponse.ok) {
        setErrorMessage(registerData?.error ?? 'Unable to create your account.');
        return;
      }

      const loginResponse = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: signupEmail.trim().toLowerCase(),
          password: signupPassword,
        }),
      });

      const loginData = await loginResponse.json().catch(() => null);
      if (!loginResponse.ok) {
        setErrorMessage(loginData?.error ?? 'Account created, but automatic login failed.');
        return;
      }

      onAuthSuccess(loginData.user);
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
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200"></span>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-400">or continue with</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full h-12 border-gray-300 font-bold flex items-center justify-center gap-3 hover:bg-gray-50" disabled>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Sign in with Google
                    </Button>
                    <div className="text-center text-sm">
                      Don't have an account?{' '}
                      <button onClick={() => setMode('signup')} className="font-bold hover:underline">Create Account</button>
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
                    {/* Avatar Selection */}
                    <div className="flex items-center gap-6 mb-8">
                      <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-gray-100">
                        <img src={avatars[selectedAvatar]} alt="Selected Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <p className="font-bold text-sm mb-1">Choose an avatar</p>
                        <p className="text-xs text-gray-500 mb-3">Select a friendly image for your profile</p>
                        <div className="flex gap-2">
                          {avatars.map((avatar, i) => (
                            <button 
                              key={i}
                              onClick={() => setSelectedAvatar(i)}
                              className={`h-10 w-10 rounded-full overflow-hidden border-2 transition-all relative ${selectedAvatar === i ? 'border-black scale-110' : 'border-transparent opacity-60 hover:opacity-100'}`}
                            >
                              <img src={avatar} alt={`Avatar ${i}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              {selectedAvatar === i && (
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                  <Check size={14} className="text-white" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="e.g., sarah.t@aucklanduni.ac.nz"
                        className="h-12 border-gray-300"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                      />
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
                      <p className="text-[10px] text-gray-500">Use at least 8 characters with a mix of letters and numbers</p>
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
                      />
                    </div>
                    
                    <Button
                      className="w-full h-12 bg-black text-white hover:bg-gray-800 text-base font-bold"
                      onClick={handleSignup}
                      disabled={isSubmitting || !signupEmail.trim() || !signupPassword || !confirmPassword}
                    >
                      {isSubmitting ? 'Creating Account...' : 'Create Account'}
                    </Button>
                    <div className="relative py-2">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200"></span>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-400">or continue with</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full h-12 border-gray-300 font-bold flex items-center justify-center gap-3 hover:bg-gray-50" disabled>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Sign up with Google
                    </Button>
                    <div className="text-center text-sm">
                      Already have an account?{' '}
                      <button onClick={() => setMode('login')} className="font-bold hover:underline">Log In</button>
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
