import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  User,
  ShoppingBag,
  CheckSquare,
  Bell,
  Trash2,
  X
} from 'lucide-react';
import { CalendarEvent, Order, Task, Reminder } from '../../types';
import { Modal } from '../common/Modal';
import { generateUniqueId, formatUzbekDate } from '../../utils/formatters';
import { useToast } from '../common/Toast';

interface CalendarViewProps {
  events: CalendarEvent[];
  orders: Order[];
  tasks: Task[];
  reminders: Reminder[];
  onSaveEvent: (event: CalendarEvent) => void;
  onDeleteEvent: (id: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  orders,
  tasks,
  reminders,
  onSaveEvent,
  onDeleteEvent
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );

  // New Event Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(selectedDate);
  const [eventTime, setEventTime] = useState('11:00');
  const [eventType, setEventType] = useState<'uchrashuv' | 'deadline' | 'vazifa' | 'eslatma'>('uchrashuv');
  const [eventNotes, setEventNotes] = useState('');

  const { showToast } = useToast();

  // Combine calendar events + order deadlines + task deadlines + reminders
  const allScheduledItems = useMemo(() => {
    const list: {
      id: string;
      title: string;
      date: string;
      time?: string;
      type: 'uchrashuv' | 'deadline' | 'vazifa' | 'eslatma';
      isCustom?: boolean;
    }[] = [];

    events.forEach((ev) => {
      list.push({ ...ev, isCustom: true });
    });

    orders.forEach((o) => {
      list.push({
        id: `ord-ev-${o.id}`,
        title: `Buyurtma deadline: ${o.orderNumber} (${o.customerName})`,
        date: o.deadline,
        time: '18:00',
        type: 'deadline',
        isCustom: false
      });
    });

    tasks.forEach((t) => {
      list.push({
        id: `task-ev-${t.id}`,
        title: `Vazifa: ${t.title}`,
        date: t.deadline,
        type: 'vazifa',
        isCustom: false
      });
    });

    reminders.forEach((r) => {
      list.push({
        id: `rem-ev-${r.id}`,
        title: `Eslatma: ${r.title}`,
        date: r.date,
        time: r.time,
        type: 'eslatma',
        isCustom: false
      });
    });

    return list;
  }, [events, orders, tasks, reminders]);

  // Calendar month matrix
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday = 0

  const monthNames = [
    'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
    'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now.toISOString().substring(0, 10));
  };

  const handleSaveCustomEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    const newEv: CalendarEvent = {
      id: generateUniqueId('ev'),
      title: eventTitle.trim(),
      date: eventDate,
      time: eventTime,
      type: eventType,
      notes: eventNotes.trim() || undefined
    };

