import type { WorkDayType } from "../types/workDay";

const FULL_DAY_HOURS = 8;
const HALF_DAY_HOURS = 4;
const MAX_HOURS_PER_DAY = 24;

const VALID_TYPES: WorkDayType[] = ["full", "half", "hours", "absent"];

export function validateWorkDayType(type: WorkDayType): void {
  if (!VALID_TYPES.includes(type)) {
    throw new Error("El tipo de jornada no es válido");
  }
}

export function normalizeWorkDayHours(
  type: WorkDayType,
  hours: number,
): number {
  validateWorkDayType(type);

  switch (type) {
    case "full":
      return FULL_DAY_HOURS;

    case "half":
      return HALF_DAY_HOURS;

    case "absent":
      return 0;

    case "hours":
      if (!Number.isFinite(hours)) {
        throw new Error("Las horas deben ser un número válido");
      }

      if (hours < 0 || hours > MAX_HOURS_PER_DAY) {
        throw new Error(`Las horas deben estar entre 0 y ${MAX_HOURS_PER_DAY}`);
      }

      return hours;
  }
}
