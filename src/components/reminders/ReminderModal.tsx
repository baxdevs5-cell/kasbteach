import React, { useState, useEffect } from 'react';
import { Reminder, ReminderRepeat } from '../../types';
import { Modal } from '../common/Modal';
import { generateUniqueId } from '../../utils/formatters';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (reminder: Reminder) => void;
  initialReminder?: Reminder | null;
}

export const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialReminder
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [time, setTime] = useState('10:00');
  const [description, setDescription] = useState('');
  const [repeat, setRepeat] = useState<ReminderRepeat>('bir_martalik');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialReminder) {
      setTitle(initialReminder.title);
      setDate(initialReminder.date);
      setTime(initialReminder.time);
      setDescription(initialReminder.description || '');
      setRepeat(initialReminder.repeat);
    } else {
      setTitle('');
      setDate(new Date().toISOString().substring(0, 10));
      setTime('10:00');
      setDescription('');
      setRepeat('bir_martalik');
    }
    setError('');
  }, [initialReminder, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Iltimos, eslatma sarlavhasini kiriting');
      return;
    }

    const reminder: Reminder = {
      id: initialReminder ? initialReminder.id : generateUniqueId('rem'),
      title: title.trim(),
      date,
      time,
      description: description.trim() || undefined,
      repeat,
      isCompleted: initialReminder ? initialReminder.isCompleted : false,
      createdAt: initialReminder ? initialReminder.createdAt : new Date().toISOString()
    };

    onSave(reminder);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialReminder ? 'Eslatmani tahrirlash' : 'Yangi eslatma yaratish'}
      subtitle="Qo‘ng‘iroq, uchrashuv yoki muhim to‘lov vaqti"
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
            Eslatma sarlavhasi *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Mijozga qo‘ng‘iroq qilish va to‘lovni tasdiqlash..."
            className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Sana *
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Vaqt *
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Takrorlanish tartibi
          </label>
          <select
            value={repeat}
            onChange={(e) => setRepeat(e.target.value as ReminderRepeat)}
            className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="bir_martalik">Bir martalik (Takrorlanmaydi)</option>
            <option value="har_kuni">Har kuni</option>
            <option value="har_hafta">Har hafta</option>
            <option value="har_oy">Har oy</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
            Tavsif (ixtiyoriy)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Qo‘shimcha tafsilotlar..."
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
            {initialReminder ? 'Saqlash' : 'Eslatmani saqlash'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
