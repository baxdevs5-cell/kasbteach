import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, User, ShoppingBag, Package, Wrench, CheckSquare, Bell, ArrowRight, X } from 'lucide-react';
import { DataStore } from '../../utils/storage';
import { formatUZS } from '../../utils/formatters';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string, targetId?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return { customers: [], orders: [], products: [], services: [], tasks: [], reminders: [] };

    const customers = DataStore.getCustomers().filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q))
    ).slice(0, 4);

    const orders = DataStore.getOrders().filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.serviceOrProduct.toLowerCase().includes(q)
    ).slice(0, 4);

    const products = DataStore.getProducts().filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    ).slice(0, 4);

    const services = DataStore.getServices().filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    ).slice(0, 4);

    const tasks = DataStore.getTasks().filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q))
    ).slice(0, 4);

    const reminders = DataStore.getReminders().filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q))
    ).slice(0, 3);

    return { customers, orders, products, services, tasks, reminders };
  }, [query]);

  const totalResultsCount =
    results.customers.length +
    results.orders.length +
    results.products.length +
    results.services.length +
    results.tasks.length +
    results.reminders.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Mijozlar, buyurtmalar, tovarlar, xizmatlar, vazifalarni qidiring..."
            className="w-full bg-transparent border-0 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs text-neutral-400 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md">
              ESC
            </kbd>
          )}
        </div>

        {/* Results view */}
        <div className="p-4 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800 space-y-4">
          {!query && (
            <div className="text-center py-10 text-neutral-400 dark:text-neutral-500">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Qidirish uchun so‘z yoki telefon raqam kiriting</p>
              <p className="text-xs mt-1 text-neutral-400">Masalan: Jasur, ORD-101, SSD, Veb-sayt</p>
            </div>
          )}

          {query && totalResultsCount === 0 && (
            <div className="text-center py-10 text-neutral-500 dark:text-neutral-400">
              <p className="text-sm font-medium">"{query}" bo‘yicha hech narsa topilmadi</p>
              <p className="text-xs mt-1 text-neutral-400">Boshqa so‘z bilan sinab ko‘ring</p>
            </div>
          )}

          {/* Customers */}
          {results.customers.length > 0 && (
            <div className="pt-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Mijozlar ({results.customers.length})
              </div>
              <div className="space-y-1">
                {results.customers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onNavigate('customers', c.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {c.name}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        {c.phone} {c.address ? `· ${c.address}` : ''}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono tabular-nums text-neutral-600 dark:text-neutral-300">
                        {formatUZS(c.totalSpent)}
                      </span>
                      <ArrowRight className="w-4 h-4 ml-2 inline-block opacity-0 group-hover:opacity-100 text-blue-600 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Orders */}
          {results.orders.length > 0 && (
            <div className="pt-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" /> Buyurtmalar ({results.orders.length})
              </div>
              <div className="space-y-1">
                {results.orders.map((o) => (
                  <button
                    key={o.id}
                    onClick={() => {
                      onNavigate('orders', o.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {o.orderNumber}: {o.serviceOrProduct}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        {o.customerName} · Muddati: {o.deadline}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono tabular-nums font-semibold text-neutral-900 dark:text-white">
                        {formatUZS(o.finalPrice)}
                      </div>
                      <span className="text-xs text-neutral-400 capitalize">{o.orderStatus}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          {results.products.length > 0 && (
            <div className="pt-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" /> Mahsulotlar ({results.products.length})
              </div>
              <div className="space-y-1">
                {results.products.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onNavigate('inventory', p.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {p.name}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        SKU: {p.sku} · Qoldiq: {p.quantity} dona
                      </div>
                    </div>
                    <div className="text-right text-xs font-mono tabular-nums font-semibold text-neutral-900 dark:text-white">
                      {formatUZS(p.sellingPrice)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Services */}
          {results.services.length > 0 && (
            <div className="pt-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" /> Xizmatlar ({results.services.length})
              </div>
              <div className="space-y-1">
                {results.services.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onNavigate('services', s.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {s.name}
                      </div>
                      <div className="text-xs text-neutral-500 dark:text-neutral-400">
                        {s.category} · {s.duration}
                      </div>
                    </div>
                    <div className="text-right text-xs font-mono tabular-nums font-semibold text-neutral-900 dark:text-white">
                      {formatUZS(s.price)}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tasks */}
          {results.tasks.length > 0 && (
            <div className="pt-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                <CheckSquare className="w-3.5 h-3.5" /> Vazifalar ({results.tasks.length})
              </div>
              <div className="space-y-1">
                {results.tasks.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      onNavigate('tasks', t.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors group"
                  >
                    <div className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate pr-4">
                      {t.title}
                    </div>
                    <span className="text-xs text-neutral-400 shrink-0">{t.deadline}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Reminders */}
          {results.reminders.length > 0 && (
            <div className="pt-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1.5">
                <Bell className="w-3.5 h-3.5" /> Eslatmalar ({results.reminders.length})
              </div>
              <div className="space-y-1">
                {results.reminders.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => {
                      onNavigate('reminders', r.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 text-left transition-colors group"
                  >
                    <div className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate pr-4">
                      {r.title}
                    </div>
                    <span className="text-xs text-neutral-400 shrink-0">{r.date} {r.time}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
