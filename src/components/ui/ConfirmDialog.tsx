import { AlertTriangle, Loader2, Info } from "lucide-react";
import Dialog from "./Dialog";
import { Button } from "./Button";

export interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  variant?: "destructive" | "warning" | "info";
  onConfirm: () => void;
  onCancel: () => void;
}

const variantStyles = {
  destructive: {
    iconBg: "bg-destructive/10 text-destructive",
    buttonBg: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    icon: AlertTriangle,
  },
  warning: {
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    buttonBg: "bg-amber-600 text-white hover:bg-amber-700 dark:bg-amber-500 dark:hover:bg-amber-600",
    icon: AlertTriangle,
  },
  info: {
    iconBg: "bg-primary/10 text-primary",
    buttonBg: "bg-primary text-primary-foreground hover:bg-primary/90",
    icon: Info,
  },
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  loading = false,
  variant = "destructive",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const currentVariant = variantStyles[variant];
  const IconComponent = currentVariant.icon;

  const footerActions = (
    <div className="flex items-center justify-end gap-2.5">
      <Button
        type="button"
        disabled={loading}
        onClick={onCancel}
        variant="outline"
      >
        {cancelLabel}
      </Button>

      <button
        type="button"
        disabled={loading}
        onClick={onConfirm}
        className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 ${currentVariant.buttonBg}`}
      >
        {loading && <Loader2 className="size-4 animate-spin" />}
        {confirmLabel}
      </button>
    </div>
  );

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      title={title}
      loading={loading}
      footer={footerActions}
      className="max-w-md"
    >
      <div className="flex items-start gap-4 pt-1">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-2xl ${currentVariant.iconBg}`}
        >
          <IconComponent className="size-5" />
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed pt-0.5">
          {description}
        </p>
      </div>
    </Dialog>
  );
}

export default ConfirmDialog;