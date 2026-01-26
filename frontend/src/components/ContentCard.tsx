import { useState } from "react";
import { Link2, FileText, Image, Star, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type ContentType = "link" | "note" | "image";

interface ContentCardProps {
  type: ContentType;
  title: string;
  preview?: string;
  imageUrl?: string;
  url?: string;
  isStarred?: boolean;
  onToggleStar?: () => void;
}

const typeConfig = {
  link: {
    icon: Link2,
    label: "Link",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  note: {
    icon: FileText,
    label: "Note",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  image: {
    icon: Image,
    label: "Image",
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
  },
};

const ContentCard = ({
  type,
  title,
  preview,
  imageUrl,
  url,
  isStarred = false,
  onToggleStar,
}: ContentCardProps) => {
  const config = typeConfig[type];
  const Icon = config.icon;
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    let textToCopy = "";
    
    if (type === "link" && url) {
      textToCopy = url;
    } else if (type === "note" && preview) {
      textToCopy = preview;
    } else if (type === "image" && imageUrl) {
      textToCopy = imageUrl;
    }
    
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="group relative bg-card hover:bg-card-hover border border-border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-card hover:border-primary/20 hover:-translate-y-1 animate-fade-in card-shine select-none">
      {/* Image Preview for Image Type */}
      {type === "image" && imageUrl && (
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {/* Header with Type Icon */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className={cn("p-1.5 rounded-lg", config.bgColor)}>
              <Icon className={cn("w-3.5 h-3.5", config.color)} />
            </div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {config.label}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            {/* Copy Button */}
            <button
              onClick={handleCopy}
              className={cn(
                "p-1.5 rounded-lg transition-all duration-200",
                copied
                  ? "text-green-500"
                  : "text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground"
              )}
              title={copied ? "Copied!" : "Copy"}
            >
              {copied ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>

            {/* Star Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleStar?.();
              }}
              className={cn(
                "p-1.5 rounded-lg transition-all duration-200",
                isStarred
                  ? "text-star"
                  : "text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-star"
              )}
            >
              <Star
                className={cn("w-4 h-4", isStarred && "fill-current")}
              />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-medium text-foreground line-clamp-2 mb-1">{title}</h3>

        {/* Preview/URL */}
        {type === "note" && preview && (
          <p className="text-sm text-muted-foreground line-clamp-2">{preview}</p>
        )}
        {type === "link" && url && (
          <p className="text-sm text-primary/70 truncate">{url}</p>
        )}
      </div>
    </div>
  );
};

export default ContentCard;
