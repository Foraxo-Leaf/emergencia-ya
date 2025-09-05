export default function OfflinePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center p-4 text-center">
      <h1 className="mb-2 text-2xl font-bold">Estás sin conexión</h1>
      <p className="text-muted-foreground">La aplicación requiere acceso a internet. Por favor verifica tu conexión.</p>
    </div>
  );
}
