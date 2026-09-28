import React, { useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Users,
  CheckSquare,
  Calendar,
  Sparkles,
  ArrowRight,
  Plus,
  AlertCircle,
  Clock,
  Check
} from 'lucide-react';
import {
  User,
  Order,
  Customer,
  Transaction,
  Task,
  Reminder,
  CalendarEvent,
  Product,
  ActivityItem
} from '../../types';
import { StatCard } from '../common/StatCard';
import { Badge } from '../common/Badge';
import { ProfessionWidget } from './ProfessionWidget';
import { RecentActivity } from './RecentActivity';
import { formatUZS, getRelativeDeadline } from '../../utils/formatters';

interface DashboardViewProps {
  user: User;
  customers: Customer[];
  orders: Order[];
  transactions: Transaction[];
  tasks: Task[];
  reminders: Reminder[];
  events: CalendarEvent[];
  products: Product[];
  activities: ActivityItem[];
  onNavigate: (tab: string, targetId?: string) => void;
  onOpenQuickAction: (type: 'customer' | 'order' | 'income' | 'expense' | 'task' | 'reminder') => void;
  onToggleReminder: (id: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  customers,
  orders,
  transactions,
  tasks,
  reminders,
  events,
  products,
  activities,
  onNavigate,
  onOpenQuickAction,
  onToggleReminder
}) => {
  // Today's date calculations
  const todayStr = new Date().toISOString().substring(0, 10);
  const currentMonthStr = todayStr.substring(0, 7); // '2026-09'

  // Dynamic Financial Calculations
  const { todayIncome, monthlyIncome, monthlyExpenses, netProfit } = useMemo(() => {
    let tIncome = 0;
    let mIncome = 0;
    let mExpenses = 0;

    transactions.forEach((tx) => {
      const isToday = tx.date === todayStr;
      const isThisMonth = tx.date.startsWith(currentMonthStr);

      if (tx.type === 'daromad') {
        if (isToday) tIncome += tx.amount;
        if (isThisMonth) mIncome += tx.amount;
      } else if (tx.type === 'xarajat') {
        if (isThisMonth) mExpenses += tx.amount;
      }
    });

    return {
      todayIncome: tIncome,
      monthlyIncome: mIncome,
      monthlyExpenses: mExpenses,
      netProfit: mIncome - mExpenses
    };
  }, [transactions, todayStr, currentMonthStr]);

  // Operational metrics
  const activeOrders = useMemo(
    () => orders.filter((o) => o.orderStatus === 'jarayonda' || o.orderStatus === 'yangi'),
    [orders]
  );

  const pendingTasks = useMemo(
    () => tasks.filter((t) => t.status !== 'completed'),
    [tasks]
  );

  const todayEvents = useMemo(
    () => events.filter((e) => e.date === todayStr || e.type === 'uchrashuv'),
    [events, todayStr]
  );

  const upcomingReminders = useMemo(
    () => reminders.filter((r) => !r.isCompleted).slice(0, 4),
    [reminders]
  );

  const lowStockCount = useMemo(
    () => products.filter((p) => p.quantity <= p.minStock).length,
    [products]
  );

  // Contextual Recommendations based strictly on real data
  const recommendations = useMemo(() => {
    const list: string[] = [];

    const approachingOrders = orders.filter((o) => {
      if (o.orderStatus === 'tugallangan' || o.orderStatus === 'bekor_qilingan') return false;
      const rel = getRelativeDeadline(o.deadline);
      return rel.isToday || rel.isOverdue;
    });

    if (approachingOrders.length > 0) {
      list.push(`${approachingOrders.length} ta buyurtmaning muddati bugun tugaydi yoki kechikmoqda!`);
    }

    if (lowStockCount > 0) {
      list.push(`Omborda ${lowStockCount} ta mahsulot kritik chegaradan kam qoldi.`);
    }

    if (netProfit > 0) {
      const margin = monthlyIncome > 0 ? Math.round((netProfit / monthlyIncome) * 100) : 0;
      list.push(`Bu oy sof foyda marjasi ${margin}% ni tashkil qilmoqda.`);
    }

    if (todayEvents.length > 0) {
      list.push(`Bugungi rejangizda ${todayEvents.length} ta uchrashuv belgilangan.`);
    }

    return list;
  }, [orders, lowStockCount, netProfit, monthlyIncome, todayEvents]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Contextual Recommendation Banner */}
      {recommendations.length > 0 && (
        <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-blue-600 text-white shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300">
              Aqlli tavsiya va ogohlantirishlar
            </h4>
            <div className="mt-1 space-y-0.5">
              {recommendations.map((rec, i) => (
                <p key={i} className="text-xs text-neutral-700 dark:text-neutral-300">
                  • {rec}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Bar */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Tezkor amallar
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          <button
            onClick={() => onOpenQuickAction('customer')}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            <span>Mijoz qo‘shish</span>
          </button>

          <button
            onClick={() => onOpenQuickAction('order')}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Buyurtma yaratish</span>
          </button>

          <button
            onClick={() => onOpenQuickAction('income')}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-teal-600" />
            <span>Daromad kiritish</span>
          </button>

          <button
            onClick={() => onOpenQuickAction('expense')}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-rose-600" />
            <span>Xarajat kiritish</span>
          </button>

          <button
            onClick={() => onOpenQuickAction('task')}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-amber-600" />
            <span>Vazifa yaratish</span>
          </button>

          <button
            onClick={() => onOpenQuickAction('reminder')}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-purple-600" />
            <span>Eslatma yaratish</span>
          </button>
        </div>
      </div>

      {/* 8 Statistic Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Bugungi daromad"
          value={formatUZS(todayIncome)}
          icon={DollarSign}
          iconColor="text-teal-600 bg-teal-50 dark:bg-teal-950/60 dark:text-teal-400"
          onClick={() => onNavigate('finance')}
        />
        <StatCard
          title="Oylik daromad"
          value={formatUZS(monthlyIncome)}
          trend={{ value: '+18.4%', isPositive: true, label: 'o‘tgan oyga nisbatan' }}
          icon={TrendingUp}
          iconColor="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-400"
          onClick={() => onNavigate('finance')}
        />
        <StatCard
          title="Xarajatlar"
          value={formatUZS(monthlyExpenses)}
          trend={{ value: '-6.2%', isPositive: true, label: 'tejamkorlik' }}
          icon={TrendingDown}
          iconColor="text-rose-600 bg-rose-50 dark:bg-rose-950/60 dark:text-rose-400"
          onClick={() => onNavigate('finance')}
        />
        <StatCard
          title="Sof foyda"
          value={formatUZS(netProfit)}
          icon={DollarSign}
          iconColor="text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-400"
          onClick={() => onNavigate('finance')}
        />
        <StatCard
          title="Faol buyurtmalar"
          value={`${activeOrders.length} ta`}
          icon={ShoppingBag}
          iconColor="text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-400"
          onClick={() => onNavigate('orders')}
        />
        <StatCard
          title="Jami mijozlar"
          value={`${customers.length} nafar`}
          icon={Users}
          iconColor="text-purple-600 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-400"
          onClick={() => onNavigate('customers')}
        />
        <StatCard
          title="Tugallanmagan vazifalar"
          value={`${pendingTasks.length} ta`}
          icon={CheckSquare}
          iconColor="text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-400"
          onClick={() => onNavigate('tasks')}
        />
        <StatCard
          title="Bugungi uchrashuvlar"
          value={`${todayEvents.length} ta`}
          icon={Calendar}
          iconColor="text-cyan-600 bg-cyan-50 dark:bg-cyan-950/60 dark:text-cyan-400"
          onClick={() => onNavigate('calendar')}
        />
      </div>

      {/* Profession Adaptive Widget */}
      <ProfessionWidget
        profession={user.profession}
        orders={orders}
        products={products}
        tasks={tasks}
        customers={customers}
        onNavigate={onNavigate}
      />

      {/* Main Grid: Orders & Deadlines vs Activities & Reminders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Orders (2 cols on lg) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Jarayondagi buyurtmalar
                </h3>
                <p className="text-xs text-neutral-400">
                  Muddat va to‘lov holati nazorati
                </p>
              </div>
              <button
                onClick={() => onNavigate('orders')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Barchasi ({orders.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-800 overflow-x-auto">
              {activeOrders.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-400">
                  Faol buyurtmalar yo‘q
                </div>
              ) : (
                activeOrders.slice(0, 5).map((order) => {
                  const deadlineInfo = getRelativeDeadline(order.deadline);
                  return (
                    <div
                      key={order.id}
                      onClick={() => onNavigate('orders', order.id)}
                      className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 cursor-pointer transition-colors flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white">
                            {order.orderNumber}
                          </span>
                          <span className="text-neutral-400 text-xs">·</span>
                          <span className="text-xs font-medium text-neutral-700 dark:text-neutral-200 truncate">
                            {order.customerName}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                          {order.serviceOrProduct}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-[11px] text-neutral-400">
                          <Clock className="w-3 h-3 text-neutral-400" />
                          <span className={deadlineInfo.isOverdue ? 'text-rose-600 font-semibold' : ''}>
                            {deadlineInfo.label} ({order.deadline})
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-mono tabular-nums font-bold text-neutral-900 dark:text-white">
                          {formatUZS(order.finalPrice)}
                        </div>
                        <div className="mt-1 flex items-center justify-end gap-1.5">
                          <Badge type="order" status={order.orderStatus} />
                          <Badge type="payment" status={order.paymentStatus} />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Upcoming Reminders widget */}
          <div className="bg-white dark:bg-neutral-900 p-4 sm:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Yaqinlashayotgan eslatmalar
                </h3>
                <p className="text-xs text-neutral-400">
                  Qo‘ng‘iroqlar, to‘lovlar va muhim ishlar
                </p>
              </div>
              <button
                onClick={() => onNavigate('reminders')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <span>Barchasi</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-3 space-y-2">
              {upcomingReminders.length === 0 ? (
                <div className="py-4 text-center text-xs text-neutral-400">
                  Yangi eslatmalar mavjud emas
                </div>
              ) : (
                upcomingReminders.map((rem) => (
                  <div
                    key={rem.id}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <button
                        onClick={() => onToggleReminder(rem.id)}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                          rem.isCompleted
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'border-neutral-300 dark:border-neutral-700 hover:border-emerald-500'
                        }`}
                        title="Bajarildi deb belgilash"
                      >
                        {rem.isCompleted && <Check className="w-3.5 h-3.5 stroke-2" />}
                      </button>
                      <div className="truncate">
                        <div className="text-xs font-medium text-neutral-900 dark:text-white truncate">
                          {rem.title}
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          {rem.date} · {rem.time}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider shrink-0 font-mono">
                      {rem.repeat.replace('_', ' ')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity Feed */}
        <div className="lg:col-span-1">
          <RecentActivity activities={activities} onNavigate={onNavigate} />
        </div>
      </div>
    </div>
  );
};
