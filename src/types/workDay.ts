export type WorkDayType = "full" | "half" | "hours" | "absent";

export interface WorkDay {
  id: string;
  date: string;

  type: WorkDayType;

  hours: number;

  note?: string;

  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkDayInput {
  date: string
  type: WorkDayType
  hours: number
  note?: string
}

export interface UpdateWorkDayInput {
  date?: string
  type?: WorkDayType
  hours?: number
  note?: string
}