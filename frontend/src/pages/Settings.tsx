import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
} from 'lucide-react';
import ProfileCard from '@/components/ProfileCard';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

// Mock user data
const mockUser = {
  name: 'John Doe',
  username: 'johndoe',
  email: 'john@example.com',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
  provider: 'google' as const,
  createdAt: 'January 2024',
};

// Provider icons
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const GitHubIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
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
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [displayName, setDisplayName] = useState(mockUser.name);

  useEffect(() => {
    document.documentElement.classList.add('dark');
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleSignOut = () => {
    navigate('/');
  };

  const getProviderInfo = () => {
    const provider = mockUser.provider as string;
    if (provider === 'google') {
      return { icon: <GoogleIcon />, name: 'Google', identifier: mockUser.email };
    } else if (provider === 'github') {
      return { icon: <GitHubIcon />, name: 'GitHub', identifier: mockUser.username };
    } else {
      return { icon: <Mail size={20} />, name: 'Email', identifier: mockUser.email };
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
      {/* Header */}
      <header className="h-14 border-b border-border bg-background/95 backdrop-blur-sm flex items-center px-6 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="hover:bg-secondary/80 transition-colors h-8 w-8"
          >
            <ArrowLeft size={18} />
          </Button>
          <h1 className="text-lg font-semibold text-foreground tracking-tight">Settings</h1>
        </div>

        <Link
          to="/dashboard"
          className="ml-auto flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs">L</span>
          </div>
          <span className="font-semibold text-foreground hidden sm:inline text-sm">Linkzzzz</span>
        </Link>
      </header>

      {/* Main Layout */}
      <div className="flex min-h-[calc(100vh-3.5rem)]">
        {/* Sidebar Navigation */}
        <aside className="w-56 border-r border-border bg-card/30 p-4 shrink-0">
          <nav className="space-y-1">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                  ${activeTab === tab.id 
                    ? 'bg-secondary text-foreground' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
                  }
                `}
              >
                <span className={activeTab === tab.id ? 'text-primary' : ''}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-8 py-8">
            {/* Account Tab */}
            {activeTab === 'account' && (
              <div className="space-y-8">
                {/* Profile Card Section */}
                <motion.section
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <h2 className="text-base font-semibold text-foreground">Profile</h2>
                    <p className="text-sm text-muted-foreground">
                      Hover over your card to see more details.
                    </p>
                  </div>
                  
                  <div className="flex justify-center py-4">
                    <ProfileCard
                      name={mockUser.name}
                      username={mockUser.username}
                      email={mockUser.email}
                      avatarUrl={mockUser.avatarUrl}
                      provider={mockUser.provider}
                      createdAt={mockUser.createdAt}
                    />
                  </div>
                </motion.section>

                <Separator className="bg-border/50" />

                {/* Authentication Section */}
                <motion.section
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <h2 className="text-base font-semibold text-foreground">Authentication</h2>
                    <p className="text-sm text-muted-foreground">Your current login method.</p>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-card border border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary/70 flex items-center justify-center">
                          {providerInfo.icon}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium text-foreground">{providerInfo.name}</p>
                          <p className="text-xs text-muted-foreground">{providerInfo.identifier}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-0 text-xs font-medium">
                        Connected
                      </Badge>
                    </div>
                  </div>
                </motion.section>

                <Separator className="bg-border/50" />

                {/* Edit Profile Section */}
                <motion.section
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <h2 className="text-base font-semibold text-foreground">Edit Profile</h2>
                    <p className="text-sm text-muted-foreground">Update your personal information.</p>
                  </div>

                  <div className="p-5 rounded-xl bg-card border border-border space-y-5">
                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-border ring-offset-2 ring-offset-background">
                          <img
                            src={mockUser.avatarUrl}
                            alt={mockUser.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors">
                          <Camera size={12} />
                        </button>
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <p className="text-sm font-medium text-foreground">Profile Picture</p>
                        <p className="text-xs text-muted-foreground">
                          Click the camera icon to update.
                        </p>
                      </div>
                    </div>

                    <Separator className="bg-border/50" />

                    {/* Display Name */}
                    <div className="space-y-2">
                      <Label htmlFor="displayName" className="text-sm font-medium">Display Name</Label>
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="h-10 bg-secondary/30 border-border/50 focus:border-primary/50 transition-colors"
                      />
                    </div>

                    {/* Email (read-only) */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                      <div className="flex items-center gap-3">
                        <Input
                          id="email"
                          value={mockUser.email}
                          disabled
                          className="h-10 bg-muted/50 border-border/50"
                        />
                        <Badge variant="outline" className="text-xs font-medium shrink-0">
                          {mockUser.provider === 'google' ? 'Google' : mockUser.provider === 'github' ? 'GitHub' : 'Email'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed when using {mockUser.provider} authentication.
                      </p>
                    </div>

                    <div className="pt-1">
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-5 text-sm font-medium shadow-sm">
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </motion.section>

                <Separator className="bg-border/50" />

                {/* Sign Out Section */}
                <motion.section
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <h2 className="text-base font-semibold text-foreground">Sign Out</h2>
                    <p className="text-sm text-muted-foreground">End your current session.</p>
                  </div>
                  
                  <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        Sign out of your Linkzzzz account.
                      </p>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleSignOut}
                        className="gap-2 h-9 font-medium"
                      >
                        <LogOut size={14} />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </motion.section>
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-8">
                <motion.section
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <h2 className="text-base font-semibold text-foreground">Theme</h2>
                    <p className="text-sm text-muted-foreground">
                      Choose your preferred color scheme.
                    </p>
                  </div>
                  
                  <div className="p-5 rounded-xl bg-card border border-border space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary/70 flex items-center justify-center">
                          {isDarkMode ? (
                            <Moon size={18} className="text-primary" />
                          ) : (
                            <Sun size={18} className="text-primary" />
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium text-foreground">
                            {isDarkMode ? 'Dark Mode' : 'Light Mode'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {isDarkMode ? 'Black + Orange theme' : 'White + Orange theme'}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={isDarkMode}
                        onCheckedChange={toggleDarkMode}
                      />
                    </div>

                    <Separator className="bg-border/50" />

                    {/* Theme Preview */}
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => {
                          setIsDarkMode(true);
                          document.documentElement.classList.add('dark');
                        }}
                        className={`p-3 rounded-xl border-2 transition-all hover:border-primary/50 ${
                          isDarkMode ? 'border-primary' : 'border-border'
                        }`}
                      >
                        <div className="w-full h-16 rounded-lg bg-[#0a0a0a] flex items-center justify-center border border-border/30">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600" />
                        </div>
                        <p className="text-sm font-medium mt-2.5 text-foreground">Dark</p>
                      </button>

                      <button
                        onClick={() => {
                          setIsDarkMode(false);
                          document.documentElement.classList.remove('dark');
                        }}
                        className={`p-3 rounded-xl border-2 transition-all hover:border-primary/50 ${
                          !isDarkMode ? 'border-primary' : 'border-border'
                        }`}
                      >
                        <div className="w-full h-16 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600" />
                        </div>
                        <p className="text-sm font-medium mt-2.5 text-foreground">Light</p>
                      </button>
                    </div>
                  </div>
                </motion.section>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                <motion.section
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <h2 className="text-base font-semibold text-foreground">Security</h2>
                    <p className="text-sm text-muted-foreground">
                      Manage your account security settings.
                    </p>
                  </div>
                  
                  <div className="p-5 rounded-xl bg-card border border-border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary/70 flex items-center justify-center">
                        <Shield size={18} className="text-muted-foreground" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium text-foreground">Two-Factor Authentication</p>
                        <p className="text-xs text-muted-foreground">Add an extra layer of security.</p>
                      </div>
                      <Badge variant="outline" className="ml-auto text-xs">Coming Soon</Badge>
                    </div>
                  </div>
                </motion.section>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <motion.section
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <h2 className="text-base font-semibold text-foreground">Notifications</h2>
                    <p className="text-sm text-muted-foreground">
                      Configure how you receive notifications.
                    </p>
                  </div>
                  
                  <div className="p-5 rounded-xl bg-card border border-border space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary/70 flex items-center justify-center">
                          <Mail size={18} className="text-muted-foreground" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium text-foreground">Email Notifications</p>
                          <p className="text-xs text-muted-foreground">Receive updates via email.</p>
                        </div>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <Separator className="bg-border/50" />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary/70 flex items-center justify-center">
                          <Bell size={18} className="text-muted-foreground" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium text-foreground">Push Notifications</p>
                          <p className="text-xs text-muted-foreground">Get notified in your browser.</p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </motion.section>
              </div>
            )}

            {/* About Tab */}
            {activeTab === 'about' && (
              <div className="space-y-8">
                <motion.section
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <h2 className="text-base font-semibold text-foreground">About Linkzzzz</h2>
                    <p className="text-sm text-muted-foreground">
                      Information about this application.
                    </p>
                  </div>
                  
                  <div className="p-5 rounded-xl bg-card border border-border space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-lg">L</span>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-foreground">Linkzzzz</p>
                        <p className="text-xs text-muted-foreground">Version 1.0.0</p>
                      </div>
                    </div>

                    <Separator className="bg-border/50" />

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Linkzzzz is your personal link and content manager. Save, organize, and access your favorite links, images, notes, and more — all in one place.
                    </p>

                    <div className="pt-1">
                      <p className="text-xs text-muted-foreground">© 2026 Linkzzzz. All rights reserved.</p>
                    </div>
                  </div>
                </motion.section>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
