import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'card' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
}) => {
  const variantStyles = {
    text: 'h-4 w-full rounded-md',
    card: 'h-32 w-full rounded-2xl',
    circle: 'h-10 w-10 rounded-full',
  };

  return (
    <div
      className={`bg-gradient-to-r from-surface-2 via-surface-1 to-surface-2 bg-[length:200%_100%] animate-shimmer border border-border-subtle ${variantStyles[variant]} ${className}`}
    />
  );
};
