import React from 'react';
import { X, Printer, Download, CheckCircle2 } from 'lucide-react';
import { Order, User } from '../../types';
import { formatUZS, formatUzbekDate } from '../../utils/formatters';

interface InvoicePrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  user: User;
}

export const InvoicePrintModal: React.FC<InvoicePrintModalProps> = ({
  isOpen,
  onClose,
  order,
  user
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0 no-print" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-10 my-6 flex flex-col max-h-[90vh]">
        {/* Actions bar (hidden in print) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 no-print">
          <div className="text-xs font-semibold text-neutral-600 dark:text-neutral-300">
            Chop etish va Kvitansiya ko‘rinishi
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Chop etish (Print)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-200/50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Document */}
        <div id="printable-area" className="p-8 sm:p-10 bg-white text-neutral-900 overflow-y-auto">
          {/* Header */}
          <div className="flex items-start justify-between border-b pb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-base">
                  S
                </div>
                <span className="text-xl font-extrabold tracking-tight text-neutral-900">
                  SmartKasb
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                {user.businessName || 'Xizmatlar va buyurtmalar markazi'}
              </p>
              <p className="text-xs text-neutral-500">
                Tel: {user.phone} {user.email ? `· ${user.email}` : ''}
              </p>
              {user.address && <p className="text-xs text-neutral-500">{user.address}</p>}
            </div>

            <div className="text-right">
              <span className="text-2xl font-black font-mono text-neutral-900 block">
                KVITANSIYA
              </span>
              <span className="text-xs font-mono font-bold text-blue-600">
                #{order.orderNumber}
              </span>
              <div className="text-xs text-neutral-500 mt-1">
                Sana: {formatUzbekDate(order.createdDate)}
              </div>
              <div className="text-xs text-neutral-500">
                Muddati: {formatUzbekDate(order.deadline)}
              </div>
            </div>
          </div>

          {/* Customer info */}
          <div className="mt-6 p-4 rounded-xl bg-neutral-50 border border-neutral-100 flex justify-between text-xs">
            <div>
              <span className="text-neutral-400 uppercase font-semibold text-[10px] block">
                Mijoz ma’lumotlari:
              </span>
              <span className="font-bold text-sm text-neutral-900 block mt-0.5">
                {order.customerName}
              </span>
              {order.customerPhone && (
                <span className="text-neutral-600 font-mono block">{order.customerPhone}</span>
              )}
            </div>

            <div className="text-right">
              <span className="text-neutral-400 uppercase font-semibold text-[10px] block">
                To‘lov holati:
              </span>
              <span className="font-bold uppercase text-xs text-emerald-700 block mt-0.5">
                {order.paymentStatus === 'toliq_tolangan'
                  ? 'To‘liq to‘langan'
                  : order.paymentStatus === 'qisman_tolangan'
                  ? 'Qisman to‘langan'
                  : 'To‘lanmagan'}
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="mt-6">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-neutral-200 text-neutral-400 uppercase text-[10px]">
                  <th className="py-2.5">Xizmat / Tovar</th>
                  <th className="py-2.5 text-center">Soni</th>
                  <th className="py-2.5 text-right">Dona narxi</th>
                  <th className="py-2.5 text-right">Jami</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                <tr>
                  <td className="py-3 font-semibold text-neutral-900">
                    {order.serviceOrProduct}
                    {order.description && (
                      <span className="block font-normal text-neutral-500 text-[11px] mt-0.5">
                        {order.description}
                      </span>
                    )}
                  </td>
                  <td className="py-3 text-center font-mono">{order.quantity}</td>
                  <td className="py-3 text-right font-mono tabular-nums">
                    {formatUZS(order.unitPrice)}
                  </td>
                  <td className="py-3 text-right font-mono tabular-nums font-bold">
                    {formatUZS(order.quantity * order.unitPrice)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Financial summary calculations */}
          <div className="mt-6 pt-4 border-t-2 border-neutral-200 flex justify-end">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Hisoblangan summa:</span>
                <span className="font-mono tabular-nums">
                  {formatUZS(order.quantity * order.unitPrice)}
                </span>
              </div>

              {order.discount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Chegirma:</span>
                  <span className="font-mono tabular-nums">
                    -{formatUZS(order.discount)}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm font-bold text-neutral-900 pt-1.5 border-t border-neutral-200">
                <span>Yakuniy to‘lov summasi:</span>
                <span className="font-mono tabular-nums text-blue-600">
                  {formatUZS(order.finalPrice)}
                </span>
              </div>

              <div className="flex justify-between text-emerald-700 font-semibold pt-1">
                <span>To‘langan summa:</span>
                <span className="font-mono tabular-nums">
                  {formatUZS(order.paidAmount)}
                </span>
              </div>

              <div className="flex justify-between text-rose-700 font-bold pt-1 border-t border-neutral-100">
                <span>Qoldiq qarz:</span>
                <span className="font-mono tabular-nums">
                  {formatUZS(order.remainingAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Notes */}
          <div className="mt-10 pt-6 border-t border-dashed border-neutral-200 flex items-center justify-between text-[11px] text-neutral-400">
            <div>
              <span>Xizmatimizdan foydalanganingiz uchun tashakkur!</span>
              {order.notes && <p className="mt-0.5 text-neutral-500">Izoh: {order.notes}</p>}
            </div>
            <div className="text-right">
              <span>SmartKasb Assistant orqali chiqarildi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
