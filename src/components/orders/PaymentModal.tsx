import React, { useState } from 'react';
import { Order } from '../../types';
import { Modal } from '../common/Modal';
import { formatUZS } from '../../utils/formatters';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onSavePayment: (orderId: string, amount: number, paymentMethod: string, notes?: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  order,
  onSavePayment
}) => {
  const [amount, setAmount] = useState<number>(order ? order.remainingAmount : 0);
  const [method, setMethod] = useState('Naqd pul');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!order || !isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      setError('To‘lov summasi 0 dan katta bo‘lishi lozim');
      return;
    }
    onSavePayment(order.id, amount, method, notes);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Buyurtmaga to‘lov qabul qilish"
      subtitle={`${order.orderNumber} — ${order.customerName}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 text-xs space-y-1.5">
          <div className="flex justify-between">
            <span className="text-neutral-500">Umumiy buyurtma summasi:</span>
            <span className="font-mono font-bold text-neutral-900 dark:text-white">
              {formatUZS(order.finalPrice)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-500">Ilgari to‘langan summa:</span>
            <span className="font-mono text-emerald-600 font-semibold">
              {formatUZS(order.paidAmount)}
            </span>
          </div>
          <div className="flex justify-between border-t border-neutral-200 dark:border-neutral-700 pt-1 font-semibold">
            <span className="text-neutral-700 dark:text-neutral-200">Hozirgi qoldiq qarz:</span>
            <span className="font-mono text-rose-600">
              {formatUZS(order.remainingAmount)}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Qabul qilinayotgan summa (so‘m) *
          </label>
          <input
            type="number"
            step="5000"
            value={amount}
            onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl font-mono tabular-nums text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            To‘lov usuli
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Naqd pul">Naqd pul</option>
            <option value="Karta (Payme/Click)">Karta (Payme / Click / Uzum)</option>
            <option value="Bank hisob raqami (Perechisleniye)">Bank hisob raqami (Perechisleniye)</option>
            <option value="Boshqa">Boshqa</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            To‘lov izohi (ixtiyoriy)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Kvitansiya raqami yoki eslatma..."
            className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl"
          >
            Bekor qilish
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
          >
            To‘lovni qabul qilish
          </button>
        </div>
      </form>
    </Modal>
  );
};
