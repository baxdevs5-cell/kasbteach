import React, { useState, useEffect } from 'react';
import { Transaction, Customer, ExpenseCategory } from '../../types';
import { Modal } from '../common/Modal';
import { generateUniqueId } from '../../utils/formatters';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Transaction) => void;
  initialTransaction?: Transaction | null;
  defaultType?: 'daromad' | 'xarajat';
  customers: Customer[];
}

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'Material',
  'Transport',
  'Salary',
  'Rent',
  'Advertising',
  'Equipment',
  'Utilities',
  'Other'
];

const INCOME_CATEGORIES = [
  'Xizmat haqi',
  'Mahsulot savdosi',
  'Konsultatsiya',
  'Avans to‘lovi',
  'Qo‘shimcha daromad',
  'Boshqa'
];

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTransaction,
  defaultType = 'daromad',
  customers
}) => {
  const [type, setType] = useState<'daromad' | 'xarajat'>(defaultType);
  const [amount, setAmount] = useState<number>(100000);
  const [category, setCategory] = useState<string>('Xizmat haqi');
  const [date, setDate] = useState<string>(new Date().toISOString().substring(0, 10));
  const [sourceOrReceiver, setSourceOrReceiver] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (initialTransaction) {
      setType(initialTransaction.type);
      setAmount(initialTransaction.amount);
      setCategory(initialTransaction.category);
      setDate(initialTransaction.date);
      setSourceOrReceiver(initialTransaction.sourceOrReceiver || '');
      setDescription(initialTransaction.description || '');
    } else {
      setType(defaultType);
      setAmount(100000);
      setCategory(defaultType === 'daromad' ? 'Xizmat haqi' : 'Material');
      setDate(new Date().toISOString().substring(0, 10));
      setSourceOrReceiver('');
      setDescription('');
    }
    setError('');
  }, [initialTransaction, defaultType, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) {
      setError('Summa 0 dan katta bo‘lishi kerak');
      return;
    }
    if (!description.trim() && !category.trim()) {
      setError('Iltimos, tavsif yoki kategoriyani kiriting');
      return;
    }

    const tx: Transaction = {
      id: initialTransaction ? initialTransaction.id : generateUniqueId('tx'),
      type,
      amount,
      category,
      date,
      sourceOrReceiver: sourceOrReceiver.trim() || undefined,
      description: description.trim() || undefined,
      createdAt: initialTransaction ? initialTransaction.createdAt : new Date().toISOString()
    };

    onSave(tx);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type === 'daromad' ? 'Daromad kiritish' : 'Xarajat kiritish'}
      subtitle="Kassa kirim yoki chiqim yozuvini shakllantiring"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        {/* Type Switcher */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setType('daromad');
              setCategory('Xizmat haqi');
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
              type === 'daromad'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            + Kirim (Daromad)
          </button>
          <button
            type="button"
            onClick={() => {
              setType('xarajat');
              setCategory('Material');
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-colors ${
              type === 'xarajat'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            - Chiqim (Xarajat)
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Summa (so‘m) *
          </label>
          <input
            type="number"
            step="5000"
            value={amount}
            onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl font-mono tabular-nums text-neutral-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Kategoriya *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {type === 'daromad'
                ? INCOME_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))
                : EXPENSE_CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Sana *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            {type === 'daromad' ? 'To‘lovchi / Mijoz' : 'Qabul qiluvchi / Manzil'}
          </label>
          <input
            type="text"
            value={sourceOrReceiver}
            onChange={(e) => setSourceOrReceiver(e.target.value)}
            placeholder={type === 'daromad' ? 'Jasur Aliyev yoki Shaxsiy' : 'Kovorking, Dokon, Yetkazib beruvchi'}
            className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Izoh / Tavsif
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Operatsiya maqsadi yoki kvitansiya ma’lumoti..."
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
            className={`px-5 py-2 text-xs font-semibold text-white rounded-xl shadow-xs transition-colors ${
              type === 'daromad' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            {initialTransaction ? 'Saqlash' : 'Kassaga yozish'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
