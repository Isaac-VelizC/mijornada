import { CalendarDays, CircleDollarSign, Info } from "lucide-react";
import type { Payment } from "../../types/payment";
import { formatCurrency, formatDate } from "../../utils/formatters";

interface LastPaymentCardProps {
  payment?: Payment;
}

export function LastPaymentCard({ payment }: LastPaymentCardProps) {
  /* ESTADO: SIN REGISTRO DE PAGOS */
  if (!payment) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card/50 p-6 transition-all hover:bg-card">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarDays className="size-5" />
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-foreground">
              Último pago registrado
            </h3>
            <p className="text-sm text-muted-foreground">
              Todavía no has registrado ningún pago en el sistema.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground bg-muted/60 rounded-lg px-3 py-2 w-fit">
              <Info className="size-3.5 shrink-0 text-primary" />
              <span>
                Registra tu primer pago para comenzar a calcular tus jornadas
                actuales.
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ESTADO: PAGO ENCONTRADO */
  const formattedDate = formatDate(payment.date);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-2xs hover:shadow-md transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Info Fecha y Nota */}
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform group-hover:scale-105">
            <CalendarDays className="size-5" />
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Último pago
            </span>

            <p className="mt-0.5 text-base sm:text-lg font-semibold text-foreground capitalize">
              {formattedDate}
            </p>

            {payment.note && (
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {payment.note}
              </p>
            )}
          </div>
        </div>

        {/* Monto Destacado */}
        {payment.amount !== undefined && (
          <div className="flex items-center gap-2 self-start sm:self-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl px-4 py-2 font-bold text-base sm:text-lg tracking-tight">
            <CircleDollarSign className="size-5 shrink-0" />
            <span>{formatCurrency(payment.amount)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default LastPaymentCard;
