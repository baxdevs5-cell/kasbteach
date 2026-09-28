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
} from '../types';

const STORAGE_KEYS = {
  USER: 'smartkasb_user_v1',
  CUSTOMERS: 'smartkasb_customers_v1',
  ORDERS: 'smartkasb_orders_v1',
  TRANSACTIONS: 'smartkasb_transactions_v1',
  TASKS: 'smartkasb_tasks_v1',
  REMINDERS: 'smartkasb_reminders_v1',
  EVENTS: 'smartkasb_events_v1',
  PRODUCTS: 'smartkasb_products_v1',
  SERVICES: 'smartkasb_services_v1',
  NOTIFICATIONS: 'smartkasb_notifications_v1',
  ACTIVITIES: 'smartkasb_activities_v1',
  AUTH_TOKEN: 'smartkasb_auth_session'
};

// Realistic initial demo seed
const INITIAL_USER: User = {
  id: 'usr-1',
  name: 'Azizbek Rahimov',
  phone: '+998 90 123 45 67',
  email: 'azizbek@smartkasb.uz',
  profession: 'dasturchi',
  businessName: 'Rahimov Digital & IT Services',
  address: 'Toshkent sh., Yunusobod tumani, Amir Temur ko‘chasi, 45-uy',
  theme: 'light',
  language: 'uz',
  currency: 'UZS',
  createdAt: '2026-08-15',
  isOnboarded: true
};

