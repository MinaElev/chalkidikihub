'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import {
  Loader2, Wand2, Sparkles, BookOpen, HelpCircle, Eye, ChevronRight, Plus,
  AlertTriangle, Calendar, Shield, ShieldCheck, Info, Sparkle,
  Image as ImageIcon, MapPin, Lock,
} from 'lucide-react';

interface DbListing {
  id: string;
  slug: string;
  title_el: string | null;
  title_en: string | null;
  area: string;
  status: string;
  owner_id: string | null;
  owner_email?: string;
  tagline_el: string | null;
  owner_story_el: string | null;
  is_closed?: boolean;
  reopening_date?: string | null;
  // House rules / practical (set if any of the structured fields are filled)
  house_rules_filled: boolean;
  practical_filled: boolean;
  // Computed
  faqs_count?: number;
  emergency_count?: number;
  extras_count?: number;
  captions_count?: number;
  total_photos?: number;
  nearby_overrides_count?: number;
  blocked_count?: number;
}

const COPY = {
  el: {
    title: 'Φτιάξε το site σου',
    subtitle: 'Προσθήκες που κάνουν τη δημόσια σελίδα κάθε καταλύματος να ξεχωρίζει και να χτίζει εμπιστοσύνη πριν την κράτηση.',
    empty: 'Δεν έχεις καταχωρημένα καταλύματα ακόμα.',
    addFirst: 'Πρόσθεσε το πρώτο σου',
    viewPublic: 'Προβολή δημόσιας σελίδας',
    features: 'Διαθέσιμες προσθήκες',
    brandEdit: 'Επεξεργασία',
    configured: 'Έτοιμο',
    notSet: 'Δεν έχει ρυθμιστεί',
    tagline: {
      title: 'Tagline / Σλόγκαν',
      desc: 'Μια σύντομη φράση κάτω από τον τίτλο που τραβάει την προσοχή.',
    },
    story: {
      title: 'Η ιστορία μας',
      desc: 'Προσωπική αφήγηση που συνδέει τους επισκέπτες με το χώρο και εσένα.',
    },
    faqs: {
      title: 'Συχνές ερωτήσεις',
      desc: 'Πρόσθεσε τις συχνότερες ερωτήσεις — βοηθάει και το Google (rich results).',
    },
    emergency: {
      title: 'Τηλέφωνα έκτακτης ανάγκης',
      desc: 'Τοπικά τηλέφωνα ασφαλείας (αστυνομία, ιατρείο, φαρμακείο) + οι βασικοί αριθμοί ΕΕ.',
    },
    houseRules: {
      title: 'Κανόνες του καταλύματος',
      desc: 'Check-in/out, κάπνισμα, κατοικίδια, πάρτι, παιδιά, ώρες κοινής ησυχίας.',
    },
    practical: {
      title: 'Χρήσιμες πληροφορίες',
      desc: 'Πώς θα φτάσουν οι επισκέπτες, Wi-Fi, parking, οδηγίες check-in.',
    },
    extras: {
      title: 'Πρόσθετες υπηρεσίες',
      desc: 'Πρωινό, μεταφορά, καθαριότητα, ποδήλατα κ.λπ. — με ή χωρίς χρέωση.',
    },
    captions: {
      title: 'Λεζάντες φωτογραφιών',
      desc: 'Γράψε τι δείχνει κάθε φωτογραφία — εμφανίζονται σε hover στη gallery.',
    },
    nearby: {
      title: 'Τι υπάρχει γύρω',
      desc: 'Αυτόματα υπολογισμένο. Μπορείς να αποκρύψεις όσες τοποθεσίες δεν θες.',
    },
    availability: {
      title: 'Ημερολόγιο διαθεσιμότητας',
      desc: 'Μπλόκαρε δεσμευμένες ή κλειστές μέρες.',
    },
  },
  en: {
    title: 'Build your site',
    subtitle: 'Add-ons that make each listing\'s public page stand out and build trust before booking.',
    empty: 'You have no listings yet.',
    addFirst: 'Add your first one',
    viewPublic: 'View public page',
    features: 'Available add-ons',
    brandEdit: 'Edit',
    configured: 'Ready',
    notSet: 'Not set',
    tagline: {
      title: 'Tagline',
      desc: 'A short hook shown under the title.',
    },
    story: {
      title: 'Our Story',
      desc: 'Personal narrative that connects visitors with you and the place.',
    },
    faqs: {
      title: 'FAQs',
      desc: 'Add common questions — also helps Google (rich results).',
    },
    emergency: {
      title: 'Emergency contacts',
      desc: 'Local safety numbers (police, clinic, pharmacy) + default EU numbers.',
    },
    houseRules: {
      title: 'House rules',
      desc: 'Check-in/out, smoking, pets, parties, kids, quiet hours.',
    },
    practical: {
      title: 'Practical info',
      desc: 'How to reach, Wi-Fi, parking, check-in instructions.',
    },
    extras: {
      title: 'Extras & services',
      desc: 'Breakfast, transfer, cleaning, bikes… paid or included.',
    },
    captions: {
      title: 'Photo captions',
      desc: 'Tell guests what each photo shows — appears on hover in the gallery.',
    },
    nearby: {
      title: 'What\u2019s nearby',
      desc: 'Auto-computed. You can hide the suggestions you don\u2019t want shown.',
    },
    availability: {
      title: 'Availability calendar',
      desc: 'Block booked or closed dates.',
    },
  },
};

