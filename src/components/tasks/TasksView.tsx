import React, { useState, useMemo } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  LayoutGrid,
  List,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Trash2,
  Edit2,
  User,
  ShoppingBag
} from 'lucide-react';
import { Task, Customer, Order, TaskStatus, Priority } from '../../types';
import { Badge } from '../common/Badge';
import { TaskModal } from './TaskModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { getRelativeDeadline } from '../../utils/formatters';
import { useToast } from '../common/Toast';

interface TasksViewProps {
  tasks: Task[];
  customers: Customer[];
  orders: Order[];
  onSaveTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  targetTaskId?: string;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  customers,
  orders,
  onSaveTask,
  onDeleteTask,
  targetTaskId
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'barchasi' | Priority>('barchasi');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const { showToast } = useToast();

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const q = search.toLowerCase();
      const matchSearch =
        t.title.toLowerCase().includes(q) ||
        (t.description && t.description.toLowerCase().includes(q)) ||
        (t.relatedCustomerName && t.relatedCustomerName.toLowerCase().includes(q));

      const matchPriority = priorityFilter === 'barchasi' || t.priority === priorityFilter;

      return matchSearch && matchPriority;
    });
  }, [tasks, search, priorityFilter]);

  const columns: { id: TaskStatus; title: string; count: number; color: string }[] = [
    {
      id: 'todo',
      title: 'Kutilmoqda (Reja)',
      count: filteredTasks.filter((t) => t.status === 'todo').length,
      color: 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-neutral-800/40'
    },
    {
      id: 'in_progress',
      title: 'Jarayonda (Bajarilmoqda)',
      count: filteredTasks.filter((t) => t.status === 'in_progress').length,
      color: 'border-blue-300 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/20'
    },
    {
      id: 'completed',
      title: 'Bajarildi (Tugallandi)',
      count: filteredTasks.filter((t) => t.status === 'completed').length,
      color: 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/40 dark:bg-emerald-950/20'
    }
  ];

  const handleMoveTask = (task: Task, newStatus: TaskStatus) => {
    const updated: Task = { ...task, status: newStatus };
    onSaveTask(updated);
    showToast(`Vazifa holati yangilandi`, 'info');
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      onDeleteTask(taskToDelete);
      showToast('Vazifa o‘chirildi', 'info');
      setTaskToDelete(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <span>Vazifalar & Rejalar</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-mono font-normal">
              {tasks.length} ta
            </span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Kanban doskasi, ustuvorliklar va muddatlar nazorati
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-700'
              }`}
              title="Kanban doskasi"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-400 hover:text-neutral-700'
              }`}
              title="Ro‘yxat ko‘rinishi"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              setEditingTask(null);
              setIsModalOpen(true);
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>+ Yangi vazifa</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Vazifa nomi yoki tavsif bo‘yicha qidiring..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl">
          <span className="text-[11px] text-neutral-400 px-2">Ustuvorlik:</span>
          {(['barchasi', 'shoshilinch', 'yuqori', 'orta', 'past'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg capitalize transition-colors ${
                priorityFilter === p
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {columns.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col.id);
            return (
              <div
                key={col.id}
                className={`p-4 rounded-2xl border ${col.color} min-h-[500px] flex flex-col`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200/60 dark:border-neutral-700/60 mb-3">
                  <h3 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    {col.title}
                  </h3>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                    {colTasks.length}
                  </span>
                </div>

                {/* Tasks Cards */}
                <div className="space-y-3 flex-1">
                  {colTasks.length === 0 ? (
                    <div className="py-12 text-center text-xs text-neutral-400">
                      Vazifalar yo‘q
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const deadlineInfo = getRelativeDeadline(task.deadline);
                      return (
                        <div
                          key={task.id}
                          className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xs hover:border-blue-400 transition-all group"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <Badge type="priority" status={task.priority} />
                            <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => {
                                  setEditingTask(task);
                                  setIsModalOpen(true);
                                }}
                                className="p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                                title="Tahrirlash"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setTaskToDelete(task.id)}
                                className="p-1 text-neutral-400 hover:text-rose-600"
                                title="O‘chirish"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <h4 className="text-xs font-bold text-neutral-900 dark:text-white leading-snug">
                            {task.title}
                          </h4>

                          {task.description && (
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          {/* Related metadata */}
                          {(task.relatedCustomerName || task.relatedOrderId) && (
                            <div className="mt-2.5 flex items-center gap-2 text-[10px] text-neutral-400 border-t border-neutral-100 dark:border-neutral-800 pt-2">
                              {task.relatedCustomerName && (
                                <span className="flex items-center gap-1 truncate">
                                  <User className="w-3 h-3 shrink-0" />
                                  {task.relatedCustomerName}
                                </span>
                              )}
                              {task.relatedOrderId && (
                                <span className="flex items-center gap-1 font-mono">
                                  <ShoppingBag className="w-3 h-3 shrink-0" />
                                  {task.relatedOrderId}
                                </span>
                              )}
                            </div>
                          )}

                          {/* Footer with deadline & shift buttons */}
                          <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-neutral-400" />
                              <span
                                className={
                                  deadlineInfo.isOverdue
                                    ? 'text-rose-600 font-semibold'
                                    : 'text-neutral-500'
                                }
                              >
                                {task.deadline}
                              </span>
                            </div>

                            {/* Move controls */}
                            <div className="flex items-center gap-1">
                              {col.id === 'in_progress' && (
                                <button
                                  onClick={() => handleMoveTask(task, 'todo')}
                                  title="Kutilmoqdaga qaytarish"
                                  className="p-1 text-neutral-400 hover:text-neutral-700 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                >
                                  <ArrowLeft className="w-3 h-3" />
                                </button>
                              )}
                              {col.id === 'todo' && (
                                <button
                                  onClick={() => handleMoveTask(task, 'in_progress')}
                                  className="px-2 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 rounded hover:bg-blue-100"
                                >
                                  Boshlash &rarr;
                                </button>
                              )}
                              {col.id === 'in_progress' && (
                                <button
                                  onClick={() => handleMoveTask(task, 'completed')}
                                  className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 rounded hover:bg-emerald-100 flex items-center gap-1"
                                >
                                  <CheckCircle2 className="w-3 h-3" />
                                  Tugallash
                                </button>
                              )}
                              {col.id === 'completed' && (
                                <button
                                  onClick={() => handleMoveTask(task, 'in_progress')}
                                  className="text-[10px] text-neutral-400 hover:text-neutral-700 underline"
                                >
                                  Qayta ochish
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs divide-y divide-neutral-100 dark:divide-neutral-800">
          {filteredTasks.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400">
              Vazifalar topilmadi
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Badge type="task" status={task.status} />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                      {task.title}
                    </h4>
                    {task.description && (
                      <p className="text-[11px] text-neutral-400 truncate mt-0.5">
                        {task.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <Badge type="priority" status={task.priority} />
                  <span className="text-xs font-mono text-neutral-400">{task.deadline}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingTask(task);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 text-neutral-400 hover:text-neutral-700"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setTaskToDelete(task.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(t) => {
          onSaveTask(t);
          showToast(editingTask ? 'Vazifa yangilandi' : 'Yangi vazifa yaratildi', 'success');
        }}
        initialTask={editingTask}
        customers={customers}
        orders={orders}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(taskToDelete)}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Vazifani o‘chirish"
        message="Haqiqatan ham ushbu vazifani o‘chirmoqchimisiz?"
        confirmLabel="Ha, o‘chirish"
        cancelLabel="Bekor qilish"
        isDestructive={true}
      />
    </div>
  );
};
