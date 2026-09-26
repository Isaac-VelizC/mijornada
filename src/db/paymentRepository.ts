import type { CreatePaymentInput, Payment } from "../types/payment";
import { db } from "./database";

export const paymentRepository = {
  async getAll(): Promise<Payment[]> {
    return db.payments.orderBy("date").reverse().toArray();
  },

  async getById(id: string): Promise<Payment | undefined> {
    return db.payments.get(id);
  },

  async getLatest(): Promise<Payment | undefined> {
    return db.payments.orderBy("date").reverse().first();
  },

  async create(input: CreatePaymentInput): Promise<Payment> {
    const payment: Payment = {
      id: crypto.randomUUID(),
      date: input.date,
      amount: input.amount,
      note: input.note?.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    await db.payments.add(payment);

    return payment;
  },

  async delete(id: string): Promise<void> {
    await db.payments.delete(id);
  },
};
