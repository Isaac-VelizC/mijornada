import { paymentRepository } from "../db/paymentRepository";
import { workDayRepository } from "../db/workDayRepository";
import type { WorkSummary } from "../types/summary";
import { calculateWorkSummary } from "../utils/calculations";
import { AppError } from "./errors";

export const summaryService = {
  async getCurrent(): Promise<WorkSummary> {
    try {
      const lastPayment = await paymentRepository.getLatest();

      const workDays = lastPayment
        ? await workDayRepository.getAfterDate(lastPayment.date)
        : await workDayRepository.getAll();

      return calculateWorkSummary(workDays, lastPayment);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError(
        "DATABASE_ERROR",
        "No se pudo calcular el resumen de trabajo",
      );
    }
  },
};
