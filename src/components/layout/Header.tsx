import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Plus,
  User as UserIcon,
  LogOut,
  Settings,
  Menu
} from 'lucide-react';
import { User, NotificationItem } from '../../types';
import { formatFullUzbekDate } from '../../utils/formatters';
import { getProfessionMeta } from '../../utils/professions';

interface HeaderProps {
  user: User;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onOpenQuickAction: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  notifications: NotificationItem[];
  onSelectTab: (tab: string) => void;
  onLogout: () => void;
  onToggleMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenSearch,
  onOpenNotifications,
  onOpenQuickAction,
  theme,
  onToggleTheme,
  notifications,
  onSelectTab,
  onLogout,
  onToggleMobileMenu
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const professionMeta = getProfessionMeta(user.profession);
  const todayFormatted = formatFullUzbekDate(new Date());

  return (
    <header className="h-16 px-4 sm:px-6 border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Greeting */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 -ml-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg"
          aria-label="Menyu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-bold text-neutral-900 dark:text-white truncate">
              Assalomu alaykum, {user.name.split(' ')[0]}!
            </h1>
            <span
              className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900"
            >
              {professionMeta.emoji} {professionMeta.label.split('(')[0]}
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 hidden sm:block truncate">
            {todayFormatted}
          </p>
        </div>
      </div>

      {/* Right: Actions, Search, Notifications, Theme, Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Quick action button */}
        <button
          onClick={onOpenQuickAction}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi qo‘shish</span>
        </button>

        {/* Global Search Button */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200/70 dark:hover:bg-neutral-700 rounded-xl transition-colors"
          title="Qidiruv (Cmd + K)"
        >
          <Search className="w-4 h-4" />
          <span className="hidden md:inline">Qidiruv...</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono text-neutral-400 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded">
            ⌘K
          </kbd>
        </button>

        {/* Notifications Icon */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
          title="Xabarnomalar"
          aria-label="Xabarnomalar"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-neutral-900" />
          )}
        </button>

        {/* Theme Switcher */}
        <button
          onClick={onToggleTheme}
          className="p-2 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
          title={theme === 'dark' ? 'Yorug‘ rejim' : 'Qorong‘u rejim'}
          aria-label="Mavzuni o‘zgartirish"
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-neutral-200 dark:hover:ring-neutral-700 transition-all focus:outline-none"
            aria-label="Profil menyusi"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              {user.name.charAt(0)}
            </div>
          </button>

          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setProfileOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl py-2 z-40 animate-in fade-in duration-100">
                <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-800">
                  <div className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                    {user.name}
                  </div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    {user.email || user.phone}
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      onSelectTab('profile');
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <UserIcon className="w-4 h-4 text-neutral-400" />
                    Profilni ko‘rish
                  </button>
                  <button
                    onClick={() => {
                      onSelectTab('settings');
                      setProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <Settings className="w-4 h-4 text-neutral-400" />
                    Sozlamalar
                  </button>
                </div>

                <div className="border-t border-neutral-100 dark:border-neutral-800 pt-1">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  >
                    <LogOut className="w-4 h-4" />
                    Chiqish
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
