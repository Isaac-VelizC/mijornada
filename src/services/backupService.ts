import { db } from "../db/database";
import { BACKUP_VERSION, type AppBackup } from "../types/backup";
import { validateBackup } from "../validators/backupValidators";
import { AppError } from "./errors";

export interface BackupInfo {
  fileName: string;
  exportedAt: string;
  workDays: number;
  payments: number;
}

export const backupService = {
  async readFile(file: File): Promise<{ backup: AppBackup; info: BackupInfo }> {
    try {
      if (!file.name.toLowerCase().endsWith(".json")) {
        throw new AppError(
          "VALIDATION_ERROR",
          "El archivo seleccionado debe ser un archivo JSON.",
        );
      }

      const text = await file.text();

      let parsed: unknown;

      try {
        parsed = JSON.parse(text);
      } catch {
        throw new AppError(
          "VALIDATION_ERROR",
          "El archivo no contiene un JSON válido.",
        );
      }

      const backup = validateBackup(parsed);

      return {
        backup,
        info: {
          fileName: file.name,
          exportedAt: backup.exportedAt,
          workDays: backup.workDays.length,
          payments: backup.payments.length,
        },
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      console.error("Error reading backup:", error);

      throw new AppError(
        "VALIDATION_ERROR",
        "No se pudo leer la copia de seguridad.",
      );
    }
  },

  async export(): Promise<void> {
    try {
      const [workDays, payments] = await Promise.all([
        db.workDays.toArray(),
        db.payments.toArray(),
      ]);

      const backup: AppBackup = {
        version: BACKUP_VERSION,
        app: "mi-jornada",
        exportedAt: new Date().toISOString(),
        workDays,
        payments,
      };

      const json = JSON.stringify(backup, null, 2);

      const blob = new Blob([json], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `mi-jornada-backup-${getFileDate()}.json`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting backup:", error);

      throw new AppError(
        "DATABASE_ERROR",
        "No se pudo crear la copia de seguridad.",
      );
    }
  },

  async import(
    backup: AppBackup,
  ): Promise<{ workDays: number; payments: number }> {
    try {
      await db.transaction("rw", db.workDays, db.payments, async () => {
        await db.workDays.clear();
        await db.payments.clear();

        if (backup.workDays.length > 0) {
          await db.workDays.bulkAdd(backup.workDays);
        }

        if (backup.payments.length > 0) {
          await db.payments.bulkAdd(backup.payments);
        }
      });

      return {
        workDays: backup.workDays.length,
        payments: backup.payments.length,
      };
    } catch (error) {
      console.error("Error importing backup:", error);

      throw new AppError(
        "DATABASE_ERROR",
        "No se pudo restaurar la copia de seguridad.",
      );
    }
  },
};

function getFileDate(): string {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
