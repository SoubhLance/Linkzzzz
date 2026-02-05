import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { getProfile, type Profile } from '@/lib/profiles';
import {
  Search,
  Plus,
  Bell,
  Grid3X3,
  List,
  Filter,
  ChevronDown,
} from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import ContentCard from '@/components/ContentCard';
import NotificationCard from '@/components/NotificationCard';
import Loader from '@/components/Loader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock data
const initialMockItems = [
  {
    id: '1',
    title: 'React Best Practices 2024',
    description: 'A comprehensive guide to modern React patterns and performance optimization techniques.',
    category: 'Study',
    type: 'link' as const,
    starred: true,
  },
  {
    id: '2',
    title: 'UI Design Inspiration',
    description: 'Beautiful interface designs from Dribbble and Behance for the new dashboard project.',
    category: 'Work',
    type: 'image' as const,
    imageUrl: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400',
    starred: false,
  },
  {
    id: '3',
    title: 'Meeting Notes - Q4 Planning',
    description: 'Key takeaways from the quarterly planning session. Action items and deadlines included.',
    category: 'Work',
    type: 'note' as const,
    starred: true,
  },
  {
    id: '4',
    title: 'Lofi Hip Hop Playlist',
    description: 'Perfect background music for focused work sessions. 3 hours of chill beats.',
    category: 'Music',
    type: 'link' as const,
    starred: false,
  },
  {
    id: '5',
    title: 'Attack on Titan Final Season',
    description: 'Episode guide and discussion threads for the final season.',
    category: 'Anime',
    type: 'link' as const,
    starred: true,
  },
  {
    id: '6',
    title: 'Solo Leveling Chapter Updates',
    description: 'Latest chapter releases and fan translations.',
    category: 'Manhwa',
    type: 'link' as const,
    starred: false,
  },
  {
    id: '7',
    title: 'TypeScript Advanced Patterns',
    description: 'Deep dive into conditional types, mapped types, and template literal types.',
    category: 'Research',
    type: 'note' as const,
    starred: false,
  },
  {
    id: '8',
    title: 'Vacation Photos - Japan 2024',
    description: 'Cherry blossom season in Tokyo and Kyoto. Beautiful temples and gardens.',
    category: 'Personal',
    type: 'image' as const,
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400',
    starred: true,
  },
];

const mockNotifications = [
  { title: 'Linkzzzz', message: 'Your link was saved successfully!', time: '2 min ago' },
  { title: 'Auto-organize', message: 'We categorized 5 new items', time: '1 hour ago' },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isLoading: authLoading, signOut } = useAuth(true); // requireAuth = true
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showStarred, setShowStarred] = useState(false);
  const [items, setItems] = useState(initialMockItems);

  const currentCategory = searchParams.get('category');

  // Get user display info from profile (persists across OAuth logins) or fallback to auth
  const userDisplayName = profile?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';
  const userAvatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userDisplayName)}&background=f97316&color=fff`;

  useEffect(() => {
    // Load profile from profiles table
    const loadProfile = async () => {
      if (!authLoading && user) {
        try {
          const profileData = await getProfile();
          setProfile(profileData);
        } catch (error) {
          console.error('Error loading profile:', error);
        }
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [authLoading, user]);

  const filteredItems = items.filter((item) => {
    if (showStarred) {
      const matchesSearch = !searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return item.starred && matchesSearch;
    }
    const matchesCategory = !currentCategory || item.category.toLowerCase() === currentCategory;
    const matchesSearch = !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleStarToggle = (itemId: string) => {
    setItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, starred: !item.starred } : item
    ));
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      setCustomCategories([...customCategories, newCategoryName.trim()]);
      setNewCategoryName('');
      setShowAddCategory(false);
    }
  };

  const handleProfileClick = () => {
    navigate('/settings');
  };

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        customCategories={customCategories}
        onAddCategory={() => setShowAddCategory(true)}
        showStarred={showStarred}
        onToggleStarred={setShowStarred}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-background/95 backdrop-blur-sm flex items-center justify-between px-6 sticky top-0 z-40">
          {/* Search */}
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              type="text"
              placeholder="Search your brain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-secondary/50 border-transparent focus:border-primary"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Add New */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2 font-bold shadow-xl shadow-primary/30 px-6 h-11 text-base border border-primary/20">
                  <Plus size={20} strokeWidth={2.5} />
                  Add New
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Item</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select defaultValue="link">
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="link">Link</SelectItem>
                        <SelectItem value="note">Note</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input placeholder="Enter title..." />
                  </div>
                  <div className="space-y-2">
                    <Label>URL or Content</Label>
                    <Textarea placeholder="Paste URL or write your note..." rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select defaultValue="personal">
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="images">Images</SelectItem>
                        <SelectItem value="music">Music</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="study">Study</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="anime">Anime</SelectItem>
                        <SelectItem value="manhwa">Manhwa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                    Save Item
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Notifications */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-2">
                <div className="space-y-2">
                  <p className="text-sm font-semibold px-2 py-1">Notifications</p>
                  {mockNotifications.map((notification, index) => (
                    <NotificationCard key={index} {...notification} />
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/20">
                    <img
                      src={userAvatarUrl}
                      alt={userDisplayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 border-b border-border">
                  <p className="font-medium text-foreground">{userDisplayName}</p>
                  <p className="text-sm text-muted-foreground">{userEmail}</p>
                </div>
                <DropdownMenuItem onClick={handleProfileClick}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {showStarred
                  ? 'Starred'
                  : currentCategory
                    ? currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)
                    : 'All Items'}
              </h1>
              <p className="text-muted-foreground text-sm">
                {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 size={18} />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List size={18} />
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter size={16} />
                Filter
                <ChevronDown size={14} />
              </Button>
            </div>
          </div>

          {/* Items Grid/List */}
          <AnimatePresence mode="wait">
            {filteredItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16"
              >
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                  <Search size={28} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No items found</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  {searchQuery
                    ? `No results for "${searchQuery}"`
                    : 'Start by adding your first link, note, or image.'}
                </p>
                <Button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus size={18} className="mr-2" />
                  Add Your First Item
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key={viewMode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                    : 'space-y-3'
                }
              >
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ContentCard
                      title={item.title}
                      description={item.description}
                      category={item.category}
                      type={item.type}
                      imageUrl={item.imageUrl}
                      starred={item.starred}
                      onStarToggle={() => handleStarToggle(item.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="py-4 px-6 border-t border-border text-center">
          <p className="text-muted-foreground text-sm">©Linkzzzz 2026</p>
        </footer>
      </main>

      {/* Add Category Dialog */}
      <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Category Name</Label>
              <Input
                placeholder="Enter category name..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
            <Button
              onClick={handleAddCategory}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Add Category
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