const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: 'cust-1',
    name: 'Jasur Aliyev',
    phone: '+998 90 987 65 43',
    email: 'jasur.aliyev@gmail.com',
    address: 'Toshkent sh., Mirzo Ulug‘bek tumani',
    totalOrders: 3,
    totalSpent: 4200000,
    lastOrderDate: '2026-09-24',
    status: 'vip',
    notes: 'Doimiy hamkor, doimo o‘z vaqtida to‘lov qiladi.',
    createdAt: '2026-08-20'
  },
  {
    id: 'cust-2',
    name: 'Malika Karimova',
    phone: '+998 93 456 78 90',
    email: 'm.karimova@business.uz',
    address: 'Samarqand sh., Registon ko‘chasi, 12',
    totalOrders: 2,
    totalSpent: 1850000,
    lastOrderDate: '2026-09-22',
    status: 'faol',
    notes: 'Onlayn do‘kon loyihasi buyurtmachisi.',
    createdAt: '2026-08-25'
  },
  {
    id: 'cust-3',
    name: 'Shavkat Umarov',
    phone: '+998 97 111 22 33',
    email: 'shavkat.u@mail.ru',
    address: 'Toshkent sh., Chilonzor 9-mavze',
    totalOrders: 1,
    totalSpent: 900000,
    lastOrderDate: '2026-09-26',
    status: 'yangi',
    notes: 'Tavsiya orqali kelgan yangi mijoz.',
    createdAt: '2026-09-26'
  },
  {
    id: 'cust-4',
    name: 'Dilnoza Boboyeva',
    phone: '+998 94 333 44 55',
    email: 'dilnoza.b@yandex.uz',
    address: 'Buxoro sh., Ibrohim Mo‘minov ko‘chasi',
    totalOrders: 2,
    totalSpent: 2600000,
    lastOrderDate: '2026-09-18',
    status: 'faol',
    notes: 'SMM va brend dizayni bo‘yicha buyurtmachi.',
    createdAt: '2026-09-02'
  },
  {
    id: 'cust-5',
    name: 'Farrux Qodirov',
    phone: '+998 99 777 88 99',
    email: 'farrux.q@invest.uz',
    address: 'Toshkent sh., Shayxontohur tumani',
    totalOrders: 4,
    totalSpent: 5900000,
    lastOrderDate: '2026-09-25',
    status: 'vip',
    notes: 'Yirik korporativ loyihalar koordinatori.',
    createdAt: '2026-08-10'
  },
  {
    id: 'cust-6',
    name: 'Gulnora Usmonova',
    phone: '+998 91 222 33 44',
    email: 'gulnora.u@edu.uz',
    address: 'Farg‘ona sh., Al-Farg‘oniy ko‘chasi',
    totalOrders: 1,
    totalSpent: 450000,
    lastOrderDate: '2026-08-30',
    status: 'noaktiv',
    notes: 'Dastlabki maslahat olgan, keyingi oy yangilanish kutilyapti.',
    createdAt: '2026-08-28'
  }
];

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'ORD-101',
    customerId: 'cust-1',
    customerName: 'Jasur Aliyev',
    customerPhone: '+998 90 987 65 43',
    serviceOrProduct: 'Veb-sayt ishlab chiqish va SEO sozlash',
    description: 'Korporativ ko‘p sahifali veb-sayt, to‘liq responsive va tezkor.',
    quantity: 1,
    unitPrice: 3500000,
    discount: 300000,
    finalPrice: 3200000,
    paidAmount: 2000000,
    remainingAmount: 1200000,
    orderStatus: 'jarayonda',
    paymentStatus: 'qisman_tolangan',
    createdDate: '2026-09-20',
    deadline: '2026-09-30',
    notes: 'Avans 2 000 000 so‘m qabul qilindi, qoldiq topshirish kuni to‘lanadi.'
  },
  {
    id: 'ord-102',
    orderNumber: 'ORD-102',
    customerId: 'cust-2',
    customerName: 'Malika Karimova',
    customerPhone: '+998 93 456 78 90',
    serviceOrProduct: 'Telegram bot integratsiyasi va to‘lov tizimi',
    description: 'Payme va Click ulangan do‘kon boti.',
    quantity: 1,
    unitPrice: 1850000,
    discount: 0,
    finalPrice: 1850000,
    paidAmount: 1850000,
    remainingAmount: 0,
    orderStatus: 'tugallangan',
    paymentStatus: 'toliq_tolangan',
    createdDate: '2026-09-15',
    deadline: '2026-09-22',
    notes: 'Loyiha muvaffaqiyatli topshirildi va to‘liq to‘landi.'
  },
  {
    id: 'ord-103',
    orderNumber: 'ORD-103',
    customerId: 'cust-5',
    customerName: 'Farrux Qodirov',
    customerPhone: '+998 99 777 88 99',
    serviceOrProduct: 'CRM ma’lumotlar bazasi optimizatsiyasi',
    description: 'Server yuklamasini kamaytirish va SQL so‘rovlarni tezlashtirish.',
    quantity: 2,
    unitPrice: 1500000,
    discount: 200000,
    finalPrice: 2800000,
    paidAmount: 1000000,
    remainingAmount: 1800000,
    orderStatus: 'jarayonda',
    paymentStatus: 'qisman_tolangan',
    createdDate: '2026-09-22',
    deadline: '2026-10-02',
    notes: 'Bosqichma-bosqich testdan o‘tkazilmoqda.'
  },
  {
    id: 'ord-104',
    orderNumber: 'ORD-104',
    customerId: 'cust-3',
    customerName: 'Shavkat Umarov',
    customerPhone: '+998 97 111 22 33',
    serviceOrProduct: 'Brending va UI/UX prototip',
    description: 'Mobil ilova bosh ekrani va komponentlar kutubxonasi.',
    quantity: 1,
    unitPrice: 900000,
    discount: 0,
    finalPrice: 900000,
    paidAmount: 0,
    remainingAmount: 900000,
    orderStatus: 'yangi',
    paymentStatus: 'tolanmagan',
    createdDate: '2026-09-26',
    deadline: '2026-10-05',
    notes: 'Texnik topshiriq kelishildi.'
  },
  {
    id: 'ord-105',
    orderNumber: 'ORD-105',
    customerId: 'cust-4',
    customerName: 'Dilnoza Boboyeva',
    customerPhone: '+998 94 333 44 55',
    serviceOrProduct: 'Instagram reklama vizuallari va shablonlar',
    description: '15 ta professional post va stories to‘plami.',
    quantity: 1,
    unitPrice: 1200000,
    discount: 100000,
    finalPrice: 1100000,
    paidAmount: 1100000,
    remainingAmount: 0,
    orderStatus: 'tugallangan',
    paymentStatus: 'toliq_tolangan',
    createdDate: '2026-09-10',
    deadline: '2026-09-18',
    notes: 'Barcha materiallar mijozga topshirildi.'
  },
  {
    id: 'ord-106',
    orderNumber: 'ORD-106',
    customerId: 'cust-1',
    customerName: 'Jasur Aliyev',
    customerPhone: '+998 90 987 65 43',
    serviceOrProduct: 'Yillik server xosti va texnik qo‘llab-quvvatlash',
    description: '24/7 monitoring, SSL xavfsizlik va zaxira nusxalari.',
    quantity: 1,
    unitPrice: 1000000,
    discount: 0,
    finalPrice: 1000000,
    paidAmount: 1000000,
    remainingAmount: 0,
    orderStatus: 'kutilmoqda',
    paymentStatus: 'toliq_tolangan',
    createdDate: '2026-09-24',
    deadline: '2026-10-10',
    notes: 'Server konfiguratsiyasi yangilanishi kutilmoqda.'
  },
  {
    id: 'ord-107',
    orderNumber: 'ORD-107',
    customerId: 'cust-5',
    customerName: 'Farrux Qodirov',
    customerPhone: '+998 99 777 88 99',
    serviceOrProduct: 'Mobil ilova MVP versiyasi',
    description: 'React Native asosidagi kross-platforma ilova.',
    quantity: 1,
    unitPrice: 3200000,
    discount: 100000,
    finalPrice: 3100000,
    paidAmount: 3100000,
    remainingAmount: 0,
    orderStatus: 'tugallangan',
    paymentStatus: 'toliq_tolangan',
    createdDate: '2026-08-15',
    deadline: '2026-09-01',
    notes: 'Avvalgi oyda muvaffaqiyatli topshirilgan.'
  },
  {
    id: 'ord-108',
    orderNumber: 'ORD-108',
    customerId: 'cust-4',
    customerName: 'Dilnoza Boboyeva',
    customerPhone: '+998 94 333 44 55',
    serviceOrProduct: 'Katalog veb-sayti yangilash',
    description: 'Mahsulotlar katalogiga qidiruv va filtrlar qo‘shish.',
    quantity: 1,
    unitPrice: 1500000,
    discount: 0,
    finalPrice: 1500000,
    paidAmount: 0,
    remainingAmount: 1500000,
    orderStatus: 'jarayonda',
    paymentStatus: 'tolanmagan',
    createdDate: '2026-09-25',
    deadline: '2026-10-04',
    notes: 'Front-end qismi ishlab chiqilmoqda.'
  }
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-1',
    type: 'daromad',
    amount: 2000000,
    category: 'Xizmat haqi',
    date: '2026-09-20',
    sourceOrReceiver: 'Jasur Aliyev (Avans)',
    customerId: 'cust-1',
    customerName: 'Jasur Aliyev',
    orderId: 'ord-101',
    description: 'Veb-sayt ishlab chiqish uchun boshlang‘ich 50% to‘lov',
    createdAt: '2026-09-20'
  },
  {
    id: 'tx-2',
    type: 'daromad',
    amount: 1850000,
    category: 'Xizmat haqi',
    date: '2026-09-22',
    sourceOrReceiver: 'Malika Karimova',
    customerId: 'cust-2',
    customerName: 'Malika Karimova',
    orderId: 'ord-102',
    description: 'Telegram bot loyihasi to‘liq to‘lovi',
    createdAt: '2026-09-22'
  },
  {
    id: 'tx-3',
    type: 'daromad',
    amount: 1000000,
    category: 'Xizmat haqi',
    date: '2026-09-23',
    sourceOrReceiver: 'Farrux Qodirov',
    customerId: 'cust-5',
    customerName: 'Farrux Qodirov',
    orderId: 'ord-103',
    description: 'DB optimizatsiyasi bo‘yicha avans to‘lovi',
    createdAt: '2026-09-23'
  },
  {
    id: 'tx-4',
    type: 'daromad',
    amount: 1100000,
    category: 'Dizayn xizmatlari',
    date: '2026-09-18',
    sourceOrReceiver: 'Dilnoza Boboyeva',
    customerId: 'cust-4',
    customerName: 'Dilnoza Boboyeva',
    orderId: 'ord-105',
    description: 'Instagram shablonlar to‘liq to‘lovi',
    createdAt: '2026-09-18'
  },
  {
    id: 'tx-5',
    type: 'daromad',
    amount: 1000000,
    category: 'Server xizmati',
    date: '2026-09-24',
    sourceOrReceiver: 'Jasur Aliyev',
    customerId: 'cust-1',
    customerName: 'Jasur Aliyev',
    orderId: 'ord-106',
    description: 'Yillik hosting va texnik xizmat',
    createdAt: '2026-09-24'
  },
  {
    id: 'tx-6',
    type: 'daromad',
    amount: 850000,
    category: 'Konsultatsiya',
    date: '2026-09-27',
    sourceOrReceiver: 'Mustaqil mijoz',
    description: 'IT arxitektura va xavfsizlik audit konsultatsiyasi',
    createdAt: '2026-09-27'
  },
  // Expenses
  {
    id: 'tx-7',
    type: 'xarajat',
    amount: 1500000,
    category: 'Rent',
    date: '2026-09-05',
    sourceOrReceiver: 'Kovorking markazi',
    description: 'Sentyabr oyi uchun ofis/kovorking ijara haqi',
    createdAt: '2026-09-05'
  },
  {
    id: 'tx-8',
    type: 'xarajat',
    amount: 650000,
    category: 'Equipment',
    date: '2026-09-12',
    sourceOrReceiver: 'Texnomart',
    description: 'Simsiz klaviatura va ergonomik sichqoncha',
    createdAt: '2026-09-12'
  },
  {
    id: 'tx-9',
    type: 'xarajat',
    amount: 450000,
    category: 'Advertising',
    date: '2026-09-15',
    sourceOrReceiver: 'Meta Ads',
    description: 'Telegram kanal va portfolio uchun maqsadli reklama',
    createdAt: '2026-09-15'
  },
  {
    id: 'tx-10',
    type: 'xarajat',
    amount: 280000,
    category: 'Utilities',
    date: '2026-09-19',
    sourceOrReceiver: 'Uzonline Internet',
    description: 'Ofis yuqori tezlikdagi optik internet to‘lovi',
    createdAt: '2026-09-19'
  },
  {
    id: 'tx-11',
    type: 'xarajat',
    amount: 320000,
    category: 'Transport',
    date: '2026-09-23',
    sourceOrReceiver: 'Yandex Go & Yoqilg‘i',
    description: 'Mijozlar bilan uchrashuvlarga borish xarajatlari',
    createdAt: '2026-09-23'
  },
  {
    id: 'tx-12',
    type: 'xarajat',
    amount: 1000000,
    category: 'Salary',
    date: '2026-09-25',
    sourceOrReceiver: 'Yordamchi dasturchi',
    description: 'Frontend bo‘limi stajyoriga oylik kompensatsiya',
    createdAt: '2026-09-25'
  }
];

