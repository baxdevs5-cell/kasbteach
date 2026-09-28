/**
 * Format currency in Uzbek standard:
 * 1 250 000 so'm
 */
export function formatUZS(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return "0 so'm";
  }
  const isNegative = amount < 0;
  const absVal = Math.round(Math.abs(amount));
  const formatted = absVal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${isNegative ? '-' : ''}${formatted} so'm`;
}

/**
 * Uzbek months array
 */
const UZ_MONTHS = [
  'Yanvar',
  'Fevral',
  'Mart',
  'Aprel',
  'May',
  'Iyun',
  'Iyul',
  'Avgust',
  'Sentabr',
  'Oktabr',
  'Noyabr',
  'Dekabr'
];

const UZ_DAYS = [
  'Yakshanba',
  'Dushanba',
  'Seshanba',
  'Chorshanba',
  'Payshanba',
  'Juma',
  'Shanba'
];

/**
 * Format date in Uzbek: e.g. "28-Sentabr, 2026"
 */
export function formatUzbekDate(dateInput: string | Date | number): string {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);

  const day = d.getDate();
  const month = UZ_MONTHS[d.getMonth()];
  const year = d.getFullYear();

  return `${day}-${month}, ${year}`;
}

/**
 * Format full date with day name: e.g. "Dushanba, 28-Sentabr, 2026"
 */
export function formatFullUzbekDate(dateInput: string | Date | number): string {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return String(dateInput);

  const dayName = UZ_DAYS[d.getDay()];
  const day = d.getDate();
  const month = UZ_MONTHS[d.getMonth()];
  const year = d.getFullYear();

  return `${dayName}, ${day}-${month}, ${year}`;
}

/**
 * Format relative deadline helper
 */
export function getRelativeDeadline(dateStr: string): { label: string; isOverdue: boolean; isToday: boolean } {
  if (!dateStr) return { label: 'Muddatsiz', isOverdue: false, isToday: false };

  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      label: `${Math.abs(diffDays)} kun kechikkan`,
      isOverdue: true,
      isToday: false
    };
  } else if (diffDays === 0) {
    return { label: 'Bugun', isOverdue: false, isToday: true };
  } else if (diffDays === 1) {
    return { label: 'Ertaga', isOverdue: false, isToday: false };
  } else {
    return { label: `${diffDays} kundan so‘ng`, isOverdue: false, isToday: false };
  }
}

/**
 * Generate unique IDs with clean prefix
 */
export function generateUniqueId(prefix: string = 'id'): string {
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 6);
  return `${prefix}-${timestamp}${randomPart}`;
}

/**
 * Format clean phone display: +998 90 123 45 67
 */
export function formatPhone(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 9) {
    return `+998 ${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`;
  } else if (digits.length === 12 && digits.startsWith('998')) {
    return `+998 ${digits.slice(3, 5)} ${digits.slice(5, 8)} ${digits.slice(8, 10)} ${digits.slice(10, 12)}`;
  }
  return phone;
}
