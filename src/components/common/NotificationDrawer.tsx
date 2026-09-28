import React from 'react';
import { X, CheckCheck, Trash2, Bell, AlertCircle, ShoppingBag, DollarSign, Package, User } from 'lucide-react';
import { NotificationItem } from '../../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
  onNavigate: (tab: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onMarkRead,
  onDelete,
  onNavigate
}) => {
  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'finance':
        return <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'inventory':
        return <Package className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'customer':
        return <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      default:
        return <AlertCircle className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col h-full z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
            <h3 className="font-semibold text-neutral-900 dark:text-white">
              Xabarnomalar
            </h3>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300">
                {unreadCount} yangi
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                title="Barchasini o‘qilgan deb belgilash"
                className="p-1.5 text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                <span className="hidden sm:inline">O‘qildi</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-neutral-400 text-center px-4">
              <Bell className="w-10 h-10 stroke-1 mb-2 opacity-50" />
              <p className="text-sm font-medium">Hozircha xabarlar yo‘q</p>
              <p className="text-xs text-neutral-400 mt-1">Muhim voqealar shu yerda ko‘rinadi</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                className={`p-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50 ${
                  !item.isRead ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 shrink-0 mt-0.5">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                        {item.title}
                      </h4>
                      <span className="text-[11px] text-neutral-400 shrink-0">
                        {item.date.split(' ')[1] || item.date}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-1 leading-relaxed">
                      {item.message}
                    </p>

                    <div className="flex items-center gap-3 mt-2.5">
                      {item.linkTab && (
                        <button
                          onClick={() => {
                            onNavigate(item.linkTab!);
                            onMarkRead(item.id);
                            onClose();
                          }}
                          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          O‘tish &rarr;
                        </button>
                      )}
                      {!item.isRead && (
                        <button
                          onClick={() => onMarkRead(item.id)}
                          className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                        >
                          O‘qildi deb belgilash
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(item.id)}
                        className="text-xs text-neutral-400 hover:text-rose-600 ml-auto p-1"
                        title="O‘chirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
