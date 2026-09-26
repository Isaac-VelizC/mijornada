import type { Payment } from './payment'

export interface WorkSummary {
  lastPayment?: Payment

  workedDays: number
  fullDays: number
  halfDays: number
  customHoursDays: number
  absentDays: number

  totalHours: number
}