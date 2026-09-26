import type {
  CreateWorkDayInput,
  UpdateWorkDayInput,
  WorkDay,
} from "../types/workDay";
import { db } from "./database";

const generateId = () => crypto.randomUUID();

export const workDayRepository = {
  async getAll(): Promise<WorkDay[]> {
    return db.workDays.orderBy("date").reverse().toArray();
  },

  async getById(id: string): Promise<WorkDay | undefined> {
    return db.workDays.get(id);
  },

  async getByDate(date: string): Promise<WorkDay | undefined> {
    return db.workDays.where("date").equals(date).first();
  },

  async getAfterDate(date: string): Promise<WorkDay[]> {
    return db.workDays.where("date").above(date).reverse().toArray();
  },

  async create(input: CreateWorkDayInput): Promise<WorkDay> {
    const now = new Date().toISOString();

    const workDay: WorkDay = {
      id: generateId(),
      date: input.date,
      type: input.type,
      hours: input.hours,
      note: input.note?.trim() || undefined,
      createdAt: now,
      updatedAt: now,
    };

    await db.workDays.add(workDay);

    return workDay;
  },

  async update(id: string, input: UpdateWorkDayInput): Promise<WorkDay> {
    const existing = await this.getById(id);

    if (!existing) {
      throw new Error("La jornada no existe.");
    }

    const updated: WorkDay = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    await db.workDays.put(updated);

    return updated;
  },

  async delete(id: string): Promise<void> {
    await db.workDays.delete(id);
  },

};
