import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
  onModeChange: (mode: 'signin' | 'signup') => void;
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  mode,
  onModeChange,
}) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name
            }
          }
        });
        if (error) throw error;
        toast.success('Check your email for the confirmation link!');
        onClose();
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        
        if (data?.session) {
          const authPayload = {
            token: data.session.access_token,
            expiresAt: new Date(data.session.expires_at * 1000).getTime()
          };

          localStorage.setItem("linkzzzz_auth", JSON.stringify(authPayload));

          console.log("Auth stored for extension:", authPayload);
        }
        toast.success('Signed in successfully!');
        onClose();
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || 'OAuth login failed');
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
      toast.success('Password reset link sent to your email!');
      setShowForgotPassword(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors z-10"
              >
                <X size={20} />
              </button>

              {/* Content */}
              <div className="p-8">
                {/* Logo */}
                <div className="flex items-center justify-center mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-glow">
                    <span className="text-primary-foreground font-bold text-xl">L</span>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {showForgotPassword ? (
                    <motion.div
                      key="forgot"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h2 className="text-2xl font-bold text-center text-foreground mb-2">
                        Reset Password
                      </h2>
                      <p className="text-muted-foreground text-center mb-6">
                        Enter your email and we'll send you a reset link.
                      </p>

                      <form onSubmit={handleForgotPassword} className="space-y-4">
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                          <Input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 h-12 bg-background border-border"
                            required
                          />
                        </div>

                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90"
                        >
                          {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </Button>

                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(false)}
                          className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Back to sign in
                        </button>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="auth"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      <h2 className="text-2xl font-bold text-center text-foreground mb-2">
                        {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
                      </h2>
                      <p className="text-muted-foreground text-center mb-6">
                        {mode === 'signin'
                          ? 'Sign in to continue to Linkzzzz'
                          : 'Start organizing your digital life'}
                      </p>

                      {/* OAuth Buttons */}
                      <div className="space-y-3 mb-6">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleOAuthLogin('google')}
                          disabled={isLoading}
                          className="w-full h-12 border-border hover:bg-accent"
                        >
                          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                              fill="#4285F4"
                            />
                            <path
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                              fill="#34A853"
                            />
                            <path
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                              fill="#FBBC05"
                            />
                            <path
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                              fill="#EA4335"
                            />
                          </svg>
                          Continue with Google
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleOAuthLogin('github')}
                          disabled={isLoading}
                          className="w-full h-12 border-border hover:bg-accent"
                        >
                          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                          Continue with GitHub
                        </Button>
                      </div>

                      {/* Divider */}
                      <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">
                            Or continue with email
                          </span>
                        </div>
                      </div>

                      {/* Form */}
                      <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === 'signup' && (
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <Input
                              type="text"
                              placeholder="Full name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="pl-10 h-12 bg-background border-border"
                              required
                            />
                          </div>
                        )}

                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                          <Input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 h-12 bg-background border-border"
                            required
                          />
                        </div>

                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                          <Input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 pr-10 h-12 bg-background border-border"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>

                        {mode === 'signin' && (
                          <button
                            type="button"
                            onClick={() => setShowForgotPassword(true)}
                            className="text-sm text-primary hover:underline"
                          >
                            Forgot password?
                          </button>
                        )}

                        <Button
                          type="submit"
                          disabled={isLoading}
                          className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 group"
                        >
                          {isLoading ? (
                            'Please wait...'
                          ) : (
                            <>
                              {mode === 'signin' ? 'Sign In' : 'Create Account'}
                              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                          )}
                        </Button>
                      </form>

                      {/* Switch mode */}
                      <p className="text-center text-sm text-muted-foreground mt-6">
                        {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
                        <button
                          type="button"
                          onClick={() => onModeChange(mode === 'signin' ? 'signup' : 'signin')}
                          className="text-primary hover:underline font-medium"
                        >
                          {mode === 'signin' ? 'Sign up' : 'Sign in'}
                        </button>
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
