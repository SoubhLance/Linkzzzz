import { useState } from "react";
import { Search, Plus, Command } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AddNewModal from "./AddNewModal";

const TopBar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 h-16 bg-background/80 backdrop-blur-xl border-b border-border flex items-center gap-4 px-6">
        {/* Search */}
        <div className="flex-1 max-w-2xl">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="text"
              placeholder="Search links, notes, images... (try /page-title)"
              className="w-full h-11 pl-11 pr-12 bg-muted/50 border-transparent hover:bg-muted focus:bg-muted focus:border-primary/30 rounded-xl text-sm placeholder:text-muted-foreground transition-all duration-200"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-muted-foreground">
              <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium bg-background rounded border border-border">
                <Command className="w-3 h-3" />K
              </kbd>
            </div>
          </div>
        </div>

        {/* Add New Button */}
        <Button
          onClick={() => setIsModalOpen(true)}
          className="h-10 px-4 bg-primary hover:bg-primary-glow text-primary-foreground font-medium rounded-xl shadow-glow transition-all duration-200 hover:shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New
        </Button>
      </header>

      <AddNewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default TopBar;
