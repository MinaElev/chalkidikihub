import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="el" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://bvwiwxmgbtklztgapxyp.supabase.co" />
        <link rel="dns-prefetch" href="https://bvwiwxmgbtklztgapxyp.supabase.co" />
        <link rel="preconnect" href="https://api.openchargemap.io" />
        <meta name="theme-color" content="#0284c7" />
      </head>
      <body>{children}</body>
    </html>
  );
}
