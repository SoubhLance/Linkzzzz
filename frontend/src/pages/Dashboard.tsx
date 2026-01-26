import { useState, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ContentCard from "@/components/ContentCard";
import EmptyState from "@/components/EmptyState";
import AddNewModal from "@/components/AddNewModal";

// Sample data for demonstration
const sampleContent = [
  {
    id: 1,
    type: "link" as const,
    title: "React Documentation",
    url: "https://react.dev",
    isStarred: true,
  },
  {
    id: 2,
    type: "note" as const,
    title: "Project Ideas",
    preview: "Build a personal dashboard app with habit tracking, note-taking, and goal setting features...",
    isStarred: false,
  },
  {
    id: 3,
    type: "image" as const,
    title: "Design Inspiration",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80",
    isStarred: true,
  },
  {
    id: 4,
    type: "link" as const,
    title: "Tailwind CSS Components",
    url: "https://tailwindui.com",
    isStarred: false,
  },
  {
    id: 5,
    type: "note" as const,
    title: "Meeting Notes - Q1 Planning",
    preview: "Key takeaways from the quarterly planning session. Focus areas include product improvements...",
    isStarred: false,
  },
  {
    id: 6,
    type: "image" as const,
    title: "Gradient Wallpaper",
    imageUrl: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=600&q=80",
    isStarred: false,
  },
  {
    id: 7,
    type: "link" as const,
    title: "Linear App Design System",
    url: "https://linear.app",
    isStarred: true,
  },
  {
    id: 8,
    type: "note" as const,
    title: "Book Recommendations",
    preview: "Atomic Habits by James Clear - great for building productive routines. Deep Work by Cal Newport...",
    isStarred: false,
  },
];

const Dashboard = () => {
  const [content, setContent] = useState(sampleContent);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);

  const toggleStar = (id: number) => {
    setContent(
      content.map((item) =>
        item.id === id ? { ...item, isStarred: !item.isStarred } : item
      )
    );
  };

  const handleDragStart = useCallback((id: number) => {
    setDraggedId(id);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, id: number) => {
    e.preventDefault();
    if (draggedId !== id) {
      setDragOverId(id);
    }
  }, [draggedId]);

  const handleDragEnd = useCallback(() => {
    if (draggedId !== null && dragOverId !== null && draggedId !== dragOverId) {
      setContent((prev) => {
        const newContent = [...prev];
        const draggedIndex = newContent.findIndex((item) => item.id === draggedId);
        const dropIndex = newContent.findIndex((item) => item.id === dragOverId);
        
        const [draggedItem] = newContent.splice(draggedIndex, 1);
        newContent.splice(dropIndex, 0, draggedItem);
        
        return newContent;
      });
    }
    setDraggedId(null);
    setDragOverId(null);
  }, [draggedId, dragOverId]);

  const handleDragLeave = useCallback(() => {
    setDragOverId(null);
  }, []);

  const isEmpty = content.length === 0;

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Your personal collection of links, notes, and images</p>
      </div>

      {/* Content Grid */}
      {isEmpty ? (
        <EmptyState onAddNew={() => setIsModalOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {content.map((item, index) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStart(item.id)}
              onDragOver={(e) => handleDragOver(e, item.id)}
              onDragEnd={handleDragEnd}
              onDragLeave={handleDragLeave}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`animate-fade-in transition-all duration-300 cursor-grab active:cursor-grabbing ${
                draggedId === item.id 
                  ? "opacity-50 scale-95 rotate-2" 
                  : dragOverId === item.id 
                    ? "scale-105 ring-2 ring-primary ring-offset-2 ring-offset-background" 
                    : ""
              }`}
            >
              <ContentCard
                type={item.type}
                title={item.title}
                preview={item.type === "note" ? item.preview : undefined}
                imageUrl={item.type === "image" ? item.imageUrl : undefined}
                url={item.type === "link" ? item.url : undefined}
                isStarred={item.isStarred}
                onToggleStar={() => toggleStar(item.id)}
              />
            </div>
          ))}
        </div>
      )}

      <AddNewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </DashboardLayout>
  );
};

export default Dashboard;

