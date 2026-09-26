import { NavLink, Outlet } from "react-router";

import { ROUTES } from "../../routes/routePath";
import { CalendarDays, LayoutDashboard, MoonIcon, Settings2, SunIcon, WalletCards } from "lucide-react";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { to: ROUTES.dashboard, label: "Inicio", icon: LayoutDashboard },
  { to: ROUTES.workDays, label: "Jornadas", icon: CalendarDays },
  { to: ROUTES.payments, label: "Pagos", icon: WalletCards },
  { to: ROUTES.settings, label: "Configuración", icon: Settings2 },
];

function AppLayout() {
  const [isDark, setIsDark] = useState(() => {
    return (
      document.documentElement.classList.contains("dark") ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased selection:bg-primary/20 selection:text-primary">
      {/* HEADER SUPERIOR */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Logo y Nombre */}
          <NavLink
            to={ROUTES.dashboard}
            className="flex items-center gap-3 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg p-1"
          >
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
              MJ
            </div>

            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors">
                Mi Jornada
              </span>
              <span className="text-[11px] leading-tight text-muted-foreground font-normal">
                Control personal
              </span>
            </div>
          </NavLink>

          {/* Navegación para Escritorio (sm en adelante) */}
          <nav className="hidden sm:flex items-center gap-1">
            {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-primary/10 text-primary font-semibold shadow-xs"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`
                }
              >
                <Icon className="size-4 shrink-0" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Acciones del Header: Toggle Tema */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              type="button"
              aria-label="Cambiar tema"
              className="flex size-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {isDark ? (
                <SunIcon className="size-4 text-amber-400" />
              ) : (
                <MoonIcon className="size-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-8 mb-16 sm:mb-0">
        <Outlet />
      </main>

      {/* BARRA DE NAVEGACIÓN INFERIOR (Mobile Bottom Nav - Únicamente Móviles) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur-lg px-3 py-2 flex justify-around items-center shadow-lg">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-xl px-4 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`flex items-center justify-center rounded-full px-3 py-1 transition-colors ${
                    isActive ? "bg-primary/10" : "bg-transparent"
                  }`}
                >
                  <Icon
                    className={`size-5 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                  />
                </div>
                <span className="text-[10px] tracking-tight">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default AppLayout;
