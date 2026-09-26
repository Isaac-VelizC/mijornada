import type { Payment } from "./payment"
import type { WorkDay } from "./workDay"

export const BACKUP_VERSION = 1

export interface AppBackup {
  version: number
  app: 'mi-jornada'
  exportedAt: string
  workDays: WorkDay[]
  payments: Payment[]
}