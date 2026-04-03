import Link from 'next/link';

export default function NotFound() {
  return (
    <html lang="el">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', background: '#f9fafb' }}>
          <div style={{ textAlign: 'center', maxWidth: '550px' }}>
            <div style={{ fontSize: '80px', marginBottom: '16px' }}>🏖️</div>
            <h1 style={{ fontSize: '72px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px' }}>404</h1>
            <p style={{ fontSize: '22px', fontWeight: 600, color: '#374151', marginBottom: '12px', lineHeight: 1.4 }}>
              Η ομάδα μας απολαμβάνει τη θάλασσα αυτή τη στιγμή...
            </p>
            <p style={{ color: '#6b7280', marginBottom: '8px', lineHeight: 1.6 }}>
              Μόλις γυρίσουμε θα δούμε τι πήγε στραβά! 🌊
            </p>
            <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '32px' }}>
              Μην χάνεις χρόνο - βρες ό,τι χρειάζεσαι παρακάτω:
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/el"
                style={{ padding: '12px 20px', background: '#0284c7', color: 'white', fontWeight: 500, borderRadius: '12px', textDecoration: 'none', fontSize: '14px' }}>
                🏠 Αρχική
              </Link>
              <Link href="/el/listings"
                style={{ padding: '12px 20px', background: '#0284c7', color: 'white', fontWeight: 500, borderRadius: '12px', textDecoration: 'none', fontSize: '14px' }}>
                🏡 Καταλύματα
              </Link>
              <Link href="/el/beaches"
                style={{ padding: '12px 20px', background: '#0284c7', color: 'white', fontWeight: 500, borderRadius: '12px', textDecoration: 'none', fontSize: '14px' }}>
                🏖️ Παραλίες
              </Link>
              <Link href="/el/restaurants"
                style={{ padding: '12px 20px', background: '#0284c7', color: 'white', fontWeight: 500, borderRadius: '12px', textDecoration: 'none', fontSize: '14px' }}>
                🍽️ Εστιατόρια
              </Link>
              <Link href="/el/activities"
                style={{ padding: '12px 20px', background: '#0284c7', color: 'white', fontWeight: 500, borderRadius: '12px', textDecoration: 'none', fontSize: '14px' }}>
                🏛️ Αξιοθέατα
              </Link>
              <Link href="/el/blog"
                style={{ padding: '12px 20px', background: '#0284c7', color: 'white', fontWeight: 500, borderRadius: '12px', textDecoration: 'none', fontSize: '14px' }}>
                📝 Blog
              </Link>
              <Link href="/el/contact"
                style={{ padding: '12px 20px', border: '2px solid #0284c7', color: '#0284c7', fontWeight: 500, borderRadius: '12px', textDecoration: 'none', fontSize: '14px' }}>
                📧 Επικοινωνία
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