    onSaveEvent(newEv);
    showToast('Reja taqvimga muvaffaqiyatli qo‘shildi', 'success');
    setIsModalOpen(false);
    setEventTitle('');
    setEventNotes('');
  };

  // Items on selected date
  const selectedDateItems = allScheduledItems.filter((i) => i.date === selectedDate);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <span>Interaktiv Taqvim</span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Buyurtma muddatlari, uchrashuvlar, vazifalar va eslatmalar jadvali
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={() => {
              setEventDate(selectedDate);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Reja qo‘shish</span>
          </button>
        </div>
      </div>

      {/* Calendar Controls & Navigation */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">
            {monthNames[month]} {year}
          </h3>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Oldingi oy"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 text-neutral-500 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Keyingi oy"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleToday}
            className="px-2.5 py-1 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
          >
            Bugun
          </button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span>Uchrashuv</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span>Buyurtma deadline</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Vazifa</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            <span>Eslatma</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Month Calendar + Selected Day Agenda */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Month Calendar Matrix (2 cols on lg) */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs p-4 sm:p-5">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 text-center text-xs font-semibold text-neutral-400 pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <span>Dush</span>
            <span>Sesh</span>
            <span>Chor</span>
            <span>Pay</span>
            <span>Juma</span>
            <span className="text-blue-500">Shan</span>
            <span className="text-rose-500">Yak</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-3">
            {/* Empty offset padding */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-16 sm:h-20 rounded-xl bg-neutral-50/40 dark:bg-neutral-800/20 opacity-40" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const isSelected = selectedDate === dateStr;
              const isToday = dateStr === new Date().toISOString().substring(0, 10);
              const dayItems = allScheduledItems.filter((item) => item.date === dateStr);

              return (
                <div
                  key={dayNum}
                  onClick={() => setSelectedDate(dateStr)}
                  className={`h-16 sm:h-20 p-1.5 sm:p-2 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/40 ring-2 ring-blue-500/20'
                      : isToday
                      ? 'border-neutral-400 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800/50'
                      : 'border-neutral-100 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-white dark:bg-neutral-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-semibold ${
                        isToday
                          ? 'w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px]'
                          : 'text-neutral-800 dark:text-neutral-200'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {dayItems.length > 0 && (
                      <span className="text-[10px] font-mono text-neutral-400 hidden sm:inline">
                        {dayItems.length}
                      </span>
                    )}
                  </div>

                  {/* Indicator dots / mini bars */}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {dayItems.slice(0, 3).map((item, idx) => (
                      <span
                        key={idx}
                        className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${
                          item.type === 'uchrashuv'
                            ? 'bg-blue-500'
                            : item.type === 'deadline'
                            ? 'bg-rose-500'
                            : item.type === 'vazifa'
                            ? 'bg-amber-500'
                            : 'bg-purple-500'
                        }`}
                        title={item.title}
                      />
                    ))}
                    {dayItems.length > 3 && (
                      <span className="text-[9px] text-neutral-400 font-mono">
                        +{dayItems.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda Drawer (1 col on lg) */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs p-5 flex flex-col">
          <div className="pb-3 border-b border-neutral-100 dark:border-neutral-800">
            <span className="text-xs text-neutral-400">Kunlik reja:</span>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white mt-0.5">
              {formatUzbekDate(selectedDate)}
            </h3>
          </div>

          <div className="mt-4 space-y-2.5 flex-1 overflow-y-auto">
            {selectedDateItems.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-400">
                Ushbu kunga hech qanday reja yoki deadline belgilanmagan.
              </div>
            ) : (
              selectedDateItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40 text-xs"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        item.type === 'uchrashuv'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                          : item.type === 'deadline'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200'
                          : item.type === 'vazifa'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                          : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      }`}
                    >
                      {item.type}
                    </span>

                    {item.time && (
                      <span className="text-neutral-400 font-mono text-[11px] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </span>
                    )}

                    {item.isCustom && (
                      <button
                        onClick={() => onDeleteEvent(item.id)}
                        className="p-1 text-neutral-400 hover:text-rose-600 rounded ml-auto"
                        title="O‘chirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="font-semibold text-neutral-900 dark:text-white leading-snug">
                    {item.title}
                  </div>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => {
              setEventDate(selectedDate);
              setIsModalOpen(true);
            }}
            className="mt-4 w-full py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-colors"
          >
            + Ushbu kunga reja yozish
          </button>
        </div>
      </div>

      {/* Add Custom Calendar Event Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Taqvimga reja qo‘shish"
        subtitle="Uchrashuv yoki muhim tadbir"
        maxWidth="md"
      >
        <form onSubmit={handleSaveCustomEvent} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Reja sarlavhasi *
            </label>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Jasur Aliyev bilan taqdimot..."
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Sana *
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Vaqti
              </label>
              <input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Turi
            </label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value as any)}
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="uchrashuv">Uchrashuv</option>
              <option value="deadline">Topshirish muddati (Deadline)</option>
              <option value="vazifa">Vazifa</option>
              <option value="eslatma">Eslatma</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Qo‘shimcha izoh
            </label>
            <textarea
              value={eventNotes}
              onChange={(e) => setEventNotes(e.target.value)}
              rows={2}
              placeholder="Joylashuv, havola yoki eslatma..."
              className="w-full px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs"
            >
              Taqvimga saqlash
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
