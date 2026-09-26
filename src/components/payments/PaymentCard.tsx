import {
  Banknote,
  Calendar,
  FileText,
  MoreVertical,
  Trash2,
} from "lucide-react";
import type { Payment } from "../../types/payment";
import { formatCurrency, formatDate } from "../../utils/formatters";

interface PaymentCardProps {
  payment: Payment;
  isLatest?: boolean;
  onDelete: (payment: Payment) => void;
}

export function PaymentCard({
  payment,
  isLatest = false,
  onDelete,
}: PaymentCardProps) {
  return (
    <article
      className={`group relative flex flex-col justify-between rounded-xl border bg-card p-5 transition-all hover:shadow-md ${
        isLatest
          ? "border-primary/40 ring-1 ring-primary/20 shadow-2xs"
          : "border-border"
      }`}
    >
      <div>
        {/* Cabecera: Fecha y Badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold capitalize text-muted-foreground">
            <Calendar className="size-3.5 shrink-0 text-muted-foreground" />
            <span>{formatDate(payment.date)}</span>
          </div>

          <div className="flex items-center gap-2">
            {isLatest && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary shrink-0">
                Último pago
              </span>
            )}

            {/* Menú de Acciones */}
            <details className="group/menu relative shrink-0">
              <summary
                className="flex size-8 cursor-pointer list-none items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors [&::-webkit-details-marker]:hidden"
                aria-label="Opciones del pago"
              >
                <MoreVertical className="size-4" />
              </summary>

              <div className="absolute right-0 top-9 z-20 min-w-28 rounded-xl border border-border bg-card p-1 shadow-lg animate-in fade-in-0 zoom-in-95">
                <button
                  type="button"
                  onClick={(e) => {
                    // Cerrar el menú al hacer clic
                    e.currentTarget.closest("details")?.removeAttribute("open");
                    onDelete(payment);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="size-3.5" />
                  Eliminar
                </button>
              </div>
            </details>
          </div>
        </div>

        {/* Monto del Pago */}
        <div className="mt-3">
          {payment.amount ? (
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {formatCurrency(payment.amount)}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Banknote className="size-4" />
              <span>Sin monto registrado</span>
            </div>
          )}
        </div>

        {/* Nota opcional */}
        {payment.note && (
          <div className="mt-3 flex items-start gap-1.5 rounded-lg bg-muted/40 p-2.5 text-xs text-muted-foreground">
            <FileText className="size-3.5 shrink-0 mt-0.5" />
            <p className="line-clamp-2">{payment.note}</p>
          </div>
        )}
      </div>
    </article>
  );
}

export default PaymentCard;
