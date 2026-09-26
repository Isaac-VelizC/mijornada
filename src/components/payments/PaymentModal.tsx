import { useState } from "react";
import { format } from "date-fns";
import Dialog from "../ui/Dialog";
import { paymentService } from "../../services/paymentService";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { AlertCircle, Banknote, Calendar, FileText } from "lucide-react";
import { Textarea } from "../ui/Textarea";

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

function getTodayString() {
  return format(new Date(), "yyyy-MM-dd");
}

export function PaymentModal({ open, onClose, onSaved }: PaymentModalProps) {
  const [date, setDate] = useState(getTodayString());
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sincronización de estado durante la fase de render para evitar cascading renders
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setDate(getTodayString());
      setAmount("");
      setNote("");
      setError(null);
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      const parsedAmount = amount.trim() === "" ? undefined : Number(amount);

      await paymentService.create({
        date,
        amount: parsedAmount,
        note,
      });

      onSaved();
    } catch (err) {
      console.error("Error saving payment:", err);

      setError(
        err instanceof Error
          ? err.message
          : "No se pudo registrar el pago."
      );
    } finally {
      setLoading(false);
    }
  };

  const today = getTodayString();

  const footerActions = (
    <div className="flex items-center justify-end gap-2.5">
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
        disabled={loading}
      >
        Cancelar
      </Button>

      <Button
        type="submit"
        form="payment-form"
        loading={loading}
      >
        Registrar pago
      </Button>
    </div>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      loading={loading}
      title="Nuevo pago"
      description="Registra la fecha en la que recibiste tu pago."
      footer={footerActions}
      className="max-w-md"
    >
      <form id="payment-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Campo Fecha */}
        <div className="space-y-1">
          <Input
            id="payment-date"
            type="date"
            label="Fecha"
            icon={Calendar}
            value={date}
            max={today}
            onChange={(e) => setDate(e.target.value)}
            disabled={loading}
            required
          />
          <p className="text-[11px] text-muted-foreground">
            Puedes registrar un pago de una fecha anterior si olvidaste registrarlo.
          </p>
        </div>

        {/* Campo Monto con prefijo visual */}
        <div className="space-y-1.5 w-full">
          <label
            htmlFor="payment-amount"
            className="text-xs font-semibold text-foreground flex items-center gap-1.5"
          >
            <Banknote className="size-3.5 text-muted-foreground" />
            Monto
            <span className="font-normal text-muted-foreground text-[11px]">
              (opcional)
            </span>
          </label>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
              Bs
            </span>

            <input
              id="payment-amount"
              type="number"
              min="0"
              max="1000000"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
              placeholder="0.00"
              className="w-full rounded-xl border border-border bg-card pl-9 pr-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        {/* Campo Nota Opcional */}
        <Textarea
          id="payment-note"
          label="Nota"
          icon={FileText}
          optionalText="opcional"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={500}
          rows={3}
          disabled={loading}
          placeholder="Ej. Pago correspondiente a septiembre..."
        />

        {/* Mensaje de Error */}
        {error && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive animate-in fade-in-0"
          >
            <AlertCircle className="size-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </form>
    </Dialog>
  );
}

export default PaymentModal;