import './globals.css';

// Requests that never reach a locale (e.g. /some.file) land here.
export default function GlobalNotFound() {
  return (
    <html lang="el">
      <body className="grid min-h-dvh place-items-center bg-white p-6 text-center text-slate-800">
        <div>
          <p className="text-sm font-semibold text-sea-700">404</p>
          <h1 className="mt-2 text-2xl font-semibold">Η σελίδα δεν βρέθηκε · Page not found</h1>
          <a href="/" className="mt-6 inline-block font-semibold text-sea-700 underline">ChalkidikiHub</a>
        </div>
      </body>
    </html>
  );
}
