import { workDayRepository } from "../db/workDayRepository";
import type {
  CreateWorkDayInput,
  UpdateWorkDayInput,
  WorkDay,
} from "../types/workDay";
import { validateDate, validateOptionalNote } from "../validators/commonValidators";
import { normalizeWorkDayHours } from "../validators/workDayValidators";
import { AppError } from "./errors";

const MAX_HOURS_PER_DAY = 24;

const validateHours = (hours: number): void => {
  if (!Number.isFinite(hours)) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Las horas deben ser un número válido.",
    );
  }

  if (hours < 0) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Las horas no pueden ser negativas.",
    );
  }

  if (hours > MAX_HOURS_PER_DAY) {
    throw new AppError(
      "VALIDATION_ERROR",
      `Las horas no pueden superar ${MAX_HOURS_PER_DAY} por día.`,
    );
  }
};

export const workDayService = {
  async getAll(): Promise<WorkDay[]> {
    try {
      return await workDayRepository.getAll();
    } catch {
      throw new AppError(
        "DATABASE_ERROR",
        "No se pudieron cargar las jornadas.",
      );
    }
  },

  async getByDate(date: string): Promise<WorkDay | undefined> {
    validateDate(date);

    try {
      return await workDayRepository.getByDate(date);
    } catch {
      throw new AppError("DATABASE_ERROR", "No se pudo consultar la jornada.");
    }
  },

  async create(input: CreateWorkDayInput): Promise<WorkDay> {
    validateDate(input.date);

    const hours = normalizeWorkDayHours(input.type, input.hours);

    validateHours(hours);

    const note = validateOptionalNote(input.note);

    try {
      const existing = await workDayRepository.getByDate(input.date);

      if (existing) {
        throw new AppError(
          "DUPLICATE_WORK_DAY",
          "Ya existe una jornada registrada para esta fecha.",
        );
      }

      return await workDayRepository.create({
        ...input,
        hours,
        note,
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError("DATABASE_ERROR", "No se pudo guardar la jornada.");
    }
  },

  async update(id: string, input: UpdateWorkDayInput): Promise<WorkDay> {
    if (!id?.trim()) {
      throw new AppError(
        "VALIDATION_ERROR",
        "El identificador de la jornada es obligatorio.",
      );
    }

    if (input.date !== undefined) {
      validateDate(input.date);
    }

    if (input.hours !== undefined) {
      validateHours(input.hours);
    }

    const note = validateOptionalNote(input.note);

    try {
      const existing = await workDayRepository.getById(id);

      if (!existing) {
        throw new AppError(
          "WORK_DAY_NOT_FOUND",
          "La jornada que intentas modificar no existe.",
        );
      }

      const type = input.type ?? existing.type;

      const hours =
        input.type !== undefined
          ? normalizeWorkDayHours(type, input.hours ?? existing.hours)
          : (input.hours ?? existing.hours);

      validateHours(hours);

      if (input.date !== undefined && input.date !== existing.date) {
        const sameDate = await workDayRepository.getByDate(input.date);

        if (sameDate && sameDate.id !== id) {
          throw new AppError(
            "DUPLICATE_WORK_DAY",
            "Ya existe otra jornada para esa fecha.",
          );
        }
      }

      return await workDayRepository.update(id, {
        ...input,
        hours,
        note,
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError("DATABASE_ERROR", "No se pudo actualizar la jornada.");
    }
  },

  async delete(id: string): Promise<void> {
    if (!id?.trim()) {
      throw new AppError(
        "VALIDATION_ERROR",
        "El identificador de la jornada es obligatorio.",
      );
    }

    try {
      const existing = await workDayRepository.getById(id);

      if (!existing) {
        throw new AppError(
          "WORK_DAY_NOT_FOUND",
          "La jornada que intentas eliminar no existe.",
        );
      }

      await workDayRepository.delete(id);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError("DATABASE_ERROR", "No se pudo eliminar la jornada.");
    }
  },
};
