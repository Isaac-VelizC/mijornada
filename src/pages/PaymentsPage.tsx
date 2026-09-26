import { useState, useCallback } from "react";
import { Plus, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import type { Payment } from "../types/payment";
import { paymentService } from "../services/paymentService";
import { Button } from "../components/ui/Button";
import PaymentList from "../components/payments/PaymentList";
import PaymentModal from "../components/payments/PaymentModal";
import ConfirmDialog from "../components/ui/ConfirmDialog";

export function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadPayments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await paymentService.getAll();
      setPayments(data);
    } catch (err) {
      console.error("Error loading payments:", err);
      setError(
        err instanceof Error ? err.message : "No se pudieron cargar los pagos.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Inicialización segura sin warnings de efectos sincronos ejecutando setState
  const [initialized, setInitialized] = useState(false);
  if (!initialized) {
    setInitialized(true);
    void loadPayments();
  }

  const handleCreate = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSaved = async () => {
    handleCloseModal();
    await loadPayments();
  };

  const handleDelete = (payment: Payment) => {
    setPaymentToDelete(payment);
  };

  const handleCancelDelete = () => {
    if (deleting) return;
    setPaymentToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!paymentToDelete || deleting) return;

    try {
      setDeleting(true);
      setError(null);
      await paymentService.delete(paymentToDelete.id);
      setPaymentToDelete(null);
      await loadPayments();
    } catch (err) {
      console.error("Error deleting payment:", err);
      setError(
        err instanceof Error ? err.message : "No se pudo eliminar el pago.",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Pagos
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Registra las fechas en las que recibes tus pagos.
          </p>
        </div>

        <Button type="button" onClick={handleCreate}>
          <Plus className="size-4" />
          Nuevo pago
        </Button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border p-12 text-center gap-3">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Cargando pagos...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/10 p-8 text-center gap-3">
          <div className="flex items-center gap-2 text-destructive text-sm font-medium">
            <AlertCircle className="size-8 text-destructive" />
            <p className="text-sm font-medium text-destructive max-w-md">
              {error}
            </p>
          </div>
          <Button variant="outline" onClick={() => void loadPayments()}>
            <RefreshCw className="size-4" />
            Reintentar
          </Button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && payments.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center flex flex-col items-center justify-center space-y-4">
          <div className="space-y-1 max-w-sm">
            <h3 className="font-semibold text-lg text-foreground">
              No hay pagos registrados
            </h3>
            <p className="text-sm text-muted-foreground">
              Registra tu primer pago para comenzar a controlar tus períodos de
              trabajo.
            </p>
          </div>
          <Button onClick={handleCreate}>
            <Plus className="size-4" />
            Registrar pago
          </Button>
        </div>
      )}

      {/* Content */}
      {!loading && !error && payments.length > 0 && (
        <PaymentList payments={payments} onDelete={handleDelete} />
      )}

      <PaymentModal
        open={modalOpen}
        onClose={handleCloseModal}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={paymentToDelete !== null}
        title="Eliminar pago"
        description={
          paymentToDelete
            ? `¿Deseas eliminar el pago registrado el ${paymentToDelete.date}? Esta acción no se puede deshacer.`
            : ""
        }
        confirmLabel="Eliminar pago"
        cancelLabel="Cancelar"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </section>
  );
}

export default PaymentsPage;
