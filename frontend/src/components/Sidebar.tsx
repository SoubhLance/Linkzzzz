import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Image,
  Music,
  Youtube,
  Briefcase,
  GraduationCap,
  User,
  Search as SearchIcon,
  BookOpen,
  Tv,
  Sparkles,
  Book,
  Plus,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Star,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  customCategories?: string[];
  onAddCategory?: () => void;
  showStarred?: boolean;
  onToggleStarred?: (starred: boolean) => void;
}

const defaultCategories = [
  { name: 'Images', icon: Image, color: 'text-pink-500' },
  { name: 'Music', icon: Music, color: 'text-green-500' },
  { name: 'YouTube', icon: Youtube, color: 'text-red-500' },
  { name: 'Work', icon: Briefcase, color: 'text-blue-500' },
  { name: 'Study', icon: GraduationCap, color: 'text-yellow-500' },
  { name: 'Personal', icon: User, color: 'text-purple-500' },
  { name: 'Research', icon: SearchIcon, color: 'text-cyan-500' },
  { name: 'Entertainment', icon: Tv, color: 'text-orange-500' },
  { name: 'Anime', icon: Sparkles, color: 'text-pink-400' },
  { name: 'Manhwa', icon: Book, color: 'text-indigo-500' },
];

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed = false,
  onToggle,
  customCategories = [],
  onAddCategory,
  showStarred = false,
  onToggleStarred,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentCategory = new URLSearchParams(location.search).get('category');
  const isAllItems = !currentCategory && !showStarred;
  const isStarredActive = showStarred;

  const handleCategoryClick = (categoryName: string) => {
    onToggleStarred?.(false);
    navigate(`/dashboard?category=${categoryName.toLowerCase()}`);
  };

  const handleAllItemsClick = () => {
    onToggleStarred?.(false);
    navigate('/dashboard');
  };

  const handleStarredClick = () => {
    onToggleStarred?.(true);
    navigate('/dashboard');
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 70 : 240 }}
      className="h-screen bg-sidebar border-r border-sidebar-border flex flex-col relative"
    >
      {/* Logo */}
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        <Link to="/dashboard" className="flex items-center gap-2 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center flex-shrink-0">
            <span className="text-primary-foreground font-bold text-sm">L</span>
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-bold text-sidebar-foreground"
            >
              Linkzzzz
            </motion.span>
          )}
        </Link>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-md hover:bg-sidebar-accent text-sidebar-foreground transition-colors"
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Categories */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar p-2">
        <div className="space-y-1">
          {/* All Items */}
          <button
            onClick={handleAllItemsClick}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
              ${isAllItems 
                ? 'bg-sidebar-accent text-sidebar-primary' 
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }
            `}
            title={isCollapsed ? 'All Items' : undefined}
          >
            <LayoutGrid size={18} className={isAllItems ? 'text-primary' : 'text-muted-foreground'} />
            {!isCollapsed && (
              <span className="text-sm font-medium truncate">All Items</span>
            )}
          </button>

          {/* Starred */}
          <button
            onClick={handleStarredClick}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
              ${isStarredActive 
                ? 'bg-sidebar-accent text-sidebar-primary' 
                : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }
            `}
            title={isCollapsed ? 'Starred' : undefined}
          >
            <Star size={18} className={isStarredActive ? 'text-primary' : 'text-muted-foreground'} />
            {!isCollapsed && (
              <span className="text-sm font-medium truncate">Starred</span>
            )}
          </button>

          {/* Divider */}
          <div className="my-2 border-t border-sidebar-border" />

          {!isCollapsed && (
            <p className="px-3 py-2 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
              Categories
            </p>
          )}
          {defaultCategories.map((category) => {
            const Icon = category.icon;
            const isActive = currentCategory === category.name.toLowerCase() && !showStarred;

            return (
              <button
                key={category.name}
                onClick={() => handleCategoryClick(category.name)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                  ${isActive 
                    ? 'bg-sidebar-accent text-sidebar-primary' 
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }
                `}
                title={isCollapsed ? category.name : undefined}
              >
                <Icon size={18} className={isActive ? 'text-primary' : category.color} />
                {!isCollapsed && (
                  <span className="text-sm font-medium truncate">{category.name}</span>
                )}
              </button>
            );
          })}

          {/* Custom categories */}
          {customCategories.map((name) => (
            <button
              key={name}
              onClick={() => handleCategoryClick(name)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200"
              title={isCollapsed ? name : undefined}
            >
              <BookOpen size={18} className="text-muted-foreground" />
              {!isCollapsed && (
                <span className="text-sm font-medium truncate">{name}</span>
              )}
            </button>
          ))}

          {/* Add category */}
          {!isCollapsed && (
            <button
              onClick={onAddCategory}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200 border border-dashed border-sidebar-border mt-2"
            >
              <Plus size={18} />
              <span className="text-sm">Add Category</span>
            </button>
          )}
        </div>
      </nav>

      {/* Bottom actions */}
      <div className="p-2 border-t border-sidebar-border space-y-1">
        <Link
          to="/settings"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/50 transition-all duration-200"
          title={isCollapsed ? 'Settings' : undefined}
        >
          <Settings size={18} />
          {!isCollapsed && <span className="text-sm font-medium">Settings</span>}
        </Link>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
