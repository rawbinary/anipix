import "../styles/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body className="min-h-screen bg-zinc-900 font-sans text-white">
        {children}
      </body>
    </html>
  );
}
