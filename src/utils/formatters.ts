import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Formatea un número como moneda en formato BOB (Bolivianos).
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: "BOB",
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Formatea fechas ISO a un formato legible en español.
 * Ej: "viernes, 25 de septiembre de 2026"
 */
export function formatDate(dateString: string, pattern = "EEEE, d 'de' MMMM 'de' yyyy"): string {
  if (!dateString) return "";
  try {
    return format(parseISO(dateString), pattern, { locale: es });
  } catch {
    return dateString;
  }
}