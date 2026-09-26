import { useState, useRef, useEffect } from "react";
import { 
  CalendarDays, 
  Clock, 
  Pencil, 
  Trash2, 
  MoreVertical, 
  FileText,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Timer
} from "lucide-react";
import type { WorkDay } from "../../types/workDay";
import { formatDate } from "../../utils/formatters";

interface WorkDayCardProps {
  workDay: WorkDay;
  onEdit: (workDay: WorkDay) => void;
  onDelete: (workDay: WorkDay) => void;
}

// Configuración visual según el tipo de jornada
const typeConfigs: Record<
  WorkDay["type"],
  {
    label: string;
    description: string;
    badgeStyle: string;
    icon: React.ElementType;
  }
> = {
  full: {
    label: "Jornada completa",
    description: "Día completo de trabajo",
    badgeStyle: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    icon: CheckCircle2,
  },
  half: {
    label: "Media jornada",
    description: "Medio día registrado",
    badgeStyle: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    icon: Timer,
  },
  hours: {
    label: "Horas personalizadas",
    description: "Horas exactas registradas",
    badgeStyle: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    icon: Clock,
  },
  absent: {
    label: "Ausente",
    description: "Sin horas trabajadas",
    badgeStyle: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    icon: XCircle,
  },
};

function WorkDayCard({ workDay, onEdit, onDelete }: WorkDayCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const config = typeConfigs[workDay.type] ?? {
    label: "Desconocido",
    description: "Sin información",
    badgeStyle: "bg-muted text-muted-foreground border-border",
    icon: AlertCircle,
  };

  const TypeIcon = config.icon;

  // Cerrar menú emergente al hacer clic fuera del componente
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <article className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all hover:border-border hover:shadow-md">
      <div>
        {/* Cabecera: Fecha y Menú de Acciones */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4 shrink-0 text-primary" />
              <h3 className="truncate font-semibold text-foreground capitalize leading-snug">
                {formatDate(workDay.date)}
              </h3>
            </div>
            <p className="text-xs text-muted-foreground">{config.description}</p>
          </div>

          {/* Menú de Opciones */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
              aria-label={`Opciones para el ${formatDate(workDay.date)}`}
              className="flex size-8 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <MoreVertical className="size-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 z-20 mt-1 w-44 rounded-xl border border-border bg-popover p-1 shadow-lg animate-in fade-in-0 zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(workDay);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <Pencil className="size-3.5 text-muted-foreground" />
                  Editar jornada
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(workDay);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 className="size-3.5" />
                  Eliminar jornada
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Badges de Tipo y Horas */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium ${config.badgeStyle}`}
          >
            <TypeIcon className="size-3.5" />
            {config.label}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 bg-muted/50 px-2.5 py-1 text-xs font-medium text-foreground">
            <Clock className="size-3.5 text-muted-foreground" />
            {workDay.hours} {workDay.hours === 1 ? "hora" : "horas"}
          </span>
        </div>

        {/* Nota opcional */}
        {workDay.note && (
          <div className="mt-4 rounded-xl border border-border/50 bg-muted/30 p-3 text-xs text-muted-foreground flex items-start gap-2">
            <FileText className="size-3.5 shrink-0 text-muted-foreground mt-0.5" />
            <p className="line-clamp-3 leading-relaxed">{workDay.note}</p>
          </div>
        )}
      </div>
    </article>
  );
}

export default WorkDayCard