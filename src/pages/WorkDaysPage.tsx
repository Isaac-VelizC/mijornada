import { useCallback, useEffect, useMemo, useState } from "react";
import type { WorkDay } from "../types/workDay";
import { workDayService } from "../services/workDayService";
import {
  AlertCircle,
  Calendar,
  FilterX,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import WorkDayList from "../components/work-days/WorkDayList";
import WorkDayModal from "../components/work-days/WorkDayModal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { Button } from "../components/ui/Button";

function WorkDaysPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedWorkDay, setSelectedWorkDay] = useState<WorkDay | undefined>();
  const [workDays, setWorkDays] = useState<WorkDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workDayToDelete, setWorkDayToDelete] = useState<WorkDay | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadWorkDays = useCallback(async () => {
    try {
      setError(null);
      const data = await workDayService.getAll();
      setWorkDays(data);
    } catch (error) {
      console.error("Error loading work days:", error);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudieron cargar las jornadas.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isSubscribed = true;

    const fetchDays = async () => {
      try {
        setError(null);
        const data = await workDayService.getAll();
        if (isSubscribed) setWorkDays(data);
      } catch (err) {
        if (isSubscribed) {
          console.error("Error loading work days:", err);
          setError(
            err instanceof Error
              ? err.message
              : "No se pudieron cargar las jornadas.",
          );
        }
      } finally {
        if (isSubscribed) setLoading(false);
      }
    };

    void fetchDays();

    return () => {
      isSubscribed = false;
    };
  }, []);

  const filteredWorkDays = useMemo(() => {
    if (!searchQuery.trim()) return workDays;
    const query = searchQuery.toLowerCase();
    return workDays.filter(
      (day) =>
        day.date.toLowerCase().includes(query) ||
        (day.note && day.note.toLowerCase().includes(query)),
    );
  }, [workDays, searchQuery]);

  const handleCreate = () => {
    setSelectedWorkDay(undefined);
    setModalOpen(true);
  };

  const handleEdit = (workDay: WorkDay) => {
    setSelectedWorkDay(workDay);
    setModalOpen(true);
  };

  const handleDelete = (work: WorkDay) => {
    setWorkDayToDelete(work);
  };

  const handleCancelDelete = () => {
    if (deleting) return;
    setWorkDayToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!workDayToDelete || deleting) return;

    try {
      setDeleting(true);
      setError(null);
      await workDayService.delete(workDayToDelete.id);
      setWorkDayToDelete(null);
      await loadWorkDays();
    } catch (error) {
      console.error("Error deleting work day:", error);

      setError(
        error instanceof Error
          ? error.message
          : "No se pudo eliminar la jornada seleccionada.",
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedWorkDay(undefined);
  };

  const handleSaved = async () => {
    handleCloseModal();
    await loadWorkDays();
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Jornadas
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Consulta y gestiona el historial de tus días trabajados.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleCreate}
        >
          <Plus className="size-4" />
          Nueva jornada
        </Button>
      </div>

      {/* Control de Búsqueda y Filtro */}
      {workDays.length > 0 && !loading && !error && (
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por fecha o notas..."
              className="w-full rounded-xl border border-border bg-card pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            />
          </div>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            {filteredWorkDays.length} de {workDays.length} registros
          </span>
        </div>
      )}

      {/* ESTADO: CARGANDO (Skeletons UI) */}
      {loading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-20 w-full animate-pulse rounded-2xl border border-border bg-card p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-muted rounded" />
                  <div className="h-3 w-48 bg-muted/60 rounded" />
                </div>
              </div>
              <div className="h-8 w-16 bg-muted rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {/* ESTADO: ERROR */}
      {!loading && error && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 flex flex-col items-center justify-center text-center gap-3">
          <AlertCircle className="size-8 text-destructive" />
          <p className="text-sm font-medium text-destructive max-w-md">
            {error}
          </p>
          <Button
            type="button"
            onClick={() => {
              setLoading(true);
              void loadWorkDays();
            }}
          >
            <RefreshCw className="size-4" />
            Reintentar
          </Button>
        </div>
      )}

      {/* ESTADO: SIN REGISTROS */}
      {!loading && !error && workDays.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center flex flex-col items-center justify-center space-y-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Calendar className="size-6" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="font-semibold text-lg text-foreground">
              No hay jornadas registradas
            </h3>
            <p className="text-sm text-muted-foreground">
              Comienza a registrar tus días de trabajo para llevar un control
              exacto de tus pagos.
            </p>
          </div>
          <Button
            type="button"
            onClick={handleCreate}
          >
            <Plus className="size-4" />
            Registrar jornada
          </Button>
        </div>
      )}

      {/* ESTADO: SIN RESULTADOS DE BÚSQUEDA */}
      {!loading &&
        !error &&
        workDays.length > 0 &&
        filteredWorkDays.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-8 text-center space-y-3">
            <FilterX className="size-8 mx-auto text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              No se encontraron jornadas que coincidan con "{searchQuery}"
            </p>
            <Button
              type="button"
              onClick={() => setSearchQuery("")}
              variant="outline"
            >
              Limpiar búsqueda
            </Button>
          </div>
        )}

      {/* LISTADO DE JORNADAS */}
      {!loading && !error && filteredWorkDays.length > 0 && (
        <WorkDayList
          workDays={filteredWorkDays}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <WorkDayModal
        open={modalOpen}
        workDay={selectedWorkDay}
        onClose={handleCloseModal}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={workDayToDelete !== null}
        title="Eliminar jornada"
        description="¿Deseas eliminar esta jornada? Esta acción no se puede deshacer."
        confirmLabel="Eliminar jornada"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </section>
  );
}

export default WorkDaysPage;
