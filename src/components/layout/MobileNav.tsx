import React from 'react';
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  DollarSign,
  MoreHorizontal,
  X,
  Package,
  Wrench,
  CheckSquare,
  Calendar,
  Bell,
  FileSpreadsheet,
  Settings,
  User as UserIcon,
  LogOut
} from 'lucide-react';
import { User } from '../../types';
import { getProfessionMeta } from '../../utils/professions';

interface MobileNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  user: User;
  isDrawerOpen: boolean;
  onCloseDrawer: () => void;
  onLogout: () => void;
  counts: {
    orders: number;
    tasks: number;
    reminders: number;
  };
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onSelectTab,
  user,
  isDrawerOpen,
  onCloseDrawer,
  onLogout,
  counts
}) => {
  const professionMeta = getProfessionMeta(user.profession);

  const mainTabs = [
    { id: 'dashboard', label: 'Asosiy', icon: LayoutDashboard },
    { id: 'orders', label: 'Buyurtma', icon: ShoppingBag, badge: counts.orders },
    { id: 'customers', label: 'Mijozlar', icon: Users },
    { id: 'finance', label: 'Kassa', icon: DollarSign }
  ];

  const drawerItems = [
    { id: 'analytics', label: 'Analitika', icon: LayoutDashboard },
    { id: 'inventory', label: 'Ombor & Mahsulotlar', icon: Package },
    { id: 'services', label: 'Xizmatlar', icon: Wrench },
    { id: 'tasks', label: 'Vazifalar', icon: CheckSquare, badge: counts.tasks },
    { id: 'calendar', label: 'Taqvim', icon: Calendar },
    { id: 'reminders', label: 'Eslatmalar', icon: Bell, badge: counts.reminders },
    { id: 'reports', label: 'Hisobotlar', icon: FileSpreadsheet },
    { id: 'profile', label: 'Profil', icon: UserIcon },
    { id: 'settings', label: 'Sozlamalar', icon: Settings }
  ];

  return (
    <>
      {/* Bottom Sticky Tab Bar (Mobile only) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 z-30 px-3 flex items-center justify-around shadow-lg">
        {mainTabs.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex flex-col items-center justify-center w-14 py-1 relative ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-neutral-500 dark:text-neutral-400'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 px-1 text-[9px] font-bold rounded-full bg-blue-600 text-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1">{item.label}</span>
            </button>
          );
        })}

        {/* More button */}
        <button
          onClick={() => onSelectTab('more_drawer')}
          className={`flex flex-col items-center justify-center w-14 py-1 ${
            isDrawerOpen
              ? 'text-blue-600 dark:text-blue-400 font-semibold'
              : 'text-neutral-500 dark:text-neutral-400'
          }`}
        >
          <MoreHorizontal className="w-5 h-5" />
          <span className="text-[11px] mt-1">Yana</span>
        </button>
      </div>

      {/* Full Drawer Sheet */}
      {isDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="fixed inset-0" onClick={onCloseDrawer} />
          <div className="relative w-full bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 rounded-t-3xl shadow-2xl p-5 max-h-[80vh] flex flex-col z-10">
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <span className="text-xl">{professionMeta.emoji}</span>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                    {user.name}
                  </h3>
                  <p className="text-xs text-neutral-400">
                    {professionMeta.label.split('(')[0]}
                  </p>
                </div>
              </div>
              <button
                onClick={onCloseDrawer}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu List */}
            <div className="py-3 grid grid-cols-2 gap-2 overflow-y-auto">
              {drawerItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectTab(item.id);
                      onCloseDrawer();
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-medium text-left transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                        : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-blue-600 dark:text-blue-400" />
                    <span className="truncate">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-auto px-1.5 py-0.5 text-[10px] rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Logout button */}
            <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <button
                onClick={() => {
                  onCloseDrawer();
                  onLogout();
                }}
                className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Hisobdan chiqish
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
