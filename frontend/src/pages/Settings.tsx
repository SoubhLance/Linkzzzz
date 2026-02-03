import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Palette,
  Moon,
  Sun,
  Camera,
  LogOut,
  Mail,
  Shield,
  Bell,
  Info,
  Check,
  ChevronRight,
} from 'lucide-react';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';



// Provider icons
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const GitHubIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

type SettingsTab = 'account' | 'appearance' | 'security' | 'notifications' | 'about';

const settingsTabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { id: 'account', label: 'Account', icon: <User size={18} /> },
  { id: 'appearance', label: 'Appearance', icon: <Palette size={18} /> },
  { id: 'security', label: 'Security', icon: <Shield size={18} /> },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
  { id: 'about', label: 'About', icon: <Info size={18} /> },
];

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading, signOut } = useAuth(true);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Get user info from auth session
  const userEmail = user?.email || '';
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userUsername = user?.email?.split('@')[0] || 'user';
  const userAvatarUrl = user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=f97316&color=fff`;
  const userProvider = user?.app_metadata?.provider || 'email';
  const userCreatedAt = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown';

  useEffect(() => {
    // Initialize form with user data once loaded
    if (!authLoading && user) {
      setDisplayName(user.user_metadata?.full_name || user.email?.split('@')[0] || '');
      setAvatarUrl(user.user_metadata?.avatar_url || '');
      setIsLoading(false);
    }
  }, [authLoading, user]);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
    }
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: displayName,
          avatar_url: avatarUrl || userAvatarUrl,
        }
      });
      if (error) throw error;
      toast.success('Profile updated successfully!');
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 2000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const getProviderInfo = () => {
    if (userProvider === 'google') {
      return { icon: <GoogleIcon />, name: 'Google', identifier: userEmail };
    } else if (userProvider === 'github') {
      return { icon: <GitHubIcon />, name: 'GitHub', identifier: userUsername };
    } else {
      return { icon: <Mail size={20} />, name: 'Email', identifier: userEmail };
    }
  };

  const providerInfo = getProviderInfo();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with subtle shadow */}
      <header className="h-16 border-b border-border/50 bg-background/80 backdrop-blur-xl flex items-center px-6 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="hover:bg-secondary/80 transition-all duration-200 h-9 w-9 rounded-xl"
          >
            <ArrowLeft size={18} />
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground tracking-tight">Settings</h1>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-primary/40" />
            <span className="hidden sm:inline text-sm text-muted-foreground font-medium">
              {settingsTabs.find(tab => tab.id === activeTab)?.label}
            </span>
          </div>
        </div>

        <Link
          to="/dashboard"
          className="ml-auto flex items-center gap-3 hover:opacity-80 transition-opacity group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/30 transition-shadow">
            <span className="text-primary-foreground font-bold text-sm">L</span>
          </div>
          <span className="font-bold text-foreground hidden sm:inline text-base tracking-tight">Linkzzzz</span>
        </Link>
      </header>

      {/* Main Layout */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar Navigation with improved styling */}
        <aside className="w-64 border-r border-border/50 bg-card/20 backdrop-blur-sm p-6 shrink-0">
          <nav className="space-y-1.5">
            {settingsTabs.map((tab, index) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group relative overflow-hidden
                  ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-secondary to-secondary/50 text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
                  }
                `}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-secondary to-secondary/50 rounded-xl"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className={`relative z-10 transition-colors ${activeTab === tab.id ? 'text-primary' : 'group-hover:text-primary/70'}`}>
                  {tab.icon}
                </span>
                <span className="relative z-10">{tab.label}</span>
                {activeTab === tab.id && (
                  <ChevronRight size={16} className="ml-auto relative z-10 text-primary" />
                )}
              </motion.button>
            ))}
          </nav>
        </aside>

        {/* Content Panel with better spacing */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background via-background to-background/95">
          <div className="max-w-3xl mx-auto px-8 py-10">
            <AnimatePresence mode="wait">
              {/* Account Tab */}
              {activeTab === 'account' && (
                <motion.div
                  key="account"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {/* All-in-One Profile Section */}
                  <section>
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 shadow-sm space-y-5">
                      {/* Profile Header with Avatar and Basic Info */}
                      <div className="flex items-start gap-6">
                        {/* Avatar with Upload */}
                        <div className="relative group shrink-0">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <div className="w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-border/50 ring-offset-4 ring-offset-background transition-all duration-300 group-hover:ring-primary/50">
                            <img
                              src={avatarUrl || userAvatarUrl}
                              alt={userName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            onClick={handleCameraClick}
                            className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-orange-600 text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-110"
                          >
                            <Camera size={14} />
                          </button>
                        </div>

                        {/* Profile Info and Authentication */}
                        <div className="flex-1 space-y-4">
                          <div>
                            <h3 className="text-lg font-bold text-foreground">{userName}</h3>
                            <p className="text-sm text-muted-foreground">@{userUsername}</p>
                          </div>

                          {/* Authentication Badge */}
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center shadow-sm">
                              {providerInfo.icon}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-foreground">{providerInfo.name}</p>
                              <p className="text-xs text-muted-foreground">{providerInfo.identifier}</p>
                            </div>
                            <Badge variant="secondary" className="bg-primary/15 text-primary border-0 text-xs font-bold px-3 py-1.5">
                              <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                                Connected
                              </div>
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-border/40" />

                      {/* Edit Fields in Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Display Name */}
                        <div className="space-y-2">
                          <Label htmlFor="displayName" className="text-sm font-bold text-foreground">
                            Display Name
                          </Label>
                          <Input
                            id="displayName"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            className="h-10 bg-secondary/20 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-xl"
                          />
                        </div>

                        {/* Email (read-only) */}
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-bold text-foreground flex items-center gap-2">
                            Email Address
                            <Badge variant="outline" className="text-xs font-bold">
                              {userProvider === 'google' ? 'Google' : userProvider === 'github' ? 'GitHub' : 'Email'}
                            </Badge>
                          </Label>
                          <Input
                            id="email"
                            value={userEmail}
                            disabled
                            className="h-10 bg-muted/30 border-border/50 rounded-xl"
                          />
                        </div>
                      </div>

                      {/* Info Message */}
                      <div className="flex items-start gap-2 p-3 rounded-xl bg-secondary/20 border border-border/30">
                        <Info size={14} className="text-primary mt-0.5 shrink-0" />
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Email cannot be changed when using {userProvider} authentication. Member since {userCreatedAt}.
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-1">
                        <Button
                          onClick={handleSaveChanges}
                          disabled={isSaving || showSaved}
                          className="bg-gradient-to-r from-primary to-orange-600 text-primary-foreground hover:from-primary/90 hover:to-orange-600/90 h-10 px-6 text-sm font-bold shadow-lg hover:shadow-primary/30 transition-all duration-300 rounded-xl disabled:opacity-50"
                        >
                          {isSaving ? (
                            <>
                              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                              Saving...
                            </>
                          ) : showSaved ? (
                            <>
                              <Check size={16} className="mr-2" />
                              Saved!
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </Button>

                        {showSaved && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            className="text-sm text-primary font-medium"
                          >
                            Changes saved successfully
                          </motion.span>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* Sign Out Section - Compact */}
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="p-4 rounded-2xl border-2 border-destructive/20 bg-destructive/5 backdrop-blur-sm">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-destructive/10 flex items-center justify-center">
                            <LogOut size={16} className="text-destructive" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">Sign Out</p>
                            <p className="text-xs text-muted-foreground">End your current session</p>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleSignOut}
                          className="gap-2 h-9 font-bold px-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                        >
                          <LogOut size={14} />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </motion.section>
                </motion.div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <motion.div
                  key="appearance"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-10"
                >
                  <section className="space-y-5">
                    <div className="space-y-2">
                      <h2 className="text-xl font-bold text-foreground tracking-tight">Theme Preferences</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Choose your preferred color scheme and customize your experience.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 shadow-sm space-y-6">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/40 transition-colors duration-200">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center shadow-sm">
                            {isDarkMode ? (
                              <Moon size={20} className="text-primary" />
                            ) : (
                              <Sun size={20} className="text-primary" />
                            )}
                          </div>
                          <div className="space-y-1">
                            <p className="text-base font-bold text-foreground">
                              {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {isDarkMode ? 'Black + Orange theme' : 'White + Orange theme'}
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={isDarkMode}
                          onCheckedChange={toggleDarkMode}
                        />
                      </div>

                      <Separator className="bg-border/40" />

                      {/* Theme Preview */}
                      <div>
                        <h3 className="text-sm font-bold text-foreground mb-4">Theme Preview</h3>
                        <div className="grid grid-cols-2 gap-5">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setIsDarkMode(true);
                              document.documentElement.classList.add('dark');
                            }}
                            className={`p-4 rounded-2xl border-2 transition-all duration-300 group ${isDarkMode
                              ? 'border-primary shadow-lg shadow-primary/20'
                              : 'border-border/50 hover:border-primary/30'
                              }`}
                          >
                            <div className="w-full h-24 rounded-xl bg-[#0a0a0a] flex items-center justify-center border border-border/30 shadow-inner overflow-hidden relative">
                              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-orange-600/5" />
                              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg relative z-10" />
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <p className="text-sm font-bold text-foreground">Dark</p>
                              {isDarkMode && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                                >
                                  <Check size={12} className="text-primary-foreground" />
                                </motion.div>
                              )}
                            </div>
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setIsDarkMode(false);
                              document.documentElement.classList.remove('dark');
                            }}
                            className={`p-4 rounded-2xl border-2 transition-all duration-300 group ${!isDarkMode
                              ? 'border-primary shadow-lg shadow-primary/20'
                              : 'border-border/50 hover:border-primary/30'
                              }`}
                          >
                            <div className="w-full h-24 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-inner overflow-hidden relative">
                              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-orange-500/5 to-orange-600/5" />
                              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg relative z-10" />
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <p className="text-sm font-bold text-foreground">Light</p>
                              {!isDarkMode && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"
                                >
                                  <Check size={12} className="text-primary-foreground" />
                                </motion.div>
                              )}
                            </div>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </section>
                </motion.div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-10"
                >
                  <section className="space-y-5">
                    <div className="space-y-2">
                      <h2 className="text-xl font-bold text-foreground tracking-tight">Security Settings</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Manage your account security and authentication methods.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center shadow-sm">
                          <Shield size={22} className="text-muted-foreground" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-base font-bold text-foreground">Two-Factor Authentication</p>
                          <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                        </div>
                        <Badge variant="outline" className="text-xs font-bold px-3 py-1.5">Coming Soon</Badge>
                      </div>
                    </div>
                  </section>
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-10"
                >
                  <section className="space-y-5">
                    <div className="space-y-2">
                      <h2 className="text-xl font-bold text-foreground tracking-tight">Notification Preferences</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Configure how and when you receive notifications.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 shadow-sm space-y-5">
                      <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/40 transition-colors duration-200">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center shadow-sm">
                            <Mail size={20} className="text-muted-foreground" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-base font-bold text-foreground">Email Notifications</p>
                            <p className="text-sm text-muted-foreground">Receive updates and alerts via email.</p>
                          </div>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <Separator className="bg-border/40" />

                      <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/40 transition-colors duration-200">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center shadow-sm">
                            <Bell size={20} className="text-muted-foreground" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-base font-bold text-foreground">Push Notifications</p>
                            <p className="text-sm text-muted-foreground">Get notified directly in your browser.</p>
                          </div>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </section>
                </motion.div>
              )}

              {/* About Tab */}
              {activeTab === 'about' && (
                <motion.div
                  key="about"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-10"
                >
                  <section className="space-y-5">
                    <div className="space-y-2">
                      <h2 className="text-xl font-bold text-foreground tracking-tight">About Linkzzzz</h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Information about this application and version details.
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-br from-card to-card/50 border border-border/50 shadow-sm space-y-5">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-lg shadow-primary/30">
                          <span className="text-primary-foreground font-black text-2xl">L</span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-black text-foreground tracking-tight">Linkzzzz</p>
                          <p className="text-sm text-muted-foreground font-medium">Version 1.0.0</p>
                        </div>
                      </div>

                      <Separator className="bg-border/40" />

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Linkzzzz is your personal link and content manager. Save, organize, and access your favorite links, images, notes, and more — all in one beautifully designed place.
                      </p>

                      <div className="p-4 rounded-xl bg-secondary/30 border border-border/30">
                        <p className="text-xs text-muted-foreground font-medium">© 2026 Linkzzzz. All rights reserved.</p>
                      </div>
                    </div>
                  </section>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;