import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Edit2,
  Calendar,
  FileSpreadsheet
} from 'lucide-react';
import { Transaction, Customer } from '../../types';
import { TransactionModal } from './TransactionModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { formatUZS, formatUzbekDate } from '../../utils/formatters';
import { useToast } from '../common/Toast';

interface FinanceViewProps {
  transactions: Transaction[];
  customers: Customer[];
  onSaveTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const FinanceView: React.FC<FinanceViewProps> = ({
  transactions,
  customers,
  onSaveTransaction,
  onDeleteTransaction
}) => {
  const [tab, setTab] = useState<'all' | 'daromad' | 'xarajat'>('all');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState(new Date().toISOString().substring(0, 7)); // '2026-09'

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDefaultType, setModalDefaultType] = useState<'daromad' | 'xarajat'>('daromad');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [txToDelete, setTxToDelete] = useState<string | null>(null);

  const { showToast } = useToast();

  // Dynamic calculations
  const { totalIncome, totalExpenses, netProfit, filteredTransactions, uniqueCategories } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    const cats = new Set<string>();

    transactions.forEach((t) => {
      if (t.type === 'daromad') inc += t.amount;
      if (t.type === 'xarajat') exp += t.amount;
      if (t.category) cats.add(t.category);
    });

    const list = transactions.filter((t) => {
      const matchTab = tab === 'all' || t.type === tab;
      const matchMonth = !monthFilter || t.date.startsWith(monthFilter);
      const matchCategory = categoryFilter === 'all' || t.category === categoryFilter;

      const q = search.toLowerCase();
      const matchSearch =
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.sourceOrReceiver && t.sourceOrReceiver.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q));

      return matchTab && matchMonth && matchCategory && matchSearch;
    });

    // Sort by date descending
    list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      totalIncome: inc,
      totalExpenses: exp,
      netProfit: inc - exp,
      filteredTransactions: list,
      uniqueCategories: Array.from(cats)
    };
  }, [transactions, tab, monthFilter, categoryFilter, search]);

  const handleConfirmDelete = () => {
    if (txToDelete) {
      onDeleteTransaction(txToDelete);
      showToast('Kassa operatsiyasi o‘chirildi', 'info');
      setTxToDelete(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <span>Kirim & Chiqim Moliya Hisobi</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Kassa harakatlari, xarajatlar tahlili va sof foyda hisoblagichi
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={() => {
              setEditingTransaction(null);
              setModalDefaultType('daromad');
              setIsModalOpen(true);
            }}
            className="flex-1 sm:flex-initial px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>+ Daromad</span>
          </button>
          <button
            onClick={() => {
              setEditingTransaction(null);
              setModalDefaultType('xarajat');
              setIsModalOpen(true);
            }}
            className="flex-1 sm:flex-initial px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>- Xarajat</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
            <span>Jami kirim (Daromad)</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-white">
            {formatUZS(totalIncome)}
          </div>
          <span className="text-[11px] text-neutral-400 mt-1 block">Barcha tushumlar jamg‘armasi</span>
        </div>

        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
            <span>Jami chiqim (Xarajatlar)</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-neutral-900 dark:text-white">
            {formatUZS(totalExpenses)}
          </div>
          <span className="text-[11px] text-neutral-400 mt-1 block">Barcha xarajat moddalari</span>
        </div>

        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
            <span>Sof foyda (Kirim - Chiqim)</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-blue-600 dark:text-blue-400">
            {formatUZS(netProfit)}
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block font-medium">
            {totalIncome > 0 ? `${Math.round((netProfit / totalIncome) * 100)}% rentabellik` : '0%'}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Type tabs */}
        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl shrink-0">
          <button
            onClick={() => setTab('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              tab === 'all'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Barchasi
          </button>
          <button
            onClick={() => setTab('daromad')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              tab === 'daromad'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Daromadlar
          </button>
          <button
            onClick={() => setTab('xarajat')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
              tab === 'xarajat'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Xarajatlar
          </button>
        </div>

        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tavsif, to‘lovchi yoki kategoriya..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="all">Barcha toifalar</option>
            {uniqueCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Month selector */}
          <input
            type="month"
            value={monthFilter}
            onChange={(e) => setMonthFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-700 dark:text-neutral-300 focus:outline-none"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="py-16 text-center">
            <DollarSign className="w-12 h-12 stroke-1 mx-auto text-neutral-300 dark:text-neutral-600 mb-3" />
            <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Bu yerda hali ma’lumot yo‘q.
            </h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1 mb-4">
              Tanlangan muddatda kassa operatsiyalari qayd etilmagan.
            </p>
            <button
              onClick={() => {
                setEditingTransaction(null);
                setModalDefaultType('daromad');
                setIsModalOpen(true);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Yangi qo‘shish</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  <th className="py-3 px-4">Turi</th>
                  <th className="py-3 px-4">Sana</th>
                  <th className="py-3 px-4">Kategoriya</th>
                  <th className="py-3 px-4">Tavsif / Manba</th>
                  <th className="py-3 px-4 text-right">Summa</th>
                  <th className="py-3 px-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
                {filteredTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      {tx.type === 'daromad' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold text-xs border border-emerald-200 dark:border-emerald-900">
                          <ArrowUpRight className="w-3 h-3" /> Daromad
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 font-semibold text-xs border border-rose-200 dark:border-rose-900">
                          <ArrowDownRight className="w-3 h-3" /> Xarajat
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 font-mono text-neutral-600 dark:text-neutral-400">
                      {tx.date}
                    </td>

                    <td className="py-3 px-4 font-medium text-neutral-800 dark:text-neutral-200">
                      {tx.category}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-neutral-900 dark:text-white truncate max-w-xs">
                        {tx.description || '—'}
                      </div>
                      {tx.sourceOrReceiver && (
                        <div className="text-[11px] text-neutral-400 truncate max-w-xs">
                          {tx.sourceOrReceiver}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold">
                      <span
                        className={
                          tx.type === 'daromad'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }
                      >
                        {tx.type === 'daromad' ? '+' : '-'} {formatUZS(tx.amount)}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditingTransaction(tx);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          title="Tahrirlash"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setTxToDelete(tx.id)}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          title="O‘chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(t) => {
          onSaveTransaction(t);
          showToast(editingTransaction ? 'Operatsiya yangilandi' : 'Kassaga yozildi', 'success');
        }}
        initialTransaction={editingTransaction}
        defaultType={modalDefaultType}
        customers={customers}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(txToDelete)}
        onClose={() => setTxToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Kassa operatsiyasini o‘chirish"
        message="Haqiqatan ham ushbu yozuvni o‘chirmoqchimisiz? Kassa qoldig‘i qayta hisoblanadi."
        confirmLabel="Ha, o‘chirish"
        cancelLabel="Bekor qilish"
        isDestructive={true}
      />
    </div>
  );
};
