import { useEffect, useId, type ReactNode } from "react";
import { X } from "lucide-react";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  loading?: boolean;
  className?: string;
}

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  loading = false,
  className = "",
}: DialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  // Bloqueo de scroll del body y atajo tecla Escape
  useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    if (!loading) {
      document.body.style.overflow = "hidden";
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, loading, onClose]);

  if (!open) return null;

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !loading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-xs p-4 animate-in fade-in-0 duration-200"
      role="presentation"
      onMouseDown={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        className={`w-full max-w-md rounded-2xl border border-border bg-background shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh] ${className}`}
      >
        {/* Cabecera del Diálogo */}
        <div className="flex items-start justify-between gap-4 border-b border-border/80 px-6 py-4 shrink-0">
          <div className="min-w-0 space-y-0.5">
            <h2
              id={titleId}
              className="text-lg font-semibold tracking-tight text-foreground truncate"
            >
              {title}
            </h2>

            {description && (
              <p
                id={descriptionId}
                className="text-xs text-muted-foreground leading-relaxed"
              >
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Cerrar modal"
            className="shrink-0 rounded-xl p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Cuerpo / Contenido Scrollable */}
        <div className="px-6 py-4 overflow-y-auto flex-1 text-sm text-foreground space-y-4">
          {children}
        </div>

        {/* Pie de página (Footer) */}
        {footer && (
          <div className="border-t border-border/80 px-6 py-4 bg-muted/20 rounded-b-2xl shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dialog;