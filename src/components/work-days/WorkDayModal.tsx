import { useState } from "react";
import { format } from "date-fns";
import { workDayService } from "../../services/workDayService";

import type { WorkDay, WorkDayType } from "../../types/workDay";
import Dialog from "../ui/Dialog";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Timer,
  XCircle,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";

interface WorkDayModalProps {
  open: boolean;
  workDay?: WorkDay;
  onClose: () => void;
  onSaved: () => void;
}

const FULL_DAY_HOURS = 8;
const HALF_DAY_HOURS = 4;

function getTodayString() {
  return format(new Date(), "yyyy-MM-dd");
}

const typeOptions: Array<{
  id: WorkDayType;
  label: string;
  sublabel: string;
  icon: React.ElementType;
}> = [
  {
    id: "full",
    label: "Jornada completa",
    sublabel: "8 horas",
    icon: CheckCircle2,
  },
  {
    id: "half",
    label: "Media jornada",
    sublabel: "4 horas",
    icon: Timer,
  },
  {
    id: "hours",
    label: "Personalizada",
    sublabel: "Horas fijas",
    icon: Clock,
  },
  {
    id: "absent",
    label: "Ausente",
    sublabel: "0 horas",
    icon: XCircle,
  },
];

export function WorkDayModal({
  open,
  workDay,
  onClose,
  onSaved,
}: WorkDayModalProps) {
  const isEditing = Boolean(workDay);

  const [date, setDate] = useState(getTodayString());
  const [type, setType] = useState<WorkDayType>("full");
  const [hours, setHours] = useState(FULL_DAY_HOURS);
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [prevOpen, setPrevOpen] = useState(open);
  const [prevWorkDay, setPrevWorkDay] = useState(workDay);

  if (open !== prevOpen || workDay !== prevWorkDay) {
    setPrevOpen(open);
    setPrevWorkDay(workDay);

    if (open) {
      setError(null);
      if (workDay) {
        setDate(workDay.date);
        setType(workDay.type);
        setHours(workDay.hours);
        setNote(workDay.note ?? "");
      } else {
        setDate(getTodayString());
        setType("full");
        setHours(FULL_DAY_HOURS);
        setNote("");
      }
    }
  }

  const handleTypeChange = (newType: WorkDayType) => {
    setType(newType);

    switch (newType) {
      case "full":
        setHours(FULL_DAY_HOURS);
        break;

      case "half":
        setHours(HALF_DAY_HOURS);
        break;

      case "absent":
        setHours(0);
        break;

      case "hours":
        setHours((current) => (current > 0 && current <= 24 ? current : 1));
        break;
    }
  };

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError(null);

      const payload = { date, type, hours, note };

      if (isEditing && workDay) {
        await workDayService.update(workDay.id, payload);
      } else {
        await workDayService.create(payload);
      }

      onSaved();
    } catch (err) {
      console.error("Error saving work day:", err);
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo guardar la jornada. Inténtalo de nuevo.",
      );
    } finally {
      setLoading(false);
    }
  };

  const footerActions = (
    <div className="flex items-center justify-end gap-2.5">
      <Button
        type="button"
        variant="outline"
        onClick={onClose}
        disabled={loading}
      >
        Cancelar
      </Button>

      <Button type="submit" form="work-day-form" loading={loading}>
        {isEditing ? "Guardar cambios" : "Guardar jornada"}
      </Button>
    </div>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      loading={loading}
      title={isEditing ? "Editar jornada" : "Nueva jornada"}
      description="Selecciona la fecha y el tipo de jornada trabajada."
      footer={footerActions}
      className="max-w-md"
    >
      <form id="work-day-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Campo Fecha usando Input reutilizable */}
        <Input
          id="work-day-date"
          type="date"
          label="Fecha"
          icon={Calendar}
          value={date}
          max={getTodayString()}
          onChange={(e) => setDate(e.target.value)}
          disabled={loading}
          required
        />

        {/* Campo Tipo de Jornada */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Tipo de jornada
          </label>

          <div className="grid grid-cols-2 gap-2">
            {typeOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = type === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleTypeChange(option.id)}
                  disabled={loading}
                  className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary shadow-2xs"
                      : "border-border bg-card hover:bg-muted/50 text-foreground"
                  } disabled:opacity-50`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <Icon
                      className={`size-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
                    />
                    <div
                      className={`size-2 rounded-full ${
                        isSelected ? "bg-primary" : "bg-transparent"
                      }`}
                    />
                  </div>

                  <span className="text-xs font-semibold">{option.label}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {option.sublabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Horas Personalizadas (Solo si el tipo es 'hours') */}
        {type === "hours" && (
          <Input
            id="work-day-hours"
            type="number"
            label="Horas trabajadas"
            icon={Clock}
            min="0.5"
            max="24"
            step="0.5"
            value={hours}
            onChange={(e) => {
              const val = Number(e.target.value);
              setHours(Number.isFinite(val) ? val : 0);
            }}
            disabled={loading}
            required
            className="animate-in fade-in-0 duration-150"
          />
        )}

        {/* Nota Opcional usando Textarea reutilizable */}
        <Textarea
          id="work-day-note"
          label="Nota"
          icon={FileText}
          optionalText="opcional"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={500}
          rows={3}
          disabled={loading}
          placeholder="Ej. Avances del proyecto, soporte técnico..."
        />

        {/* Mensaje de Error */}
        {error && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive animate-in fade-in-0"
          >
            <AlertCircle className="size-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </form>
    </Dialog>
  );
}

export default WorkDayModal;
