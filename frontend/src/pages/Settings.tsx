import { useState, useRef } from "react";
import {
  User,
  Palette,
  SlidersHorizontal,
  Bell,
  Shield,
  Info,
  LogOut,
  Github,
  Check,
  ChevronRight,
  Camera,
  Lock,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const sections = [
  { id: "account", label: "Account", icon: User },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "content", label: "Content", icon: SlidersHorizontal },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "about", label: "About", icon: Info },
];

const accentColors = [
  { name: "Teal", value: "174 62% 47%" },
  { name: "Purple", value: "270 50% 60%" },
  { name: "Blue", value: "217 91% 60%" },
  { name: "Green", value: "142 71% 45%" },
  { name: "Orange", value: "25 95% 53%" },
  { name: "Pink", value: "330 81% 60%" },
];

const Settings = () => {
  const [activeSection, setActiveSection] = useState("account");
  const [selectedAccent, setSelectedAccent] = useState(accentColors[0].value);
  const [starredFirst, setStarredFirst] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  
  // Account settings state
  const [displayName, setDisplayName] = useState("John Doe");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarInitial, setAvatarInitial] = useState("J");
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { session } = useAuth();
  const navigate = useNavigate();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    setIsSaving(true);
    // Simulate save
    setTimeout(() => {
      setAvatarInitial(displayName.charAt(0).toUpperCase());
      setIsSaving(false);
      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully.",
      });
    }, 800);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 items-start">
        {/* Sidebar Navigation */}
        <nav className="space-y-0.5 lg:sticky lg:top-6">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                activeSection === section.id
                  ? "bg-primary/10 text-primary border-l-2 border-primary ml-0 pl-[10px]"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <section.icon className="w-4 h-4 shrink-0" />
              {section.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="min-h-[500px]">
          <div className="bg-card/50 border border-border/50 rounded-xl p-6 lg:p-8">
            {/* Account Section */}
            {activeSection === "account" && (
              <div className="space-y-8 animate-fade-in">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-6">Account</h2>
                  
                  {/* Avatar */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className="relative group">
                      {avatarUrl ? (
                        <img 
                          src={avatarUrl} 
                          alt="Profile" 
                          className="w-16 h-16 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-xl font-bold text-primary-foreground">
                          {avatarInitial}
                        </div>
                      )}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                      >
                        <Camera className="w-5 h-5 text-white" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{displayName}</p>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-primary hover:underline"
                      >
                        Change photo
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-5 max-w-sm">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm text-muted-foreground">Display Name</Label>
                      <Input
                        id="name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="bg-muted/30 border-border/50 h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm text-muted-foreground flex items-center gap-1.5">
                        Email
                        <Lock className="w-3 h-3 text-muted-foreground/60" />
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        defaultValue="john@example.com"
                        disabled
                        className="bg-muted/20 border-border/30 h-10 text-muted-foreground cursor-not-allowed"
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>
                    
                    <Button 
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="w-full mt-2"
                    >
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>

                <div className="pt-6 border-t border-border/30">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleLogout}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </div>
            )}

            {/* Appearance Section */}
            {activeSection === "appearance" && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-lg font-semibold text-foreground">Appearance</h2>

                {/* Theme */}
                <div>
                  <Label className="mb-3 block text-sm text-muted-foreground">Theme</Label>
                  <div className="flex gap-3 max-w-sm">
                    <button className="flex-1 p-3 rounded-lg border-2 border-primary bg-card/50 text-center">
                      <div className="w-full h-6 rounded bg-background mb-2 border border-border/50" />
                      <span className="text-sm font-medium">Dark</span>
                    </button>
                    <button className="flex-1 p-3 rounded-lg border border-border/50 bg-card/30 text-center opacity-50 cursor-not-allowed">
                      <div className="w-full h-6 rounded bg-muted/50 mb-2" />
                      <span className="text-xs text-muted-foreground">Light (Soon)</span>
                    </button>
                  </div>
                </div>

                {/* Accent Color */}
                <div>
                  <Label className="mb-3 block text-sm text-muted-foreground">Accent Color</Label>
                  <div className="flex flex-wrap gap-2">
                    {accentColors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedAccent(color.value)}
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200",
                          selectedAccent === color.value
                            ? "ring-2 ring-offset-2 ring-offset-card ring-primary"
                            : "hover:scale-110"
                        )}
                        style={{ backgroundColor: `hsl(${color.value})` }}
                      >
                        {selectedAccent === color.value && (
                          <Check className="w-4 h-4 text-primary-foreground" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Card Density */}
                <div>
                  <Label className="mb-3 block text-sm text-muted-foreground">Card Density</Label>
                  <Select defaultValue="comfortable">
                    <SelectTrigger className="max-w-[200px] bg-muted/30 border-border/50 h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="comfortable">Comfortable</SelectItem>
                      <SelectItem value="spacious">Spacious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Content Section */}
            {activeSection === "content" && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-lg font-semibold text-foreground">Content Preferences</h2>

                <div className="space-y-6 max-w-sm">
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Default Category</Label>
                    <Select defaultValue="personal">
                      <SelectTrigger className="bg-muted/30 border-border/50 h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="study">Study</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Default View</Label>
                    <Select defaultValue="grid">
                      <SelectTrigger className="bg-muted/30 border-border/50 h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grid">Grid</SelectItem>
                        <SelectItem value="list">List</SelectItem>
                        <SelectItem value="timeline">Timeline</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between py-4 border-t border-border/30">
                    <div>
                      <Label className="text-foreground text-sm">Show Starred First</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">Display starred items at the top</p>
                    </div>
                    <Switch
                      checked={starredFirst}
                      onCheckedChange={setStarredFirst}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === "notifications" && (
              <div className="space-y-6 animate-fade-in">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
                  <p className="text-muted-foreground text-sm mt-1">Configure how you receive notifications</p>
                </div>

                <div className="space-y-1 max-w-sm">
                  <div className="flex items-center justify-between py-4 border-b border-border/30">
                    <div>
                      <Label className="text-foreground text-sm">Email Notifications</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">Receive updates via email</p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <div>
                      <Label className="text-foreground text-sm">Push Notifications</Label>
                      <p className="text-xs text-muted-foreground mt-0.5">Browser push notifications</p>
                    </div>
                    <Switch
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Section */}
            {activeSection === "security" && (
              <div className="space-y-8 animate-fade-in">
                <h2 className="text-lg font-semibold text-foreground">Security</h2>

                <div className="space-y-6 max-w-sm">
                  {/* Change Password */}
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/20 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-muted/50">
                        <Shield className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Change Password</p>
                        <p className="text-xs text-muted-foreground">Update your password</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>

                  {/* Connected Accounts */}
                  <div>
                    <Label className="mb-3 block text-sm text-muted-foreground">Connected Accounts</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                        <div className="flex items-center gap-3">
                          <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="currentColor"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                          <span className="text-sm">Google</span>
                        </div>
                        <span className="text-xs text-primary font-medium">Connected</span>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg border border-border/50">
                        <div className="flex items-center gap-3">
                          <Github className="w-4 h-4" />
                          <span className="text-sm">GitHub</span>
                        </div>
                        <Button variant="outline" size="sm" className="h-7 text-xs">
                          Connect
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Sign Out All */}
                  <div className="pt-4 border-t border-border/30">
                    <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                      Sign Out All Devices
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* About Section */}
            {activeSection === "about" && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-lg font-semibold text-foreground">About</h2>

                <div className="space-y-4 max-w-sm">
                  <div className="p-4 rounded-lg bg-muted/20 border border-border/30">
                    <p className="text-xs text-muted-foreground mb-1">Version</p>
                    <p className="text-sm font-medium text-foreground">1.0.0-beta</p>
                  </div>

                  <div className="space-y-1.5">
                    <a
                      href="#"
                      className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/20 transition-colors"
                    >
                      <span className="text-sm text-foreground">Privacy Policy</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </a>
                    <a
                      href="#"
                      className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/20 transition-colors"
                    >
                      <span className="text-sm text-foreground">Terms of Service</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
