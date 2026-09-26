import { isFutureDate, isValidDateString } from "../utils/dates";

export function validateRequiredString(
  value: string,
  fieldName: string,
): string {
  const normalized = value.trim();

  if (!normalized) {
    throw new Error(`${fieldName} es obligatorio`);
  }

  return normalized;
}

export function validateId(id: string): string {
  return validateRequiredString(id, "El identificador");
}

export function validateDate(date: string): string {
  const normalized = date.trim();

  if (!normalized) {
    throw new Error("La fecha es obligatoria");
  }

  if (!isValidDateString(normalized)) {
    throw new Error("La fecha no es válida");
  }

  if (isFutureDate(normalized)) {
    throw new Error("No puedes registrar una fecha futura");
  }

  return normalized;
}

export function validateOptionalNote(note?: string): string | undefined {
  if (note === undefined) {
    return undefined;
  }

  const normalized = note.trim();

  if (normalized.length > 500) {
    throw new Error("La nota no puede superar los 500 caracteres");
  }

  return normalized || undefined;
}

export function validateOptionalAmount(amount?: number): number | undefined {
  if (amount === undefined) {
    return undefined;
  }

  if (!Number.isFinite(amount)) {
    throw new Error("El monto debe ser un número válido");
  }

  if (amount < 0) {
    throw new Error("El monto no puede ser negativo");
  }

  if (amount > 1_000_000) {
    throw new Error("El monto supera el límite permitido");
  }

  return amount;
}
