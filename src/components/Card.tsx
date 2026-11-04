import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

export interface CardProps {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  headerAction?: ReactNode;
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'brand' | 'success' | 'accent' | 'warning' | 'danger';
  interactive?: boolean;
}

export function Card({
  title,
  subtitle,
  icon: Icon,
  headerAction,
  children,
  className = '',
  variant = 'default',
  interactive = false,
}: CardProps) {
  const styles = {
    brand: { iconColor: 'text-nature-brand' },
    success: { iconColor: 'text-nature-accent' },
    accent: { iconColor: 'text-nature-accent' },
    warning: { iconColor: 'text-yellow-500' },
    danger: { iconColor: 'text-red-500' },
    default: { iconColor: 'text-nature-muted' },
  }[variant];

  return (
    <div className={`relative bg-nature-surface rounded-2xl overflow-hidden flex flex-col border border-nature-border/70 shadow-card ${interactive ? 'transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-card-hover hover:border-nature-brand/30' : ''} ${className}`}>
      {(title || Icon || headerAction) && (
        <div className="px-4 sm:px-6 pt-6 pb-3 relative z-10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {Icon && (
                <div className={`p-2 rounded-lg bg-nature-bg shadow-soft ${styles.iconColor}`}>
                  <Icon className="h-5 w-5" />
                </div>
              )}
              <div>
                {title && (
                  <h3 className="font-display text-lg font-semibold text-nature-ink tracking-tight">{title}</h3>
                )}
                {subtitle && <p className="text-sm text-nature-muted mt-1">{subtitle}</p>}
              </div>
            </div>
            {headerAction}
          </div>
        </div>
      )}

      <div className="p-4 sm:p-6 flex-grow flex flex-col relative z-10">{children}</div>
    </div>
  );
}
