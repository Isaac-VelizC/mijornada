import { BACKUP_VERSION, type AppBackup } from "../types/backup";

import type { Payment } from "../types/payment";
import type { WorkDay } from "../types/workDay";

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isValidDateString(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00`);

  return !Number.isNaN(date.getTime());
}

function isValidIsoDate(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  const date = new Date(value);

  return !Number.isNaN(date.getTime());
}

function isWorkDay(value: unknown): value is WorkDay {
  if (!isObject(value)) {
    return false;
  }

  if (typeof value.id !== "string" || value.id.trim() === "") {
    return false;
  }

  if (!isValidDateString(value.date)) {
    return false;
  }

  if (
    value.type !== "full" &&
    value.type !== "half" &&
    value.type !== "hours" &&
    value.type !== "absent"
  ) {
    return false;
  }

  if (
    typeof value.hours !== "number" ||
    !Number.isFinite(value.hours) ||
    value.hours < 0 ||
    value.hours > 24
  ) {
    return false;
  }

  if (
    value.note !== undefined &&
    (typeof value.note !== "string" || value.note.length > 500)
  ) {
    return false;
  }

  if (!isValidIsoDate(value.createdAt)) {
    return false;
  }

  if (!isValidIsoDate(value.updatedAt)) {
    return false;
  }

  switch (value.type) {
    case "full":
      if (value.hours !== 8) {
        return false;
      }
      break;

    case "half":
      if (value.hours !== 4) {
        return false;
      }
      break;

    case "absent":
      if (value.hours !== 0) {
        return false;
      }
      break;

    case "hours":
      break;
  }

  return true;
}

function isPayment(value: unknown): value is Payment {
  if (!isObject(value)) {
    return false;
  }

  if (typeof value.id !== "string" || value.id.trim() === "") {
    return false;
  }

  if (!isValidDateString(value.date)) {
    return false;
  }

  if (
    value.amount !== undefined &&
    (typeof value.amount !== "number" ||
      !Number.isFinite(value.amount) ||
      value.amount < 0 ||
      value.amount > 1_000_000)
  ) {
    return false;
  }

  if (
    value.note !== undefined &&
    (typeof value.note !== "string" || value.note.length > 500)
  ) {
    return false;
  }

  if (!isValidIsoDate(value.createdAt)) {
    return false;
  }

  return true;
}

function hasDuplicateWorkDayDates(workDays: WorkDay[]): boolean {
  const dates = new Set<string>();

  for (const workDay of workDays) {
    if (dates.has(workDay.date)) {
      return true;
    }

    dates.add(workDay.date);
  }

  return false;
}

export function validateBackup(value: unknown): AppBackup {
  if (!isObject(value)) {
    throw new Error("El archivo de respaldo no tiene un formato válido.");
  }

  if (value.app !== "mi-jornada") {
    throw new Error("El archivo no pertenece a Mi Jornada.");
  }

  if (value.version !== BACKUP_VERSION) {
    throw new Error(
      `Versión de respaldo no compatible. Se esperaba la versión ${BACKUP_VERSION}.`,
    );
  }

  if (!isValidIsoDate(value.exportedAt)) {
    throw new Error("El respaldo no contiene una fecha de exportación válida.");
  }

  if (!Array.isArray(value.workDays)) {
    throw new Error("El respaldo no contiene una lista válida de jornadas.");
  }

  if (!Array.isArray(value.payments)) {
    throw new Error("El respaldo no contiene una lista válida de pagos.");
  }

  if (!value.workDays.every(isWorkDay)) {
    throw new Error("El respaldo contiene jornadas con datos inválidos.");
  }

  if (!value.payments.every(isPayment)) {
    throw new Error("El respaldo contiene pagos con datos inválidos.");
  }

  if (hasDuplicateWorkDayDates(value.workDays)) {
    throw new Error(
      "El respaldo contiene jornadas duplicadas para una misma fecha.",
    );
  }

  return {
    version: value.version,
    app: value.app,
    exportedAt: value.exportedAt,
    workDays: value.workDays,
    payments: value.payments,
  };
}
