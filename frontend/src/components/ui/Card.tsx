import React from 'react';
import { motion } from 'framer-motion';

export interface CardProps {
  children?: React.ReactNode;
  hoverEffect?: boolean;
  glowColor?: 'indigo' | 'emerald' | 'amber' | 'purple' | 'none';
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  hoverEffect = false,
  glowColor = 'none',
  className = '',
  onClick,
}) => {
  const glowStyles = {
    none: '',
    indigo: 'hover:shadow-glow-violet',
    emerald: 'hover:shadow-glow-emerald',
    amber: 'hover:shadow-amber-500/20',
    purple: 'hover:shadow-purple-500/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`bg-surface-1 border border-border-default rounded-2xl p-6 shadow-glass-sm transition-all duration-200 ${
        hoverEffect ? 'hover:border-border-strong hover:-translate-y-0.5 hover:shadow-glass-md cursor-pointer' : ''
      } ${glowStyles[glowColor]} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};
