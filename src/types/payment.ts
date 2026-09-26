export interface Payment {
  id: string
  date: string
  amount?: number
  note?: string
  createdAt: string
}

export interface CreatePaymentInput {
  date: string
  amount?: number
  note?: string
}