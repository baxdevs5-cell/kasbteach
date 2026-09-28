import { ProfessionId, ProfessionMeta } from '../types';

export const PROFESSIONS_LIST: ProfessionMeta[] = [
  {
    id: 'oshpaz',
    label: 'Oshpaz / Restorator',
    emoji: '👨‍🍳',
    description: 'Buyurtmalar, banketlar, menyu, ingredient xarajatlari va taom yetkazib berish hisobi',
    highlightedModules: ['orders', 'finance', 'inventory', 'customers'],
    featuresList: ['Buyurtmalar nazorati', 'Ingredient xarajatlari', 'Taomnoma narxlari', 'Banketlar taqvimi']
  },
  {
    id: 'usta',
    label: 'Usta (Santexnik / Elektrik / Maishiy texnika)',
    emoji: '🔧',
    description: 'Xizmatlar, buyurtmalar, ish materiallari, usta jadvali va to‘lovlar',
    highlightedModules: ['services', 'orders', 'tasks', 'calendar'],
    featuresList: ['Xizmatlar katalogi', 'Chaqiruv buyurtmalari', 'Ish materiallari hisobi', 'Mijozlar manzillari']
  },
  {
    id: 'dasturchi',
    label: 'Dasturchi / Freelancer',
    emoji: '🧑‍💻',
    description: 'Loyihalar, mijozlar, sprint vazifalari, deadline va soatlik ish hisoboti',
    highlightedModules: ['tasks', 'orders', 'finance', 'calendar'],
    featuresList: ['Sprint & Kanban doskasi', 'Loyiha muddatlari', 'Freelance daromadi', 'Mijozlar hisobi']
  },
  {
    id: 'sotuvchi',
    label: 'Sotuvchi / Do‘kon egasi',
    emoji: '🏪',
    description: 'Mahsulotlar ombori, tezkor savdo, kam qolgan tovarlar va savdo foydasi',
    highlightedModules: ['inventory', 'orders', 'finance', 'customers'],
    featuresList: ['Ombor qoldig‘i', 'Kam qolgan tovar ogohlantirishi', 'Savdo kvitansiyalari', 'Sof savdo foydasi']
  },
  {
    id: 'oqituvchi',
    label: 'O‘qituvchi / Repetitor',
    emoji: '📚',
    description: 'O‘quvchilar ro‘yxati, dars jadvali, oylik to‘lovlar va davomat',
    highlightedModules: ['customers', 'calendar', 'finance', 'tasks'],
    featuresList: ['O‘quvchilar guruhi', 'Darslar taqvimi', 'Oylik to‘lov holati', 'Vazifalar nazorati']
  },
  {
    id: 'fotograf',
    label: 'Fotograf / Videograf',
    emoji: '📸',
    description: 'Fotosessiyalar, to‘y va tadbirlar, to‘lovlar, tayyorlash deadline va albomlar',
    highlightedModules: ['calendar', 'orders', 'services', 'finance'],
    featuresList: ['Fotosessiya taqvimi', 'Paket xizmatlar', 'Montaj muddatlari', 'Oldindan to‘lov (avans)']
  },
  {
    id: 'avtoservis',
    label: 'Avtoservis / Avtoustaxona',
    emoji: '🚗',
    description: 'Avtomobillar, ta’mirlash buyurtmalari, ehtiyot qismlar va servis tarixi',
    highlightedModules: ['orders', 'inventory', 'customers', 'finance'],
    featuresList: ['Avtomobil davlat raqami hisobi', 'Ehtiyot qismlar ombori', 'Ta’mirlash dalolatnomasi', 'Xizmatlar to‘lovi']
  },
  {
    id: 'quruvchi',
    label: 'Quruvchi / Pudratchi',
    emoji: '🏗️',
    description: 'Qurilish ob’ektlari, materiallar smetasi, ishchilar to‘lovi va bosqichlar',
    highlightedModules: ['tasks', 'finance', 'inventory', 'orders'],
    featuresList: ['Ob’ektlar rejasi', 'Materiallar smetasi', 'Ishchilar ish haqi', 'Bosqichma-bosqich qabul']
  },
  {
    id: 'buxgalter',
    label: 'Buxgalter / Auditor',
    emoji: '🧾',
    description: 'Moliyaviy hisobotlar, soliq muddatlari, mijozlar fakturalari va daromadlar',
    highlightedModules: ['finance', 'reports', 'customers', 'calendar'],
    featuresList: ['Daromad & Xarajat smetasi', 'Soliq taqvimi', 'Mijozlar hisob-fakturalari', 'Foyda hisoboti']
  },
  {
    id: 'dizayner',
    label: 'Dizayner (Grafik / Interyer / UI/UX)',
    emoji: '🎨',
    description: 'Dizayn loyihalari, mijozlar talablari, muddatlar va xizmat narxlari',
    highlightedModules: ['tasks', 'orders', 'services', 'finance'],
    featuresList: ['Loyiha vazifalari', 'Tahrirlar hisobi', 'Xizmatlar preyskuranti', 'Muddati yaqin loyihalar']
  },
  {
    id: 'sartarosh',
    label: 'Sartarosh / Go‘zallik ustasi',
    emoji: '💇',
    description: 'Mijozlar yoziluvi, xizmatlar narxi, go‘zallik vositalari va kunlik kassa',
    highlightedModules: ['calendar', 'services', 'customers', 'finance'],
    featuresList: ['Mijozlar bandligi', 'Soch & stil xizmatlari', 'Ishlatilgan vositalar', 'Kunlik kassa daromadi']
  },
  {
    id: 'smm',
    label: 'SMM mutaxassisi / Marketolog',
    emoji: '📱',
    description: 'Kontent-reja, mijoz loyihalari, reklama byudjeti va oylik hisobotlar',
    highlightedModules: ['tasks', 'calendar', 'customers', 'reports'],
    featuresList: ['Kontent taqvimi', 'Reklama xarajatlari', 'Mijozlar oylik to‘lovi', 'Natijalar hisoboti']
  },
  {
    id: 'yetkazib_beruvchi',
    label: 'Yetkazib beruvchi / Kuryerlik',
    emoji: '📦',
    description: 'Yetkazish buyurtmalari, yo‘l xarajatlari, mijoz manzillari va yetkazish vaqti',
    highlightedModules: ['orders', 'finance', 'customers', 'tasks'],
    featuresList: ['Yetkazish manzillari', 'Yoqilg‘i xarajatlari', 'Yetkazish holati', 'To‘lov usullari']
  },
  {
    id: 'boshqa',
    label: 'Boshqa mutaxassislik / Yakka tartibdagi tadbirkor',
    emoji: '💼',
    description: 'Universal boshqaruv: mijozlar, buyurtmalar, kassa va vazifalar bitta joyda',
    highlightedModules: ['orders', 'customers', 'finance', 'tasks'],
    featuresList: ['Universal buyurtmalar', 'Mijozlar bazasi', 'Kassa kirim-chiqim', 'Eslatmalar']
  }
];

export function getProfessionMeta(id: ProfessionId): ProfessionMeta {
  const found = PROFESSIONS_LIST.find((p) => p.id === id);
  return found || PROFESSIONS_LIST[PROFESSIONS_LIST.length - 1];
}
