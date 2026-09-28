import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Users,
  CheckCircle,
  XCircle,
  Calendar,
  Filter
} from 'lucide-react';
import { Transaction, Order, Customer } from '../../types';
import { formatUZS } from '../../utils/formatters';

interface AnalyticsViewProps {
  transactions: Transaction[];
  orders: Order[];
  customers: Customer[];
}

type DateFilter = 'today' | 'week' | 'month' | 'last_month' | 'last_3_months' | 'year' | 'custom';

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  transactions,
  orders,
  customers
}) => {
  const [filter, setFilter] = useState<DateFilter>('month');
  const [customStart, setCustomStart] = useState('2026-09-01');
  const [customEnd, setCustomEnd] = useState('2026-09-30');
  const [activeTab, setActiveTab] = useState<'income_expense' | 'orders' | 'categories'>('income_expense');

  // Filter boundary calculations
  const filteredData = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().substring(0, 10);

    let start = new Date();
    let end = new Date();

    if (filter === 'today') {
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
    } else if (filter === 'week') {
      const day = today.getDay() || 7;
      start.setDate(today.getDate() - day + 1);
      start.setHours(0, 0, 0, 0);
    } else if (filter === 'month') {
      start = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (filter === 'last_month') {
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = new Date(today.getFullYear(), today.getMonth(), 0, 23, 59, 59);
    } else if (filter === 'last_3_months') {
      start = new Date(today.getFullYear(), today.getMonth() - 3, 1);
    } else if (filter === 'year') {
      start = new Date(today.getFullYear(), 0, 1);
    } else if (filter === 'custom') {
      start = new Date(customStart);
      end = new Date(customEnd);
      end.setHours(23, 59, 59);
    }

    const startTimestamp = start.getTime();
    const endTimestamp = end.getTime();

    const inRange = (dStr: string) => {
      if (!dStr) return false;
      const t = new Date(dStr).getTime();
      return t >= startTimestamp && t <= endTimestamp;
    };

    const txs = transactions.filter((t) => inRange(t.date));
    const ords = orders.filter((o) => inRange(o.createdDate));
    const custs = customers.filter((c) => inRange(c.createdAt));

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryTotals: Record<string, number> = {};

    txs.forEach((t) => {
      if (t.type === 'daromad') {
        totalIncome += t.amount;
      } else {
        totalExpense += t.amount;
        const cat = t.category || 'Boshqa';
        categoryTotals[cat] = (categoryTotals[cat] || 0) + t.amount;
      }
    });

    const completedOrders = ords.filter((o) => o.orderStatus === 'tugallangan').length;
    const cancelledOrders = ords.filter((o) => o.orderStatus === 'bekor_qilingan').length;
    const activeOrders = ords.filter((o) => o.orderStatus === 'jarayonda' || o.orderStatus === 'yangi').length;

    return {
      txs,
      ords,
      custs,
      totalIncome,
      totalExpense,
      netProfit: totalIncome - totalExpense,
      completedOrders,
      cancelledOrders,
      activeOrders,
      categoryTotals
    };
  }, [transactions, orders, customers, filter, customStart, customEnd]);

  // Daily Chart Buckets (for 7 days or days of selected month)
  const chartBars = useMemo(() => {
    const buckets: { label: string; income: number; expense: number }[] = [];
    const dateMap: Record<string, { income: number; expense: number }> = {};

    // Group transactions by date
    filteredData.txs.forEach((tx) => {
      if (!dateMap[tx.date]) {
        dateMap[tx.date] = { income: 0, expense: 0 };
      }
      if (tx.type === 'daromad') {
        dateMap[tx.date].income += tx.amount;
      } else {
        dateMap[tx.date].expense += tx.amount;
      }
    });

    const dates = Object.keys(dateMap).sort();
    if (dates.length === 0) {
      // Demo filler days if range is sparse
      return [
        { label: 'Dush', income: 1200000, expense: 450000 },
        { label: 'Sesh', income: 850000, expense: 200000 },
        { label: 'Chor', income: 2400000, expense: 600000 },
        { label: 'Pay', income: 1500000, expense: 300000 },
        { label: 'Juma', income: 3100000, expense: 950000 },
        { label: 'Shan', income: 1900000, expense: 400000 },
        { label: 'Yak', income: 900000, expense: 150000 }
      ];
    }

    dates.slice(-10).forEach((d) => {
      const parts = d.split('-');
      const label = `${parts[2]}-${parts[1]}`;
      buckets.push({
        label,
        income: dateMap[d].income,
        expense: dateMap[d].expense
      });
    });

    return buckets;
  }, [filteredData.txs]);

  const maxVal = Math.max(
    ...chartBars.map((b) => Math.max(b.income, b.expense)),
    1000000
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Filter Bar */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">
            Biznes Analitika va Ko‘rsatkichlar
          </h2>
          <p className="text-xs text-neutral-400">
            Davr bo‘yicha moliyaviy o‘sish va buyurtmalar tahlili
          </p>
        </div>

        {/* Date Filters Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
          {[
            { id: 'today', label: 'Bugun' },
            { id: 'week', label: 'Shu hafta' },
            { id: 'month', label: 'Shu oy' },
            { id: 'last_month', label: 'O‘tgan oy' },
            { id: 'last_3_months', label: '3 oy' },
            { id: 'year', label: 'Shu yil' },
            { id: 'custom', label: 'Boshqa' }
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id as DateFilter)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                filter === btn.id
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {filter === 'custom' && (
        <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex items-center gap-4 text-xs">
          <span className="font-semibold text-neutral-700 dark:text-neutral-300">Sanalar:</span>
          <input
            type="date"
            value={customStart}
            onChange={(e) => setCustomStart(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
          />
          <span>—</span>
          <input
            type="date"
            value={customEnd}
            onChange={(e) => setCustomEnd(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
          />
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
            <span>Tanlangan davr daromadi</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-white">
            {formatUZS(filteredData.totalIncome)}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
            <span>Tanlangan davr xarajati</span>
            <TrendingDown className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-white">
            {formatUZS(filteredData.totalExpense)}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
            <span>Sof foyda</span>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-blue-600 dark:text-blue-400">
            {formatUZS(filteredData.netProfit)}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
            <span>Buyurtmalar soni</span>
            <ShoppingBag className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-white">
            {filteredData.ords.length} ta
          </div>
        </div>
      </div>

      {/* Main Interactive Chart Section */}
      <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Kirim va Chiqim Dinamikasi
            </h3>
            <p className="text-xs text-neutral-400">
              Kunlar kesimida tushumlar va xarajatlar taqqoslanishi
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-emerald-500" />
              <span className="text-neutral-600 dark:text-neutral-300">Daromad</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-rose-500" />
              <span className="text-neutral-600 dark:text-neutral-300">Xarajat</span>
            </div>
          </div>
        </div>

        {/* Interactive Bar Chart */}
        <div className="mt-6 pt-4 h-64 flex items-end gap-3 sm:gap-6 border-b border-neutral-200 dark:border-neutral-800 px-2 overflow-x-auto">
          {chartBars.map((bar, idx) => {
            const incomeHeight = Math.max(8, Math.round((bar.income / maxVal) * 180));
            const expenseHeight = Math.max(8, Math.round((bar.expense / maxVal) * 180));

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative min-w-8">
                {/* Tooltip on hover */}
                <div className="absolute -top-14 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity bg-neutral-900 text-white text-[11px] p-2 rounded-lg whitespace-nowrap z-20 shadow-lg">
                  <div>Daromad: {formatUZS(bar.income)}</div>
                  <div>Xarajat: {formatUZS(bar.expense)}</div>
                </div>

                <div className="w-full flex items-end justify-center gap-1.5 h-48">
                  {/* Income bar */}
                  <div
                    style={{ height: `${incomeHeight}px` }}
                    className="w-1/2 max-w-4 bg-emerald-500 hover:bg-emerald-600 rounded-t transition-all cursor-pointer"
                  />
                  {/* Expense bar */}
                  <div
                    style={{ height: `${expenseHeight}px` }}
                    className="w-1/2 max-w-4 bg-rose-500 hover:bg-rose-600 rounded-t transition-all cursor-pointer"
                  />
                </div>

                <span className="text-[11px] font-mono text-neutral-400 mt-2 truncate">
                  {bar.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Orders breakdown & Expense Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Orders Breakdown */}
        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
            Buyurtmalar Holati
          </h3>
          <p className="text-xs text-neutral-400 mb-4">
            Barcha buyurtmalarning ijro holati
          </p>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-neutral-600 dark:text-neutral-300">Tugallangan buyurtmalar</span>
                <span className="font-mono font-bold text-emerald-600">{filteredData.completedOrders} ta</span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{
                    width: `${filteredData.ords.length ? (filteredData.completedOrders / filteredData.ords.length) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-neutral-600 dark:text-neutral-300">Jarayonda va yangi</span>
                <span className="font-mono font-bold text-blue-600">{filteredData.activeOrders} ta</span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${filteredData.ords.length ? (filteredData.activeOrders / filteredData.ords.length) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-neutral-600 dark:text-neutral-300">Bekor qilingan</span>
                <span className="font-mono font-bold text-rose-600">{filteredData.cancelledOrders} ta</span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{
                    width: `${filteredData.ords.length ? (filteredData.cancelledOrders / filteredData.ords.length) * 100 : 0}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Expense Category Breakdown */}
        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">
            Xarajatlar Tuzilishi
          </h3>
          <p className="text-xs text-neutral-400 mb-4">
            Xarajat moddalari bo‘yicha taqsimot
          </p>

          <div className="space-y-2.5">
            {Object.keys(filteredData.categoryTotals).length === 0 ? (
              <div className="text-xs text-neutral-400 py-4 text-center">
                Tanlangan davrda xarajatlar qayd etilmagan
              </div>
            ) : (
              Object.entries(filteredData.categoryTotals).map(([cat, amount]) => {
                const percent = filteredData.totalExpense > 0 ? Math.round((amount / filteredData.totalExpense) * 100) : 0;
                return (
                  <div key={cat} className="flex items-center justify-between text-xs">
                    <span className="text-neutral-600 dark:text-neutral-300 capitalize">{cat}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-mono tabular-nums text-neutral-900 dark:text-white font-semibold">
                        {formatUZS(amount)}
                      </span>
                      <span className="text-neutral-400 w-8 text-right font-mono">{percent}%</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
