import DataBackupCard from "../components/settings/DataBackupCard";

function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Configuración</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Administra las opciones de Mi Jornada.
        </p>
      </div>

      <DataBackupCard />
    </div>
  );
}

export default SettingsPage;
