import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  trend?: {
    value: string;
    isPositive: boolean;
    label?: string;
  };
  icon: LucideIcon;
  iconColor?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  icon: Icon,
  iconColor = 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60',
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 sm:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-all ${
        onClick ? 'cursor-pointer hover:border-neutral-300 dark:hover:border-neutral-700' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 truncate">
          {title}
        </span>
        <div className={`p-2 rounded-xl shrink-0 ${iconColor}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-2 flex items-baseline justify-between gap-2">
        <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-white truncate">
          {value}
        </div>
      </div>

      {trend && (
        <div className="mt-1.5 flex items-center gap-1.5 text-xs">
          {trend.isPositive ? (
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          ) : (
            <TrendingDown className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
          )}
          <span
            className={`font-semibold font-mono tabular-nums ${
              trend.isPositive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {trend.value}
          </span>
          {trend.label && (
            <span className="text-neutral-400 dark:text-neutral-500 text-[11px] truncate">
              {trend.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
