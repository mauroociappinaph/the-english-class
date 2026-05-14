import React from 'react';
import { TagChip } from './TagChip';
import { TagListProps } from '../../types/components';
import { clsx } from 'clsx';

export const TagList: React.FC<TagListProps> = ({ 
  tags = [], 
  limit, 
  variant = 'zinc', 
  showCount = true,
  className,
  tagClassName
}) => {
  if (!tags || tags.length === 0) return null;

  const visibleTags = limit ? tags.slice(0, limit) : tags;
  const remainingCount = tags.length - (limit || 0);

  return (
    <div className={clsx("flex flex-wrap gap-2 items-center", className)}>
      {visibleTags.map((tag, idx) => (
        <TagChip key={`${tag}-${idx}`} variant={variant} className={tagClassName}>
          {tag}
        </TagChip>
      ))}
      {limit && showCount && remainingCount > 0 && (
        <span className="text-[9px] font-bold text-zinc-700 flex items-center italic whitespace-nowrap">
          +{remainingCount} more
        </span>
      )}
    </div>
  );
};
