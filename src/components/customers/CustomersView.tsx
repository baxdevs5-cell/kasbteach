import React, { useState, useMemo } from 'react';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Filter,
  ArrowUpDown,
  ShoppingBag
} from 'lucide-react';
import { Customer, Order, Task, CustomerStatus } from '../../types';
import { Badge } from '../common/Badge';
import { CustomerModal } from './CustomerModal';
import { CustomerDetailDrawer } from './CustomerDetailDrawer';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { formatUZS, formatUzbekDate } from '../../utils/formatters';
import { useToast } from '../common/Toast';

interface CustomersViewProps {
  customers: Customer[];
  orders: Order[];
  tasks: Task[];
  onSaveCustomer: (customer: Customer) => void;
  onDeleteCustomer: (id: string) => void;
  onOpenOrderModal: (customerId?: string) => void;
  targetCustomerId?: string;
}

export const CustomersView: React.FC<CustomersViewProps> = ({
  customers,
  orders,
  tasks,
  onSaveCustomer,
  onDeleteCustomer,
  onOpenOrderModal,
  targetCustomerId
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'barchasi' | CustomerStatus>('barchasi');
  const [sortBy, setSortBy] = useState<'spent' | 'orders' | 'name' | 'recent'>('spent');

  // Modals & Drawers
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(targetCustomerId || null);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

  const { showToast } = useToast();

  // Filter & Sort
  const filteredCustomers = useMemo(() => {
    let list = customers.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch =
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.address && c.address.toLowerCase().includes(q));

      const matchStatus = statusFilter === 'barchasi' || c.status === statusFilter;

      return matchSearch && matchStatus;
    });

    list.sort((a, b) => {
      if (sortBy === 'spent') return b.totalSpent - a.totalSpent;
      if (sortBy === 'orders') return b.totalOrders - a.totalOrders;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return list;
  }, [customers, search, statusFilter, sortBy]);

  const selectedCustomer = useMemo(
    () => customers.find((c) => c.id === selectedCustomerId) || null,
    [customers, selectedCustomerId]
  );

  const handleConfirmDelete = () => {
    if (customerToDelete) {
      onDeleteCustomer(customerToDelete);
      showToast('Mijoz muvaffaqiyatli o‘chirildi', 'info');
      if (selectedCustomerId === customerToDelete) {
        setSelectedCustomerId(null);
      }
      setCustomerToDelete(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <span>Mijozlar bazasi</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-mono font-normal">
              {customers.length} nafar
            </span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Aloqalar, to‘lovlar va buyurtmalar tarixi
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCustomer(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-stretch sm:self-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>+ Yangi mijoz</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Mijoz ismi, telefon raqami yoki manzil..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
            {(['barchasi', 'faol', 'yangi', 'vip', 'noaktiv'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg capitalize transition-colors ${
                  statusFilter === st
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-xl">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent border-0 text-xs text-neutral-700 dark:text-neutral-200 focus:outline-none font-medium cursor-pointer"
            >
              <option value="spent">Xarid summasi bo‘yicha</option>
              <option value="orders">Buyurtmalar soni</option>
              <option value="name">Alifbo bo‘yicha</option>
              <option value="recent">Eng oxirgi qo‘shilganlar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Customers Table / Grid */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="w-12 h-12 stroke-1 mx-auto text-neutral-300 dark:text-neutral-600 mb-3" />
            <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Bu yerda hali ma’lumot yo‘q.
            </h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1 mb-4">
              Qidiruv natijasida mijoz topilmadi yoki hali mijoz qo‘shilmagan.
            </p>
            <button
              onClick={() => {
                setEditingCustomer(null);
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
                  <th className="py-3 px-4">Mijoz F.I.SH</th>
                  <th className="py-3 px-4">Telefon & Email</th>
                  <th className="py-3 px-4">Manzil</th>
                  <th className="py-3 px-4 text-center">Buyurtmalar</th>
                  <th className="py-3 px-4 text-right">Jami to‘lagan</th>
                  <th className="py-3 px-4">Holati</th>
                  <th className="py-3 px-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
                {filteredCustomers.map((cust) => (
                  <tr
                    key={cust.id}
                    onClick={() => setSelectedCustomerId(cust.id)}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-neutral-900 dark:text-white">
                        {cust.name}
                      </div>
                      {cust.notes && (
                        <div className="text-[11px] text-neutral-400 truncate max-w-xs mt-0.5">
                          {cust.notes}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-mono text-neutral-700 dark:text-neutral-300">
                        {cust.phone}
                      </div>
                      {cust.email && (
                        <div className="text-[11px] text-neutral-400 truncate max-w-xs">
                          {cust.email}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400 max-w-xs truncate">
                      {cust.address || '—'}
                    </td>

                    <td className="py-3 px-4 text-center font-mono tabular-nums font-semibold text-neutral-900 dark:text-white">
                      {cust.totalOrders}
                    </td>

                    <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-neutral-900 dark:text-white">
                      {formatUZS(cust.totalSpent)}
                    </td>

                    <td className="py-3 px-4">
                      <Badge type="customer" status={cust.status} />
                    </td>

                    <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedCustomerId(cust.id)}
                          className="p-1.5 text-neutral-400 hover:text-blue-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          title="Profilni ko‘rish"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingCustomer(cust);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                          title="Tahrirlash"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setCustomerToDelete(cust.id)}
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

      {/* Add / Edit Customer Modal */}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(c) => {
          onSaveCustomer(c);
          showToast(editingCustomer ? 'Mijoz ma’lumotlari yangilandi' : 'Yangi mijoz qo‘shildi', 'success');
        }}
        initialCustomer={editingCustomer}
      />

      {/* Customer Detail Drawer */}
      <CustomerDetailDrawer
        isOpen={Boolean(selectedCustomerId)}
        onClose={() => setSelectedCustomerId(null)}
        customer={selectedCustomer}
        orders={orders}
        tasks={tasks}
        onEdit={(c) => {
          setEditingCustomer(c);
          setIsModalOpen(true);
        }}
        onDelete={(id) => setCustomerToDelete(id)}
        onCreateOrder={(id) => onOpenOrderModal(id)}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(customerToDelete)}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Mijozni o‘chirish"
        message="Haqiqatan ham bu mijozni va unga tegishli yozuvlarni o‘chirmoqchimisiz? Bu amalni ortga qaytarib bo‘lmaydi."
        confirmLabel="Ha, o‘chirish"
        cancelLabel="Bekor qilish"
        isDestructive={true}
      />
    </div>
  );
};
