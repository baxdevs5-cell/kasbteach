import React from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Users,
  ShoppingBag,
  Package,
  Wrench,
  DollarSign,
  CheckSquare,
  Calendar,
  Bell,
  FileSpreadsheet,
  Settings,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Sparkles
} from 'lucide-react';
import { ProfessionId, User } from '../../types';
import { getProfessionMeta } from '../../utils/professions';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  user: User;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
  counts: {
    orders: number;
    tasks: number;
    reminders: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  user,
  isCollapsed,
  onToggleCollapse,
  onLogout,
  counts
}) => {
  const professionMeta = getProfessionMeta(user.profession);

  const menuItems = [
    { id: 'dashboard', label: 'Bosh sahifa', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analitika', icon: BarChart3 },
    { id: 'customers', label: 'Mijozlar', icon: Users },
    { id: 'orders', label: 'Buyurtmalar', icon: ShoppingBag, badge: counts.orders },
    { id: 'finance', label: 'Kirim & Chiqim', icon: DollarSign },
    { id: 'inventory', label: 'Ombor & Tovar', icon: Package },
    { id: 'services', label: 'Xizmatlar', icon: Wrench },
    { id: 'tasks', label: 'Vazifalar', icon: CheckSquare, badge: counts.tasks },
    { id: 'calendar', label: 'Taqvim', icon: Calendar },
    { id: 'reminders', label: 'Eslatmalar', icon: Bell, badge: counts.reminders },
    { id: 'reports', label: 'Hisobotlar', icon: FileSpreadsheet },
    { id: 'profile', label: 'Profil', icon: UserIcon },
    { id: 'settings', label: 'Sozlamalar', icon: Settings }
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-all duration-200 z-30 shrink-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand logo zone */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-neutral-200 dark:border-neutral-800">
        {!isCollapsed ? (
          <button
            onClick={() => onSelectTab('dashboard')}
            className="flex items-center gap-2.5 text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              S
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-neutral-900 dark:text-white">
                SmartKasb
              </span>
              <span className="text-[10px] block font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Assistant
              </span>
            </div>
          </button>
        ) : (
          <button
            onClick={() => onSelectTab('dashboard')}
            className="w-9 h-9 mx-auto rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-xs"
            title="SmartKasb Assistant"
          >
            S
          </button>
        )}

        <button
          onClick={onToggleCollapse}
          className={`p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors ${
            isCollapsed ? 'hidden' : 'block'
          }`}
          aria-label="Kengaytirish/Qisqartirish"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Profession chip */}
      {!isCollapsed && (
        <div className="px-4 py-2.5 bg-blue-50/50 dark:bg-blue-950/20 border-b border-blue-100/60 dark:border-blue-900/30 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-base">{professionMeta.emoji}</span>
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-200 truncate">
              {professionMeta.label.split('(')[0]}
            </span>
          </div>
          <button
            onClick={() => onSelectTab('settings')}
            className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline shrink-0"
          >
            O‘zgartirish
          </button>
        </div>
      )}

      {/* Navigation items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          const isHighlighted = professionMeta.highlightedModules.includes(item.id);

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-colors relative group ${
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-colors ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-neutral-400 group-hover:text-neutral-600 dark:group-hover:text-neutral-200'
                }`}
              />

              {!isCollapsed && (
                <>
                  <span className="truncate flex-1 text-left">{item.label}</span>
                  {isHighlighted && !isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" title="Kasbingiz uchun asosiy" />
                  )}
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.2 text-[11px] font-mono tabular-nums rounded-md bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer User & Logout */}
      <div className="p-3 border-t border-neutral-200 dark:border-neutral-800">
        {!isCollapsed ? (
          <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/60">
            <button
              onClick={() => onSelectTab('profile')}
              className="flex items-center gap-2.5 min-w-0 text-left"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                  {user.name}
                </div>
                <div className="text-[11px] text-neutral-400 truncate">
                  {user.businessName || 'SmartKasb'}
                </div>
              </div>
            </button>
            <button
              onClick={onLogout}
              title="Chiqish"
              className="p-1.5 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={onToggleCollapse}
              className="p-2 text-neutral-400 hover:text-neutral-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
              title="Kengaytirish"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={onLogout}
              className="p-2 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
              title="Chiqish"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