const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Jasur Aliyev veb-saytini mobil moslashuvini tekshirish',
    description: 'Safari va Chrome brauzerlarida barcha tugmalar va shakllar to‘g‘ri ishlashini sinash.',
    priority: 'shoshilinch',
    deadline: '2026-09-28',
    status: 'in_progress',
    relatedCustomerId: 'cust-1',
    relatedCustomerName: 'Jasur Aliyev',
    relatedOrderId: 'ord-101',
    createdAt: '2026-09-23'
  },
  {
    id: 'task-2',
    title: 'Farrux Qodirov DB indekslarini qayta qurish',
    description: 'PostgreSQL so‘rovlarida sekin ishlayotgan joinlarni indekslash.',
    priority: 'yuqori',
    deadline: '2026-09-29',
    status: 'todo',
    relatedCustomerId: 'cust-5',
    relatedCustomerName: 'Farrux Qodirov',
    relatedOrderId: 'ord-103',
    createdAt: '2026-09-24'
  },
  {
    id: 'task-3',
    title: 'Dilnoza Boboyeva veb-katalog filtrlari dizayni',
    description: 'Kategoriya va narx bo‘yicha interaktiv filtrlash UI qismini tayyorlash.',
    priority: 'orta',
    deadline: '2026-10-01',
    status: 'todo',
    relatedCustomerId: 'cust-4',
    relatedCustomerName: 'Dilnoza Boboyeva',
    relatedOrderId: 'ord-108',
    createdAt: '2026-09-25'
  },
  {
    id: 'task-4',
    title: 'Oylik moliyaviy hisobotni umumlashtirish',
    description: 'Sentyabr oyi kirim-chiqim kassa qoldig‘ini solishtirish.',
    priority: 'orta',
    deadline: '2026-09-30',
    status: 'todo',
    createdAt: '2026-09-26'
  },
  {
    id: 'task-5',
    title: 'Malika Karimovaga Telegram bot qo‘llanmasini jo‘natish',
    description: 'Admin paneldan tovarlarni qo‘shish va buyurtmalarni ko‘rish videosini yuborish.',
    priority: 'past',
    deadline: '2026-09-23',
    status: 'completed',
    relatedCustomerId: 'cust-2',
    relatedCustomerName: 'Malika Karimova',
    relatedOrderId: 'ord-102',
    createdAt: '2026-09-22'
  },
  {
    id: 'task-6',
    title: 'Server zaxira nusxasini (Backup) avtomatlashtirish',
    description: 'Har tun 03:00 da avtomatik zaxira nusxa yaratish skriptini tekshirish.',
    priority: 'yuqori',
    deadline: '2026-09-25',
    status: 'completed',
    createdAt: '2026-09-21'
  }
];

