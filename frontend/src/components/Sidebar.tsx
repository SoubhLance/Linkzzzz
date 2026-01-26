import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Star, 
  FolderOpen, 
  Music, 
  Youtube, 
  Briefcase, 
  GraduationCap, 
  User, 
  Search as SearchIcon, 
  Gamepad2, 
  BookOpen,
  Sparkles,
  ChevronDown,
  Settings,
  Image as ImageIcon
} from "lucide-react";
import Logo from "./Logo";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Starred", icon: Star, path: "/starred" },
];

const categories = [
  { name: "Images", icon: ImageIcon },
  { name: "Music", icon: Music },
  { name: "YouTube", icon: Youtube },
  { name: "Work", icon: Briefcase },
  { name: "Study", icon: GraduationCap },
  { name: "Personal", icon: User },
  { name: "Research", icon: SearchIcon },
  { name: "Entertainment", icon: Gamepad2 },
  { name: "Anime", icon: Sparkles },
  { name: "Manhwa", icon: BookOpen },
];

const Sidebar = () => {
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-sidebar-border">
        <Logo size="md" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3">
        {/* Main Navigation */}
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )
              }
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Categories Section */}
        <div className="mt-6">
          <button
            onClick={() => setCategoriesExpanded(!categoriesExpanded)}
            className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="flex items-center gap-2">
              <FolderOpen className="w-3.5 h-3.5" />
              Categories
            </span>
            <ChevronDown
              className={cn(
                "w-3.5 h-3.5 transition-transform duration-200",
                categoriesExpanded ? "rotate-0" : "-rotate-90"
              )}
            />
          </button>

          {categoriesExpanded && (
            <div className="mt-1 space-y-0.5 animate-fade-in">
              {categories.map((category) => (
                <NavLink
                  key={category.name}
                  to={`/category/${category.name.toLowerCase()}`}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                      isActive
                        ? "bg-sidebar-accent text-primary"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    )
                  }
                >
                  <category.icon className="w-4 h-4" />
                  {category.name}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Settings */}
      <div className="p-3 border-t border-sidebar-border">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-sidebar-accent text-primary"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )
          }
        >
          <Settings className="w-4 h-4" />
          Settings
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
