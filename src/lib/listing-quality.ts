/**
 * Owner-facing quality checks for a listing — what is missing or thin, in
 * order of how much it matters to guests. Used by the "quality reminder"
 * campaign in Admin → Mass Email. Thresholds match the nudges on the owner's
 * My Listings page, so the email and the dashboard never disagree.
 *
 * Pure: no I/O, so it is unit-tested.
 */
import { isUnsetPin } from '@/lib/geo';

export const MIN_PHOTOS = 5;
export const MIN_DESCRIPTION = 300;
export const MIN_AMENITIES = 5;

export type QualityListing = {
  id: string;
  title_el: string | null;
  description_el: string | null;
  amenities: string[] | null;
  photo_count: number;
  latitude: number | null;
  longitude: number | null;
  contact_phone: string | null;
  contact_email: string | null;
  price_per_night: number | null;
  guests_max: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  check_in_time: string | null;
  check_out_time: string | null;
  check_in_info_el: string | null;
  how_to_reach_el: string | null;
  parking_info_el: string | null;
  wifi_info_el: string | null;
  rule_smoking: string | boolean | null;
  rule_pets: string | boolean | null;
  rule_parties: string | boolean | null;
  rule_kids: string | boolean | null;
};

export type QualityIssue = {
  key: string;
  /** 'important' issues are the ones guests notice first. */
  weight: 'important' | 'helpful';
  /** Short imperative, e.g. "Προσθέστε περισσότερες φωτογραφίες". */
  title: string;
  /** One sentence on what to do and why it helps. */
  detail: string;
  /** Section of the edit page where it is fixed (anchor id). */
  section: 'basics' | 'photos' | 'location' | 'amenities' | 'contact' | 'rules' | 'practical';
};

const filled = (s: string | null | undefined) => Boolean(s && s.trim());

export function listingIssues(l: QualityListing): QualityIssue[] {
  const out: QualityIssue[] = [];
  const desc = (l.description_el || '').trim().length;

  if (l.photo_count === 0) {
    out.push({ key: 'photos', section: 'photos', weight: 'important', title: 'Προσθέστε φωτογραφίες',
      detail: `Η καταχώρηση δεν έχει καμία φωτογραφία. Ανεβάστε τουλάχιστον ${MIN_PHOTOS}: δωμάτια, μπάνιο, κουζίνα, εξωτερικούς χώρους και θέα. Είναι το πρώτο που κοιτάζει ο επισκέπτης.` });
  } else if (l.photo_count < MIN_PHOTOS) {
    out.push({ key: 'photos', section: 'photos', weight: 'important', title: 'Προσθέστε περισσότερες φωτογραφίες',
      detail: `Έχετε ${l.photo_count} ${l.photo_count === 1 ? 'φωτογραφία' : 'φωτογραφίες'}· προτείνουμε τουλάχιστον ${MIN_PHOTOS}. Δείξτε όλους τους χώρους, ώστε ο επισκέπτης να ξέρει τι θα βρει.` });
  }

  if (desc === 0) {
    out.push({ key: 'description', section: 'basics', weight: 'important', title: 'Γράψτε μια περιγραφή',
      detail: `Περιγράψτε τους χώρους, τι κάνει το κατάλυμα ξεχωριστό και τι υπάρχει κοντά (παραλία, καταστήματα, εστιατόρια). Προτείνουμε τουλάχιστον ${MIN_DESCRIPTION} χαρακτήρες.` });
  } else if (desc < MIN_DESCRIPTION) {
    out.push({ key: 'description', section: 'basics', weight: 'important', title: 'Εμπλουτίστε την περιγραφή',
      detail: `Η περιγραφή έχει σήμερα ${desc} χαρακτήρες· προτείνουμε τουλάχιστον ${MIN_DESCRIPTION}. Προσθέστε τους χώρους, τις αποστάσεις από την παραλία και ό,τι αγαπούν οι επισκέπτες σας.` });
  }

  if (isUnsetPin(l.latitude, l.longitude)) {
    out.push({ key: 'pin', section: 'location', weight: 'important', title: 'Διορθώστε τη θέση στον χάρτη',
      detail: 'Η πινέζα του χάρτη δεν δείχνει το κατάλυμα (είναι ακόμα στην αρχική θέση, μέσα στη θάλασσα). Μετακινήστε τη στο σωστό σημείο, ώστε οι επισκέπτες να βλέπουν πού βρίσκεστε.' });
  }

  if (!filled(l.contact_phone) && !filled(l.contact_email)) {
    out.push({ key: 'contact', section: 'contact', weight: 'important', title: 'Προσθέστε στοιχεία επικοινωνίας',
      detail: 'Δεν υπάρχει τηλέφωνο ή email στην καταχώρηση. Χωρίς αυτά, ένας ενδιαφερόμενος δεν μπορεί να επικοινωνήσει απευθείας μαζί σας.' });
  }

  if ((l.amenities?.length || 0) < MIN_AMENITIES) {
    out.push({ key: 'amenities', section: 'amenities', weight: 'important', title: 'Συμπληρώστε τις παροχές',
      detail: 'Σημειώστε τι προσφέρετε (π.χ. κλιματισμό, Wi-Fi, πάρκινγκ, κουζίνα, μπαλκόνι). Πολλοί επισκέπτες φιλτράρουν την αναζήτηση με βάση τις παροχές.' });
  }

  if (!l.price_per_night) {
    out.push({ key: 'price', section: 'basics', weight: 'helpful', title: 'Προσθέστε ενδεικτική τιμή',
      detail: 'Μια ενδεικτική τιμή ανά βράδυ βοηθά τον επισκέπτη να αποφασίσει αν το κατάλυμα ταιριάζει στον προϋπολογισμό του.' });
  }
  if (!(l.guests_max && l.bedrooms && l.bathrooms)) {
    out.push({ key: 'capacity', section: 'basics', weight: 'helpful', title: 'Συμπληρώστε άτομα, υπνοδωμάτια και μπάνια',
      detail: 'Ο επισκέπτης θέλει να ξέρει αμέσως πόσα άτομα χωράει το κατάλυμα.' });
  }
  if (!(l.check_in_time && l.check_out_time)) {
    out.push({ key: 'times', section: 'rules', weight: 'helpful', title: 'Ορίστε ώρες άφιξης και αναχώρησης',
      detail: 'Οι ώρες check-in και check-out διευκολύνουν τον προγραμματισμό του ταξιδιού.' });
  }
  const practical = [
    !filled(l.how_to_reach_el) && 'πώς να φτάσει κανείς',
    !filled(l.parking_info_el) && 'πάρκινγκ',
    !filled(l.wifi_info_el) && 'Wi-Fi',
    !filled(l.check_in_info_el) && 'οδηγίες άφιξης',
  ].filter(Boolean) as string[];
  if (practical.length >= 2) {
    out.push({ key: 'practical', section: 'practical', weight: 'helpful', title: 'Προσθέστε πρακτικές πληροφορίες',
      detail: `Λείπουν: ${practical.join(', ')}. Είναι οι ερωτήσεις που κάνουν οι επισκέπτες πριν κλείσουν.` });
  }
  if ([l.rule_smoking, l.rule_pets, l.rule_parties, l.rule_kids].every((v) => v == null)) {
    out.push({ key: 'rules', section: 'rules', weight: 'helpful', title: 'Δηλώστε τους κανόνες του σπιτιού',
      detail: 'Π.χ. αν επιτρέπονται κατοικίδια ή το κάπνισμα, και αν είναι κατάλληλο για παιδιά.' });
  }
  return out;
}
