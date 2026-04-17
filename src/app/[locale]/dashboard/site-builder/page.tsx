'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { Link } from '@/i18n/navigation';
import {
  Loader2, Wand2, Sparkles, BookOpen, HelpCircle, Eye, ChevronRight, Plus,
  AlertTriangle, Calendar,
} from 'lucide-react';

interface DbListing {
  id: string;
  slug: string;
  title_el: string | null;
  title_en: string | null;
  area: string;
  status: string;
  tagline_el: string | null;
  owner_story_el: string | null;
  // Computed
  faqs_count?: number;
  emergency_count?: number;
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

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('listings')
        .select('id, slug, title_el, title_en, area, status, tagline_el, owner_story_el')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (!data) {
        setListings([]);
        setLoading(false);
        return;
      }

      // Counts per listing (best effort — no-op if a query fails)
      const ids = data.map(l => l.id);
      const faqCounts: Record<string, number> = {};
      const emergencyCounts: Record<string, number> = {};
      const blockedCounts: Record<string, number> = {};

      if (ids.length > 0) {
        const today = new Date().toISOString().slice(0, 10);
        const [faqsRes, emergRes, availRes] = await Promise.all([
          supabase.from('listing_faqs').select('listing_id').in('listing_id', ids),
          supabase.from('listing_emergency_contacts').select('listing_id').in('listing_id', ids),
          supabase.from('listing_availability').select('listing_id').in('listing_id', ids).gte('date', today),
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
      }

      setListings(
        data.map(l => ({
          ...l,
          faqs_count: faqCounts[l.id] || 0,
          emergency_count: emergencyCounts[l.id] || 0,
          blocked_count: blockedCounts[l.id] || 0,
        })) as DbListing[],
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
      <p className="text-sm text-gray-600 mb-6 max-w-2xl">{t.subtitle}</p>

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

            return (
              <div
                key={listing.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
              >
                {/* Listing header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-200">
                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-gray-900 truncate">{title}</h2>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-0.5 text-xs text-gray-500">
                      <span className="capitalize">{listing.area}</span>
                      <span>·</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                          listing.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {listing.status}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/stay/${listing.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-primary-700 px-3 py-1.5 bg-white border border-gray-200 rounded-lg self-start sm:self-auto"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    {t.viewPublic}
                  </Link>
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
