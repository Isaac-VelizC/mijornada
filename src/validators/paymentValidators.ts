export function validatePaymentAmount(amount?: number): number | undefined {
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
