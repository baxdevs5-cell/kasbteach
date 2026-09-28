import React, { useState, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Edit2,
  Trash2,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import { Product } from '../../types';
import { ProductModal } from './ProductModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { formatUZS } from '../../utils/formatters';
import { useToast } from '../common/Toast';

interface InventoryViewProps {
  products: Product[];
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onAdjustStock: (id: string, delta: number) => void;
  targetProductId?: string;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  onSaveProduct,
  onDeleteProduct,
  onAdjustStock,
  targetProductId
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [filterMode, setFilterMode] = useState<'all' | 'low' | 'out'>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const { showToast } = useToast();

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Alert products
  const lowStockProducts = useMemo(
    () => products.filter((p) => p.quantity > 0 && p.quantity <= p.minStock),
    [products]
  );

  const outOfStockProducts = useMemo(
    () => products.filter((p) => p.quantity === 0),
    [products]
  );

  // Financial aggregates
  const { totalInventoryCost, totalRetailValue, totalPotentialProfit } = useMemo(() => {
    let cost = 0;
    let retail = 0;
    products.forEach((p) => {
      cost += p.purchasePrice * p.quantity;
      retail += p.sellingPrice * p.quantity;
    });
    return {
      totalInventoryCost: cost,
      totalRetailValue: retail,
      totalPotentialProfit: retail - cost
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        (p.supplier && p.supplier.toLowerCase().includes(q));

      const matchCategory = categoryFilter === 'all' || p.category === categoryFilter;

      let matchMode = true;
      if (filterMode === 'low') matchMode = p.quantity > 0 && p.quantity <= p.minStock;
      if (filterMode === 'out') matchMode = p.quantity === 0;

      return matchSearch && matchCategory && matchMode;
    });
  }, [products, search, categoryFilter, filterMode]);

  const handleConfirmDelete = () => {
    if (productToDelete) {
      onDeleteProduct(productToDelete);
      showToast('Mahsulot o‘chirildi', 'info');
      setProductToDelete(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <span>Ombor & Mahsulotlar</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-mono font-normal">
              {products.length} turdagi tovar
            </span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Zaxiralar hisobi, tannarx va avtomatik qoldiq ogohlantirishlari
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-stretch sm:self-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>+ Mahsulot qo‘shish</span>
        </button>
      </div>

      {/* Financial Valuation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 sm:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
          <span className="text-xs text-neutral-500">Ombordagi tovarlar tannarxi</span>
          <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-white mt-1">
            {formatUZS(totalInventoryCost)}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
          <span className="text-xs text-neutral-500">Sotuv qiymati</span>
          <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-neutral-900 dark:text-white mt-1">
            {formatUZS(totalRetailValue)}
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs">
          <span className="text-xs text-neutral-500">Kutilayotgan potensial sof foyda</span>
          <div className="text-lg sm:text-xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
            {formatUZS(totalPotentialProfit)}
          </div>
        </div>
      </div>

      {/* Critical Stock Warning Badges */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {lowStockProducts.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    Kam qolgan mahsulotlar ({lowStockProducts.length})
                  </h4>
                  <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
                    {lowStockProducts.map((p) => `${p.name} (${p.quantity} dona)`).join(', ')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFilterMode(filterMode === 'low' ? 'all' : 'low')}
                className="text-xs font-semibold text-amber-800 dark:text-amber-200 hover:underline shrink-0"
              >
                {filterMode === 'low' ? 'Barchasi' : 'Filtrlash'}
              </button>
            </div>
          )}

          {outOfStockProducts.length > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-rose-900 dark:text-rose-200">
                    Tugagan mahsulotlar ({outOfStockProducts.length})
                  </h4>
                  <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5">
                    {outOfStockProducts.map((p) => p.name).join(', ')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFilterMode(filterMode === 'out' ? 'all' : 'out')}
                className="text-xs font-semibold text-rose-800 dark:text-rose-200 hover:underline shrink-0"
              >
                {filterMode === 'out' ? 'Barchasi' : 'Filtrlash'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tovar nomi, SKU yoki yetkazib beruvchi..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="all">Barcha kategoriyalar</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
        {filteredProducts.length === 0 ? (
          <div className="py-16 text-center">
            <Package className="w-12 h-12 stroke-1 mx-auto text-neutral-300 dark:text-neutral-600 mb-3" />
            <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Bu yerda hali ma’lumot yo‘q.
            </h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1 mb-4">
              Omborga mahsulot kiritilmagan yoki qidiruv bo‘yicha tovar topilmadi.
            </p>
            <button
              onClick={() => {
                setEditingProduct(null);
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
                  <th className="py-3 px-4">Tovar nomi & SKU</th>
                  <th className="py-3 px-4">Kategoriya</th>
                  <th className="py-3 px-4 text-center">Qoldiq soni</th>
                  <th className="py-3 px-4 text-right">Tannarx</th>
                  <th className="py-3 px-4 text-right">Sotish narxi</th>
                  <th className="py-3 px-4 text-right">Potensial foyda</th>
                  <th className="py-3 px-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
                {filteredProducts.map((prod) => {
                  const isOut = prod.quantity === 0;
                  const isLow = prod.quantity > 0 && prod.quantity <= prod.minStock;
                  const profit = (prod.sellingPrice - prod.purchasePrice) * prod.quantity;

                  return (
                    <tr
                      key={prod.id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-neutral-900 dark:text-white">
                          {prod.name}
                        </div>
                        <div className="text-[11px] text-neutral-400 font-mono">
                          {prod.sku} {prod.supplier ? `· ${prod.supplier}` : ''}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                        {prod.category}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => onAdjustStock(prod.id, -1)}
                            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-0.5"
                            title="1 dona kamaytirish"
                          >
                            <MinusCircle className="w-4 h-4" />
                          </button>

                          <span
                            className={`font-mono font-bold tabular-nums px-2 py-0.5 rounded ${
                              isOut
                                ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                : isLow
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'text-neutral-900 dark:text-white'
                            }`}
                          >
                            {prod.quantity} dona
                          </span>

                          <button
                            onClick={() => onAdjustStock(prod.id, 1)}
                            className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 p-0.5"
                            title="1 dona ko‘paytirish"
                          >
                            <PlusCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums text-neutral-500">
                        {formatUZS(prod.purchasePrice)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-neutral-900 dark:text-white">
                        {formatUZS(prod.sellingPrice)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums font-semibold text-emerald-600 dark:text-emerald-400">
                        {formatUZS(profit)}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingProduct(prod);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            title="Tahrirlash"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setProductToDelete(prod.id)}
                            className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            title="O‘chirish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(p) => {
          onSaveProduct(p);
          showToast(editingProduct ? 'Mahsulot yangilandi' : 'Omborga mahsulot qo‘shildi', 'success');
        }}
        initialProduct={editingProduct}
      />

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={Boolean(productToDelete)}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Mahsulotni o‘chirish"
        message="Haqiqatan ham bu tovarni ombordan o‘chirmoqchimisiz?"
        confirmLabel="Ha, o‘chirish"
        cancelLabel="Bekor qilish"
        isDestructive={true}
      />
    </div>
  );
};
