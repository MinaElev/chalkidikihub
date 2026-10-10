import './globals.css';

// The real <html>/<body> live in app/[locale]/layout.tsx so `lang` matches the
// page locale. This pass-through exists so app-level routes (sitemap, robots,
// api) have a root.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
