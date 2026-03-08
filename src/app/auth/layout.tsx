export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-gradient-radial from-obsidian-800/20 via-transparent to-transparent" />
      {children}
    </div>
  );
}