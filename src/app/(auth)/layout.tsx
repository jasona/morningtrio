export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
            3
          </div>
          <h1 className="text-2xl font-bold tracking-tight">MorningTrio</h1>
          <p className="text-sm text-muted-foreground">
            Focus on your top 3 priorities each day
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
