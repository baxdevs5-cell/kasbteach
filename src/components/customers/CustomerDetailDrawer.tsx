import React from 'react';
import {
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  Plus,
  Edit2,
  Trash2,
  FileText
} from 'lucide-react';
import { Customer, Order, Task } from '../../types';
import { Badge } from '../common/Badge';
import { formatUZS, formatUzbekDate } from '../../utils/formatters';

interface CustomerDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  orders: Order[];
  tasks: Task[];
  onEdit: (customer: Customer) => void;
  onDelete: (customerId: string) => void;
  onCreateOrder: (customerId: string) => void;
}

export const CustomerDetailDrawer: React.FC<CustomerDetailDrawerProps> = ({
  isOpen,
  onClose,
  customer,
  orders,
  tasks,
  onEdit,
  onDelete,
  onCreateOrder
}) => {
  if (!isOpen || !customer) return null;

  const customerOrders = orders.filter((o) => o.customerId === customer.id);
  const customerTasks = tasks.filter((t) => t.relatedCustomerId === customer.id);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white dark:bg-neutral-900 border-l border-neutral-200 dark:border-neutral-800 shadow-2xl flex flex-col h-full z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                {customer.name}
              </h3>
              <Badge type="customer" status={customer.status} />
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Qo‘shilgan sana: {formatUzbekDate(customer.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onEdit(customer)}
              title="Tahrirlash"
              className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(customer.id)}
              title="O‘chirish"
              className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
              <span className="text-xs text-neutral-400">Jami xarid summasi</span>
              <div className="text-base font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
                {formatUZS(customer.totalSpent)}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
              <span className="text-xs text-neutral-400">Buyurtmalar soni</span>
              <div className="text-base font-bold font-mono tabular-nums text-neutral-900 dark:text-white mt-1">
                {customerOrders.length} ta
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Aloqa ma’lumotlari
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2.5 text-neutral-700 dark:text-neutral-200">
                <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                <a href={`tel:${customer.phone}`} className="hover:text-blue-600 underline">
                  {customer.phone}
                </a>
              </div>

              {customer.email && (
                <div className="flex items-center gap-2.5 text-neutral-700 dark:text-neutral-200">
                  <Mail className="w-4 h-4 text-neutral-400 shrink-0" />
                  <a href={`mailto:${customer.email}`} className="hover:text-blue-600">
                    {customer.email}
                  </a>
                </div>
              )}

              {customer.address && (
                <div className="flex items-center gap-2.5 text-neutral-700 dark:text-neutral-200">
                  <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>{customer.address}</span>
                </div>
              )}

              {customer.notes && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 text-neutral-600 dark:text-neutral-300">
                  <FileText className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{customer.notes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Order History */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Buyurtmalar tarixi ({customerOrders.length})
              </h4>
              <button
                onClick={() => onCreateOrder(customer.id)}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Yangi buyurtma
              </button>
            </div>

            <div className="space-y-2">
              {customerOrders.length === 0 ? (
                <p className="text-xs text-neutral-400 py-3 text-center bg-neutral-50 dark:bg-neutral-800/40 rounded-xl">
                  Hozircha buyurtmalar mavjud emas
                </p>
              ) : (
                customerOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold font-mono text-neutral-900 dark:text-white">
                        {ord.orderNumber}
                      </span>
                      <span className="text-xs font-mono font-bold tabular-nums text-neutral-900 dark:text-white">
                        {formatUZS(ord.finalPrice)}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-0.5 truncate">
                      {ord.serviceOrProduct}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/60 text-[11px]">
                      <span className="text-neutral-400">Muddati: {ord.deadline}</span>
                      <div className="flex items-center gap-1">
                        <Badge type="order" status={ord.orderStatus} size="sm" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Related Tasks */}
          {customerTasks.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                Bog‘langan vazifalar ({customerTasks.length})
              </h4>
              <div className="space-y-1.5">
                {customerTasks.map((t) => (
                  <div
                    key={t.id}
                    className="p-2.5 rounded-xl border border-neutral-100 dark:border-neutral-800 text-xs flex items-center justify-between"
                  >
                    <span className="text-neutral-800 dark:text-neutral-200 truncate pr-2">
                      {t.title}
                    </span>
                    <Badge type="task" status={t.status} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
