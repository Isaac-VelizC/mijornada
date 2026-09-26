import { Link } from "react-router";
import { FileQuestion, ArrowLeft, Home } from "lucide-react";
import { ROUTES } from "../routes/routePath";

export default function NotFound() {
  return (
    <div className="flex min-h-[75vh] w-full flex-col items-center justify-center px-4 py-12">
      <div className="relative flex max-w-md w-full flex-col items-center text-center">
        {/* Glow de fondo decorativo */}
        <div
          aria-hidden="true"
          className="absolute -top-12 size-48 rounded-full bg-primary/10 blur-3xl pointer-events-none"
        />

        {/* Icono Principal */}
        <div className="relative flex size-20 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
          <FileQuestion className="size-10 text-primary" />
          <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
            404
          </span>
        </div>

        {/* Textos */}
        <div className="mt-6 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Página no encontrada
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            Lo sentimos, la página que estás buscando no existe, ha sido movida
            o la dirección es incorrecta.
          </p>
        </div>

        {/* Acciones */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-xs transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Regresar
          </button>

          <Link
            to={ROUTES.dashboard}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90"
          >
            <Home className="size-4" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
