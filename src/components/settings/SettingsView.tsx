import React, { useState } from 'react';
import {
  Settings,
  User as UserIcon,
  Building2,
  Palette,
  Globe,
  Bell,
  Database,
  Download,
  Upload,
  RefreshCw,
  Sun,
  Moon,
  CheckCircle2
} from 'lucide-react';
import { User, ProfessionId } from '../../types';
import { PROFESSIONS_LIST, getProfessionMeta } from '../../utils/professions';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { DataStore } from '../../utils/storage';
import { useToast } from '../common/Toast';

interface SettingsViewProps {
  user: User;
  onSaveUser: (updatedUser: User) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onResetData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onSaveUser,
  theme,
  onToggleTheme,
  onResetData
}) => {
  const [activeSection, setActiveSection] = useState<'business' | 'appearance' | 'language' | 'notifications' | 'data'>('business');

  // Business state
  const [businessName, setBusinessName] = useState(user.businessName);
  const [profession, setProfession] = useState<ProfessionId>(user.profession);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address || '');

  // Notifications toggles
  const [reminderNotifs, setReminderNotifs] = useState(true);
  const [orderNotifs, setOrderNotifs] = useState(true);
  const [taskNotifs, setTaskNotifs] = useState(true);

  // Language state
  const [language, setLanguage] = useState<'uz' | 'ru' | 'en'>(user.language || 'uz');

  // Dialog state
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const { showToast } = useToast();

  const handleSaveBusiness = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...user,
      businessName: businessName.trim(),
      profession,
      phone: phone.trim(),
      address: address.trim()
    };
    onSaveUser(updated);
    showToast('Biznes sozlamalari saqlandi', 'success');
  };

  const handleSaveLanguage = (lang: 'uz' | 'ru' | 'en') => {
    setLanguage(lang);
    const updated: User = { ...user, language: lang };
    onSaveUser(updated);
    showToast('Tizim tili yangilandi', 'success');
  };

  const handleExportData = () => {
    const jsonStr = DataStore.exportDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smartkasb_backup_${new Date().toISOString().substring(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Ma’lumotlar zaxira nusxasi yuklandi (JSON)', 'success');
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = DataStore.importDataFromJSON(content);
      if (success) {
        showToast('Ma’lumotlar muvaffaqiyatli tiklandi! Sahifa yangilanmoqda...', 'success');
        setTimeout(() => window.location.reload(), 1000);
      } else {
        showToast('Faylni import qilishda xatolik yuz berdi. JSON formatini tekshiring.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmReset = () => {
    onResetData();
    showToast('Dastlabki demo ma’lumotlar tiklandi', 'info');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
          Tizim Sozlamalari
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Kasbingiz, interfeys, bildirishnomalar va ma’lumotlar zaxirasi
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
        {/* Navigation Sidebar */}
        <div className="bg-white dark:bg-neutral-900 p-2 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-1">
          <button
            onClick={() => setActiveSection('business')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors ${
              activeSection === 'business'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Kasb & Korxona</span>
          </button>

          <button
            onClick={() => setActiveSection('appearance')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors ${
              activeSection === 'appearance'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            <Palette className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Tashqi ko‘rinish</span>
          </button>

          <button
            onClick={() => setActiveSection('language')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors ${
              activeSection === 'language'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Til (Language)</span>
          </button>

          <button
            onClick={() => setActiveSection('notifications')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors ${
              activeSection === 'notifications'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Bildirishnomalar</span>
          </button>

          <button
            onClick={() => setActiveSection('data')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors ${
              activeSection === 'data'
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            <Database className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Ma’lumotlar bazasi</span>
          </button>
        </div>

        {/* Content Panel */}
        <div className="md:col-span-3 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
          {/* BUSINESS SETTINGS */}
          {activeSection === 'business' && (
            <form onSubmit={handleSaveBusiness} className="space-y-4">
              <div className="pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Kasb va Korxona sozlamalari
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Kasbingizni o‘zgartirsangiz, paneldagi asosiy vositalar shunga moslanadi
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Tanlangan kasb
                </label>
                <select
                  value={profession}
                  onChange={(e) => setProfession(e.target.value as ProfessionId)}
                  className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                >
                  {PROFESSIONS_LIST.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.emoji} {p.label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-neutral-500 mt-1">
                  {getProfessionMeta(profession).description}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Korxona yoki Brend nomi
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Bog‘lanish telefoni
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Ish manzili
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Toshkent sh...."
                    className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
                >
                  Saqlash
                </button>
              </div>
            </form>
          )}

          {/* APPEARANCE */}
          {activeSection === 'appearance' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Tashqi ko‘rinish va Rang mavzusi
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Ko‘zingizga qulay rejimni tanlang
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (theme !== 'light') onToggleTheme();
                  }}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    theme === 'light'
                      ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <Sun className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                  <div className="text-xs font-bold text-neutral-900">Yorug‘ rejim (Light)</div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Kunduzgi ish uchun yorqin</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (theme !== 'dark') onToggleTheme();
                  }}
                  className={`p-4 rounded-xl border text-center transition-all ${
                    theme === 'dark'
                      ? 'border-blue-500 bg-neutral-800 ring-2 ring-blue-500/20'
                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <Moon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <div className="text-xs font-bold text-neutral-900 dark:text-white">Qorong‘u rejim (Dark)</div>
                  <p className="text-[11px] text-neutral-400 mt-0.5">Ko‘zni toliqtirmaydigan tun rejimi</p>
                </button>
              </div>
            </div>
          )}

          {/* LANGUAGE */}
          {activeSection === 'language' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Tizim tili (Language)
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Interfeys tilini tanlang (Asosiy til: O‘zbekcha)
                </p>
              </div>

              <div className="space-y-2 pt-2">
                {[
                  { code: 'uz', name: 'O‘zbek tili (Lotin)', desc: 'Asosiy va to‘liq mahalliylashtirilgan interfeys' },
                  { code: 'ru', name: 'Русский язык', desc: 'Интерфейс на русском языке' },
                  { code: 'en', name: 'English (US)', desc: 'English localized interface' }
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => handleSaveLanguage(item.code as any)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all ${
                      language === item.code
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-neutral-900 dark:text-white">
                        {item.name}
                      </div>
                      <p className="text-[11px] text-neutral-500 mt-0.5">{item.desc}</p>
                    </div>
                    {language === item.code && (
                      <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeSection === 'notifications' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Bildirishnomalar sozlamalari
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Eslatma va ogohlantirishlarni yoqish yoki o‘chirish
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                      Yaqinlashgan eslatmalar
                    </h4>
                    <p className="text-[11px] text-neutral-500">
                      Vaqti kelgan eslatmalar paneli xabarlari
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={reminderNotifs}
                    onChange={(e) => setReminderNotifs(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                      Buyurtma muddatlari (Deadline)
                    </h4>
                    <p className="text-[11px] text-neutral-500">
                      Muddatiga 1 kun qolgan buyurtmalar bo‘yicha ogohlantirish
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={orderNotifs}
                    onChange={(e) => setOrderNotifs(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 dark:border-neutral-800">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                      Shoshilinch vazifalar
                    </h4>
                    <p className="text-[11px] text-neutral-500">
                      Kanbandagi shoshilinch vazifalar bildirishnomasi
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={taskNotifs}
                    onChange={(e) => setTaskNotifs(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* DATA MANAGEMENT */}
          {activeSection === 'data' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-neutral-100 dark:border-neutral-800">
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Ma’lumotlar bazasi va Zaxira nusxasi
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Barcha mijozlar, buyurtmalar va kassa hisobotlarini yuklab oling yoki tiklang
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                      To‘liq zaxira nusxasini yuklab olish
                    </h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Barcha yozuvlar shifrlanmagan standart JSON fayl shaklida kompyuteringizga saqlanadi.
                    </p>
                  </div>
                  <button
                    onClick={handleExportData}
                    className="px-3.5 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl flex items-center gap-1.5 shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span>Eksport (JSON)</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                      Zaxira nusxadan tiklash (Import)
                    </h4>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Oldin saqlab olingan JSON faylni yuklab tizimni tiklang.
                    </p>
                  </div>
                  <label className="px-3.5 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl flex items-center gap-1.5 shrink-0 cursor-pointer">
                    <Upload className="w-4 h-4" />
                    <span>Faylni tanlash</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportData}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/40 dark:bg-rose-950/20 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200">
                      Boshlang‘ich demo ma’lumotlarni qayta tiklash
                    </h4>
                    <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5">
                      Barcha kiritilgan o‘zgarishlar o‘chirilib, dastlabki namunaviy demo ma’lumotlar yuklanadi.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsResetConfirmOpen(true)}
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl flex items-center gap-1.5 shrink-0"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Demo tiklash</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleConfirmReset}
        title="Demo ma’lumotlarni tiklash"
        message="Haqiqatan ham barcha joriy yozuvlarni tozalab, tizimni dastlabki demo holatiga qaytarmoqchimisiz?"
        confirmLabel="Ha, qayta tiklash"
        cancelLabel="Bekor qilish"
        isDestructive={true}
      />
    </div>
  );
};
