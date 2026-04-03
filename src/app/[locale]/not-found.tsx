import { Link } from '@/i18n/navigation';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-xl">
        <div className="text-8xl mb-4">🏖️</div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-700 mb-3">
          Η ομάδα μας απολαμβάνει τη θάλασσα αυτή τη στιγμή...
        </p>
        <p className="text-gray-500 mb-2">
          Μόλις γυρίσουμε θα δούμε τι πήγε στραβά! 🌊
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Μην χάνεις χρόνο - βρες ό,τι χρειάζεσαι παρακάτω:
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <Link href="/" className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors text-sm">
            🏠 Αρχική
          </Link>
          <Link href="/listings" className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors text-sm">
            🏡 Καταλύματα
          </Link>
          <Link href="/beaches" className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors text-sm">
            🏖️ Παραλίες
          </Link>
          <Link href="/restaurants" className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors text-sm">
            🍽️ Εστιατόρια
          </Link>
          <Link href="/activities" className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors text-sm">
            🏛️ Αξιοθέατα
          </Link>
          <Link href="/blog" className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors text-sm">
            📝 Blog
          </Link>
          <Link href="/contact" className="px-5 py-2.5 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-medium rounded-xl transition-colors text-sm">
            📧 Επικοινωνία
          </Link>
        </div>
      </div>
    </div>
  );
}
