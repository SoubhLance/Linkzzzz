import { useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import ContentCard from "@/components/ContentCard";
import EmptyState from "@/components/EmptyState";
import AddNewModal from "@/components/AddNewModal";

// Sample data - in a real app this would be filtered by category
const getSampleContent = (category: string) => {
  const allContent = [
    {
      id: 1,
      type: "link" as const,
      title: "Spotify Web Player",
      url: "https://open.spotify.com",
      isStarred: false,
      category: "music",
    },
    {
      id: 2,
      type: "link" as const,
      title: "YouTube Music",
      url: "https://music.youtube.com",
      isStarred: true,
      category: "music",
    },
    {
      id: 3,
      type: "link" as const,
      title: "Fireship Channel",
      url: "https://youtube.com/@fireship",
      isStarred: true,
      category: "youtube",
    },
    {
      id: 4,
      type: "note" as const,
      title: "Project Timeline",
      preview: "Q1: Research and planning. Q2: Development phase...",
      isStarred: false,
      category: "work",
    },
  ];
  
  return allContent.filter((item) => item.category === category.toLowerCase());
};

const Category = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const displayName = categoryName?.charAt(0).toUpperCase() + (categoryName?.slice(1) || "");
  
  const [content, setContent] = useState(getSampleContent(categoryName || ""));
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleStar = (id: number) => {
    setContent(
      content.map((item) =>
        item.id === id ? { ...item, isStarred: !item.isStarred } : item
      )
    );
  };

  const isEmpty = content.length === 0;

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">{displayName}</h1>
        <p className="text-muted-foreground mt-1">
          {content.length} {content.length === 1 ? "item" : "items"} in this category
        </p>
      </div>

      {/* Content Grid */}
      {isEmpty ? (
        <EmptyState
          title={`No items in ${displayName}`}
          description={`Start adding links, notes, and images to your ${displayName} category.`}
          onAddNew={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {content.map((item, index) => (
            <div
              key={item.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className="animate-fade-in"
            >
              <ContentCard
                type={item.type}
                title={item.title}
                preview={item.type === "note" ? item.preview : undefined}
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

export default Category;
