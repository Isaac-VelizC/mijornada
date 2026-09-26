import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  BriefcaseBusiness,
  Clock3,
  Coffee,
  Moon,
  Plus,
  RefreshCw,
  WalletCards,
} from "lucide-react";
import { useNavigate } from "react-router";
import type { WorkSummary } from "../types/summary";
import { summaryService } from "../services/summaryService";
import LastPaymentCard from "../components/dashboard/LastPaymentCard";
import SummaryCard from "../components/dashboard/SummaryCard";
import { ROUTES } from "../routes/routePath";
import { Button } from "../components/ui/Button";

export function Dashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState<WorkSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSummary = useCallback(async () => {
    try {
      setError(null);
      const data = await summaryService.getCurrent();
      setSummary(data);
    } catch (err) {
      console.error("Error loading dashboard:", err);
      setError(
        err instanceof Error
          ? err.message
          : "No se pudo cargar el resumen de tu jornada.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    const fetchSummary = async () => {
      try {
        setError(null);
        const data = await summaryService.getCurrent();
        if (isSubscribed) {
          setSummary(data);
        }
      } catch (err) {
        if (isSubscribed) {
          console.error("Error loading dashboard:", err);
          setError(
            err instanceof Error
              ? err.message
              : "No se pudo cargar el resumen de tu jornada.",
          );
        }
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    void fetchSummary();

    return () => {
      isSubscribed = false;
    };
  }, []);

  const handleRetry = () => {
    setLoading(true);
    void loadSummary();
  };

  // ESTADO: CARGANDO (SKELETONS UI)
  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted rounded-lg" />
          <div className="h-4 w-64 bg-muted/60 rounded-md" />
        </div>

        <div className="h-32 w-full bg-card rounded-xl border border-border shadow-xs" />

        <div className="space-y-4">
          <div className="h-6 w-32 bg-muted rounded-md" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-xl bg-card border border-border p-4 space-y-3"
              >
                <div className="flex justify-between items-center">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="size-8 rounded-lg bg-muted" />
                </div>
                <div className="h-7 w-16 bg-muted rounded" />
                <div className="h-3 w-32 bg-muted/60 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ESTADO: ERROR
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inicio</h1>
          <p className="text-sm text-muted-foreground">
            Resumen de tu jornada actual.
          </p>
        </div>

        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 flex flex-col items-start gap-4 shadow-xs">
          <div className="flex items-center gap-3 text-destructive">
            <AlertCircle className="size-5 shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </div>

          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center gap-2 rounded-lg bg-card border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RefreshCw className="size-4" />
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!summary) return null;

  return (
    <div className="space-y-8">
      {/* Encabezado Principal y Acciones Rápidas Mobile-First */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Inicio
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Resumen en tiempo real de tu jornada de trabajo.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            type="button"
            onClick={() => navigate(ROUTES.workDays)}
          >
            <Plus className="size-4" />
            Registrar jornada
          </Button>

          <Button
            type="button"
            onClick={() => navigate(ROUTES.payments)}
            variant="outline"
          >
            <WalletCards className="size-4 text-muted-foreground" />
            Registrar pago
          </Button>
        </div>
      </div>

      {/* Tarjeta de Último Pago */}
      <LastPaymentCard payment={summary.lastPayment} />

      {/* Métricas / Resumen */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Métricas clave
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SummaryCard
            title="Días trabajados"
            value={summary.workedDays}
            description="Desde el último pago"
            icon={BriefcaseBusiness}
            iconColor="text-indigo-500 bg-indigo-500/10"
          />

          <SummaryCard
            title="Jornadas completas"
            value={summary.fullDays}
            description="Días estándar de 8 horas"
            icon={Clock3}
            iconColor="text-emerald-500 bg-emerald-500/10"
          />

          <SummaryCard
            title="Medias jornadas"
            value={summary.halfDays}
            description="Días de 4 horas"
            icon={Coffee}
            iconColor="text-amber-500 bg-amber-500/10"
          />

          <SummaryCard
            title="Horas personalizadas"
            value={summary.customHoursDays}
            description="Jornadas ajustadas manualmente"
            icon={Clock3}
            iconColor="text-sky-500 bg-sky-500/10"
          />

          <SummaryCard
            title="Ausencias"
            value={summary.absentDays}
            description="Inasistencias registradas"
            icon={Moon}
            iconColor="text-rose-500 bg-rose-500/10"
          />

          <SummaryCard
            title="Horas totales"
            value={`${summary.totalHours} h`}
            description="Acumulado del periodo"
            icon={Clock3}
            iconColor="text-primary bg-primary/10"
          />
        </div>
      </section>
    </div>
  );
}

export default Dashboard;