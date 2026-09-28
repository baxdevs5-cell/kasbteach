export type ProfessionId =
  | 'oshpaz'
  | 'usta'
  | 'dasturchi'
  | 'sotuvchi'
  | 'oqituvchi'
  | 'fotograf'
  | 'avtoservis'
  | 'quruvchi'
  | 'buxgalter'
  | 'dizayner'
  | 'sartarosh'
  | 'smm'
  | 'yetkazib_beruvchi'
  | 'boshqa';

export interface ProfessionMeta {
  id: ProfessionId;
  label: string;
  emoji: string;
  description: string;
  highlightedModules: string[];
  featuresList: string[];
}

export type OrderStatus =
  | 'yangi'
  | 'jarayonda'
  | 'kutilmoqda'
  | 'tugallangan'
  | 'bekor_qilingan';

export type PaymentStatus =
  | 'tolanmagan'
  | 'qisman_tolangan'
  | 'toliq_tolangan';

export type CustomerStatus = 'faol' | 'yangi' | 'vip' | 'noaktiv';

export type Priority = 'past' | 'orta' | 'yuqori' | 'shoshilinch';

export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export type ReminderRepeat = 'bir_martalik' | 'har_kuni' | 'har_hafta' | 'har_oy';

export type ExpenseCategory =
  | 'Material'
  | 'Transport'
  | 'Salary'
  | 'Rent'
  | 'Advertising'
  | 'Equipment'
  | 'Utilities'
  | 'Other';

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  profession: ProfessionId;
  businessName: string;
  address?: string;
  avatarUrl?: string;
  theme: 'light' | 'dark';
  language: 'uz' | 'ru' | 'en';
  currency: string;
  createdAt: string;
  isOnboarded: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  status: CustomerStatus;
  notes?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  serviceOrProduct: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  finalPrice: number;
  paidAmount: number;
  remainingAmount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  createdDate: string;
  deadline: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  type: 'daromad' | 'xarajat';
  amount: number;
  category: string;
  date: string;
  sourceOrReceiver?: string;
  customerId?: string;
  customerName?: string;
  orderId?: string;
  description?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: Priority;
  deadline: string;
  status: TaskStatus;
  relatedCustomerId?: string;
  relatedCustomerName?: string;
  relatedOrderId?: string;
  createdAt: string;
}

export interface Reminder {
  id: string;
  title: string;
  date: string;
  time: string;
  description?: string;
  repeat: ReminderRepeat;
  isCompleted: boolean;
  createdAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  type: 'uchrashuv' | 'deadline' | 'vazifa' | 'eslatma';
  relatedId?: string;
  notes?: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice: number;
  minStock: number;
  supplier?: string;
  sku: string;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: string;
  category: string;
  isActive: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'order' | 'customer' | 'finance' | 'inventory' | 'task' | 'system';
  isRead: boolean;
  linkTab?: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'customer' | 'order' | 'payment' | 'expense' | 'task' | 'reminder';
}
