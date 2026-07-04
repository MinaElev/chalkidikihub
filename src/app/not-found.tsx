import NotFoundContent from './not-found-content';

// Root 404 boundary. Kept fully static (no headers()/cookies()) so it doesn't
// flip ISR detail routes (beaches/listings/blog/…) from static to dynamic at
// runtime — that regression 500s every on-demand-generated page. Locale is
// detected on the client; see not-found-content.tsx.
export default function NotFound() {
  return (
    <html lang="el">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <NotFoundContent />
      </body>
    </html>
  );
}
