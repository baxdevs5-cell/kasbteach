import React, { useState, useMemo } from 'react';
import {
  Bell,
  Plus,
  Check,
  Calendar,
  Clock,
  Trash2,
  Edit2,
  Repeat
} from 'lucide-react';
import { Reminder } from '../../types';
import { ReminderModal } from './ReminderModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { formatUzbekDate } from '../../utils/formatters';
import { useToast } from '../common/Toast';

interface RemindersViewProps {
  reminders: Reminder[];
  onSaveReminder: (reminder: Reminder) => void;
  onDeleteReminder: (id: string) => void;
  onToggleReminder: (id: string) => void;
  targetReminderId?: string;
}

export const RemindersView: React.FC<RemindersViewProps> = ({
  reminders,
  onSaveReminder,
  onDeleteReminder,
  onToggleReminder,
  targetReminderId
}) => {
  const [tab, setTab] = useState<'upcoming' | 'completed' | 'all'>('upcoming');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [reminderToDelete, setReminderToDelete] = useState<string | null>(null);

  const { showToast } = useToast();

  const filteredReminders = useMemo(() => {
    let list = reminders.filter((r) => {
      if (tab === 'upcoming') return !r.isCompleted;
      if (tab === 'completed') return r.isCompleted;
      return true;
    });

    list.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
    return list;
  }, [reminders, tab]);

  const handleConfirmDelete = () => {
    if (reminderToDelete) {
      onDeleteReminder(reminderToDelete);
      showToast('Eslatma o‘chirildi', 'info');
      setReminderToDelete(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <span>Eslatmalar</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-mono font-normal">
              {reminders.filter((r) => !r.isCompleted).length} ta faol
            </span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Muhim muddatlar, qo‘ng‘iroqlar va takroriy vazifalar
          </p>
        </div>

        <button
          onClick={() => {
            setEditingReminder(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-stretch sm:self-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>+ Yangi eslatma</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-fit">
        <button
          onClick={() => setTab('upcoming')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
            tab === 'upcoming'
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
              : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          Kutilayotganlar ({reminders.filter((r) => !r.isCompleted).length})
        </button>
        <button
          onClick={() => setTab('completed')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
            tab === 'completed'
              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
              : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          Bajarilganlar ({reminders.filter((r) => r.isCompleted).length})
        </button>
        <button
          onClick={() => setTab('all')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
            tab === 'all'
              ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
              : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          Barchasi ({reminders.length})
        </button>
      </div>

      {/* Reminders List */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs divide-y divide-neutral-100 dark:divide-neutral-800 overflow-hidden">
        {filteredReminders.length === 0 ? (
          <div className="py-16 text-center">
            <Bell className="w-12 h-12 stroke-1 mx-auto text-neutral-300 dark:text-neutral-600 mb-3" />
            <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Bu yerda hali ma’lumot yo‘q.
            </h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1 mb-4">
              Yangi eslatma qo‘shib o‘z vaqtingizni unumli rejalashtiring.
            </p>
            <button
              onClick={() => {
                setEditingReminder(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Yangi qo‘shish</span>
            </button>
          </div>
        ) : (
          filteredReminders.map((rem) => (
            <div
              key={rem.id}
              className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                rem.isCompleted ? 'bg-neutral-50/50 dark:bg-neutral-900/40 opacity-70' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <button
                  onClick={() => onToggleReminder(rem.id)}
                  className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                    rem.isCompleted
                      ? 'bg-emerald-600 border-emerald-600 text-white'
                      : 'border-neutral-300 dark:border-neutral-700 hover:border-emerald-500'
                  }`}
                  title={rem.isCompleted ? 'Qayta ochish' : 'Bajarildi deb belgilash'}
                >
                  {rem.isCompleted && <Check className="w-4 h-4 stroke-2" />}
                </button>

                <div className="min-w-0">
                  <h4
                    className={`text-xs font-bold truncate ${
                      rem.isCompleted
                        ? 'line-through text-neutral-400 dark:text-neutral-500'
                        : 'text-neutral-900 dark:text-white'
                    }`}
                  >
                    {rem.title}
                  </h4>
                  {rem.description && (
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                      {rem.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatUzbekDate(rem.date)}
                    </span>
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3" />
                      {rem.time}
                    </span>
                    <span className="flex items-center gap-1 font-mono uppercase tracking-wider text-[10px] text-neutral-400">
                      <Repeat className="w-3 h-3" />
                      {rem.repeat.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => {
                    setEditingReminder(rem);
                    setIsModalOpen(true);
                  }}
                  className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  title="Tahrirlash"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setReminderToDelete(rem.id)}
                  className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  title="O‘chirish"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reminder Modal */}
      <ReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(r) => {
          onSaveReminder(r);
          showToast(editingReminder ? 'Eslatma yangilandi' : 'Yangi eslatma saqlandi', 'success');
        }}
        initialReminder={editingReminder}
      />

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={Boolean(reminderToDelete)}
        onClose={() => setReminderToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Eslatmani o‘chirish"
        message="Haqiqatan ham ushbu eslatmani o‘chirmoqchimisiz?"
        confirmLabel="Ha, o‘chirish"
        cancelLabel="Bekor qilish"
        isDestructive={true}
      />
    </div>
  );
};
