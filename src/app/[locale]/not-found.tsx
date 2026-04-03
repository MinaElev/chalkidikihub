import { Link } from '@/i18n/navigation';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="text-8xl mb-4">🍽️</div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-700 mb-2">
          Πάω να φάω κάτι... Έρχομαι!
        </p>
        <p className="text-gray-500 mb-2">
          Η σελίδα που ψάχνεις πήγε για σουβλάκι στα Χανιώτη. 🥙
        </p>
        <p className="text-sm text-gray-400 mb-8">
          Μάλλον κάτι πήγε στραβά, ή η σελίδα δεν υπάρχει πια.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/"
            className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-colors">
            Πίσω στην Αρχική
          </Link>
          <Link href="/beaches"
            className="px-6 py-3 border border-primary-600 text-primary-600 hover:bg-primary-50 font-medium rounded-xl transition-colors">
            Πάμε παραλία! 🏖️
          </Link>
        </div>
      </div>
    </div>
  );
}
