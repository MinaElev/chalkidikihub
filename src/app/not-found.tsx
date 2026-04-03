import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="el">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: '#f9fafb' }}>
          <div style={{ textAlign: 'center', maxWidth: '500px' }}>
            <div style={{ fontSize: '80px', marginBottom: '16px' }}>🍽️</div>
            <h1 style={{ fontSize: '72px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px' }}>404</h1>
            <p style={{ fontSize: '24px', fontWeight: 600, color: '#374151', marginBottom: '8px' }}>
              Πάω να φάω κάτι... Έρχομαι!
            </p>
            <p style={{ color: '#6b7280', marginBottom: '8px' }}>
              Η σελίδα που ψάχνεις πήγε για σουβλάκι στα Χανιώτη. 🥙
            </p>
            <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '32px' }}>
              Μάλλον κάτι πήγε στραβά, ή η σελίδα δεν υπάρχει πια.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/el"
                style={{ padding: '12px 24px', background: '#0284c7', color: 'white', fontWeight: 500, borderRadius: '12px', textDecoration: 'none' }}>
                Πίσω στην Αρχική
              </Link>
              <Link href="/el/beaches"
                style={{ padding: '12px 24px', border: '2px solid #0284c7', color: '#0284c7', fontWeight: 500, borderRadius: '12px', textDecoration: 'none' }}>
                Πάμε παραλία! 🏖️
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