const INITIAL_REMINDERS: Reminder[] = [
  {
    id: 'rem-1',
    title: 'Jasur Aliyev bilan zoom qo‘ng‘iroq',
    date: '2026-09-28',
    time: '15:00',
    description: 'Sayt dizayni va oxirgi bosqich tafsilotlarini kelishib olish',
    repeat: 'bir_martalik',
    isCompleted: false,
    createdAt: '2026-09-26'
  },
  {
    id: 'rem-2',
    title: 'Kovorking ijara to‘lovini tasdiqlash',
    date: '2026-10-01',
    time: '10:00',
    description: 'Keyingi oy uchun shartnomani uzaytirish',
    repeat: 'har_oy',
    isCompleted: false,
    createdAt: '2026-09-20'
  },
  {
    id: 'rem-3',
    title: 'Soliq hisobotini tekshirish',
    date: '2026-10-05',
    time: '11:30',
    description: 'Yakka tartibdagi tadbirkorlik oylik aylanmasini soliq.uz da tekshirish',
    repeat: 'har_oy',
    isCompleted: false,
    createdAt: '2026-09-15'
  },
  {
    id: 'rem-4',
    title: 'Farrux Qodirovga oraliq hisobot yuborish',
    date: '2026-09-29',
    time: '17:00',
    description: 'DB optimizatsiyasining dastlabki test tezligi natijalari',
    repeat: 'bir_martalik',
    isCompleted: false,
    createdAt: '2026-09-26'
  },
  {
    id: 'rem-5',
    title: 'Kunlik kassa va hisob-kitobni yakunlash',
    date: '2026-09-28',
    time: '19:00',
    description: 'Barcha kunlik operatsiyalarni tizimga kiritish',
    repeat: 'har_kuni',
    isCompleted: false,
    createdAt: '2026-09-01'
  }
];

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'ev-1',
    title: 'Jasur Aliyev — Sayt taqdimoti',
    date: '2026-09-28',
    time: '15:00',
    type: 'uchrashuv',
    relatedId: 'cust-1',
    notes: 'Online Google Meet orqali taqdimot'
  },
  {
    id: 'ev-2',
    title: 'ORD-101 topshirish deadline',
    date: '2026-09-30',
    time: '18:00',
    type: 'deadline',
    relatedId: 'ord-101',
    notes: 'Saytni asosiy domenga ulash'
  },
  {
    id: 'ev-3',
    title: 'Farrux Qodirov bilan strategiya uchrashuvi',
    date: '2026-09-29',
    time: '11:00',
    type: 'uchrashuv',
    relatedId: 'cust-5',
    notes: 'Yunusobod ofisida jonli ko‘rishuv'
  },
  {
    id: 'ev-4',
    title: 'ORD-103 yakuniy topshirish',
    date: '2026-10-02',
    time: '16:00',
    type: 'deadline',
    relatedId: 'ord-103',
    notes: 'Server test monitoring yakuni'
  },
  {
    id: 'ev-5',
    title: 'Dilnoza Boboyeva bilan dizayn muhokamasi',
    date: '2026-10-01',
    time: '14:30',
    type: 'uchrashuv',
    relatedId: 'cust-4'
  }
];

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'SSD 1TB NVMe Yuqori tezlikli drayv',
    category: 'Uskunalar',
    quantity: 14,
    purchasePrice: 650000,
    sellingPrice: 890000,
    minStock: 5,
    supplier: 'Asia Tech Distribution',
    sku: 'SSD-NVME-1TB',
    createdAt: '2026-08-10'
  },
  {
    id: 'prod-2',
    name: 'DDR4 16GB 3200MHz Operativ xotira',
    category: 'Ehtiyot qismlar',
    quantity: 3, // Low stock alert!
    purchasePrice: 280000,
    sellingPrice: 420000,
    minStock: 6,
    supplier: 'Asia Tech Distribution',
    sku: 'RAM-DDR4-16G',
    createdAt: '2026-08-12'
  },
  {
    id: 'prod-3',
    name: 'USB-C Ko‘p tarmoqli adapter (Hub 7-in-1)',
    category: 'Aksessuarlar',
    quantity: 0, // Out of stock alert!
    purchasePrice: 190000,
    sellingPrice: 320000,
    minStock: 4,
    supplier: 'Gadget Store UZ',
    sku: 'HUB-7IN1-USBC',
    createdAt: '2026-08-15'
  },
  {
    id: 'prod-4',
    name: 'Wi-Fi 6 Gigabit Router Dual-Band',
    category: 'Tarmoq',
    quantity: 8,
    purchasePrice: 480000,
    sellingPrice: 680000,
    minStock: 3,
    supplier: 'NetComm Tashkent',
    sku: 'RTR-WIFI6-GB',
    createdAt: '2026-08-20'
  },
  {
    id: 'prod-5',
    name: 'Termopasta Arctic MX-4 (4g)',
    category: 'Sarflov materiallari',
    quantity: 2, // Low stock alert!
    purchasePrice: 45000,
    sellingPrice: 85000,
    minStock: 5,
    supplier: 'Cooling Pro',
    sku: 'TP-ARCTIC-4G',
    createdAt: '2026-08-25'
  },
  {
    id: 'prod-6',
    name: 'HDMI 2.1 8K Kabel (2 metr)',
    category: 'Kabellar',
    quantity: 25,
    purchasePrice: 40000,
    sellingPrice: 80000,
    minStock: 10,
    supplier: 'Cable Master',
    sku: 'CBL-HDMI8K-2M',
    createdAt: '2026-09-01'
  },
  {
    id: 'prod-7',
    name: 'Optik simsiz sichqoncha Bluetooth',
    category: 'Aksessuarlar',
    quantity: 12,
    purchasePrice: 110000,
    sellingPrice: 195000,
    minStock: 5,
    supplier: 'Gadget Store UZ',
    sku: 'MS-OPTIC-BT',
    createdAt: '2026-09-05'
  },
  {
    id: 'prod-8',
    name: 'Ethernet RJ45 CAT6 Kabel o‘rami (100m)',
    category: 'Tarmoq',
    quantity: 4,
    purchasePrice: 220000,
    sellingPrice: 340000,
    minStock: 2,
    supplier: 'NetComm Tashkent',
    sku: 'CBL-CAT6-100M',
    createdAt: '2026-09-10'
  }
];

