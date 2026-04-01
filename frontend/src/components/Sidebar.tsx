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
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Star,
  Trash2,
  CheckCircle,
} from 'lucide-react';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  customCategories?: string[];
  onAddCategory?: () => void;
  showStarred?: boolean;
  onToggleStarred?: (starred: boolean) => void;
  onDeleteCategory?: (name: string) => void;
}

const defaultCategories = [
  { name: 'Images', icon: Image, color: 'text-pink-400' },
  { name: 'Music', icon: Music, color: 'text-emerald-400' },
  { name: 'YouTube', icon: Youtube, color: 'text-red-400' },
  { name: 'Work', icon: Briefcase, color: 'text-blue-400' },
  { name: 'Study', icon: GraduationCap, color: 'text-amber-400' },
  { name: 'Personal', icon: User, color: 'text-violet-400' },
  { name: 'Research', icon: SearchIcon, color: 'text-cyan-400' },
  { name: 'Entertainment', icon: Tv, color: 'text-orange-400' },
  { name: 'Anime', icon: Sparkles, color: 'text-pink-300' },
  { name: 'Manhwa', icon: Book, color: 'text-indigo-400' },
];

const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed = false,
  onToggle,
  customCategories = [],
  onAddCategory,
  showStarred = false,
  onToggleStarred,
  onDeleteCategory,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const currentCategory = new URLSearchParams(location.search).get('category');
  const isAllItems = !currentCategory && !showStarred;
  const isStarredActive = showStarred;
  const isCompletedActive = currentCategory === 'completed';

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

  const handleCompletedClick = () => {
    onToggleStarred?.(false);
    navigate('/dashboard?category=completed');
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 70 : 260 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="h-screen bg-[#0B0B0F] flex flex-col relative"
      style={{
        boxShadow: '1px 0 0 hsl(240 5% 12%), 4px 0 24px hsl(0 0% 0% / 0.3)',
      }}
    >
      {/* Logo */}
      <div className="p-5 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/20">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              className="font-bold text-[15px] text-white tracking-tight"
            >
              Linkzzzz
            </motion.span>
          )}
        </Link>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white/70 transition-all duration-200"
        >
          {isCollapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
        </button>
      </div>

      {/* Separator */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      {/* Categories */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4">
        <div className="space-y-0.5">
          {/* All Items */}
          <button
            onClick={handleAllItemsClick}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
              ${isAllItems
                ? 'bg-orange-500/10 text-orange-400'
                : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
              }
            `}
            title={isCollapsed ? 'All Items' : undefined}
          >
            <LayoutGrid size={18} className={isAllItems ? 'text-orange-400' : 'group-hover:text-white/60'} />
            {!isCollapsed && (
              <span className="text-[13px] font-medium truncate">{isAllItems ? 'All Items' : 'All Items'}</span>
            )}
            {isAllItems && !isCollapsed && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-400 animate-glow-pulse" />
            )}
          </button>

          {/* Starred */}
          <button
            onClick={handleStarredClick}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
              ${isStarredActive
                ? 'bg-orange-500/10 text-orange-400'
                : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
              }
            `}
            title={isCollapsed ? 'Starred' : undefined}
          >
            <Star size={18} className={isStarredActive ? 'text-orange-400 fill-orange-400/30' : 'group-hover:text-white/60'} />
            {!isCollapsed && (
              <span className="text-[13px] font-medium truncate">Starred</span>
            )}
            {isStarredActive && !isCollapsed && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-400 animate-glow-pulse" />
            )}
          </button>

          {/* Completed */}
          <button
            onClick={handleCompletedClick}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
              ${isCompletedActive
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
              }
            `}
            title={isCollapsed ? 'Completed' : undefined}
          >
            <CheckCircle size={18} className={isCompletedActive ? 'text-emerald-400' : 'group-hover:text-white/60'} />
            {!isCollapsed && (
              <span className="text-[13px] font-medium truncate">Completed</span>
            )}
            {isCompletedActive && !isCollapsed && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400 animate-glow-pulse" />
            )}
          </button>

          {/* Separator */}
          <div className="!my-4 mx-1 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

          {!isCollapsed && (
            <p className="px-3 py-2 text-[10px] font-semibold text-white/20 uppercase tracking-[0.15em]">
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
                  w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group
                  ${isActive
                    ? 'bg-orange-500/10 text-orange-400'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03]'
                  }
                `}
                title={isCollapsed ? category.name : undefined}
              >
                <Icon size={17} className={`transition-colors duration-200 ${isActive ? 'text-orange-400' : category.color + ' opacity-60 group-hover:opacity-100'}`} />
                {!isCollapsed && (
                  <span className="text-[13px] font-medium truncate">{category.name}</span>
                )}
                {isActive && !isCollapsed && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-orange-400" />
                )}
              </button>
            );
          })}

          {/* Custom categories (filtered to avoid duplicating defaults) */}
          {customCategories
            .filter((name) => !defaultCategories.some((d) => d.name.toLowerCase() === name.toLowerCase()))
            .map((name) => (
            <div key={name} className="relative group w-full flex items-center">
              <button
                onClick={() => handleCategoryClick(name)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/[0.03] transition-all duration-200"
                title={isCollapsed ? name : undefined}
              >
                <BookOpen size={17} className="text-white/30 group-hover:text-white/50" />
                {!isCollapsed && (
                  <span className="text-[13px] font-medium truncate pr-6">{name}</span>
                )}
              </button>
              {onDeleteCategory && !isCollapsed && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeleteCategory(name); }}
                  className="absolute right-2 p-1.5 flex items-center justify-center rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all z-10"
                  title="Delete category"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}

          {/* Add category */}
          {!isCollapsed && (
            <button
              onClick={onAddCategory}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-white/20 hover:text-white/50 hover:bg-white/[0.02] transition-all duration-200 border border-dashed border-white/[0.06] hover:border-white/[0.12] mt-3"
            >
              <Plus size={16} />
              <span className="text-[13px]">Add Category</span>
            </button>
          )}
        </div>
      </nav>

      {/* Bottom actions */}
      <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <div className="p-3">
        <Link
          to="/settings"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/40 hover:text-white/70 hover:bg-white/[0.03] transition-all duration-200"
          title={isCollapsed ? 'Settings' : undefined}
        >
          <Settings size={17} />
          {!isCollapsed && <span className="text-[13px] font-medium">Settings</span>}
        </Link>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
