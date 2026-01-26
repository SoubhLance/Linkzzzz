import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import ContentCard from "@/components/ContentCard";
import EmptyState from "@/components/EmptyState";

const starredContent = [
  {
    id: 1,
    type: "link" as const,
    title: "React Documentation",
    url: "https://react.dev",
    isStarred: true,
  },
  {
    id: 3,
    type: "image" as const,
    title: "Design Inspiration",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80",
    isStarred: true,
  },
  {
    id: 7,
    type: "link" as const,
    title: "Linear App Design System",
    url: "https://linear.app",
    isStarred: true,
  },
];

const Starred = () => {
  const [content, setContent] = useState(starredContent);

  const toggleStar = (id: number) => {
    setContent(content.filter((item) => item.id !== id));
  };

  const isEmpty = content.length === 0;

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Starred</h1>
        <p className="text-muted-foreground mt-1">Your favorite items for quick access</p>
      </div>

      {/* Content Grid */}
      {isEmpty ? (
        <EmptyState
          title="No starred items"
          description="Star your important links, notes, and images to find them here."
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
                imageUrl={item.type === "image" ? item.imageUrl : undefined}
                url={item.type === "link" ? item.url : undefined}
                isStarred={item.isStarred}
                onToggleStar={() => toggleStar(item.id)}
              />
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Starred;
