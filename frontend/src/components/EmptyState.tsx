import { Link2, FileText, Image, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  onAddNew?: () => void;
}

const EmptyState = ({
  title = "No content yet",
  description = "Start organizing your digital life by adding links, notes, and images.",
  onAddNew,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      {/* Icon Group */}
      <div className="relative mb-6">
        <div className="flex items-center gap-2">
          <div className="p-3 rounded-xl bg-primary/10">
            <Link2 className="w-6 h-6 text-primary" />
          </div>
          <div className="p-3 rounded-xl bg-secondary/10 -ml-3">
            <FileText className="w-6 h-6 text-secondary" />
          </div>
          <div className="p-3 rounded-xl bg-amber-400/10 -ml-3">
            <Image className="w-6 h-6 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Text */}
      <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>

      {/* CTA */}
      {onAddNew && (
        <Button
          onClick={onAddNew}
          className="bg-primary hover:bg-primary-glow text-primary-foreground font-medium shadow-glow"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Your First Item
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
