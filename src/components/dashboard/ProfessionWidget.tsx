import React from 'react';
import {
  ProfessionId,
  Order,
  Product,
  Task,
  Customer
} from '../../types';
import { getProfessionMeta } from '../../utils/professions';
import { formatUZS } from '../../utils/formatters';
import { ArrowRight, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';

interface ProfessionWidgetProps {
  profession: ProfessionId;
  orders: Order[];
  products: Product[];
  tasks: Task[];
  customers: Customer[];
  onNavigate: (tab: string) => void;
}

export const ProfessionWidget: React.FC<ProfessionWidgetProps> = ({
  profession,
  orders,
  products,
  tasks,
  customers,
  onNavigate
}) => {
  const meta = getProfessionMeta(profession);
  const lowStock = products.filter((p) => p.quantity <= p.minStock);
  const urgentTasks = tasks.filter((t) => t.priority === 'shoshilinch' && t.status !== 'completed');
  const activeOrders = orders.filter((o) => o.orderStatus === 'jarayonda' || o.orderStatus === 'yangi');

  return (
    <div className="p-4 sm:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <span className="text-xl">{meta.emoji}</span>
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              {meta.label.split('(')[0]} uchun tezkor panel
            </h3>
            <p className="text-xs text-neutral-400">
              {meta.featuresList.slice(0, 3).join(' · ')}
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('settings')}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline hidden sm:block"
        >
          Kasbni o‘zgartirish
        </button>
      </div>

      {/* Dynamic Content by Profession Group */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Module 1 */}
        {profession === 'sotuvchi' || profession === 'avtoservis' || profession === 'oshpaz' ? (
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Ombor nazorati
              </span>
              {lowStock.length > 0 && (
                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> {lowStock.length} ta kam qoldi
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500">
              Jami mahsulot turlari: {products.length} ta
            </p>
            <button
              onClick={() => onNavigate('inventory')}
              className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Omborni ko‘rish</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Faol loyihalar / Ishlar
              </span>
              <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white">
                {activeOrders.length} ta
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              Jarayondagi buyurtmalar
            </p>
            <button
              onClick={() => onNavigate('orders')}
              className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              <span>Buyurtmalarga o‘tish</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* Module 2 */}
        <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Shoshilinch vazifalar
            </span>
            <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
              {urgentTasks.length} ta
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            Bugun/ertaga muddati yetadiganlar
          </p>
          <button
            onClick={() => onNavigate('tasks')}
            className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
          >
            <span>Kanban doskasi</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Module 3 */}
        <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
              Mijozlar bazasi
            </span>
            <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {customers.length} nafar
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            Aloqalar, manzillar va buyurtmalar
          </p>
          <button
            onClick={() => onNavigate('customers')}
            className="mt-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
          >
            <span>Mijozlar ro‘yxati</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
