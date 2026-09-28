import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign
} from 'lucide-react';
import { Transaction, Order, Customer, Product, Service } from '../../types';
import { formatUZS, formatUzbekDate } from '../../utils/formatters';
import { useToast } from '../common/Toast';

interface ReportsViewProps {
  transactions: Transaction[];
  orders: Order[];
  customers: Customer[];
  products: Product[];
  services: Service[];
}

type ReportType =
  | 'income'
  | 'expense'
  | 'profit'
  | 'orders'
  | 'customers'
  | 'products'
  | 'services';

export const ReportsView: React.FC<ReportsViewProps> = ({
  transactions,
  orders,
  customers,
  products,
  services
}) => {
  const [reportType, setReportType] = useState<ReportType>('income');
  const [dateFilter, setDateFilter] = useState<'this_month' | 'last_month' | 'year' | 'all'>('this_month');
  const [search, setSearch] = useState('');

  const { showToast } = useToast();

  const reportData = useMemo(() => {
    const today = new Date();
    const currentMonth = today.toISOString().substring(0, 7); // '2026-09'

    const filterDate = (dateStr: string) => {
      if (dateFilter === 'all') return true;
      if (dateFilter === 'this_month') return dateStr.startsWith(currentMonth);
      if (dateFilter === 'last_month') {
        const lastM = new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().substring(0, 7);
        return dateStr.startsWith(lastM);
      }
      if (dateFilter === 'year') return dateStr.startsWith(String(today.getFullYear()));
      return true;
    };

    switch (reportType) {
      case 'income': {
        const rows = transactions
          .filter((t) => t.type === 'daromad' && filterDate(t.date))
          .filter((t) => (t.description || '').toLowerCase().includes(search.toLowerCase()) || (t.category || '').toLowerCase().includes(search.toLowerCase()));
        const total = rows.reduce((sum, r) => sum + r.amount, 0);
        return {
          title: 'Daromadlar hisoboti',
          totalLabel: 'Jami daromad',
          totalValue: formatUZS(total),
          headers: ['Sana', 'Kategoriya', 'Manba / Mijoz', 'Tavsif', 'Summa'],
          rows: rows.map((r) => [r.date, r.category, r.sourceOrReceiver || '—', r.description || '—', formatUZS(r.amount)]),
          rawItems: rows
        };
      }
      case 'expense': {
        const rows = transactions
          .filter((t) => t.type === 'xarajat' && filterDate(t.date))
          .filter((t) => (t.description || '').toLowerCase().includes(search.toLowerCase()) || (t.category || '').toLowerCase().includes(search.toLowerCase()));
        const total = rows.reduce((sum, r) => sum + r.amount, 0);
        return {
          title: 'Xarajatlar hisoboti',
          totalLabel: 'Jami xarajat',
          totalValue: formatUZS(total),
          headers: ['Sana', 'Kategoriya', 'Qabul qiluvchi', 'Tavsif', 'Summa'],
          rows: rows.map((r) => [r.date, r.category, r.sourceOrReceiver || '—', r.description || '—', formatUZS(r.amount)]),
          rawItems: rows
        };
      }
      case 'profit': {
        const incRows = transactions.filter((t) => t.type === 'daromad' && filterDate(t.date));
        const expRows = transactions.filter((t) => t.type === 'xarajat' && filterDate(t.date));
        const totalInc = incRows.reduce((sum, r) => sum + r.amount, 0);
        const totalExp = expRows.reduce((sum, r) => sum + r.amount, 0);
        const profit = totalInc - totalExp;

        return {
          title: 'Sof foyda hisoboti',
          totalLabel: 'Sof foyda',
          totalValue: formatUZS(profit),
          headers: ['Operatsiya turi', 'Sana', 'Kategoriya', 'Tavsif', 'Summa'],
          rows: transactions
            .filter((t) => filterDate(t.date))
            .map((r) => [r.type === 'daromad' ? '+ Daromad' : '- Xarajat', r.date, r.category, r.description || '—', formatUZS(r.amount)]),
          rawItems: transactions
        };
      }
      case 'orders': {
        const rows = orders.filter((o) => filterDate(o.createdDate));
        const total = rows.reduce((sum, r) => sum + r.finalPrice, 0);
        return {
          title: 'Buyurtmalar hisoboti',
          totalLabel: 'Buyurtmalar summasi',
          totalValue: formatUZS(total),
          headers: ['Buyurtma №', 'Mijoz', 'Xizmat/Tovar', 'Holati', 'Muddati', 'Yakuniy summa'],
          rows: rows.map((r) => [r.orderNumber, r.customerName, r.serviceOrProduct, r.orderStatus, r.deadline, formatUZS(r.finalPrice)]),
          rawItems: rows
        };
      }
      case 'customers': {
        const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);
        return {
          title: 'Mijozlar hisoboti',
          totalLabel: 'Jami tushum',
          totalValue: formatUZS(totalSpent),
          headers: ['Mijoz F.I.SH', 'Telefon', 'Holati', 'Buyurtmalar soni', 'Jami to‘lagan'],
          rows: customers.map((c) => [c.name, c.phone, c.status, String(c.totalOrders), formatUZS(c.totalSpent)]),
          rawItems: customers
        };
      }
      case 'products': {
        const totalVal = products.reduce((sum, p) => sum + p.sellingPrice * p.quantity, 0);
        return {
          title: 'Mahsulotlar va ombor hisoboti',
          totalLabel: 'Ombor tovar qiymati',
          totalValue: formatUZS(totalVal),
          headers: ['Nomi', 'SKU', 'Qoldiq', 'Tannarx', 'Sotish narxi'],
          rows: products.map((p) => [p.name, p.sku, `${p.quantity} dona`, formatUZS(p.purchasePrice), formatUZS(p.sellingPrice)]),
          rawItems: products
        };
      }
      case 'services': {
        return {
          title: 'Xizmatlar ro‘yxati hisoboti',
          totalLabel: 'Jami xizmat turlari',
          totalValue: `${services.length} ta`,
          headers: ['Xizmat nomi', 'Kategoriya', 'Muddati', 'Standart narxi', 'Holati'],
          rows: services.map((s) => [s.name, s.category, s.duration, formatUZS(s.price), s.isActive ? 'Faol' : 'To‘xtatilgan']),
          rawItems: services
        };
      }
    }
  }, [reportType, dateFilter, search, transactions, orders, customers, products, services]);

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [reportData.headers.join(','), ...reportData.rows.map((e) => e.map((val) => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SmartKasb_${reportType}_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('CSV fayl muvaffaqiyatli yuklab olindi', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <span>Moliyaviy & Biznes Hisobotlar</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Kassa, buyurtmalar, mijozlar va ombor hisobotlarini eksport qiling
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={handleExportCSV}
            className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-200 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>CSV Eksport</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Chop etish</span>
          </button>
        </div>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-2xl">
        {[
          { id: 'income', label: 'Daromad hisoboti' },
          { id: 'expense', label: 'Xarajat hisoboti' },
          { id: 'profit', label: 'Foyda hisoboti' },
          { id: 'orders', label: 'Buyurtmalar hisoboti' },
          { id: 'customers', label: 'Mijozlar hisoboti' },
          { id: 'products', label: 'Mahsulotlar hisoboti' },
          { id: 'services', label: 'Xizmatlar hisoboti' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as ReportType)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
              reportType === tab.id
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Date Filter & Search */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
          {[
            { id: 'this_month', label: 'Shu oy' },
            { id: 'last_month', label: 'O‘tgan oy' },
            { id: 'year', label: 'Shu yil' },
            { id: 'all', label: 'Barcha davr' }
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => setDateFilter(d.id as any)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                dateFilter === d.id
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Hisobot qatorlarini qidiring..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Report Summary Header Card */}
      <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-xs text-neutral-400">{reportData.title}</span>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mt-0.5">
            {reportData.totalLabel}: <span className="font-mono text-blue-600 dark:text-blue-400">{reportData.totalValue}</span>
          </h3>
        </div>
        <span className="text-xs font-mono text-neutral-400">
          Jami qatorlar: {reportData.rows.length} ta
        </span>
      </div>

      {/* Printable Report Table */}
      <div id="printable-area" className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                {reportData.headers.map((h, idx) => (
                  <th key={idx} className="py-3 px-4">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
              {reportData.rows.length === 0 ? (
                <tr>
                  <td colSpan={reportData.headers.length} className="py-12 text-center text-neutral-400">
                    Tanlangan davrda hisobot yozuvlari topilmadi
                  </td>
                </tr>
              ) : (
                reportData.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="py-3 px-4 font-medium text-neutral-800 dark:text-neutral-200">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
