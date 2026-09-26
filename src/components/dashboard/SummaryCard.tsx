import type { LucideIcon } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  iconColor?: string;
}

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  iconColor = "text-primary bg-primary/10",
}: SummaryCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-2xs hover:shadow-md hover:border-primary/20 transition-all duration-200">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </span>
        <div
          className={`flex size-9 items-center justify-center rounded-xl ${iconColor} transition-transform group-hover:scale-110`}
        >
          <Icon className="size-4 shrink-0" />
        </div>
      </div>

      <div className="mt-2">
        <div className="text-2xl font-bold tracking-tight text-foreground">
          {value}
        </div>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export default SummaryCard;
