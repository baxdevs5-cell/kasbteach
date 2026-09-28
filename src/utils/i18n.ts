export type Language = 'uz' | 'ru' | 'en';

export const translations = {
  uz: {
    appName: 'SmartKasb Assistant',
    tagline: 'Kasbingizni boshqaring. Vaqtingizni tejang.',
    nav: {
      dashboard: 'Bosh sahifa',
      analytics: 'Analitika',
      customers: 'Mijozlar',
      orders: 'Buyurtmalar',
      inventory: 'Ombor & Mahsulotlar',
      services: 'Xizmatlar',
      finance: 'Kirim & Chiqim',
      tasks: 'Vazifalar',
      calendar: 'Taqvim',
      reminders: 'Eslatmalar',
      reports: 'Hisobotlar',
      profile: 'Profil',
      settings: 'Sozlamalar'
    },
    common: {
      search: 'Qidiruv...',
      add: 'Qo‘shish',
      edit: 'Tahrirlash',
      delete: 'O‘chirish',
      save: 'Saqlash',
      cancel: 'Bekor qilish',
      close: 'Yopish',
      filter: 'Filtr',
      export: 'Eksport (CSV)',
      print: 'Chop etish / Kvitansiya',
      status: 'Holat',
      all: 'Barchasi',
      details: 'Batafsil',
      actions: 'Amallar',
      noData: 'Bu yerda hali ma’lumot yo‘q.',
      today: 'Bugun',
      thisWeek: 'Shu hafta',
      thisMonth: 'Shu oy',
      lastMonth: 'O‘tgan oy',
      last3Months: 'Oxirgi 3 oy',
      thisYear: 'Shu yil',
      customRange: 'Boshqa muddat'
    },
    stats: {
      todayIncome: 'Bugungi daromad',
      monthlyIncome: 'Oylik daromad',
      expenses: 'Xarajatlar',
      netProfit: 'Sof foyda',
      activeOrders: 'Faol buyurtmalar',
      totalCustomers: 'Jami mijozlar',
      pendingTasks: 'Bajarilmagan vazifalar',
      todayMeetings: 'Bugungi uchrashuvlar'
    }
  },
  ru: {
    appName: 'SmartKasb Assistant',
    tagline: 'Управляйте делом. Экономьте время.',
    nav: {
      dashboard: 'Главная',
      analytics: 'Аналитика',
      customers: 'Клиенты',
      orders: 'Заказы',
      inventory: 'Склад и товары',
      services: 'Услуги',
      finance: 'Доходы и расходы',
      tasks: 'Задачи',
      calendar: 'Календарь',
      reminders: 'Напоминания',
      reports: 'Отчеты',
      profile: 'Профиль',
      settings: 'Настройки'
    },
    common: {
      search: 'Поиск...',
      add: 'Добавить',
      edit: 'Редактировать',
      delete: 'Удалить',
      save: 'Сохранить',
      cancel: 'Отмена',
      close: 'Закрыть',
      filter: 'Фильтр',
      export: 'Экспорт (CSV)',
      print: 'Печать / Квитанция',
      status: 'Статус',
      all: 'Все',
      details: 'Подробнее',
      actions: 'Действия',
      noData: 'Здесь пока нет данных.',
      today: 'Сегодня',
      thisWeek: 'На этой неделе',
      thisMonth: 'В этом месяце',
      lastMonth: 'Прошлый месяц',
      last3Months: 'Последние 3 месяца',
      thisYear: 'Этот год',
      customRange: 'Выбрать период'
    },
    stats: {
      todayIncome: 'Доход за сегодня',
      monthlyIncome: 'Доход за месяц',
      expenses: 'Расходы',
      netProfit: 'Чистая прибыль',
      activeOrders: 'Активные заказы',
      totalCustomers: 'Всего клиентов',
      pendingTasks: 'Незавершенные задачи',
      todayMeetings: 'Встречи на сегодня'
    }
  },
  en: {
    appName: 'SmartKasb Assistant',
    tagline: 'Manage your trade. Save your time.',
    nav: {
      dashboard: 'Dashboard',
      analytics: 'Analytics',
      customers: 'Customers',
      orders: 'Orders',
      inventory: 'Inventory',
      services: 'Services',
      finance: 'Income & Expense',
      tasks: 'Tasks',
      calendar: 'Calendar',
      reminders: 'Reminders',
      reports: 'Reports',
      profile: 'Profile',
      settings: 'Settings'
    },
    common: {
      search: 'Search...',
      add: 'Add new',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
      filter: 'Filter',
      export: 'Export (CSV)',
      print: 'Print / Receipt',
      status: 'Status',
      all: 'All',
      details: 'Details',
      actions: 'Actions',
      noData: 'No records found here yet.',
      today: 'Today',
      thisWeek: 'This week',
      thisMonth: 'This month',
      lastMonth: 'Last month',
      last3Months: 'Last 3 months',
      thisYear: 'This year',
      customRange: 'Custom range'
    },
    stats: {
      todayIncome: "Today's Income",
      monthlyIncome: 'Monthly Income',
      expenses: 'Expenses',
      netProfit: 'Net Profit',
      activeOrders: 'Active Orders',
      totalCustomers: 'Total Customers',
      pendingTasks: 'Pending Tasks',
      todayMeetings: "Today's Meetings"
    }
  }
};

export function getTranslation(lang: Language = 'uz') {
  return translations[lang] || translations.uz;
}
