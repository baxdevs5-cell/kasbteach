import React from 'react';
import {
  UserPlus,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  CheckSquare,
  Bell,
  X
} from 'lucide-react';

interface QuickActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (actionType: 'customer' | 'order' | 'income' | 'expense' | 'task' | 'reminder') => void;
}

export const QuickActionsModal: React.FC<QuickActionsModalProps> = ({
  isOpen,
  onClose,
  onAction
}) => {
  if (!isOpen) return null;

  const actions = [
    {
      id: 'customer',
      label: 'Mijoz qo‘shish',
      desc: 'Yangi mijoz va kontakt ma’lumotlari',
      icon: UserPlus,
      color: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
    },
    {
      id: 'order',
      label: 'Buyurtma yaratish',
      desc: 'Yangi xizmat yoki tovar buyurtmasi',
      icon: ShoppingBag,
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
    },
    {
      id: 'income',
      label: 'Daromad kiritish',
      desc: 'Kassa kirimi yoki to‘lov qabuli',
      icon: ArrowUpRight,
      color: 'bg-teal-50 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400'
    },
    {
      id: 'expense',
      label: 'Xarajat kiritish',
      desc: 'Ijara, material yoki xizmat chiqimi',
      icon: ArrowDownRight,
      color: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
    },
    {
      id: 'task',
      label: 'Vazifa yaratish',
      desc: 'Reja, topshiriq yoki sprint vazifasi',
      icon: CheckSquare,
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
    },
    {
      id: 'reminder',
      label: 'Eslatma yaratish',
      desc: 'Muhim sana, qo‘ng‘iroq yoki to‘lov',
      icon: Bell,
      color: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 z-10">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
              Tezkor amallar
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Qaysi ma’lumotni kiritmoqchisiz?
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={() => {
                  onAction(act.id as any);
                  onClose();
                }}
                className="flex items-start gap-3 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-blue-400 dark:hover:border-blue-600 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 text-left transition-all group"
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${act.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {act.label}
                  </h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    {act.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
