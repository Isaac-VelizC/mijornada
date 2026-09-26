import { format, isValid, parseISO } from "date-fns";

export function getTodayString(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function isValidDateString(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return false;
  }

  return isValid(parseISO(date));
}

export function isFutureDate(date: string): boolean {
  return date > getTodayString();
}
