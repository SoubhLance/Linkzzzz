import { useState } from "react";
import { X, Link2, FileText, Image, Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface AddNewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ContentType = "link" | "note" | "image";

const defaultCategories = [
  "Music",
  "YouTube",
  "Work",
  "Study",
  "Personal",
  "Research",
  "Entertainment",
  "Anime",
  "Manhwa",
];

const contentTypes = [
  { type: "link" as ContentType, icon: Link2, label: "Add Link", color: "text-primary", bgColor: "bg-primary/10" },
  { type: "note" as ContentType, icon: FileText, label: "Add Note", color: "text-secondary", bgColor: "bg-secondary/10" },
  { type: "image" as ContentType, icon: Image, label: "Add Image", color: "text-amber-400", bgColor: "bg-amber-400/10" },
];

const AddNewModal = ({ isOpen, onClose }: AddNewModalProps) => {
  const [selectedType, setSelectedType] = useState<ContentType | null>(null);
  const [isStarred, setIsStarred] = useState(false);
  const [categories, setCategories] = useState(defaultCategories);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);

  // Form states
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setSelectedCategory(newCategory.trim());
      setNewCategory("");
      setShowNewCategoryInput(false);
    }
  };

  const resetForm = () => {
    setSelectedType(null);
    setIsStarred(false);
    setSelectedCategory("");
    setUrl("");
    setTitle("");
    setNoteContent("");
    setImageUrl("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 bg-card border border-border rounded-2xl shadow-2xl animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {selectedType ? `Add ${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}` : "Add New"}
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!selectedType ? (
            /* Type Selection */
            <div className="grid grid-cols-3 gap-3">
              {contentTypes.map((item) => (
                <button
                  key={item.type}
                  onClick={() => setSelectedType(item.type)}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl border border-border bg-muted/30 hover:bg-muted hover:border-primary/30 transition-all duration-200 group"
                >
                  <div className={cn("p-3 rounded-xl", item.bgColor)}>
                    <item.icon className={cn("w-6 h-6", item.color)} />
                  </div>
                  <span className="text-sm font-medium text-foreground">{item.label}</span>
                </button>
              ))}
            </div>
          ) : (
            /* Form */
            <div className="space-y-5">
              {/* Link Form */}
              {selectedType === "link" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="bg-muted/50 border-border focus:border-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter a title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-muted/50 border-border focus:border-primary/50"
                    />
                  </div>
                </>
              )}

              {/* Note Form */}
              {selectedType === "note" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="noteTitle">Title</Label>
                    <Input
                      id="noteTitle"
                      placeholder="Enter a title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-muted/50 border-border focus:border-primary/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="noteContent">Content</Label>
                    <Textarea
                      id="noteContent"
                      placeholder="Write your note..."
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      className="min-h-[120px] bg-muted/50 border-border focus:border-primary/50 resize-none"
                    />
                  </div>
                </>
              )}

              {/* Image Form */}
              {selectedType === "image" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">Image URL</Label>
                    <Input
                      id="imageUrl"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="bg-muted/50 border-border focus:border-primary/50"
                    />
                    <p className="text-xs text-muted-foreground">Or drag & drop an image file</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="imageTitle">Title</Label>
                    <Input
                      id="imageTitle"
                      placeholder="Enter a title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-muted/50 border-border focus:border-primary/50"
                    />
                  </div>
                </>
              )}

              {/* Category Selection */}
              <div className="space-y-2">
                <Label>Category</Label>
                {showNewCategoryInput ? (
                  <div className="flex gap-2">
                    <Input
                      placeholder="New category name"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="bg-muted/50 border-border focus:border-primary/50"
                      onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddCategory}
                    >
                      Add
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowNewCategoryInput(false);
                        setNewCategory("");
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="bg-muted/50 border-border">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                      <button
                        onClick={() => setShowNewCategoryInput(true)}
                        className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent focus:bg-accent text-primary"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add your own category
                      </button>
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Star Toggle */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsStarred(!isStarred)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-200",
                    isStarred
                      ? "border-star bg-star/10 text-star"
                      : "border-border text-muted-foreground hover:border-star/50 hover:text-star"
                  )}
                >
                  <Star className={cn("w-4 h-4", isStarred && "fill-current")} />
                  <span className="text-sm font-medium">
                    {isStarred ? "Starred" : "Add to Starred"}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {selectedType && (
          <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
            <Button
              variant="ghost"
              onClick={() => setSelectedType(null)}
              className="text-muted-foreground"
            >
              Back
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button className="bg-primary hover:bg-primary-glow text-primary-foreground">
                Save
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddNewModal;
