import React, { useState, useEffect, useCallback } from 'react';
import {
  User,
  Customer,
  Order,
  Transaction,
  Task,
  Reminder,
  CalendarEvent,
  Product,
  Service,
  NotificationItem,
  ActivityItem,
  ProfessionId
} from './types';
import { DataStore } from './utils/storage';
import { ToastProvider, useToast } from './components/common/Toast';
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingModal } from './components/auth/OnboardingModal';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';
import { QuickActionsModal } from './components/dashboard/QuickActionsModal';

// Views
import { DashboardView } from './components/dashboard/DashboardView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { CustomersView } from './components/customers/CustomersView';
import { OrdersView } from './components/orders/OrdersView';
import { FinanceView } from './components/finance/FinanceView';
import { InventoryView } from './components/inventory/InventoryView';
import { ServicesView } from './components/services/ServicesView';
import { TasksView } from './components/tasks/TasksView';
import { CalendarView } from './components/calendar/CalendarView';
import { RemindersView } from './components/reminders/RemindersView';
import { ReportsView } from './components/reports/ReportsView';
import { ProfileView } from './components/profile/ProfileView';
import { SettingsView } from './components/settings/SettingsView';

// Modals for Quick Actions
import { CustomerModal } from './components/customers/CustomerModal';
import { OrderModal } from './components/orders/OrderModal';
import { TransactionModal } from './components/finance/TransactionModal';
import { TaskModal } from './components/tasks/TaskModal';
import { ReminderModal } from './components/reminders/ReminderModal';

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => DataStore.isAuthenticated());
  const [user, setUser] = useState<User>(() => DataStore.getUser());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('smartkasb_theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [targetEntityId, setTargetEntityId] = useState<string | undefined>();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Global Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Quick action direct modals
  const [directModal, setDirectModal] = useState<
    'customer' | 'order' | 'income' | 'expense' | 'task' | 'reminder' | null
  >(null);

  // State data arrays
  const [customers, setCustomers] = useState<Customer[]>(() => DataStore.getCustomers());
  const [orders, setOrders] = useState<Order[]>(() => DataStore.getOrders());
  const [transactions, setTransactions] = useState<Transaction[]>(() => DataStore.getTransactions());
  const [tasks, setTasks] = useState<Task[]>(() => DataStore.getTasks());
  const [reminders, setReminders] = useState<Reminder[]>(() => DataStore.getReminders());
  const [events, setEvents] = useState<CalendarEvent[]>(() => DataStore.getEvents());
  const [products, setProducts] = useState<Product[]>(() => DataStore.getProducts());
  const [services, setServices] = useState<Service[]>(() => DataStore.getServices());
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => DataStore.getNotifications());
  const [activities, setActivities] = useState<ActivityItem[]>(() => DataStore.getActivities());

  const { showToast } = useToast();

  // Apply dark theme class to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('smartkasb_theme', theme);
  }, [theme]);

  // Global keyboard shortcut: Cmd + K or Ctrl + K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Auth & Session Handlers
  const handleAuthSuccess = (loggedUser: User, requiresOnboarding?: boolean) => {
    DataStore.setAuthenticated('session_token_smartkasb');
    DataStore.saveUser(loggedUser);
    setUser(loggedUser);
    setIsAuthenticated(true);

    if (requiresOnboarding) {
      setIsOnboardingOpen(true);
    }
  };

  const handleLaunchDemo = () => {
    DataStore.resetToDemoData();
    setIsAuthenticated(true);
    setUser(DataStore.getUser());
    setCustomers(DataStore.getCustomers());
    setOrders(DataStore.getOrders());
    setTransactions(DataStore.getTransactions());
    setTasks(DataStore.getTasks());
    setReminders(DataStore.getReminders());
    setEvents(DataStore.getEvents());
    setProducts(DataStore.getProducts());
    setServices(DataStore.getServices());
    setNotifications(DataStore.getNotifications());
    setActivities(DataStore.getActivities());
    showToast('Demo tizim barcha namunaviy ma’lumotlar bilan ishga tushirildi', 'success');
  };

  const handleLogout = () => {
    DataStore.setAuthenticated(null);
    setIsAuthenticated(false);
    showToast('Hisobdan muvaffaqiyatli chiqildi', 'info');
  };

  const handleOnboardingComplete = (selectedProfession: ProfessionId) => {
    const updated = DataStore.updateUserProfession(selectedProfession);
    setUser(updated);
    setIsOnboardingOpen(false);
    showToast('Kasbingiz muvaffaqiyatli sozlandi!', 'success');
  };

  // Navigation helper
  const handleNavigate = (tab: string, targetId?: string) => {
    if (tab === 'more_drawer') {
      setIsMobileDrawerOpen(true);
      return;
    }
    setCurrentTab(tab);
    setTargetEntityId(targetId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync state helpers
  const handleSaveCustomer = (c: Customer) => {
    const updated = DataStore.saveCustomer(c);
    setCustomers(updated);
    setActivities(DataStore.getActivities());
  };

  const handleDeleteCustomer = (id: string) => {
    const updated = DataStore.deleteCustomer(id);
    setCustomers(updated);
  };

  const handleSaveOrder = (o: Order) => {
    const updated = DataStore.saveOrder(o);
    setOrders(updated);
    setCustomers(DataStore.getCustomers());
    setActivities(DataStore.getActivities());
  };

  const handleDeleteOrder = (id: string) => {
    const updated = DataStore.deleteOrder(id);
    setOrders(updated);
    setCustomers(DataStore.getCustomers());
  };

  const handleSavePayment = (orderId: string, amount: number, method: string, notes?: string) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    const newPaid = targetOrder.paidAmount + amount;
    const newRemaining = Math.max(0, targetOrder.finalPrice - newPaid);
    const updatedOrder: Order = {
      ...targetOrder,
      paidAmount: newPaid,
      remainingAmount: newRemaining,
      paymentStatus: newRemaining === 0 ? 'toliq_tolangan' : 'qisman_tolangan'
    };
    handleSaveOrder(updatedOrder);

    // Record income transaction
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'daromad',
      amount,
      category: 'Xizmat haqi',
      date: new Date().toISOString().substring(0, 10),
      sourceOrReceiver: `${targetOrder.customerName} (${method})`,
      customerId: targetOrder.customerId,
      customerName: targetOrder.customerName,
      orderId: targetOrder.id,
      description: `${targetOrder.orderNumber} uchun to‘lov: ${notes || method}`,
      createdAt: new Date().toISOString()
    };
    handleSaveTransaction(newTx);
  };

  const handleSaveTransaction = (tx: Transaction) => {
    const updated = DataStore.saveTransaction(tx);
    setTransactions(updated);
    setActivities(DataStore.getActivities());
  };

  const handleDeleteTransaction = (id: string) => {
    const updated = DataStore.deleteTransaction(id);
    setTransactions(updated);
  };

  const handleSaveTask = (t: Task) => {
    const updated = DataStore.saveTask(t);
    setTasks(updated);
    setActivities(DataStore.getActivities());
  };

  const handleDeleteTask = (id: string) => {
    const updated = DataStore.deleteTask(id);
    setTasks(updated);
  };

  const handleSaveReminder = (r: Reminder) => {
    const updated = DataStore.saveReminder(r);
    setReminders(updated);
    setActivities(DataStore.getActivities());
  };

  const handleDeleteReminder = (id: string) => {
    const updated = DataStore.deleteReminder(id);
    setReminders(updated);
  };

  const handleToggleReminder = (id: string) => {
    const target = reminders.find((r) => r.id === id);
    if (!target) return;
    const updated = { ...target, isCompleted: !target.isCompleted };
    handleSaveReminder(updated);
    showToast(updated.isCompleted ? 'Eslatma bajarildi' : 'Eslatma qayta ochildi', 'info');
  };

  const handleSaveEvent = (e: CalendarEvent) => {
    const updated = DataStore.saveEvent(e);
    setEvents(updated);
  };

  const handleDeleteEvent = (id: string) => {
    const updated = DataStore.deleteEvent(id);
    setEvents(updated);
  };

  const handleSaveProduct = (p: Product) => {
    const updated = DataStore.saveProduct(p);
    setProducts(updated);
  };

  const handleDeleteProduct = (id: string) => {
    const updated = DataStore.deleteProduct(id);
    setProducts(updated);
  };

  const handleAdjustStock = (id: string, delta: number) => {
    const updated = DataStore.adjustProductStock(id, delta);
    setProducts(updated);
    showToast('Ombor qoldig‘i yangilandi', 'info');
  };

  const handleSaveService = (s: Service) => {
    const updated = DataStore.saveService(s);
    setServices(updated);
  };

  const handleDeleteService = (id: string) => {
    const updated = DataStore.deleteService(id);
    setServices(updated);
  };

  const handleResetData = () => {
    DataStore.resetToDemoData();
    setUser(DataStore.getUser());
    setCustomers(DataStore.getCustomers());
    setOrders(DataStore.getOrders());
    setTransactions(DataStore.getTransactions());
    setTasks(DataStore.getTasks());
    setReminders(DataStore.getReminders());
    setEvents(DataStore.getEvents());
    setProducts(DataStore.getProducts());
    setServices(DataStore.getServices());
    setNotifications(DataStore.getNotifications());
    setActivities(DataStore.getActivities());
  };

  // Notification handlers
  const handleMarkNotifRead = (id: string) => {
    const updated = DataStore.markNotificationAsRead(id);
    setNotifications(updated);
  };

  const handleMarkAllNotifsRead = () => {
    const updated = DataStore.markAllNotificationsAsRead();
    setNotifications(updated);
    showToast('Barcha xabarlar o‘qilgan deb belgilandi', 'info');
  };

  const handleDeleteNotif = (id: string) => {
    const updated = DataStore.deleteNotification(id);
    setNotifications(updated);
  };

  // If not authenticated, render the public landing page
  if (!isAuthenticated) {
    return (
      <>
        <LandingPage
          onOpenLogin={() => {
            setAuthModalMode('login');
            setIsAuthModalOpen(true);
          }}
          onOpenRegister={() => {
            setAuthModalMode('register');
            setIsAuthModalOpen(true);
          }}
          onLaunchDemo={handleLaunchDemo}
        />

        <AuthModal
          isOpen={isAuthModalOpen}
          initialMode={authModalMode}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={handleAuthSuccess}
        />
      </>
    );
  }

  // Active notification / task counts
  const badgeCounts = {
    orders: orders.filter((o) => o.orderStatus === 'jarayonda' || o.orderStatus === 'yangi').length,
    tasks: tasks.filter((t) => t.status !== 'completed').length,
    reminders: reminders.filter((r) => !r.isCompleted).length
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col antialiased">
      <div className="flex flex-1 min-h-screen">
        {/* Desktop Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={handleNavigate}
          user={user}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          onLogout={handleLogout}
          counts={badgeCounts}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            user={user}
            onOpenSearch={() => setIsSearchOpen(true)}
            onOpenNotifications={() => setIsNotifDrawerOpen(true)}
            onOpenQuickAction={() => setIsQuickActionsOpen(true)}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            notifications={notifications}
            onSelectTab={handleNavigate}
            onLogout={handleLogout}
            onToggleMobileMenu={() => setIsMobileDrawerOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {currentTab === 'dashboard' && (
              <DashboardView
                user={user}
                customers={customers}
                orders={orders}
                transactions={transactions}
                tasks={tasks}
                reminders={reminders}
                events={events}
                products={products}
                activities={activities}
                onNavigate={handleNavigate}
                onOpenQuickAction={(type) => setDirectModal(type)}
                onToggleReminder={handleToggleReminder}
              />
            )}

            {currentTab === 'analytics' && (
              <AnalyticsView
                transactions={transactions}
                orders={orders}
                customers={customers}
              />
            )}

            {currentTab === 'customers' && (
              <CustomersView
                customers={customers}
                orders={orders}
                tasks={tasks}
                onSaveCustomer={handleSaveCustomer}
                onDeleteCustomer={handleDeleteCustomer}
                onOpenOrderModal={(custId) => {
                  setTargetEntityId(custId);
                  setDirectModal('order');
                }}
                targetCustomerId={targetEntityId}
              />
            )}

            {currentTab === 'orders' && (
              <OrdersView
                orders={orders}
                customers={customers}
                services={services}
                products={products}
                user={user}
                onSaveOrder={handleSaveOrder}
                onDeleteOrder={handleDeleteOrder}
                onSavePayment={handleSavePayment}
                targetOrderId={targetEntityId}
              />
            )}

            {currentTab === 'finance' && (
              <FinanceView
                transactions={transactions}
                customers={customers}
                onSaveTransaction={handleSaveTransaction}
                onDeleteTransaction={handleDeleteTransaction}
              />
            )}

            {currentTab === 'inventory' && (
              <InventoryView
                products={products}
                onSaveProduct={handleSaveProduct}
                onDeleteProduct={handleDeleteProduct}
                onAdjustStock={handleAdjustStock}
                targetProductId={targetEntityId}
              />
            )}

            {currentTab === 'services' && (
              <ServicesView
                services={services}
                onSaveService={handleSaveService}
                onDeleteService={handleDeleteService}
                onCreateOrderWithService={(sName, sPrice) => {
                  setDirectModal('order');
                }}
                targetServiceId={targetEntityId}
              />
            )}

            {currentTab === 'tasks' && (
              <TasksView
                tasks={tasks}
                customers={customers}
                orders={orders}
                onSaveTask={handleSaveTask}
                onDeleteTask={handleDeleteTask}
                targetTaskId={targetEntityId}
              />
            )}

            {currentTab === 'calendar' && (
              <CalendarView
                events={events}
                orders={orders}
                tasks={tasks}
                reminders={reminders}
                onSaveEvent={handleSaveEvent}
                onDeleteEvent={handleDeleteEvent}
              />
            )}

            {currentTab === 'reminders' && (
              <RemindersView
                reminders={reminders}
                onSaveReminder={handleSaveReminder}
                onDeleteReminder={handleDeleteReminder}
                onToggleReminder={handleToggleReminder}
                targetReminderId={targetEntityId}
              />
            )}

            {currentTab === 'reports' && (
              <ReportsView
                transactions={transactions}
                orders={orders}
                customers={customers}
                products={products}
                services={services}
              />
            )}

            {currentTab === 'profile' && (
              <ProfileView
                user={user}
                onSaveUser={(u) => {
                  setUser(u);
                  DataStore.saveUser(u);
                }}
              />
            )}

            {currentTab === 'settings' && (
              <SettingsView
                user={user}
                onSaveUser={(u) => {
                  setUser(u);
                  DataStore.saveUser(u);
                }}
                theme={theme}
                onToggleTheme={handleToggleTheme}
                onResetData={handleResetData}
              />
            )}
          </main>
        </div>
      </div>

      {/* Mobile Navigation Drawer & Bottom Bar */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={handleNavigate}
        user={user}
        isDrawerOpen={isMobileDrawerOpen}
        onCloseDrawer={() => setIsMobileDrawerOpen(false)}
        onLogout={handleLogout}
        counts={badgeCounts}
      />

      {/* Global Search Modal (Cmd + K) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotifsRead}
        onMarkRead={handleMarkNotifRead}
        onDelete={handleDeleteNotif}
        onNavigate={handleNavigate}
      />

      {/* Quick Action Selector Modal */}
      <QuickActionsModal
        isOpen={isQuickActionsOpen}
        onClose={() => setIsQuickActionsOpen(false)}
        onAction={(type) => setDirectModal(type)}
      />

      {/* Onboarding Modal for Profession Selection */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        currentProfession={user.profession}
        onComplete={handleOnboardingComplete}
      />

      {/* Quick Action Direct Forms */}
      {directModal === 'customer' && (
        <CustomerModal
          isOpen={true}
          onClose={() => setDirectModal(null)}
          onSave={(c) => {
            handleSaveCustomer(c);
            showToast('Yangi mijoz qo‘shildi', 'success');
          }}
        />
      )}

      {directModal === 'order' && (
        <OrderModal
          isOpen={true}
          onClose={() => {
            setDirectModal(null);
            setTargetEntityId(undefined);
          }}
          onSave={(o) => {
            handleSaveOrder(o);
            showToast('Yangi buyurtma yaratildi', 'success');
          }}
          customers={customers}
          services={services}
          products={products}
          presetCustomerId={targetEntityId}
        />
      )}

      {(directModal === 'income' || directModal === 'expense') && (
        <TransactionModal
          isOpen={true}
          onClose={() => setDirectModal(null)}
          onSave={(t) => {
            handleSaveTransaction(t);
            showToast('Kassa operatsiyasi qayd etildi', 'success');
          }}
          defaultType={directModal === 'income' ? 'daromad' : 'xarajat'}
          customers={customers}
        />
      )}

      {directModal === 'task' && (
        <TaskModal
          isOpen={true}
          onClose={() => setDirectModal(null)}
          onSave={(t) => {
            handleSaveTask(t);
            showToast('Yangi vazifa yaratildi', 'success');
          }}
          customers={customers}
          orders={orders}
        />
      )}

      {directModal === 'reminder' && (
        <ReminderModal
          isOpen={true}
          onClose={() => setDirectModal(null)}
          onSave={(r) => {
            handleSaveReminder(r);
            showToast('Yangi eslatma saqlandi', 'success');
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
