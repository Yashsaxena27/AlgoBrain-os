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
    <div className={`shimmer-bg bg-surface/50 border border-white/5 ${variantStyles[variant]} ${className}`} />
  );
};
