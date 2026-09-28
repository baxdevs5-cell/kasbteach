import React from 'react';
import { OrderStatus, PaymentStatus, CustomerStatus, Priority, TaskStatus } from '../../types';

interface BadgeProps {
  children?: React.ReactNode;
  type?: 'order' | 'payment' | 'customer' | 'priority' | 'task' | 'neutral';
  status?: OrderStatus | PaymentStatus | CustomerStatus | Priority | TaskStatus | string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  type = 'neutral',
  status,
  size = 'sm'
}) => {
  let label = children;
  let colorClasses = 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700';

  if (type === 'order') {
    switch (status) {
      case 'yangi':
        label = label || 'Yangi';
        colorClasses = 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900';
        break;
      case 'jarayonda':
        label = label || 'Jarayonda';
        colorClasses = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900';
        break;
      case 'kutilmoqda':
        label = label || 'Kutilmoqda';
        colorClasses = 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-900';
        break;
      case 'tugallangan':
        label = label || 'Tugallangan';
        colorClasses = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900';
        break;
      case 'bekor_qilingan':
        label = label || 'Bekor qilingan';
        colorClasses = 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900';
        break;
    }
  } else if (type === 'payment') {
    switch (status) {
      case 'tolanmagan':
        label = label || 'To‘lanmagan';
        colorClasses = 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900';
        break;
      case 'qisman_tolangan':
        label = label || 'Qisman to‘langan';
        colorClasses = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900';
        break;
      case 'toliq_tolangan':
        label = label || 'To‘liq to‘langan';
        colorClasses = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900';
        break;
    }
  } else if (type === 'customer') {
    switch (status) {
      case 'vip':
        label = label || 'VIP';
        colorClasses = 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-900 font-semibold';
        break;
      case 'faol':
        label = label || 'Faol';
        colorClasses = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900';
        break;
      case 'yangi':
        label = label || 'Yangi';
        colorClasses = 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200 dark:border-sky-900';
        break;
      case 'noaktiv':
        label = label || 'Noaktiv';
        colorClasses = 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700';
        break;
    }
  } else if (type === 'priority') {
    switch (status) {
      case 'past':
        label = label || 'Past';
        colorClasses = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
        break;
      case 'orta':
        label = label || 'O‘rta';
        colorClasses = 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-900';
        break;
      case 'yuqori':
        label = label || 'Yuqori';
        colorClasses = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900';
        break;
      case 'shoshilinch':
        label = label || 'Shoshilinch';
        colorClasses = 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-900 font-semibold';
        break;
    }
  } else if (type === 'task') {
    switch (status) {
      case 'todo':
        label = label || 'Kutilmoqda';
        colorClasses = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
        break;
      case 'in_progress':
        label = label || 'Jarayonda';
        colorClasses = 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-900';
        break;
      case 'completed':
        label = label || 'Bajarildi';
        colorClasses = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900';
        break;
    }
  }

  const sizeClasses =
    size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-md whitespace-nowrap ${sizeClasses} ${colorClasses}`}
    >
      {label}
    </span>
  );
};