const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-1',
    name: 'Veb-sayt yaratish (Landing & Korporativ)',
    description: 'Zamonaviy dizayn, moslashuvchan interfeys va qidiruv tizimlariga optimallashtirish.',
    price: 3200000,
    duration: '7–10 kun',
    category: 'Dasturlash',
    isActive: true,
    createdAt: '2026-08-01'
  },
  {
    id: 'srv-2',
    name: 'Telegram savdo boti & CRM integratsiyasi',
    description: 'Mijozlar buyurtmasi, avtomat to‘lovlar va xabarnomalar tizimi.',
    price: 1850000,
    duration: '3–5 kun',
    category: 'Avtomatlashtirish',
    isActive: true,
    createdAt: '2026-08-05'
  },
  {
    id: 'srv-3',
    name: 'UI/UX mobil va veb dizayn tayyorlash',
    description: 'Figma platformasida qulay va chiroyli interfeys prototiplari.',
    price: 1200000,
    duration: '4–6 kun',
    category: 'Dizayn',
    isActive: true,
    createdAt: '2026-08-10'
  },
  {
    id: 'srv-4',
    name: 'Server va ma’lumotlar bazasi optimizatsiyasi',
    description: 'Yuklamalarni kamaytirish, so‘rovlarni tezlashtirish va xavfsizlik auditi.',
    price: 1500000,
    duration: '2–3 kun',
    category: 'IT / DevOps',
    isActive: true,
    createdAt: '2026-08-15'
  },
  {
    id: 'srv-5',
    name: '1 oylik texnik qo‘llab-quvvatlash va monitoring',
    description: 'Doimiy nazorat, nosozliklarni tezkor bartaraf etish va zaxira nusxalar.',
    price: 900000,
    duration: '1 oy',
    category: 'Qo‘llab-quvvatlash',
    isActive: true,
    createdAt: '2026-08-20'
  },
  {
    id: 'srv-6',
    name: 'IT konsultatsiya va arxitektura tanlash',
    description: 'Loyiha uchun to‘g‘ri texnologiya stekini tanlash bo‘yicha 1 soatlik sessiya.',
    price: 350000,
    duration: '1–2 soat',
    category: 'Konsultatsiya',
    isActive: true,
    createdAt: '2026-09-01'
  }
];

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Buyurtma muddati yaqinlashmoqda',
    message: 'Jasur Aliyevning #ORD-101 buyurtmasi muddati 30-Sentabr kuni yakunlanadi.',
    date: '2026-09-27 10:00',
    type: 'order',
    isRead: false,
    linkTab: 'orders'
  },
  {
    id: 'notif-2',
    title: 'Kam qolgan mahsulot ogohlantirishi',
    message: 'Omborda 2 turdagi mahsulot kritik minimal chegaradan kam qoldi (RAM DDR4 va Arctic MX-4).',
    date: '2026-09-27 09:15',
    type: 'inventory',
    isRead: false,
    linkTab: 'inventory'
  },
  {
    id: 'notif-3',
    title: 'Yangi to‘lov qabul qilindi',
    message: 'Mustaqil mijozdan 850 000 so‘m IT konsultatsiya to‘lovi kassa kirimiga yozildi.',
    date: '2026-09-27 14:20',
    type: 'finance',
    isRead: true,
    linkTab: 'finance'
  },
  {
    id: 'notif-4',
    title: 'Yangi mijoz qo‘shildi',
    message: 'Shavkat Umarov mijozlar bazasiga muvaffaqiyatli kiritildi.',
    date: '2026-09-26 16:45',
    type: 'customer',
    isRead: true,
    linkTab: 'customers'
  }
];

