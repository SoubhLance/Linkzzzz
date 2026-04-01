import React from 'react';
import { Link2, FileText, Image as ImageIcon, Star, Trash2, Edit2, CheckCircle2 } from 'lucide-react';

interface ContentCardProps {
  title: string;
  description: string;
  category?: string;
  type?: 'link' | 'note' | 'image';
  imageUrl?: string;
  starred?: boolean;
  completed?: boolean;
  onStarToggle?: () => void;
  onClick?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  onCompleteToggle?: () => void;
}

const categoryAccentMap: Record<string, string> = {
  study: 'from-amber-500/80 to-amber-600/40',
  work: 'from-blue-500/80 to-blue-600/40',
  music: 'from-emerald-500/80 to-emerald-600/40',
  anime: 'from-pink-500/80 to-pink-600/40',
  manhwa: 'from-indigo-500/80 to-indigo-600/40',
  research: 'from-cyan-500/80 to-cyan-600/40',
  personal: 'from-violet-500/80 to-violet-600/40',
  images: 'from-pink-400/80 to-rose-500/40',
  youtube: 'from-red-500/80 to-red-600/40',
  entertainment: 'from-orange-500/80 to-orange-600/40',
};

const categoryDotMap: Record<string, string> = {
  study: 'bg-amber-400',
  work: 'bg-blue-400',
  music: 'bg-emerald-400',
  anime: 'bg-pink-400',
  manhwa: 'bg-indigo-400',
  research: 'bg-cyan-400',
  personal: 'bg-violet-400',
  images: 'bg-pink-400',
  youtube: 'bg-red-400',
  entertainment: 'bg-orange-400',
};

const ContentCard: React.FC<ContentCardProps> = ({
  title,
  description,
  category,
  type = 'link',
  imageUrl,
  starred = false,
  completed = false,
  onStarToggle,
  onClick,
  onDelete,
  onEdit,
  onCompleteToggle,
}) => {
  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStarToggle?.();
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    if (type === 'link' && description) {
      e.stopPropagation();
      window.open(description, '_blank', 'noopener,noreferrer');
    }
  };

  const accentGradient = category
    ? categoryAccentMap[category.toLowerCase()] || 'from-orange-500/80 to-orange-600/40'
    : 'from-orange-500/80 to-orange-600/40';

  const dotColor = category
    ? categoryDotMap[category.toLowerCase()] || 'bg-orange-400'
    : 'bg-orange-400';

  const TypeIcon = () => {
    if (type === 'link') return <Link2 size={14} className="text-white/30" />;
    if (type === 'note') return <FileText size={14} className="text-white/30" />;
    if (type === 'image') return <ImageIcon size={14} className="text-white/30" />;
    return null;
  };

  return (
    <div
      onClick={onClick}
      className={`group relative flex flex-col w-full h-full min-h-[11rem] bg-[#111114] rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 ease-out hover:shadow-[0_8px_40px_hsl(24,100%,50%,0.08)] hover:scale-[1.03] hover:-translate-y-0.5 ${completed ? 'opacity-60 hover:opacity-80' : ''}`}
      style={{
        boxShadow: '0 2px 8px hsl(0 0% 0% / 0.3), inset 0 1px 0 hsl(0 0% 100% / 0.02)',
      }}
    >
      {/* Top accent bar */}
      <div className={`h-[3px] w-full bg-gradient-to-r ${accentGradient} opacity-60 group-hover:opacity-100 transition-opacity duration-300`} />

      {/* Hover glow overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.03] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" />

      {/* Image overlay handling */}
      {imageUrl && type === 'image' && (
        <>
          <div className="absolute inset-0 w-full h-full overflow-hidden rounded-2xl">
            <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
          </div>
          {/* Gradient overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/70 to-transparent z-10 rounded-2xl" />
        </>
      )}

      <div className="relative z-20 flex flex-col h-full p-5">
        {/* Top Header */}
        <div className="flex items-start justify-between mb-auto">
          {category ? (
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/50 bg-white/[0.04] px-2.5 py-1 rounded-lg">
              <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
              {category}
            </span>
          ) : (
            <span />
          )}

          <div className="flex items-center">
            {/* Action items conditionally shown on hover */}
            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mr-1.5">
              {onCompleteToggle && (
                <button onClick={(e) => { e.stopPropagation(); onCompleteToggle(); }} className={`p-1.5 rounded-lg transition-all ${completed ? 'text-emerald-400 bg-emerald-500/10' : 'text-white/20 hover:text-emerald-400 hover:bg-emerald-500/10'}`}>
                  <CheckCircle2 size={14} className={completed ? "fill-emerald-400" : ""} />
                </button>
              )}
              {onEdit && (
                <button onClick={(e) => { e.stopPropagation(); onEdit(); }} className="p-1.5 rounded-lg text-white/20 hover:text-blue-400 hover:bg-blue-500/10 transition-all">
                  <Edit2 size={14} />
                </button>
              )}
              {onDelete && (
                <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all">
                  <Trash2 size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handleStarClick}
                className={`p-1.5 rounded-lg transition-all duration-200 ${starred ? 'text-orange-400 bg-orange-500/10' : 'text-white/20 hover:text-orange-400 hover:bg-orange-500/10'}`}
                aria-label={starred ? "Unstar" : "Star"}
              >
                <Star size={15} className={starred ? "fill-orange-400" : ""} />
              </button>
              <button 
                onClick={handleLinkClick}
                className={`p-1.5 rounded-lg transition-all ${
                  type === 'link' 
                    ? 'bg-white/[0.05] hover:bg-orange-500/10 hover:text-orange-400 cursor-pointer' 
                    : 'bg-white/[0.03] cursor-pointer'
                }`}
                title={type === 'link' ? "Open Link" : undefined}
              >
                <TypeIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="mt-auto pt-4">
          <h3 className={`text-[15px] font-semibold tracking-tight line-clamp-1 mb-1.5 transition-colors duration-200 ${
            completed
              ? 'line-through text-white/35 group-hover:text-white/50'
              : 'text-white/90 group-hover:text-orange-300'
          }`}>
            {title}
          </h3>
          <p className={`text-[13px] line-clamp-2 leading-relaxed transition-colors duration-200 ${
            completed ? 'text-white/20 group-hover:text-white/30' : 'text-white/30 group-hover:text-white/45'
          }`}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
