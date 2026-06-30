import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          {
            "bg-primary text-primary-foreground hover:bg-primary/95 shadow-md shadow-primary/10":
              variant === 'primary',
            "bg-secondary text-secondary-foreground hover:bg-secondary/90":
              variant === 'secondary',
            "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground":
              variant === 'outline',
            "hover:bg-accent hover:text-accent-foreground bg-transparent":
              variant === 'ghost',
            "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md shadow-destructive/10":
              variant === 'danger',
          },
          {
            "h-8 px-3 text-xs": size === 'sm',
            "h-10 px-4 py-2 text-sm": size === 'md',
            "h-12 px-6 text-base": size === 'lg',
            "h-10 w-10 p-0": size === 'icon',
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
