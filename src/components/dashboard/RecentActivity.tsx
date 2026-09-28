import React from 'react';
import {
  ActivityItem
} from '../../types';
import {
  User,
  ShoppingBag,
  DollarSign,
  TrendingDown,
  CheckSquare,
  Bell,
  Clock
} from 'lucide-react';

interface RecentActivityProps {
  activities: ActivityItem[];
  onNavigate?: (tab: string) => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  onNavigate
}) => {
  const getIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'customer':
        return <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'payment':
        return <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'expense':
        return <TrendingDown className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      case 'task':
        return <CheckSquare className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'reminder':
        return <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      default:
        return <Clock className="w-4 h-4 text-neutral-500" />;
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            So‘nggi harakatlar
          </h3>
          <p className="text-xs text-neutral-400">
            Real vaqtda kiritilgan amallar tarixi
          </p>
        </div>
      </div>

      <div className="mt-3 flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800 space-y-2">
        {activities.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-400">
            Harakatlar tarixi bo‘sh
          </div>
        ) : (
          activities.slice(0, 7).map((act) => (
            <div key={act.id} className="pt-2 first:pt-0 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 shrink-0 mt-0.5">
                {getIcon(act.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                    {act.title}
                  </h4>
                  <span className="text-[10px] text-neutral-400 shrink-0 font-mono">
                    {act.timestamp.split(' ')[1] || act.timestamp}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                  {act.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
