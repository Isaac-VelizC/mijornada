import { paymentRepository } from "../db/paymentRepository";
import type { CreatePaymentInput, Payment } from "../types/payment";
import { validateDate, validateOptionalNote } from "../validators/commonValidators";
import { validatePaymentAmount } from "../validators/paymentValidators";
import { AppError } from "./errors";

export const paymentService = {
  async getAll(): Promise<Payment[]> {
    try {
      return await paymentRepository.getAll();
    } catch {
      throw new AppError("DATABASE_ERROR", "No se pudieron cargar los pagos.");
    }
  },

  async getLatest(): Promise<Payment | undefined> {
    try {
      return await paymentRepository.getLatest();
    } catch {
      throw new AppError(
        "DATABASE_ERROR",
        "No se pudo obtener el último pago.",
      );
    }
  },

  async create(input: CreatePaymentInput): Promise<Payment> {
    validateDate(input.date);
    validatePaymentAmount(input.amount);

    const note = validateOptionalNote(input.note);

    try {
      return await paymentRepository.create({
        date: input.date,
        amount: input.amount,
        note,
      });
    } catch {
      throw new AppError("DATABASE_ERROR", "No se pudo registrar el pago.");
    }
  },

  async delete(id: string): Promise<void> {
    if (!id?.trim()) {
      throw new AppError(
        "VALIDATION_ERROR",
        "El identificador del pago es obligatorio.",
      );
    }
    try {
      const existing = await paymentRepository.getById(id);

      if (!existing) {
        throw new AppError(
          "PAYMENT_NOT_FOUND",
          "El pago que intentas eliminar no existe.",
        );
      }

      await paymentRepository.delete(id);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError("DATABASE_ERROR", "No se pudo eliminar el pago.");
    }
  },
};
