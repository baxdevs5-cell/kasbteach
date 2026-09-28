import React, { useState, useMemo } from 'react';
import {
  Wrench,
  Plus,
  Search,
  Clock,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  ShoppingBag
} from 'lucide-react';
import { Service } from '../../types';
import { ServiceModal } from './ServiceModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { formatUZS } from '../../utils/formatters';
import { useToast } from '../common/Toast';

interface ServicesViewProps {
  services: Service[];
  onSaveService: (service: Service) => void;
  onDeleteService: (id: string) => void;
  onCreateOrderWithService: (serviceName: string, price: number) => void;
  targetServiceId?: string;
}

export const ServicesView: React.FC<ServicesViewProps> = ({
  services,
  onSaveService,
  onDeleteService,
  onCreateOrderWithService,
  targetServiceId
}) => {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);

  const { showToast } = useToast();

  const filteredServices = useMemo(() => {
    const q = search.toLowerCase();
    return services.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        (s.description && s.description.toLowerCase().includes(q))
    );
  }, [services, search]);

  const handleConfirmDelete = () => {
    if (serviceToDelete) {
      onDeleteService(serviceToDelete);
      showToast('Xizmat o‘chirildi', 'info');
      setServiceToDelete(null);
    }
  };

  const handleToggleActive = (service: Service) => {
    const updated: Service = { ...service, isActive: !service.isActive };
    onSaveService(updated);
    showToast(updated.isActive ? 'Xizmat faollashtirildi' : 'Xizmat to‘xtatildi', 'info');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
            <span>Xizmatlar Preyskuranti</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-mono font-normal">
              {services.length} ta xizmat
            </span>
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Xizmat turlari, standart narxlar va bajarish muddatlari katalogi
          </p>
        </div>

        <button
          onClick={() => {
            setEditingService(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 self-stretch sm:self-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          <span>+ Yangi xizmat</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Xizmat nomi yoki kategoriya bo‘yicha qidiring..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <Wrench className="w-12 h-12 stroke-1 mx-auto text-neutral-300 dark:text-neutral-600 mb-3" />
            <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Bu yerda hali ma’lumot yo‘q.
            </h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1 mb-4">
              Ko‘rsatadigan xizmatlaringizni qo‘shing va ularni buyurtmalarga tezkor biriktiring.
            </p>
            <button
              onClick={() => {
                setEditingService(null);
                setIsModalOpen(true);
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>+ Yangi qo‘shish</span>
            </button>
          </div>
        ) : (
          filteredServices.map((service) => (
            <div
              key={service.id}
              className={`p-5 rounded-2xl border bg-white dark:bg-neutral-900 shadow-xs flex flex-col justify-between transition-all ${
                service.isActive
                  ? 'border-neutral-200 dark:border-neutral-800'
                  : 'border-neutral-200/50 dark:border-neutral-800/50 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                    {service.category}
                  </span>
                  <button
                    onClick={() => handleToggleActive(service)}
                    className={`text-[11px] font-medium flex items-center gap-1 ${
                      service.isActive
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-neutral-400'
                    }`}
                  >
                    {service.isActive ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Faol
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5" /> To‘xtatilgan
                      </>
                    )}
                  </button>
                </div>

                <h3 className="text-sm font-bold text-neutral-900 dark:text-white leading-snug">
                  {service.name}
                </h3>

                {service.description && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                      Standart narxi
                    </span>
                    <span className="text-base font-bold font-mono tabular-nums text-neutral-900 dark:text-white">
                      {formatUZS(service.price)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                      Muddati
                    </span>
                    <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300 flex items-center gap-1 justify-end">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      {service.duration}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                  <button
                    onClick={() => onCreateOrderWithService(service.name, service.price)}
                    className="flex-1 py-1.5 px-3 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Buyurtma ochish</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingService(service);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      title="Tahrirlash"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setServiceToDelete(service.id)}
                      className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      title="O‘chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Service Modal */}
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(s) => {
          onSaveService(s);
          showToast(editingService ? 'Xizmat yangilandi' : 'Yangi xizmat qo‘shildi', 'success');
        }}
        initialService={editingService}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(serviceToDelete)}
        onClose={() => setServiceToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Xizmatni o‘chirish"
        message="Haqiqatan ham bu xizmatni katalogdan o‘chirmoqchimisiz?"
        confirmLabel="Ha, o‘chirish"
        cancelLabel="Bekor qilish"
        isDestructive={true}
      />
    </div>
  );
};
