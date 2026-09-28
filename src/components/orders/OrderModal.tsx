import React, { useState, useEffect } from 'react';
import { Order, Customer, Service, Product, OrderStatus, PaymentStatus } from '../../types';
import { Modal } from '../common/Modal';
import { generateUniqueId, formatUZS } from '../../utils/formatters';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (order: Order) => void;
  initialOrder?: Order | null;
  customers: Customer[];
  services: Service[];
  products: Product[];
  presetCustomerId?: string;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialOrder,
  customers,
  services,
  products,
  presetCustomerId
}) => {
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [serviceOrProduct, setServiceOrProduct] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number>(500000);
  const [discount, setDiscount] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('yangi');
  const [deadline, setDeadline] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  // Auto calculate final and remaining
  const subtotal = Math.max(0, quantity * unitPrice);
  const finalPrice = Math.max(0, subtotal - discount);
  const remainingAmount = Math.max(0, finalPrice - paidAmount);

  // Auto determine payment status
  const computedPaymentStatus: PaymentStatus =
    paidAmount >= finalPrice && finalPrice > 0
      ? 'toliq_tolangan'
      : paidAmount > 0
      ? 'qisman_tolangan'
      : 'tolanmagan';

  useEffect(() => {
    if (initialOrder) {
      setCustomerId(initialOrder.customerId);
      setCustomerName(initialOrder.customerName);
      setCustomerPhone(initialOrder.customerPhone || '');
      setServiceOrProduct(initialOrder.serviceOrProduct);
      setDescription(initialOrder.description || '');
      setQuantity(initialOrder.quantity || 1);
      setUnitPrice(initialOrder.unitPrice || 0);
      setDiscount(initialOrder.discount || 0);
      setPaidAmount(initialOrder.paidAmount || 0);
      setOrderStatus(initialOrder.orderStatus);
      setDeadline(initialOrder.deadline || '');
      setNotes(initialOrder.notes || '');
    } else {
      const defaultCust = presetCustomerId
        ? customers.find((c) => c.id === presetCustomerId)
        : customers[0];

      if (defaultCust) {
        setCustomerId(defaultCust.id);
        setCustomerName(defaultCust.name);
        setCustomerPhone(defaultCust.phone);
      } else {
        setCustomerId('');
        setCustomerName('');
        setCustomerPhone('');
      }

      setServiceOrProduct(services[0]?.name || products[0]?.name || '');
      setDescription('');
      setQuantity(1);
      setUnitPrice(services[0]?.price || products[0]?.sellingPrice || 500000);
      setDiscount(0);
      setPaidAmount(0);
      setOrderStatus('yangi');

      // Default deadline: 7 days from now
      const d = new Date();
      d.setDate(d.getDate() + 7);
      setDeadline(d.toISOString().substring(0, 10));
      setNotes('');
    }
    setError('');
  }, [initialOrder, presetCustomerId, customers, services, products, isOpen]);

  const handleCustomerChange = (cId: string) => {
    setCustomerId(cId);
    const target = customers.find((c) => c.id === cId);
    if (target) {
      setCustomerName(target.name);
      setCustomerPhone(target.phone);
    }
  };

  const handlePresetServiceSelect = (name: string, price: number) => {
    setServiceOrProduct(name);
    setUnitPrice(price);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setError('Iltimos, mijozni tanlang yoki kiriting');
      return;
    }
    if (!serviceOrProduct.trim()) {
      setError('Iltimos, xizmat yoki mahsulot nomini kiriting');
      return;
    }
    if (unitPrice < 0) {
      setError('Narx musbat son bo‘lishi kerak');
      return;
    }

    const order: Order = {
      id: initialOrder ? initialOrder.id : generateUniqueId('ord'),
      orderNumber: initialOrder
        ? initialOrder.orderNumber
        : `ORD-${Math.floor(100 + Math.random() * 900)}`,
      customerId: customerId || generateUniqueId('cust'),
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim() || undefined,
      serviceOrProduct: serviceOrProduct.trim(),
      description: description.trim() || undefined,
      quantity,
      unitPrice,
      discount,
      finalPrice,
      paidAmount,
      remainingAmount,
      orderStatus,
      paymentStatus: computedPaymentStatus,
      createdDate: initialOrder
        ? initialOrder.createdDate
        : new Date().toISOString().substring(0, 10),
      deadline: deadline || new Date().toISOString().substring(0, 10),
      notes: notes.trim() || undefined
    };

    onSave(order);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialOrder ? 'Buyurtmani tahrirlash' : 'Yangi buyurtma yaratish'}
      subtitle="Hisob-kitob, muddat va to‘lov summasi avtomatik shakllanadi"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        {/* Customer selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Mijozni tanlang *
            </label>
            <select
              value={customerId}
              onChange={(e) => handleCustomerChange(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.phone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Mijoz telefoni
            </label>
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="+998 90..."
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Service / Product selection */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Xizmat yoki tovar nomi *
          </label>
          <input
            type="text"
            value={serviceOrProduct}
            onChange={(e) => setServiceOrProduct(e.target.value)}
            placeholder="Masalan: Veb-sayt dizayni yoki Santexnika ta’miri"
            className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2">
            <span className="text-[11px] text-neutral-400">Tezkor tanlov:</span>
            {services.slice(0, 3).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handlePresetServiceSelect(s.name, s.price)}
                className="px-2 py-0.5 text-[11px] bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md text-neutral-700 dark:text-neutral-300 transition-colors"
              >
                {s.name} ({formatUZS(s.price)})
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Qo‘shimcha tavsif
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Buyurtma shartlari, hajmi yoki talablari..."
            className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Financial calculation numbers */}
        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Soni / Miqdori
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-1.5 text-sm bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Dona narxi (so‘m)
              </label>
              <input
                type="number"
                step="5000"
                value={unitPrice}
                onChange={(e) => setUnitPrice(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-1.5 text-sm bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Chegirma (so‘m)
              </label>
              <input
                type="number"
                step="5000"
                value={discount}
                onChange={(e) => setDiscount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-1.5 text-sm bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 flex items-center justify-between text-xs font-medium">
            <span className="text-neutral-500">Yakuniy summa (Soni × Narx - Chegirma):</span>
            <span className="font-mono tabular-nums text-sm font-bold text-neutral-900 dark:text-white">
              {formatUZS(finalPrice)}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-200 dark:border-neutral-700">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                To‘langan avans / summa
              </label>
              <input
                type="number"
                step="5000"
                value={paidAmount}
                onChange={(e) => setPaidAmount(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-1.5 text-sm bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Qoldiq qarz
              </label>
              <div className="w-full px-3 py-2 text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl font-mono tabular-nums font-semibold text-rose-600 dark:text-rose-400">
                {formatUZS(remainingAmount)}
              </div>
            </div>
          </div>
        </div>

        {/* Status & Deadline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Buyurtma holati
            </label>
            <select
              value={orderStatus}
              onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="yangi">Yangi</option>
              <option value="jarayonda">Jarayonda</option>
              <option value="kutilmoqda">Kutilmoqda</option>
              <option value="tugallangan">Tugallangan</option>
              <option value="bekor_qilingan">Bekor qilingan</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Topshirish muddati (Deadline) *
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Maxsus eslatma
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Qo‘shimcha talablar yoki mijoz iltimosi..."
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
            {initialOrder ? 'Saqlash' : 'Buyurtma yaratish'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
