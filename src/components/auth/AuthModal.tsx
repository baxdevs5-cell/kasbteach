import React, { useState } from 'react';
import { X, Lock, Mail, Phone, User as UserIcon, Briefcase, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { User, ProfessionId } from '../../types';
import { PROFESSIONS_LIST } from '../../utils/professions';
import { useToast } from '../common/Toast';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register' | 'forgot_password';
  onClose: () => void;
  onSuccess: (user: User, requiresOnboarding?: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot_password'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { showToast } = useToast();

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profession, setProfession] = useState<ProfessionId>('dasturchi');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email && !phone) {
      setErrorMsg('Iltimos, telefon yoki emailingizni kiriting');
      return;
    }
    if (!password) {
      setErrorMsg('Iltimos, parolingizni kiriting');
      return;
    }

    // Authenticate
    const user: User = {
      id: `usr-${Date.now()}`,
      name: email.includes('@') ? email.split('@')[0] : 'Foydalanuvchi',
      phone: phone || '+998 90 123 45 67',
      email: email || 'user@smartkasb.uz',
      profession: 'dasturchi',
      businessName: 'Mening Korxonam',
      theme: 'light',
      language: 'uz',
      currency: 'UZS',
      createdAt: new Date().toISOString().substring(0, 10),
      isOnboarded: true
    };

    showToast('Tizimga muvaffaqiyatli kirdingiz!', 'success');
    onSuccess(user, false);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('Iltimos, ismingizni kiriting');
      return;
    }
    if (!phone.trim() || phone.trim() === '+998') {
      setErrorMsg('Iltimos, telefon raqamingizni kiriting');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Parol kamida 6 ta belgidan iborat bo‘lishi kerak');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Kiritilgan parollar bir-biriga mos kelmadi');
      return;
    }

    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || `${phone.replace(/\D/g, '')}@smartkasb.uz`,
      profession: profession,
      businessName: `${name.trim()} xizmatlari`,
      theme: 'light',
      language: 'uz',
      currency: 'UZS',
      createdAt: new Date().toISOString().substring(0, 10),
      isOnboarded: false // Trigger onboarding!
    };

    showToast('Ro‘yxatdan o‘tish muvaffaqiyatli yakunlandi!', 'success');
    onSuccess(newUser, true);
    onClose();
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email && !phone) {
      setErrorMsg('Iltimos, emailingizni yoki telefoningizni kiriting');
      return;
    }
    setForgotSuccess(true);
    showToast('Parolni tiklash ko‘rsatmalari yuborildi', 'info');
  };

  const handleDemoFill = () => {
    setEmail('azizbek@smartkasb.uz');
    setPassword('demo123456');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-8 z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
              S
            </div>
            <span className="font-bold text-neutral-900 dark:text-white">SmartKasb</span>
          </div>

          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
            {mode === 'login' && 'Tizimga kirish'}
            {mode === 'register' && 'Yangi hisob yaratish'}
            {mode === 'forgot_password' && 'Parolni tiklash'}
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            {mode === 'login' && 'Shaxsiy kabinetingizga kirish uchun ma’lumotlarni kiriting'}
            {mode === 'register' && 'Boshqaruv panelidan to‘liq foydalanish uchun ro‘yxatdan o‘ting'}
            {mode === 'forgot_password' && 'Telefon raqamingiz yoki emailingizga tasdiqlash kodi yuboriladi'}
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300">
            {errorMsg}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Email yoki Telefon raqami
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="azizbek@smartkasb.uz yoki +998..."
                  className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Parol
                </label>
                <button
                  type="button"
                  onClick={() => setMode('forgot_password')}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Parolni unutdingizmi?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-600 dark:text-neutral-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Meni eslab qol</span>
              </label>

              <button
                type="button"
                onClick={handleDemoFill}
                className="text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 underline"
              >
                Demo ma’lumotlarni to‘ldirish
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
            >
              Kirish
            </button>

            <div className="text-center text-xs text-neutral-500 mt-4">
              Hisobingiz yo‘qmi?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg('');
                }}
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Ro‘yxatdan o‘tish
              </button>
            </div>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                To‘liq ism-familiyangiz *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Azizbek Rahimov"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Telefon raqam *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+998 90 123 45 67"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Email (ixtiyoriy)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@misol.uz"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Kasbingiz *
              </label>
              <div className="relative">
                <select
                  value={profession}
                  onChange={(e) => setProfession(e.target.value as ProfessionId)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {PROFESSIONS_LIST.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.emoji} {p.label}
                    </option>
                  ))}
                </select>
                <Briefcase className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Parol *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Parolni tasdiqlang *
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors mt-2"
            >
              Ro‘yxatdan o‘tish va Boshlash
            </button>

            <div className="text-center text-xs text-neutral-500 mt-3">
              Hisobingiz bormi?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                }}
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Kirish
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot_password' && (
          <div>
            {!forgotSuccess ? (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Telefon yoki Email
                  </label>
                  <input
                    type="text"
                    value={email || phone}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="+998 90 123 45 67 yoki email@misol.uz"
                    className="w-full px-3.5 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors"
                >
                  Tiklash kodini yuborish
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setErrorMsg('');
                    }}
                    className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                  >
                    ← Kirish sahifasiga qaytish
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  SMS / Email yuborildi
                </h4>
                <p className="text-xs text-neutral-500 mt-1">
                  Parolni yangilash uchun 6 xonali tasdiqlash kodi yuborildi.
                </p>
                <button
                  onClick={() => {
                    setMode('login');
                    setForgotSuccess(false);
                  }}
                  className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  Kirishga o‘tish
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
