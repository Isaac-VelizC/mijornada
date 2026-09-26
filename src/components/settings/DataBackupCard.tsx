import { useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Download,
  Upload,
} from "lucide-react";

import { backupService, type BackupInfo } from "../../services/backupService";
import ConfirmDialog from "../ui/ConfirmDialog";
import type { AppBackup } from "../../types/backup";
import { Button } from "../ui/Button";

function DataBackupCard() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [backupToRestore, setBackupToRestore] = useState<{
    backup: AppBackup;
    info: BackupInfo;
  } | null>(null);

  const handleExport = async () => {
    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      await backupService.export();

      setMessage("La copia de seguridad se descargó correctamente.");
    } catch (error) {
      console.error("Error exporting backup:", error);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo exportar la copia.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectFile = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      setMessage(null);

      const result = await backupService.readFile(file);

      setBackupToRestore(result);
    } catch (error) {
      console.error("Error reading backup:", error);

      setError(
        error instanceof Error ? error.message : "No se pudo leer la copia.",
      );
    } finally {
      setLoading(false);
      event.target.value = "";
    }
  };

  const handleImport = async () => {
    if (!backupToRestore || loading) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await backupService.import(backupToRestore.backup);

      setBackupToRestore(null);

      setMessage(
        `Copia restaurada correctamente: ${result.workDays} jornadas y ${result.payments} pagos.`,
      );

      window.location.reload();
    } catch (error) {
      console.error("Error importing backup:", error);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo restaurar la copia.",
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <section className="rounded-xl border border-border bg-card p-6 shadow-xs">
        {/* Encabezado */}
        <div className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Database className="size-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">
              Datos y copias de seguridad
            </h2>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              Guarda una copia de tus jornadas y pagos para poder restaurarlos
              si pierdes los datos del navegador o cambias de dispositivo.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button
            type="button"
            onClick={() => void handleExport()}
            disabled={loading}
            variant="outline"
          >
            <Download className="size-4" />

            {loading ? "Procesando..." : "Exportar copia"}
          </Button>

          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
          >
            <Upload className="size-4" />
            Importar copia
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleSelectFile}
          className="hidden"
        />

        {/* Mensaje de Éxito */}
        {message && (
          <div
            role="status"
            className="mt-4 flex items-center gap-2.5 rounded-xl border border-success/30 bg-success/10 p-3.5 text-xs font-medium text-success animate-in fade-in-0"
          >
            <CheckCircle2 className="size-4 shrink-0" />
            <p>{message}</p>
          </div>
        )}

        {/* Mensaje de Error */}
        {error && (
          <div
            role="alert"
            className="mt-4 flex items-center gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-xs font-medium text-destructive animate-in fade-in-0"
          >
            <AlertTriangle className="size-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </section>

      <ConfirmDialog
        open={backupToRestore !== null}
        title="Restaurar copia de seguridad"
        description={
          backupToRestore
            ? `La copia "${backupToRestore.info.fileName}" contiene ${backupToRestore.info.workDays} jornadas y ${backupToRestore.info.payments} pagos. Al restaurarla, los datos actuales serán reemplazados. Esta acción no se puede deshacer.`
            : ""
        }
        confirmLabel="Restaurar copia"
        cancelLabel="Cancelar"
        loading={loading}
        onConfirm={() => void handleImport()}
        onCancel={() => {
          if (!loading) {
            setBackupToRestore(null);
          }
        }}
      />
    </>
  );
}

export default DataBackupCard;