const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    title: 'To‘lov qabul qilindi',
    description: '850 000 so‘m IT audit xizmati uchun qabul qilindi',
    timestamp: '2026-09-27 14:20',
    type: 'payment'
  },
  {
    id: 'act-2',
    title: 'Yangi mijoz ro‘yxatga olindi',
    description: 'Shavkat Umarov (Chilonzor) bazaga kiritildi',
    timestamp: '2026-09-26 16:45',
    type: 'customer'
  },
  {
    id: 'act-3',
    title: 'Yangi buyurtma rasmiylashtirildi',
    description: 'ORD-108: Katalog saytini yangilash (1 500 000 so‘m)',
    timestamp: '2026-09-25 11:30',
    type: 'order'
  },
  {
    id: 'act-4',
    title: 'Xarajat qayd etildi',
    description: 'Yordamchi dasturchiga 1 000 000 so‘m ish haqi to‘landi',
    timestamp: '2026-09-25 18:00',
    type: 'expense'
  },
  {
    id: 'act-5',
    title: 'Vazifa bajarildi',
    description: 'Server zaxira nusxasini avtomatlashtirish yakunlandi',
    timestamp: '2026-09-25 21:00',
    type: 'task'
  },
  {
    id: 'act-6',
    title: 'To‘lov kvitansiyasi yopildi',
    description: 'ORD-102 bo‘yicha 1 850 000 so‘m to‘liq to‘landi',
    timestamp: '2026-09-22 17:15',
    type: 'payment'
  }
];

// Helper to safely read from localStorage
function getStored<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return fallback;
  }
}

