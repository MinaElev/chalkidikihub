import { describe, it, expect } from 'vitest';
import { listingIssues, type QualityListing } from '@/lib/listing-quality';
import { qualityEmail } from '@/lib/email/quality-email';

const complete: QualityListing = {
  id: 'L1', title_el: 'Βίλα', description_el: 'x'.repeat(400), amenities: ['a', 'b', 'c', 'd', 'e'], photo_count: 8,
  latitude: 40.0, longitude: 23.8, contact_phone: '2370000000', contact_email: null, price_per_night: 80,
  guests_max: 4, bedrooms: 2, bathrooms: 1, check_in_time: '14:00', check_out_time: '11:00',
  check_in_info_el: 'κλειδί', how_to_reach_el: 'δρόμος', parking_info_el: 'ναι', wifi_info_el: 'ναι',
  rule_smoking: false, rule_pets: null, rule_parties: null, rule_kids: null,
};

describe('listingIssues', () => {
  it('a complete listing has no issues', () => {
    expect(listingIssues(complete)).toEqual([]);
  });
  it('flags photos, short description, default pin, contact and amenities as important', () => {
    const issues = listingIssues({ ...complete, photo_count: 2, description_el: 'μικρή', latitude: 40.1, longitude: 23.6, contact_phone: null, amenities: [] });
    expect(issues.filter((i) => i.weight === 'important').map((i) => i.key)).toEqual(['photos', 'description', 'pin', 'contact', 'amenities']);
    expect(issues[0].detail).toContain('Έχετε 2 φωτογραφίες');
  });
  it('groups practical info only when two or more pieces are missing', () => {
    expect(listingIssues({ ...complete, wifi_info_el: null }).map((i) => i.key)).not.toContain('practical');
    expect(listingIssues({ ...complete, wifi_info_el: null, parking_info_el: '' }).map((i) => i.key)).toContain('practical');
  });
});

describe('qualityEmail', () => {
  it('one section per listing, with its edit link, escaped titles', () => {
    const m = qualityEmail({
      ownerName: 'Μηνάς',
      siteUrl: 'https://chalkidikihub.gr',
      listings: [
        { id: 'A', title: 'Amira <House>', issues: listingIssues({ ...complete, photo_count: 0 }) },
        { id: 'B', title: 'Δεύτερο', issues: listingIssues({ ...complete, description_el: '' }) },
      ],
    });
    expect(m.subject).toBe('Μικρές βελτιώσεις για τις καταχωρήσεις σας στο ChalkidikiHub');
    expect(m.html).toContain('η ζήτηση για διαμονή στη Χαλκιδική αρχίζει να αυξάνεται');
    expect(m.html).toContain('Νοιαζόμαστε');
    expect(m.html).toContain('https://chalkidikihub.gr/dashboard/listings/A/edit');
    expect(m.html).toContain('https://chalkidikihub.gr/dashboard/listings/B/edit');
    expect(m.html).toContain('Amira &lt;House&gt;');
    expect(m.html).toContain('Προσθέστε φωτογραφίες');
    expect(m.html).toContain('Γράψτε μια περιγραφή');
    expect(m.html).toContain('/dashboard/listings/A/edit#photos');
    expect(m.html).toContain('/dashboard/listings/B/edit#basics');
  });
});
