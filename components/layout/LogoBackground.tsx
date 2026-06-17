type LogoBackgroundProps = {
  children: React.ReactNode;
};

export default function LogoBackground({ children }: LogoBackgroundProps) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-orange-50 p-6">
      <div
        className="pointer-events-none absolute inset-0 bg-center bg-no-repeat opacity-50"
        style={{
          backgroundImage: "url('/stickerkita-logo.png')",
          backgroundSize: "1500px auto",
        }}
      />

      <div className="relative z-10">{children}</div>
    </main>
  );
}