// Helper to safely write to localStorage
function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to storage:`, e);
  }
}

export const DataStore = {
  // Session & Auth
  isAuthenticated(): boolean {
    return Boolean(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN));
  },
  setAuthenticated(token: string | null): void {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
  },

  // User & Profile
  getUser(): User {
    return getStored<User>(STORAGE_KEYS.USER, INITIAL_USER);
  },
  saveUser(user: User): void {
    setStored(STORAGE_KEYS.USER, user);
  },
  updateUserProfession(profession: ProfessionId): User {
    const user = this.getUser();
    user.profession = profession;
    user.isOnboarded = true;
    this.saveUser(user);
    return user;
  },

  // Customers
  getCustomers(): Customer[] {
    return getStored<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  },
  saveCustomers(customers: Customer[]): void {
    setStored(STORAGE_KEYS.CUSTOMERS, customers);
  },
  saveCustomer(customer: Customer): Customer[] {
    const list = this.getCustomers();
    const index = list.findIndex((c) => c.id === customer.id);
    let updated: Customer[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = customer;
    } else {
      updated = [customer, ...list];
      this.addActivity({
        id: `act-${Date.now()}`,
        title: 'Yangi mijoz qo‘shildi',
        description: `${customer.name} ro‘yxatga olindi`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        type: 'customer'
      });
    }
    this.saveCustomers(updated);
    return updated;
  },
  deleteCustomer(id: string): Customer[] {
    const list = this.getCustomers().filter((c) => c.id !== id);
    this.saveCustomers(list);
    return list;
  },

  // Orders
  getOrders(): Order[] {
    return getStored<Order[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },
  saveOrders(orders: Order[]): void {
    setStored(STORAGE_KEYS.ORDERS, orders);
  },
  saveOrder(order: Order): Order[] {
    const list = this.getOrders();
    const index = list.findIndex((o) => o.id === order.id);
    let updated: Order[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = order;
    } else {
      updated = [order, ...list];
      this.addActivity({
        id: `act-${Date.now()}`,
        title: 'Yangi buyurtma yaratildi',
        description: `${order.customerName}: ${order.serviceOrProduct}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        type: 'order'
      });
    }
    this.saveOrders(updated);

    // Sync Customer spend and order count
    this.recalculateCustomerMetrics(order.customerId);
    return updated;
  },
  deleteOrder(id: string): Order[] {
    const list = this.getOrders();
    const target = list.find((o) => o.id === id);
    const updated = list.filter((o) => o.id !== id);
    this.saveOrders(updated);
    if (target) {
      this.recalculateCustomerMetrics(target.customerId);
    }
    return updated;
  },

  // Transactions (Finance)
  getTransactions(): Transaction[] {
    return getStored<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  },
  saveTransactions(transactions: Transaction[]): void {
    setStored(STORAGE_KEYS.TRANSACTIONS, transactions);
  },
  saveTransaction(tx: Transaction): Transaction[] {
    const list = this.getTransactions();
    const index = list.findIndex((t) => t.id === tx.id);
    let updated: Transaction[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = tx;
    } else {
      updated = [tx, ...list];
      this.addActivity({
        id: `act-${Date.now()}`,
        title: tx.type === 'daromad' ? 'Daromad yozildi' : 'Xarajat qayd etildi',
        description: `${tx.description || tx.category}: ${tx.amount.toLocaleString()} so‘m`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        type: tx.type === 'daromad' ? 'payment' : 'expense'
      });
    }
    this.saveTransactions(updated);
    return updated;
  },
  deleteTransaction(id: string): Transaction[] {
    const list = this.getTransactions().filter((t) => t.id !== id);
    this.saveTransactions(list);
    return list;
  },

  // Tasks
  getTasks(): Task[] {
    return getStored<Task[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
  },
  saveTasks(tasks: Task[]): void {
    setStored(STORAGE_KEYS.TASKS, tasks);
  },
  saveTask(task: Task): Task[] {
    const list = this.getTasks();
    const index = list.findIndex((t) => t.id === task.id);
    let updated: Task[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = task;
    } else {
      updated = [task, ...list];
      this.addActivity({
        id: `act-${Date.now()}`,
        title: 'Yangi vazifa yaratildi',
        description: task.title,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        type: 'task'
      });
    }
    this.saveTasks(updated);
    return updated;
  },
  deleteTask(id: string): Task[] {
    const list = this.getTasks().filter((t) => t.id !== id);
    this.saveTasks(list);
    return list;
  },

  // Reminders
  getReminders(): Reminder[] {
    return getStored<Reminder[]>(STORAGE_KEYS.REMINDERS, INITIAL_REMINDERS);
  },
  saveReminders(reminders: Reminder[]): void {
    setStored(STORAGE_KEYS.REMINDERS, reminders);
  },
  saveReminder(reminder: Reminder): Reminder[] {
    const list = this.getReminders();
    const index = list.findIndex((r) => r.id === reminder.id);
    let updated: Reminder[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = reminder;
    } else {
      updated = [reminder, ...list];
      this.addActivity({
        id: `act-${Date.now()}`,
        title: 'Yangi eslatma yaratildi',
        description: `${reminder.title} (${reminder.date} ${reminder.time})`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        type: 'reminder'
      });
    }
    this.saveReminders(updated);
    return updated;
  },
  deleteReminder(id: string): Reminder[] {
    const list = this.getReminders().filter((r) => r.id !== id);
    this.saveReminders(list);
    return list;
  },

  // Calendar Events
  getEvents(): CalendarEvent[] {
    return getStored<CalendarEvent[]>(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
  },
  saveEvents(events: CalendarEvent[]): void {
    setStored(STORAGE_KEYS.EVENTS, events);
  },
  saveEvent(event: CalendarEvent): CalendarEvent[] {
    const list = this.getEvents();
    const index = list.findIndex((e) => e.id === event.id);
    let updated: CalendarEvent[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = event;
    } else {
      updated = [event, ...list];
    }
    this.saveEvents(updated);
    return updated;
  },
  deleteEvent(id: string): CalendarEvent[] {
    const list = this.getEvents().filter((e) => e.id !== id);
    this.saveEvents(list);
    return list;
  },

  // Inventory / Products
  getProducts(): Product[] {
    return getStored<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },
  saveProducts(products: Product[]): void {
    setStored(STORAGE_KEYS.PRODUCTS, products);
  },
  saveProduct(product: Product): Product[] {
    const list = this.getProducts();
    const index = list.findIndex((p) => p.id === product.id);
    let updated: Product[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = product;
    } else {
      updated = [product, ...list];
    }
    this.saveProducts(updated);
    return updated;
  },
  deleteProduct(id: string): Product[] {
    const list = this.getProducts().filter((p) => p.id !== id);
    this.saveProducts(list);
    return list;
  },
  adjustProductStock(id: string, delta: number): Product[] {
    const list = this.getProducts();
    const updated = list.map((p) => {
      if (p.id === id) {
        const newQty = Math.max(0, p.quantity + delta);
        return { ...p, quantity: newQty };
      }
      return p;
    });
    this.saveProducts(updated);
    return updated;
  },

  // Services
  getServices(): Service[] {
    return getStored<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  },
  saveServices(services: Service[]): void {
    setStored(STORAGE_KEYS.SERVICES, services);
  },
  saveService(service: Service): Service[] {
    const list = this.getServices();
    const index = list.findIndex((s) => s.id === service.id);
    let updated: Service[];
    if (index >= 0) {
      updated = [...list];
      updated[index] = service;
    } else {
      updated = [service, ...list];
    }
    this.saveServices(updated);
    return updated;
  },
  deleteService(id: string): Service[] {
    const list = this.getServices().filter((s) => s.id !== id);
    this.saveServices(list);
    return list;
  },

  // Notifications
  getNotifications(): NotificationItem[] {
    return getStored<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
  },
  saveNotifications(notifs: NotificationItem[]): void {
    setStored(STORAGE_KEYS.NOTIFICATIONS, notifs);
  },
  markNotificationAsRead(id: string): NotificationItem[] {
    const list = this.getNotifications().map((n) => (n.id === id ? { ...n, isRead: true } : n));
    this.saveNotifications(list);
    return list;
  },
  markAllNotificationsAsRead(): NotificationItem[] {
    const list = this.getNotifications().map((n) => ({ ...n, isRead: true }));
    this.saveNotifications(list);
    return list;
  },
  deleteNotification(id: string): NotificationItem[] {
    const list = this.getNotifications().filter((n) => n.id !== id);
    this.saveNotifications(list);
    return list;
  },

  // Activities
  getActivities(): ActivityItem[] {
    return getStored<ActivityItem[]>(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
  },
  addActivity(act: ActivityItem): void {
    const list = [act, ...this.getActivities()].slice(0, 30);
    setStored(STORAGE_KEYS.ACTIVITIES, list);
  },

  // Recalculate customer metrics when orders change
  recalculateCustomerMetrics(customerId: string): void {
    const orders = this.getOrders().filter((o) => o.customerId === customerId);
    const customers = this.getCustomers();
    const customer = customers.find((c) => c.id === customerId);
    if (!customer) return;

    customer.totalOrders = orders.length;
    customer.totalSpent = orders.reduce((sum, o) => sum + (o.paidAmount || 0), 0);
    if (orders.length > 0) {
      const sorted = [...orders].sort(
        (a, b) => new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
      );
      customer.lastOrderDate = sorted[0].createdDate;
    }
    this.saveCustomers(customers);
  },

  // Reset to initial demo dataset
  resetToDemoData(): void {
    setStored(STORAGE_KEYS.USER, INITIAL_USER);
    setStored(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    setStored(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    setStored(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
    setStored(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    setStored(STORAGE_KEYS.REMINDERS, INITIAL_REMINDERS);
    setStored(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    setStored(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    setStored(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
    setStored(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    setStored(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES);
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, 'demo_session_active');
  },

  // Full backup export as JSON
  exportDataAsJSON(): string {
    const exportBundle = {
      exportDate: new Date().toISOString(),
      user: this.getUser(),
      customers: this.getCustomers(),
      orders: this.getOrders(),
      transactions: this.getTransactions(),
      tasks: this.getTasks(),
      reminders: this.getReminders(),
      events: this.getEvents(),
      products: this.getProducts(),
      services: this.getServices(),
      notifications: this.getNotifications(),
      activities: this.getActivities()
    };
    return JSON.stringify(exportBundle, null, 2);
  },

  // Restore backup from JSON
  importDataFromJSON(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.user) setStored(STORAGE_KEYS.USER, data.user);
      if (data.customers) setStored(STORAGE_KEYS.CUSTOMERS, data.customers);
      if (data.orders) setStored(STORAGE_KEYS.ORDERS, data.orders);
      if (data.transactions) setStored(STORAGE_KEYS.TRANSACTIONS, data.transactions);
      if (data.tasks) setStored(STORAGE_KEYS.TASKS, data.tasks);
      if (data.reminders) setStored(STORAGE_KEYS.REMINDERS, data.reminders);
      if (data.events) setStored(STORAGE_KEYS.EVENTS, data.events);
      if (data.products) setStored(STORAGE_KEYS.PRODUCTS, data.products);
      if (data.services) setStored(STORAGE_KEYS.SERVICES, data.services);
      if (data.notifications) setStored(STORAGE_KEYS.NOTIFICATIONS, data.notifications);
      if (data.activities) setStored(STORAGE_KEYS.ACTIVITIES, data.activities);
      return true;
    } catch (e) {
      console.error('Failed to import JSON data:', e);
      return false;
    }
  }
};
