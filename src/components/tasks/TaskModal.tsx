import React, { useState, useEffect } from 'react';
import { Task, Priority, TaskStatus, Customer, Order } from '../../types';
import { Modal } from '../common/Modal';
import { generateUniqueId } from '../../utils/formatters';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  initialTask?: Task | null;
  customers: Customer[];
  orders: Order[];
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
  customers,
  orders
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('orta');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [deadline, setDeadline] = useState('');
  const [relatedCustomerId, setRelatedCustomerId] = useState('');
  const [relatedOrderId, setRelatedOrderId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setPriority(initialTask.priority);
      setStatus(initialTask.status);
      setDeadline(initialTask.deadline);
      setRelatedCustomerId(initialTask.relatedCustomerId || '');
      setRelatedOrderId(initialTask.relatedOrderId || '');
    } else {
      setTitle('');
      setDescription('');
      setPriority('orta');
      setStatus('todo');
      // Default deadline tomorrow
      const d = new Date();
      d.setDate(d.getDate() + 1);
      setDeadline(d.toISOString().substring(0, 10));
      setRelatedCustomerId('');
      setRelatedOrderId('');
    }
    setError('');
  }, [initialTask, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Iltimos, vazifa sarlavhasini kiriting');
      return;
    }

    const matchedCust = customers.find((c) => c.id === relatedCustomerId);

    const task: Task = {
      id: initialTask ? initialTask.id : generateUniqueId('task'),
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      status,
      deadline: deadline || new Date().toISOString().substring(0, 10),
      relatedCustomerId: relatedCustomerId || undefined,
      relatedCustomerName: matchedCust ? matchedCust.name : undefined,
      relatedOrderId: relatedOrderId || undefined,
      createdAt: initialTask ? initialTask.createdAt : new Date().toISOString().substring(0, 10)
    };

    onSave(task);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialTask ? 'Vazifani tahrirlash' : 'Yangi vazifa yaratish'}
      subtitle="Ustuvorlik darajasi va muddatini belgilang"
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
            Vazifa sarlavhasi *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sayt mobil dizaynini tekshirish..."
            className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Batafsil tavsif
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Qilinishi kerak bo‘lgan ishlar tafsiloti..."
            className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Ustuvorlik (Prioritet)
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="past">Past</option>
              <option value="orta">O‘rta</option>
              <option value="yuqori">Yuqori</option>
              <option value="shoshilinch">Shoshilinch</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Holati
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todo">Kutilmoqda (Todo)</option>
              <option value="in_progress">Jarayonda (In Progress)</option>
              <option value="completed">Bajarildi (Completed)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Topshirish muddati *
          </label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Bog‘langan mijoz (ixtiyoriy)
            </label>
            <select
              value={relatedCustomerId}
              onChange={(e) => setRelatedCustomerId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Bog‘lanmagan</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Bog‘langan buyurtma (ixtiyoriy)
            </label>
            <select
              value={relatedOrderId}
              onChange={(e) => setRelatedOrderId(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Bog‘lanmagan</option>
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.orderNumber}: {o.customerName}
                </option>
              ))}
            </select>
          </div>
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
            {initialTask ? 'Saqlash' : 'Vazifani yaratish'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