export default function SiteBuilderPage() {
  const locale = useLocale();
  const [listings, setListings] = useState<DbListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Role probe — decides whether to fetch own listings or all
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      const admin = profile?.role === 'superadmin' || profile?.role === 'admin';
      setIsSuperAdmin(admin);

      let query = supabase
        .from('listings')
        .select(`
          id, slug, title_el, title_en, area, status, owner_id,
          tagline_el, owner_story_el,
          is_closed, reopening_date,
          check_in_time, check_out_time, rule_smoking, rule_pets, rule_parties, rule_kids,
          quiet_hours_from, quiet_hours_to, house_rules_extra_el,
          how_to_reach_el, wifi_info_el, parking_info_el, check_in_info_el
        `)
        .order('created_at', { ascending: false });
      if (!admin) {
        query = query.eq('owner_id', user.id);
      }
      const { data } = await query;

      if (!data) {
        setListings([]);
        setLoading(false);
        return;
      }

      // Resolve owner emails / names (admins only — to label each row)
      const ownerEmails: Record<string, string> = {};
      if (admin) {
        const ownerIds = Array.from(new Set(data.map(l => l.owner_id).filter(Boolean))) as string[];
        if (ownerIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, email, full_name')
            .in('id', ownerIds);
          (profiles || []).forEach((p: { id: string; email: string | null; full_name: string | null }) => {
            ownerEmails[p.id] = p.email || p.full_name || p.id;
          });
        }
      }

      // Counts per listing (best effort — no-op if a query fails)
      const ids = data.map(l => l.id);
      const faqCounts: Record<string, number> = {};
      const emergencyCounts: Record<string, number> = {};
      const blockedCounts: Record<string, number> = {};

      const extrasCounts: Record<string, number> = {};
      const captionsCounts: Record<string, number> = {};
      const totalPhotos: Record<string, number> = {};
      const nearbyOverrideCounts: Record<string, number> = {};

      if (ids.length > 0) {
        const today = new Date().toISOString().slice(0, 10);
        const [faqsRes, emergRes, availRes, extrasRes, imgsRes, nearbyRes] = await Promise.all([
          supabase.from('listing_faqs').select('listing_id').in('listing_id', ids),
          supabase.from('listing_emergency_contacts').select('listing_id').in('listing_id', ids),
          supabase.from('listing_availability').select('listing_id').in('listing_id', ids).gte('date', today),
          supabase.from('listing_extras').select('listing_id').in('listing_id', ids),
          supabase.from('listing_images').select('listing_id, caption_el, caption_en').in('listing_id', ids),
          supabase.from('listing_nearby_overrides').select('listing_id').in('listing_id', ids),
        ]);
        (faqsRes.data || []).forEach((r: { listing_id: string }) => {
          faqCounts[r.listing_id] = (faqCounts[r.listing_id] || 0) + 1;
        });
        (emergRes.data || []).forEach((r: { listing_id: string }) => {
          emergencyCounts[r.listing_id] = (emergencyCounts[r.listing_id] || 0) + 1;
        });
        (availRes.data || []).forEach((r: { listing_id: string }) => {
          blockedCounts[r.listing_id] = (blockedCounts[r.listing_id] || 0) + 1;
        });
        (extrasRes.data || []).forEach((r: { listing_id: string }) => {
          extrasCounts[r.listing_id] = (extrasCounts[r.listing_id] || 0) + 1;
        });
        (imgsRes.data || []).forEach((r: { listing_id: string; caption_el: string | null; caption_en: string | null }) => {
          totalPhotos[r.listing_id] = (totalPhotos[r.listing_id] || 0) + 1;
          if ((r.caption_el && r.caption_el.trim()) || (r.caption_en && r.caption_en.trim())) {
            captionsCounts[r.listing_id] = (captionsCounts[r.listing_id] || 0) + 1;
          }
        });
        (nearbyRes.data || []).forEach((r: { listing_id: string }) => {
          nearbyOverrideCounts[r.listing_id] = (nearbyOverrideCounts[r.listing_id] || 0) + 1;
        });
      }

      setListings(
        data.map(l => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const row = l as any;
          const house_rules_filled = Boolean(
            row.check_in_time || row.check_out_time ||
            row.rule_smoking || row.rule_pets || row.rule_parties || row.rule_kids ||
            row.quiet_hours_from || row.quiet_hours_to ||
            (row.house_rules_extra_el && row.house_rules_extra_el.trim()),
          );
          const practical_filled = Boolean(
            (row.how_to_reach_el && row.how_to_reach_el.trim()) ||
            (row.wifi_info_el && row.wifi_info_el.trim()) ||
            (row.parking_info_el && row.parking_info_el.trim()) ||
            (row.check_in_info_el && row.check_in_info_el.trim()),
          );
          return {
            ...row,
            owner_email: row.owner_id ? ownerEmails[row.owner_id] : undefined,
            is_closed: Boolean(row.is_closed),
            reopening_date: row.reopening_date || null,
            house_rules_filled,
            practical_filled,
            faqs_count: faqCounts[row.id] || 0,
            emergency_count: emergencyCounts[row.id] || 0,
            extras_count: extrasCounts[row.id] || 0,
            captions_count: captionsCounts[row.id] || 0,
            total_photos: totalPhotos[row.id] || 0,
            nearby_overrides_count: nearbyOverrideCounts[row.id] || 0,
            blocked_count: blockedCounts[row.id] || 0,
          } as DbListing;
        }),
      );
      setLoading(false);
    })();
  }, []);

  const t = COPY[locale as 'el' | 'en'] || COPY.en;

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary-100 text-primary-700">
          <Wand2 className="w-5 h-5" />
        </span>
        <h1 className="text-2xl font-bold text-gray-900">{t.title}</h1>
      </div>
      <p className="text-sm text-gray-600 mb-4 max-w-2xl">{t.subtitle}</p>

      {isSuperAdmin && (
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-3 mb-5 flex flex-wrap items-center gap-3 text-sm">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-violet-200 text-violet-700">
            <Shield className="w-4 h-4" />
          </span>
          <div className="text-violet-900 flex-1 min-w-0">
            <strong>Admin mode</strong> — βλέπεις όλα τα καταλύματα της πλατφόρμας ({listings.length})
          </div>
          <Link href="/admin/brand-sites"
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-xs font-medium rounded-lg">
            Admin brand hub →
          </Link>
        </div>
      )}

      {listings.length === 0 ? (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl">
          <p className="text-gray-500 mb-4">{t.empty}</p>
          <Link
            href="/dashboard/listings/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl"
          >
            <Plus className="w-5 h-5" />
            {t.addFirst}
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {listings.map(listing => {
            const title = (locale === 'el' ? listing.title_el : listing.title_en) || listing.title_el || listing.title_en || '—';
            const hasTagline = !!listing.tagline_el?.trim();
            const hasStory = !!listing.owner_story_el?.trim();
            const faqsCount = listing.faqs_count || 0;
            const emergencyCount = listing.emergency_count || 0;
            const blockedCount = listing.blocked_count || 0;
            const extrasCount = listing.extras_count || 0;
            const captionsCount = listing.captions_count || 0;
            const totalPhotos = listing.total_photos || 0;
            const nearbyOverridesCount = listing.nearby_overrides_count || 0;
            const houseRulesFilled = listing.house_rules_filled;
            const practicalFilled = listing.practical_filled;

            return (
              <div
                key={listing.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
              >
                {/* Listing header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-semibold text-gray-900 truncate">{title}</h2>
                      {/* Active / Closed status — always visible */}
                      {listing.is_closed ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-orange-100 text-orange-800 border border-orange-200">
                          <Lock className="w-3 h-3" /> Κλειστό
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-green-100 text-green-800 border border-green-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                          Ενεργό
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs text-gray-500">
                      <span className="capitalize">{listing.area}</span>
                      <span>·</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          listing.status === 'published'
                            ? 'bg-green-50 text-green-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {listing.status}
                      </span>
                      {isSuperAdmin && listing.owner_email && (
                        <>
                          <span>·</span>
                          <span className="inline-flex items-center gap-1 text-violet-700 bg-violet-50 px-1.5 py-0.5 rounded">
                            <Shield className="w-3 h-3" />
                            {listing.owner_email}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <Link
                      href={`/stay/${listing.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700 hover:text-primary-700 px-3 py-2 bg-white border border-gray-200 hover:border-primary-300 rounded-lg"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {t.viewPublic}
                    </Link>
                    <Link
                      href={`/dashboard/listings/${listing.id}/brand`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-white px-3 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      Επεξεργασία
                    </Link>
                  </div>
                </div>

                {/* Feature rows */}
                <div className="divide-y divide-gray-100">
                  {/* Tagline + Story (one combined Brand Page entry) */}
                  <FeatureRow
                    icon={<Sparkles className="w-5 h-5" />}
                    iconBg="bg-pink-100 text-pink-600"
                    title={t.tagline.title}
                    desc={t.tagline.desc}
                    status={hasTagline ? t.configured : t.notSet}
                    statusColor={hasTagline ? 'text-green-700 bg-green-50' : 'text-gray-500 bg-gray-50'}
                    href={`/dashboard/listings/${listing.id}/brand`}
                    cta={t.brandEdit}
                  />
                  <FeatureRow
                    icon={<BookOpen className="w-5 h-5" />}
                    iconBg="bg-violet-100 text-violet-600"
                    title={t.story.title}
                    desc={t.story.desc}
                    status={hasStory ? t.configured : t.notSet}
                    statusColor={hasStory ? 'text-green-700 bg-green-50' : 'text-gray-500 bg-gray-50'}
                    href={`/dashboard/listings/${listing.id}/brand`}
                    cta={t.brandEdit}
                  />
                  <FeatureRow
                    icon={<HelpCircle className="w-5 h-5" />}
                    iconBg="bg-amber-100 text-amber-600"
                    title={t.faqs.title}
                    desc={t.faqs.desc}
                    status={faqsCount > 0 ? `${faqsCount}` : t.notSet}
                    statusColor={faqsCount > 0 ? 'text-green-700 bg-green-50' : 'text-gray-500 bg-gray-50'}
                    href={`/dashboard/listings/${listing.id}/brand`}
                    cta={t.brandEdit}
                  />
                  <FeatureRow
                    icon={<AlertTriangle className="w-5 h-5" />}
                    iconBg="bg-red-100 text-red-600"
                    title={t.emergency.title}
                    desc={t.emergency.desc}
                    status={emergencyCount > 0 ? `${emergencyCount}` : t.notSet}
                    statusColor={emergencyCount > 0 ? 'text-green-700 bg-green-50' : 'text-gray-500 bg-gray-50'}
                    href={`/dashboard/listings/${listing.id}/brand`}
                    cta={t.brandEdit}
                  />
                  <FeatureRow
                    icon={<ShieldCheck className="w-5 h-5" />}
                    iconBg="bg-blue-100 text-blue-600"
                    title={t.houseRules.title}
                    desc={t.houseRules.desc}
                    status={houseRulesFilled ? t.configured : t.notSet}
                    statusColor={houseRulesFilled ? 'text-green-700 bg-green-50' : 'text-gray-500 bg-gray-50'}
                    href={`/dashboard/listings/${listing.id}/brand`}
                    cta={t.brandEdit}
                  />
                  <FeatureRow
                    icon={<Info className="w-5 h-5" />}
                    iconBg="bg-indigo-100 text-indigo-600"
                    title={t.practical.title}
                    desc={t.practical.desc}
                    status={practicalFilled ? t.configured : t.notSet}
                    statusColor={practicalFilled ? 'text-green-700 bg-green-50' : 'text-gray-500 bg-gray-50'}
                    href={`/dashboard/listings/${listing.id}/brand`}
                    cta={t.brandEdit}
                  />
                  <FeatureRow
                    icon={<Sparkle className="w-5 h-5" />}
                    iconBg="bg-teal-100 text-teal-600"
                    title={t.extras.title}
                    desc={t.extras.desc}
                    status={extrasCount > 0 ? `${extrasCount}` : t.notSet}
                    statusColor={extrasCount > 0 ? 'text-green-700 bg-green-50' : 'text-gray-500 bg-gray-50'}
                    href={`/dashboard/listings/${listing.id}/brand`}
                    cta={t.brandEdit}
                  />
                  <FeatureRow
                    icon={<ImageIcon className="w-5 h-5" />}
                    iconBg="bg-pink-100 text-pink-600"
                    title={t.captions.title}
                    desc={t.captions.desc}
                    status={totalPhotos > 0 ? `${captionsCount}/${totalPhotos}` : t.notSet}
                    statusColor={captionsCount > 0 ? 'text-green-700 bg-green-50' : 'text-gray-500 bg-gray-50'}
                    href={`/dashboard/listings/${listing.id}/brand`}
                    cta={t.brandEdit}
                  />
                  <FeatureRow
                    icon={<MapPin className="w-5 h-5" />}
                    iconBg="bg-violet-100 text-violet-600"
                    title={t.nearby.title}
                    desc={t.nearby.desc}
                    status={nearbyOverridesCount > 0 ? `${nearbyOverridesCount} hidden` : t.configured}
                    statusColor={'text-green-700 bg-green-50'}
                    href={`/dashboard/listings/${listing.id}/brand`}
                    cta={t.brandEdit}
                  />
                  <FeatureRow
                    icon={<Calendar className="w-5 h-5" />}
                    iconBg="bg-emerald-100 text-emerald-600"
                    title={t.availability.title}
                    desc={t.availability.desc}
                    status={blockedCount > 0 ? `${blockedCount}` : t.notSet}
                    statusColor={blockedCount > 0 ? 'text-green-700 bg-green-50' : 'text-gray-500 bg-gray-50'}
                    href={`/dashboard/listings/${listing.id}/availability`}
                    cta={t.brandEdit}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
function FeatureRow({
  icon, iconBg, title, desc, status, statusColor, href, cta, disabled = false,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  desc: string;
  status: string;
  statusColor: string;
  href: string;
  cta: string;
  disabled?: boolean;
}) {
  const content = (
    <div className={`flex items-center gap-3 p-4 ${disabled ? 'opacity-60' : 'hover:bg-gray-50 transition-colors'}`}>
      <span className={`inline-flex items-center justify-center w-10 h-10 rounded-lg shrink-0 ${iconBg}`}>
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-gray-900 text-sm">{title}</span>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusColor}`}>
            {status}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
      </div>
      {!disabled && (
        <span className="inline-flex items-center gap-1 text-sm text-primary-600 font-medium shrink-0">
          {cta}
          <ChevronRight className="w-4 h-4" />
        </span>
      )}
    </div>
  );

  if (disabled) return <div>{content}</div>;
  return <Link href={href}>{content}</Link>;
}
