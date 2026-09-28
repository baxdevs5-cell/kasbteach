import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { Modal } from '../common/Modal';
import { generateUniqueId, formatUZS } from '../../utils/formatters';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Product) => void;
  initialProduct?: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Uskunalar');
  const [quantity, setQuantity] = useState<number>(5);
  const [purchasePrice, setPurchasePrice] = useState<number>(100000);
  const [sellingPrice, setSellingPrice] = useState<number>(150000);
  const [minStock, setMinStock] = useState<number>(3);
  const [supplier, setSupplier] = useState('');
  const [sku, setSku] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setCategory(initialProduct.category);
      setQuantity(initialProduct.quantity);
      setPurchasePrice(initialProduct.purchasePrice);
      setSellingPrice(initialProduct.sellingPrice);
      setMinStock(initialProduct.minStock);
      setSupplier(initialProduct.supplier || '');
      setSku(initialProduct.sku);
    } else {
      setName('');
      setCategory('Uskunalar');
      setQuantity(10);
      setPurchasePrice(100000);
      setSellingPrice(150000);
      setMinStock(3);
      setSupplier('');
      setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
    }
    setError('');
  }, [initialProduct, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Iltimos, mahsulot nomini kiriting');
      return;
    }
    if (sellingPrice < purchasePrice) {
      setError('Sotish narxi tannarxidan past bo‘lishi mumkin emas');
      return;
    }

    const prod: Product = {
      id: initialProduct ? initialProduct.id : generateUniqueId('prod'),
      name: name.trim(),
      category: category.trim(),
      quantity,
      purchasePrice,
      sellingPrice,
      minStock,
      supplier: supplier.trim() || undefined,
      sku: sku.trim() || `SKU-${Date.now().toString(36).toUpperCase()}`,
      createdAt: initialProduct ? initialProduct.createdAt : new Date().toISOString().substring(0, 10)
    };

    onSave(prod);
    onClose();
  };

  const potentialProfit = Math.max(0, (sellingPrice - purchasePrice) * quantity);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialProduct ? 'Mahsulotni tahrirlash' : 'Omborga mahsulot qo‘shish'}
      subtitle="Tannarx, sotish narxi va minimal zaxira miqdorini belgilang"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Mahsulot nomi *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="SSD 1TB NVMe drayv..."
            className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Kategoriya
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Uskunalar, Aksessuarlar..."
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              SKU / Artikuli
            </label>
            <input
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl font-mono text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Qoldiq soni (Omborda)
            </label>
            <input
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl font-mono text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Minimal zaxira (Ogohlantirish)
            </label>
            <input
              type="number"
              min="1"
              value={minStock}
              onChange={(e) => setMinStock(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl font-mono text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Tannarxi (so‘m)
            </label>
            <input
              type="number"
              step="5000"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl font-mono text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Sotish narxi (so‘m)
            </label>
            <input
              type="number"
              step="5000"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(Math.max(0, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl font-mono text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs flex items-center justify-between">
          <span className="text-neutral-500">Kutilayotgan potensial sof foyda:</span>
          <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
            {formatUZS(potentialProfit)}
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Yetkazib beruvchi (Ta’minotchi)
          </label>
          <input
            type="text"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            placeholder="Asia Tech Distribution..."
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
            className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
          >
            {initialProduct ? 'Saqlash' : 'Omborga kiritish'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
