import React from 'react';
import { motion } from 'framer-motion';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  type = 'button',
  onClick,
  title,
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 focus-ring disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';
  
  const variantStyles = {
    primary: 'bg-accent-violet hover:bg-accent-violet/90 text-white shadow-md shadow-accent-violet/20 border border-indigo-400/20',
    secondary: 'bg-surface-2 hover:bg-surface-3 text-text-primary border border-border-default hover:border-border-strong',
    outline: 'bg-transparent hover:bg-surface-2 text-text-secondary hover:text-text-primary border border-border-default hover:border-border-strong',
    ghost: 'bg-transparent hover:bg-surface-2 text-text-tertiary hover:text-text-primary',
    danger: 'bg-accent-rose hover:bg-accent-rose/90 text-white shadow-md shadow-accent-rose/20 border border-rose-400/20',
  };

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-xs font-semibold px-4.5 py-2.5 gap-2',
    lg: 'text-sm font-semibold px-6 py-3 gap-2.5',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      title={title}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      ) : (
        leftIcon
      )}
      {children && <span>{children}</span>}
      {!isLoading && rightIcon}
    </motion.button>
  );
};
