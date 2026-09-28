import React from 'react';
import {
  Users,
  ShoppingBag,
  TrendingUp,
  CheckSquare,
  Calendar,
  Bell,
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart,
  Smartphone,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { PROFESSIONS_LIST } from '../../utils/professions';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onLaunchDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onOpenRegister,
  onLaunchDemo
}) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans">
      {/* Top Bar Contract (Single-line, 3 zones) */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-xs">
              S
            </div>
            <span className="text-lg font-bold tracking-tight text-neutral-900 dark:text-white">
              SmartKasb Assistant
            </span>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600 dark:text-neutral-300">
            <a href="#imkoniyatlar" className="hover:text-blue-600 transition-colors">
              Imkoniyatlar
            </a>
            <a href="#kasblar" className="hover:text-blue-600 transition-colors">
              Kasblar
            </a>
            <a href="#qanday-ishlaydi" className="hover:text-blue-600 transition-colors">
              Qanday ishlaydi
            </a>
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenLogin}
              className="px-3.5 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
            >
              Kirish
            </button>
            <button
              onClick={onLaunchDemo}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors whitespace-nowrap"
            >
              Tizimni ko‘rish
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kasbingizni boshqaring. Vaqtingizni tejang.</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-white leading-tight text-balance">
            Kasbingizni boshqarish endi oson.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            <strong className="text-neutral-900 dark:text-white font-semibold">SmartKasb Assistant</strong> — mijozlar, buyurtmalar, daromad, xarajatlar va vazifalarni bitta qulay tizimda boshqarish uchun zamonaviy raqamli yordamchi.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onOpenRegister}
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
            >
              <span>Bepul boshlash</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={onLaunchDemo}
              className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl shadow-xs transition-colors"
            >
              Tizimni ko‘rish (Jonli Demo)
            </button>
          </div>

          <p className="mt-4 text-xs text-neutral-400">
            Hech qanday karta talab etilmaydi · 14 ta kasbga moslashtirilgan · O‘zbek tilida
          </p>
        </div>

        {/* Dashboard Preview Teaser Card */}
        <div className="mt-12 max-w-5xl mx-auto bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xl p-4 sm:p-6 overflow-hidden">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="ml-2 text-xs font-medium text-neutral-400">smartkasb.uz/dashboard</span>
            </div>
            <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              ● Jonli ma’lumotlar
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4">
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
              <div className="text-xs text-neutral-400">Oylik daromad</div>
              <div className="text-base sm:text-lg font-bold font-mono tabular-nums text-neutral-900 dark:text-white mt-1">
                12 500 000 so‘m
              </div>
              <div className="text-[11px] text-emerald-600 mt-0.5">+18.4% o‘sish</div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
              <div className="text-xs text-neutral-400">Xarajatlar</div>
              <div className="text-base sm:text-lg font-bold font-mono tabular-nums text-neutral-900 dark:text-white mt-1">
                4 200 000 so‘m
              </div>
              <div className="text-[11px] text-neutral-500 mt-0.5">-6.2% tejamkorlik</div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
              <div className="text-xs text-neutral-400">Sof foyda</div>
              <div className="text-base sm:text-lg font-bold font-mono tabular-nums text-blue-600 dark:text-blue-400 mt-1">
                8 300 000 so‘m
              </div>
              <div className="text-[11px] text-emerald-600 mt-0.5">66.4% marja</div>
            </div>

            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
              <div className="text-xs text-neutral-400">Faol buyurtmalar</div>
              <div className="text-base sm:text-lg font-bold font-mono tabular-nums text-neutral-900 dark:text-white mt-1">
                8 ta
              </div>
              <div className="text-[11px] text-blue-600 mt-0.5">3 tasi topshirishda</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="imkoniyatlar" className="py-16 px-4 sm:px-6 bg-white dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Barcha biznes jarayonlari bitta platformada
            </h2>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Daftar-kitob va tarqoq eslatmalardan xalos bo‘ling. Har bir xizmat va tovar nazorat ostida.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                Mijozlarni boshqarish (CRM)
              </h3>
              <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Mijozlarning telefon raqami, manzili, buyurtmalar tarixi, to‘lagan jami summasi va shaxsiy eslatmalari bitta profilda.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                Buyurtmalar va Kvitansiyalar
              </h3>
              <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Buyurtma holatini kuzating, chegirma va qoldiq qarzni avtomatik hisoblang, rasmiy kvitansiya chop eting.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                Kirim va Chiqim Kvitanti
              </h3>
              <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Xarajat toifalarini (ijara, material, transport, maosh) ajratib kiritib boring va aniq sof foydani ko‘ring.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
                <CheckSquare className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                Kanban Vazifalar Doskasi
              </h3>
              <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Muhim vazifalarni ustuvorlik darajasi (shoshilinch, yuqori, o‘rta) va muddatlar bo‘yicha tartiblang.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
                <Calendar className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                Taqvim va Uchrashuvlar
              </h3>
              <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Mijozlar bilan uchrashuvlar, buyurtma topshirish sanalari va shaxsiy rejalaringizni ko‘rib boring.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
                <BarChart className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                Moliyaviy Hisobotlar & Eksport
              </h3>
              <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Oylik va yillik aylanma hisobotlarini bir tugma bilan CSV formatida yuklab oling yoki chop qiling.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Professions Showcase Section */}
      <section id="kasblar" className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Har bir kasbga moslashtirilgan interfeys
            </h2>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              O‘z kasbingizni tanlang va tizim aynan sizga kerakli vositalarni birinchi o‘ringa chiqaradi:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
            {PROFESSIONS_LIST.map((prof) => (
              <div
                key={prof.id}
                className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-blue-400 dark:hover:border-blue-700 transition-colors"
              >
                <div className="text-2xl mb-1.5">{prof.emoji}</div>
                <div className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                  {prof.label.split('(')[0]}
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1">
                  {prof.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="qanday-ishlaydi" className="py-16 px-4 sm:px-6 bg-neutral-100/50 dark:bg-neutral-900/50 border-t border-neutral-200 dark:border-neutral-800">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Qanday ishlaydi?
            </h2>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              Atigi 4 ta oson qadamda professional boshqaruvga o‘ting:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">01-Qadam</span>
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mt-1">
                Ro‘yxatdan o‘ting
              </h4>
              <p className="text-xs text-neutral-500 mt-1">
                Ism va telefon raqamingizni kiritib tezkor hisob yarating.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">02-Qadam</span>
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mt-1">
                Kasbingizni tanlang
              </h4>
              <p className="text-xs text-neutral-500 mt-1">
                14 ta sohaga ixtisoslashgan tayyor andozalardan birini tanlang.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">03-Qadam</span>
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mt-1">
                Ma’lumotlarni kiriting
              </h4>
              <p className="text-xs text-neutral-500 mt-1">
                Mijozlar, buyurtmalar yoki dastlabki kassa kirim-chiqimini yozing.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 font-mono">04-Qadam</span>
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mt-1">
                Ishingizni boshqaring
              </h4>
              <p className="text-xs text-neutral-500 mt-1">
                Barcha ko‘rsatkichlar, hisobotlar va sof foydani real vaqtda kuzating.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={onLaunchDemo}
              className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md transition-all inline-flex items-center gap-2"
            >
              <span>Demo tizimni hoziroq sinab ko‘ring</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 px-4 sm:px-6 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs text-neutral-500 dark:text-neutral-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900 dark:text-white">SmartKasb Assistant</span>
            <span>·</span>
            <span>Kasbingizni boshqaring. Vaqtingizni tejang.</span>
          </div>
          <div>
            © 2026 SmartKasb. Barcha huquqlar himoyalangan.
          </div>
        </div>
      </footer>
    </div>
  );
};
