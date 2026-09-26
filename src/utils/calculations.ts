import type { Payment } from "../types/payment";
import type { WorkSummary } from "../types/summary";
import type { WorkDay } from "../types/workDay";

export function calculateWorkSummary(
  workDays: WorkDay[],
  lastPayment?: Payment,
): WorkSummary {
  let workedDays = 0;
  let fullDays = 0;
  let halfDays = 0;
  let customHoursDays = 0;
  let absentDays = 0;
  let totalHours = 0;

  for (const workDay of workDays) {
    switch (workDay.type) {
      case "absent":
        absentDays++;
        break;

      case "full":
        workedDays++;
        fullDays++;
        totalHours += workDay.hours;
        break;

      case "half":
        workedDays++;
        halfDays++;
        totalHours += workDay.hours;
        break;

      case "hours":
        workedDays++;
        customHoursDays++;
        totalHours += workDay.hours;
        break;
    }
  }

  return {
    lastPayment,
    workedDays,
    fullDays,
    halfDays,
    customHoursDays,
    absentDays,
    totalHours,
  };
}
