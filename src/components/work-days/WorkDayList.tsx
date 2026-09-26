import type { WorkDay } from "../../types/workDay";
import WorkDayCard from "./WorkDayCard";

interface WorkDayListProps {
  workDays: WorkDay[];
  onEdit: (workDay: WorkDay) => void;
  onDelete: (workDay: WorkDay) => void;
}

export function WorkDayList({ workDays, onEdit, onDelete }: WorkDayListProps) {
  if (workDays.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {workDays.map((workDay) => (
        <WorkDayCard
          key={workDay.id}
          workDay={workDay}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default WorkDayList;