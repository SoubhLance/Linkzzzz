import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { getProfile, type Profile } from '@/lib/profiles';
import { supabase } from '@/lib/supabase';
import {
  Search,
  Plus,
  Bell,
  Grid3X3,
  List,
  Filter,
  ChevronDown,
  Link2,
  FileText,
  Image as ImageIcon,
  Sparkles,
  Package,
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

// Interfaces for Supabase schema
interface Category {
  id: string;
  user_id: string;
  name: string;
}

interface Item {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryId?: string;
  type: 'link' | 'note' | 'image';
  imageUrl?: string;
  starred: boolean;
  is_completed?: boolean;
}

const mockNotifications = [
  { title: 'Linkzzzz', message: 'Your link was saved successfully!', time: '2 min ago' },
  { title: 'Auto-organize', message: 'We categorized 5 new items', time: '1 hour ago' },
];

const typeOptions = [
  { value: 'link', label: 'Link', icon: Link2 },
  { value: 'note', label: 'Note', icon: FileText },
  { value: 'image', label: 'Image', icon: ImageIcon },
];

const categoryDots: Record<string, string> = {
  images: 'bg-pink-400',
  music: 'bg-emerald-400',
  youtube: 'bg-red-400',
  work: 'bg-blue-400',
  study: 'bg-amber-400',
  personal: 'bg-violet-400',
  research: 'bg-cyan-400',
  entertainment: 'bg-orange-400',
  anime: 'bg-pink-300',
  manhwa: 'bg-indigo-400',
};

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
  const [items, setItems] = useState<Item[]>([]);
  const [dbCategories, setDbCategories] = useState<Category[]>([]);
  const [selectedType, setSelectedType] = useState('link');
  
  // States for Add Item Modal
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemContent, setNewItemContent] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);

  const currentCategory = searchParams.get('category');

  // Get user display info from profile (persists across OAuth logins) or fallback to auth
  const userDisplayName = profile?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || '';
  const userAvatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(userDisplayName)}&background=f97316&color=fff`;

  const fetchCategories = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id);
      
    if (!error && data) {
      setDbCategories(data);
      setCustomCategories(data.map(c => c.name));
    }
  };

  const fetchItems = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('items')
      .select('*, categories(name)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const formatted = data.map(dbItem => ({
        id: dbItem.id,
        title: dbItem.title,
        description: dbItem.content,
        category: dbItem.categories?.name || 'Uncategorized',
        categoryId: dbItem.category_id,
        type: dbItem.type as any,
        imageUrl: dbItem.image_url,
        starred: dbItem.is_favorite,
        is_completed: dbItem.is_completed,
      }));
      setItems(formatted);
    }
  };

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
    
    if (!authLoading && user) {
      loadProfile();
      fetchCategories();
      fetchItems();
    }
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

  const handleStarToggle = async (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item || !user) return;
    const newStarredStatus = !item.starred;
    
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, starred: newStarredStatus } : i));

    const { error } = await supabase
      .from('items')
      .update({ is_favorite: newStarredStatus })
      .eq('id', itemId)
      .eq('user_id', user.id);
      
    if (error) {
      setItems(prev => prev.map(i => i.id === itemId ? { ...i, starred: !newStarredStatus } : i));
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim() || !user) return;
    
    const { data, error } = await supabase
      .from('categories')
      .insert([{ user_id: user.id, name: newCategoryName.trim() }])
      .select()
      .single();

    if (!error && data) {
      setDbCategories([...dbCategories, data]);
      setCustomCategories([...customCategories, data.name]);
      setNewCategoryName('');
      setShowAddCategory(false);
    }
  };

  const handleSaveItem = async () => {
    if (!user || !newItemTitle.trim() || !newItemContent.trim()) return;
    setIsSubmitting(true);

    try {
      let categoryId = dbCategories.find(c => c.name.toLowerCase() === selectedCategoryName.toLowerCase())?.id;
      
      if (!categoryId) {
        const { data: newCat, error: catError } = await supabase
          .from('categories')
          .insert([{ user_id: user.id, name: selectedCategoryName.toLowerCase() }])
          .select()
          .single();
          
        if (catError) throw catError;
        categoryId = newCat.id;
        
        setDbCategories([...dbCategories, newCat]);
        setCustomCategories([...customCategories, newCat.name]);
      }

      const itemData = {
        user_id: user.id,
        category_id: categoryId,
        type: selectedType,
        title: newItemTitle,
        content: newItemContent,
        image_url: selectedType === 'image' ? newItemContent : null,
      };

      if (editingItemId) {
        const { error: updateError } = await supabase
          .from('items')
          .update(itemData)
          .eq('id', editingItemId)
          .eq('user_id', user.id);
          
        if (updateError) throw updateError;
        
        setItems(items.map(i => i.id === editingItemId ? {
            ...i,
            title: newItemTitle,
            description: newItemContent,
            category: selectedCategoryName, 
            type: selectedType as any,
            imageUrl: itemData.image_url || undefined,
        } : i));
      } else {
        const insertData = {
          ...itemData,
          is_favorite: false,
          position: items.length
        };
        const { data: insertedItem, error: itemError } = await supabase
          .from('items')
          .insert([insertData])
          .select(`*, categories(name)`)
          .single();

        if (itemError) throw itemError;

        const formattedItem = {
          id: insertedItem.id,
          title: insertedItem.title,
          description: insertedItem.content,
          category: insertedItem.categories?.name,
          type: insertedItem.type as any,
          imageUrl: insertedItem.image_url,
          starred: insertedItem.is_favorite,
          is_completed: insertedItem.is_completed,
        };

        setItems([formattedItem, ...items]);
      }

      setNewItemTitle('');
      setNewItemContent('');
      setEditingItemId(null);
      setIsAddDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteItem = async (itemId: string) => {
    if (!user) return;
    setItems(items.filter(i => i.id !== itemId));
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', user.id);
    if (error) fetchItems();
  };

  const handleEditClick = (item: Item) => {
    setEditingItemId(item.id);
    setNewItemTitle(item.title);
    setNewItemContent(item.description || '');
    setSelectedType(item.type);
    setSelectedCategoryName(item.category?.toLowerCase() || 'personal');
    setIsAddDialogOpen(true);
  };

  const handleCompleteToggle = async (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (!item || !user) return;
    const newStatus = !item.is_completed;
    
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, is_completed: newStatus } : i));

    const { error } = await supabase
      .from('items')
      .update({ is_completed: newStatus })
      .eq('id', itemId)
      .eq('user_id', user.id);
      
    if (error) {
       setItems(prev => prev.map(i => i.id === itemId ? { ...i, is_completed: !newStatus } : i));
    }
  };

  const handleDeleteCategory = async (categoryName: string) => {
    if (!user) return;
    const cat = dbCategories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
    if (cat) {
      setDbCategories(dbCategories.filter(c => c.id !== cat.id));
      setCustomCategories(customCategories.filter(c => c !== cat.name));
      await supabase.from('categories').delete().eq('id', cat.id).eq('user_id', user.id);
    }
  };

  const handleProfileClick = () => {
    navigate('/settings');
  };

  if (isLoading || authLoading) {
    return (
      <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0F] flex">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        customCategories={customCategories}
        onAddCategory={() => setShowAddCategory(true)}
        showStarred={showStarred}
        onToggleStarred={setShowStarred}
        onDeleteCategory={handleDeleteCategory}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Floating Glass Top Bar */}
        <header className="mx-4 mt-4 h-16 rounded-2xl glass-topbar flex items-center justify-between px-5 sticky top-4 z-40">
          {/* Search */}
          <div className={`relative w-full max-w-lg transition-all duration-300 ${searchFocused ? 'max-w-xl' : ''}`}>
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200 ${searchFocused ? 'text-orange-400' : 'text-white/25'}`} size={18} />
            <input
              type="text"
              placeholder="Search your brain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className={`w-full pl-11 pr-4 h-11 bg-white/[0.03] rounded-full text-[14px] text-white placeholder:text-white/20 outline-none transition-all duration-300 border ${
                searchFocused
                  ? 'border-orange-500/30 bg-white/[0.05] shadow-[0_0_0_3px_hsl(24,100%,50%,0.08),0_0_20px_hsl(24,100%,50%,0.06)]'
                  : 'border-white/[0.04] hover:border-white/[0.08] hover:bg-white/[0.04]'
              }`}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 ml-4">
            {/* Add New */}
            <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) {
                setEditingItemId(null);
                setNewItemTitle('');
                setNewItemContent('');
              }
            }}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 px-5 h-10 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-[13px] rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                  <Plus size={17} strokeWidth={2.5} />
                  Add New
                </button>
              </DialogTrigger>

              {/* ===== REDESIGNED MODAL ===== */}
              <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden border-0 bg-transparent shadow-none [&>button]:text-white/40 [&>button]:hover:text-white/70">
                <div className="glass-modal rounded-2xl gradient-border-orange animate-modal-enter overflow-hidden">
                  {/* Modal Header */}
                  <DialogHeader className="px-7 pt-7 pb-5">
                    <DialogTitle className="text-[20px] font-bold text-white tracking-tight">Add New Item</DialogTitle>
                    <p className="text-[13px] text-white/35 mt-1">Save a link, note, or image to your collection</p>
                  </DialogHeader>

                  {/* Modal Body */}
                  <div className="px-7 pb-6 space-y-5">
                    {/* Type Selector - Segmented Control */}
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.12em]">Type</label>
                      <div className="flex gap-1.5 p-1 bg-white/[0.03] rounded-xl border border-white/[0.04]">
                        {typeOptions.map(({ value, label, icon: Icon }) => (
                          <button
                            key={value}
                            onClick={() => setSelectedType(value)}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-[10px] text-[13px] font-medium transition-all duration-200 ${
                              selectedType === value
                                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25'
                                : 'text-white/35 hover:text-white/60 hover:bg-white/[0.03]'
                            }`}
                          >
                            <Icon size={15} />
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Title Input */}
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.12em]">Title</label>
                      <input
                        type="text"
                        placeholder="Enter title..."
                        value={newItemTitle}
                        onChange={(e) => setNewItemTitle(e.target.value)}
                        className="w-full h-12 px-4 bg-white/[0.03] border border-white/[0.06] rounded-xl text-[14px] text-white placeholder:text-white/15 outline-none transition-all duration-250 focus:border-orange-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_hsl(24,100%,50%,0.1),inset_0_2px_4px_hsl(0,0%,0%,0.1)]"
                        style={{ boxShadow: 'inset 0 2px 4px hsl(0 0% 0% / 0.12)' }}
                      />
                    </div>

                    {/* URL / Content */}
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.12em]">URL or Content</label>
                      <textarea
                        placeholder="Paste URL or write your note..."
                        value={newItemContent}
                        onChange={(e) => setNewItemContent(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-[14px] text-white placeholder:text-white/15 outline-none resize-none transition-all duration-250 focus:border-orange-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_hsl(24,100%,50%,0.1),inset_0_2px_4px_hsl(0,0%,0%,0.1)]"
                        style={{ boxShadow: 'inset 0 2px 4px hsl(0 0% 0% / 0.12)' }}
                      />
                    </div>

                    {/* Category Select */}
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.12em]">Category</label>
                      <Select value={selectedCategoryName} onValueChange={setSelectedCategoryName}>
                        <SelectTrigger className="h-12 bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05] focus:ring-orange-500/20 focus:border-orange-500/40 rounded-xl text-[14px] text-white transition-all duration-200"
                          style={{ boxShadow: 'inset 0 2px 4px hsl(0 0% 0% / 0.12)' }}>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#18181B] border-white/[0.08] rounded-xl shadow-2xl shadow-black/50">
                          {Array.from(new Set([...Object.keys(categoryDots), ...dbCategories.map(c => c.name.toLowerCase())])).map((key) => {
                            const dotClass = categoryDots[key] || 'bg-white';
                            return (
                              <SelectItem key={key} value={key} className="text-white/70 hover:text-white focus:text-white focus:bg-white/[0.05] rounded-lg">
                                <span className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${dotClass}`} />
                                  {key.charAt(0).toUpperCase() + key.slice(1)}
                                </span>
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="px-7 pb-7">
                    <button 
                      onClick={handleSaveItem}
                      disabled={isSubmitting}
                      className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-[14px] rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Saving...' : 'Save Item'}
                    </button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Notifications */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="relative p-2.5 rounded-xl hover:bg-white/[0.04] transition-all duration-200 text-white/35 hover:text-white/60">
                  <Bell size={19} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full ring-2 ring-[#111114]" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-80 p-3 bg-[#18181B] border-white/[0.06] rounded-xl shadow-2xl shadow-black/50">
                <div className="space-y-2">
                  <p className="text-[13px] font-semibold text-white/70 px-2 py-1">Notifications</p>
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
                  <div className="w-9 h-9 rounded-xl overflow-hidden ring-2 ring-orange-500/20 hover:ring-orange-500/40 transition-all duration-200">
                    <img
                      src={userAvatarUrl}
                      alt={userDisplayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-[#18181B] border-white/[0.06] rounded-xl shadow-2xl shadow-black/50">
                <div className="px-3 py-3 border-b border-white/[0.06]">
                  <p className="font-semibold text-[14px] text-white">{userDisplayName}</p>
                  <p className="text-[12px] text-white/35 mt-0.5">{userEmail}</p>
                </div>
                <DropdownMenuItem onClick={handleProfileClick} className="text-white/60 hover:text-white focus:text-white focus:bg-white/[0.04] rounded-lg mx-1 mt-1">
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()} className="text-red-400/80 hover:text-red-400 focus:text-red-400 focus:bg-red-500/[0.06] rounded-lg mx-1 mb-1">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-8">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-[26px] font-bold tracking-tight text-white">
                {showStarred
                  ? 'Starred'
                  : currentCategory
                    ? currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)
                    : 'All Items'}
              </h1>
              <p className="text-white/25 text-[13px] mt-1">
                {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} in your collection
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-xl transition-all duration-200 ${viewMode === 'grid' ? 'bg-white/[0.06] text-white/70' : 'text-white/20 hover:text-white/40 hover:bg-white/[0.03]'}`}
              >
                <Grid3X3 size={17} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-xl transition-all duration-200 ${viewMode === 'list' ? 'bg-white/[0.06] text-white/70' : 'text-white/20 hover:text-white/40 hover:bg-white/[0.03]'}`}
              >
                <List size={17} />
              </button>
              <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-white/30 hover:text-white/50 hover:bg-white/[0.03] transition-all duration-200 text-[13px] ml-1">
                <Filter size={15} />
                Filter
                <ChevronDown size={13} />
              </button>
            </div>
          </div>

          {/* Items Grid/List */}
          <AnimatePresence mode="wait">
            {filteredItems.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24"
              >
                {/* Premium empty state */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-[#111114] flex items-center justify-center"
                    style={{ boxShadow: '0 4px 24px hsl(0 0% 0% / 0.4), inset 0 1px 0 hsl(0 0% 100% / 0.02)' }}>
                    <Package size={32} className="text-white/15" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                    <Sparkles size={12} className="text-white" />
                  </div>
                </div>
                <h3 className="text-[18px] font-semibold text-white/80 mb-2">
                  {searchQuery ? 'No results found' : 'Nothing here yet'}
                </h3>
                <p className="text-white/25 text-center max-w-sm text-[14px] leading-relaxed">
                  {searchQuery
                    ? `We couldn't find anything matching "${searchQuery}". Try a different search term.`
                    : 'Start building your collection by adding your first link, note, or image.'}
                </p>
                <button
                  onClick={() => setIsAddDialogOpen(true)}
                  className="mt-8 flex items-center gap-2 px-6 h-11 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-[14px] rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
                >
                  <Plus size={18} />
                  Add Your First Item
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={viewMode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'
                    : 'space-y-3'
                }
              >
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <ContentCard
                      title={item.title}
                      description={item.description}
                      category={item.category}
                      type={item.type}
                      imageUrl={item.imageUrl}
                      starred={item.starred}
                      isCompleted={item.is_completed}
                      onStarToggle={() => handleStarToggle(item.id)}
                      onDelete={() => deleteItem(item.id)}
                      onEdit={() => handleEditClick(item)}
                      onCompleteToggle={() => handleCompleteToggle(item.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="py-4 px-6 text-center">
          <div className="mx-auto h-px w-full max-w-xs bg-gradient-to-r from-transparent via-white/[0.04] to-transparent mb-4" />
          <p className="text-white/15 text-[12px]">©Linkzzzz 2026</p>
        </footer>
      </main>

      {/* Add Category Dialog */}
      <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
        <DialogContent className="sm:max-w-md p-0 border-0 bg-transparent shadow-none [&>button]:text-white/40 [&>button]:hover:text-white/70">
          <div className="glass-modal rounded-2xl gradient-border-orange animate-modal-enter overflow-hidden">
            <DialogHeader className="px-7 pt-7 pb-5">
              <DialogTitle className="text-[20px] font-bold text-white tracking-tight">Add New Category</DialogTitle>
              <p className="text-[13px] text-white/35 mt-1">Create a custom category for organizing your items</p>
            </DialogHeader>
            <div className="px-7 pb-6 space-y-5">
              <div className="space-y-2.5">
                <label className="text-[10px] font-semibold text-white/30 uppercase tracking-[0.12em]">Category Name</label>
                <input
                  type="text"
                  placeholder="Enter category name..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full h-12 px-4 bg-white/[0.03] border border-white/[0.06] rounded-xl text-[14px] text-white placeholder:text-white/15 outline-none transition-all duration-250 focus:border-orange-500/40 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_hsl(24,100%,50%,0.1),inset_0_2px_4px_hsl(0,0%,0%,0.1)]"
                  style={{ boxShadow: 'inset 0 2px 4px hsl(0 0% 0% / 0.12)' }}
                />
              </div>
            </div>
            <div className="px-7 pb-7">
              <button
                onClick={handleAddCategory}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold text-[14px] rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-xl hover:shadow-orange-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Add Category
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
