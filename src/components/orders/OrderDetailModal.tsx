import React from 'react';
import {
  X,
  Printer,
  CreditCard,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  User,
  Phone,
  FileText
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { formatUZS, formatUzbekDate, getRelativeDeadline } from '../../utils/formatters';

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  onEdit: (order: Order) => void;
  onDelete: (orderId: string) => void;
  onOpenPayment: (order: Order) => void;
  onOpenInvoice: (order: Order) => void;
  onChangeStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  isOpen,
  onClose,
  order,
  onEdit,
  onDelete,
  onOpenPayment,
  onOpenInvoice,
  onChangeStatus
}) => {
  if (!isOpen || !order) return null;

  const deadlineInfo = getRelativeDeadline(order.deadline);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Buyurtma #${order.orderNumber}`}
      subtitle={`${order.customerName} · ${formatUzbekDate(order.createdDate)}`}
      maxWidth="lg"
    >
      <div className="space-y-5">
        {/* Status header & quick actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">Holat:</span>
            <select
              value={order.orderStatus}
              onChange={(e) => onChangeStatus(order.id, e.target.value as OrderStatus)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200"
            >
              <option value="yangi">Yangi</option>
              <option value="jarayonda">Jarayonda</option>
              <option value="kutilmoqda">Kutilmoqda</option>
              <option value="tugallangan">Tugallangan</option>
              <option value="bekor_qilingan">Bekor qilingan</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Badge type="payment" status={order.paymentStatus} />
          </div>
        </div>

        {/* Customer & Deadline Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Mijoz</span>
            <div className="font-semibold text-neutral-900 dark:text-white text-sm">
              {order.customerName}
            </div>
            {order.customerPhone && (
              <div className="text-neutral-500 font-mono">{order.customerPhone}</div>
            )}
          </div>

          <div className="p-3.5 rounded-xl border border-neutral-100 dark:border-neutral-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-neutral-400 block">Muddati</span>
            <div className="font-semibold text-neutral-900 dark:text-white text-sm flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-neutral-400" />
              <span>{formatUzbekDate(order.deadline)}</span>
            </div>
            <div className={`text-[11px] font-medium ${deadlineInfo.isOverdue ? 'text-rose-600' : 'text-neutral-500'}`}>
              {deadlineInfo.label}
            </div>
          </div>
        </div>

        {/* Product / Service Description */}
        <div className="p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
          <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">
            Xizmat / Tovar
          </span>
          <div className="text-sm font-semibold text-neutral-900 dark:text-white">
            {order.serviceOrProduct}
          </div>
          {order.description && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
              {order.description}
            </p>
          )}
          {order.notes && (
            <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500 flex items-start gap-1.5">
              <FileText className="w-3.5 h-3.5 text-neutral-400 mt-0.5 shrink-0" />
              <span>{order.notes}</span>
            </div>
          )}
        </div>

        {/* Financial Breakdown Card */}
        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-800 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-neutral-500">Miqdori va birlik narxi:</span>
            <span className="font-mono tabular-nums">
              {order.quantity} × {formatUZS(order.unitPrice)}
            </span>
          </div>

          {order.discount > 0 && (
            <div className="flex justify-between text-rose-600">
              <span>Chegirma:</span>
              <span className="font-mono tabular-nums">-{formatUZS(order.discount)}</span>
            </div>
          )}

          <div className="flex justify-between text-sm font-bold text-neutral-900 dark:text-white pt-2 border-t border-neutral-200 dark:border-neutral-700">
            <span>Yakuniy summa:</span>
            <span className="font-mono tabular-nums text-blue-600 dark:text-blue-400">
              {formatUZS(order.finalPrice)}
            </span>
          </div>

          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
            <span>To‘langan summa:</span>
            <span className="font-mono tabular-nums">{formatUZS(order.paidAmount)}</span>
          </div>

          <div className="flex justify-between text-rose-600 dark:text-rose-400 font-bold pt-1 border-t border-neutral-200 dark:border-neutral-700">
            <span>Qoldiq to‘lov:</span>
            <span className="font-mono tabular-nums">{formatUZS(order.remainingAmount)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onOpenPayment(order)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>To‘lov kiritish</span>
            </button>

            <button
              onClick={() => onOpenInvoice(order)}
              className="px-3.5 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Kvitansiya chop etish</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onEdit(order)}
              className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
              title="Tahrirlash"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(order.id)}
              className="p-2 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
              title="O‘chirish"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
