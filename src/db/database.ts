import Dexie, { type Table } from "dexie";

import type { WorkDay } from "../types/workDay";
import type { Payment } from "../types/payment";

export class AppDatabase extends Dexie {
  workDays!: Table<WorkDay, string>;
  payments!: Table<Payment, string>;

  constructor() {
    super("work-tracker-db");

    this.version(1).stores({
      workDays: "id, &date, type",
      payments: "id, date",
    });
  }
}

export const db = new AppDatabase();
