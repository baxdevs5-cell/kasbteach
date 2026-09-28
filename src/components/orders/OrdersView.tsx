import React, { useState, useMemo } from 'react';
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  CreditCard,
  Printer,
  Edit2,
  Trash2,
  Eye,
  Clock,
  ArrowUpDown
} from 'lucide-react';
import { Order, Customer, Service, Product, OrderStatus, PaymentStatus, User } from '../../types';
import { Badge } from '../common/Badge';
import { OrderModal } from './OrderModal';
import { OrderDetailModal } from './OrderDetailModal';
import { PaymentModal } from './PaymentModal';
import { InvoicePrintModal } from './InvoicePrintModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { formatUZS, getRelativeDeadline } from '../../utils/formatters';
import { useToast } from '../common/Toast';

interface OrdersViewProps {
  orders: Order[];
  customers: Customer[];
  services: Service[];
  products: Product[];
  user: User;
  onSaveOrder: (order: Order) => void;
  onDeleteOrder: (id: string) => void;
  onSavePayment: (orderId: string, amount: number, method: string, notes?: string) => void;
  targetOrderId?: string;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  customers,
  services,
  products,
  user,
  onSaveOrder,
  onDeleteOrder,
  onSavePayment,
  targetOrderId
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'barchasi' | OrderStatus>('barchasi');
  const [paymentFilter, setPaymentFilter] = useState<'barchasi' | PaymentStatus>('barchasi');
  const [sortBy, setSortBy] = useState<'recent' | 'deadline' | 'amount' | 'remaining'>('recent');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(targetOrderId || null);
  const [payingOrder, setPayingOrder] = useState<Order | null>(null);
  const [printingOrder, setPrintingOrder] = useState<Order | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);

  const { showToast } = useToast();

  const filteredOrders = useMemo(() => {
    let list = orders.filter((o) => {
      const q = search.toLowerCase();
      const matchSearch =
        o.orderNumber.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.serviceOrProduct.toLowerCase().includes(q);

      const matchStatus = statusFilter === 'barchasi' || o.orderStatus === statusFilter;
      const matchPayment = paymentFilter === 'barchasi' || o.paymentStatus === paymentFilter;

      return matchSearch && matchStatus && matchPayment;
    });

    list.sort((a, b) => {
      if (sortBy === 'deadline') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      if (sortBy === 'amount') {
        return b.finalPrice - a.finalPrice;
      }
      if (sortBy === 'remaining') {
        return b.remainingAmount - a.remainingAmount;
      }
      return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
    });

    return list;
  }, [orders, search, statusFilter, paymentFilter, sortBy]);

  const selectedOrder = useMemo(
    () => orders.find((o) => o.id === selectedOrderId) || null,
    [orders, selectedOrderId]
  );

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const target = orders.find((o) => o.id === orderId);
    if (target) {
      const updated: Order = { ...target, orderStatus: newStatus };
      onSaveOrder(updated);
      showToast(`Buyurtma holati "${newStatus}"ga o‘zgartirildi`, 'info');
    }
  };

  const handleConfirmDelete = () => {
    if (orderToDelete) {
      onDeleteOrder(orderToDelete);
      showToast('Buyurtma o‘chirildi', 'info');
      if (selectedOrderId === orderToDelete) {
        setSelectedOrderId(null);
      }
      setOrderToDelete(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <span>Buyurtmalar</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-mono font-normal">
              {orders.length} ta
            </span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Buyurtmalar ro‘yxati, hisob-kitob va kvitansiyalar
          </p>
        </div>

        <button
          onClick={() => {
            setEditingOrder(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-stretch sm:self-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>+ Yangi buyurtma</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buyurtma raqami, mijoz ismi yoki xizmat..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-xl">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-0 text-xs text-neutral-700 dark:text-neutral-200 focus:outline-none font-medium cursor-pointer"
            >
              <option value="recent">Eng oxirgi sanalar</option>
              <option value="deadline">Topshirish muddati (Deadline)</option>
              <option value="amount">Buyurtma summasi bo‘yicha</option>
              <option value="remaining">Qoldiq qarz bo‘yicha</option>
            </select>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[11px] text-neutral-400 mr-1">Holati:</span>
            {(['barchasi', 'yangi', 'jarayonda', 'kutilmoqda', 'tugallangan', 'bekor_qilingan'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg capitalize transition-colors ${
                  statusFilter === st
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1">
            <span className="text-[11px] text-neutral-400 mr-1">To‘lov:</span>
            {(['barchasi', 'tolanmagan', 'qisman_tolangan', 'toliq_tolangan'] as const).map((pst) => (
              <button
                key={pst}
                onClick={() => setPaymentFilter(pst)}
                className={`px-2 py-0.5 text-[11px] font-semibold rounded-md transition-colors ${
                  paymentFilter === pst
                    ? 'bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {pst === 'barchasi'
                  ? 'Barchasi'
                  : pst === 'tolanmagan'
                  ? 'To‘lanmagan'
                  : pst === 'qisman_tolangan'
                  ? 'Qisman'
                  : 'To‘liq'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center">
            <ShoppingBag className="w-12 h-12 stroke-1 mx-auto text-neutral-300 dark:text-neutral-600 mb-3" />
            <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Bu yerda hali ma’lumot yo‘q.
            </h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1 mb-4">
              Kriteriyalarga mos buyurtma topilmadi yoki hali buyurtma kiritilmagan.
            </p>
            <button
              onClick={() => {
                setEditingOrder(null);
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
                  <th className="py-3 px-4">Buyurtma №</th>
                  <th className="py-3 px-4">Mijoz</th>
                  <th className="py-3 px-4">Xizmat / Tovar</th>
                  <th className="py-3 px-4">Muddati</th>
                  <th className="py-3 px-4 text-right">Summasi</th>
                  <th className="py-3 px-4 text-right">Qoldiq qarz</th>
                  <th className="py-3 px-4">Holati</th>
                  <th className="py-3 px-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
                {filteredOrders.map((ord) => {
                  const deadlineInfo = getRelativeDeadline(ord.deadline);
                  return (
                    <tr
                      key={ord.id}
                      onClick={() => setSelectedOrderId(ord.id)}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors"
                    >
                      <td className="py-3 px-4 font-mono font-bold text-neutral-900 dark:text-white">
                        {ord.orderNumber}
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-neutral-900 dark:text-white">
                          {ord.customerName}
                        </div>
                        {ord.customerPhone && (
                          <div className="text-[11px] text-neutral-400 font-mono">
                            {ord.customerPhone}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="text-neutral-800 dark:text-neutral-200 truncate max-w-xs">
                          {ord.serviceOrProduct}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-neutral-700 dark:text-neutral-300">
                          <Clock className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{ord.deadline}</span>
                        </div>
                        <span
                          className={`text-[10px] ${
                            deadlineInfo.isOverdue
                              ? 'text-rose-600 font-semibold'
                              : deadlineInfo.isToday
                              ? 'text-amber-600 font-semibold'
                              : 'text-neutral-400'
                          }`}
                        >
                          {deadlineInfo.label}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-neutral-900 dark:text-white">
                        {formatUZS(ord.finalPrice)}
                      </td>

                      <td className="py-3 px-4 text-right font-mono tabular-nums">
                        {ord.remainingAmount > 0 ? (
                          <span className="text-rose-600 font-semibold">
                            {formatUZS(ord.remainingAmount)}
                          </span>
                        ) : (
                          <span className="text-emerald-600">To‘liq to‘langan</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-1">
                          <Badge type="order" status={ord.orderStatus} />
                          <Badge type="payment" status={ord.paymentStatus} />
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          {ord.remainingAmount > 0 && (
                            <button
                              onClick={() => setPayingOrder(ord)}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg"
                              title="To‘lov kiritish"
                            >
                              <CreditCard className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setPrintingOrder(ord)}
                            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            title="Kvitansiya chop etish"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingOrder(ord);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            title="Tahrirlash"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setOrderToDelete(ord.id)}
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

      {/* Add / Edit Order Modal */}
      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(o) => {
          onSaveOrder(o);
          showToast(editingOrder ? 'Buyurtma yangilandi' : 'Yangi buyurtma yaratildi', 'success');
        }}
        initialOrder={editingOrder}
        customers={customers}
        services={services}
        products={products}
      />

      {/* Detail Modal */}
      <OrderDetailModal
        isOpen={Boolean(selectedOrderId)}
        onClose={() => setSelectedOrderId(null)}
        order={selectedOrder}
        onEdit={(o) => {
          setEditingOrder(o);
          setSelectedOrderId(null);
          setIsModalOpen(true);
        }}
        onDelete={(id) => setOrderToDelete(id)}
        onOpenPayment={(o) => {
          setSelectedOrderId(null);
          setPayingOrder(o);
        }}
        onOpenInvoice={(o) => {
          setSelectedOrderId(null);
          setPrintingOrder(o);
        }}
        onChangeStatus={handleStatusChange}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={Boolean(payingOrder)}
        onClose={() => setPayingOrder(null)}
        order={payingOrder}
        onSavePayment={(orderId, amount, method, notes) => {
          onSavePayment(orderId, amount, method, notes);
          showToast(`${formatUZS(amount)} to‘lov muvaffaqiyatli qabul qilindi`, 'success');
        }}
      />

      {/* Printable Invoice Modal */}
      <InvoicePrintModal
        isOpen={Boolean(printingOrder)}
        onClose={() => setPrintingOrder(null)}
        order={printingOrder}
        user={user}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(orderToDelete)}
        onClose={() => setOrderToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Buyurtmani o‘chirish"
        message="Haqiqatan ham ushbu buyurtmani o‘chirmoqchimisiz?"
        confirmLabel="Ha, o‘chirish"
        cancelLabel="Bekor qilish"
        isDestructive={true}
      />
    </div>
  );
};
