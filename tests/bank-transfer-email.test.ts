import { describe, it, expect, vi } from 'vitest';
import fs from 'node:fs';

vi.mock('server-only', () => ({}));
vi.mock('@/lib/supabase/clients', () => ({ adminDb: () => ({}) }));
const { bankTransferEmail } = await import('@/lib/email/bank-transfer-email');

const base = {
  ownerName: 'Μηνάς',
  listingTitle: 'Amira House <Sithonia>',
  amountLabel: '90€',
  planLabel: 'Βασικό, 1 έτος',
  renewal: false,
  bank: { iban: 'GR00 0000 0000 0000 0000 0000 000', beneficiary: 'Δικαιούχος Δοκιμής', bank: 'Τράπεζα Δοκιμής', bic: 'TESTGRAA' },
  dashboardUrl: 'https://chalkidikihub.gr/dashboard/billing?pay=x',
};

describe('bankTransferEmail', () => {
  it('says the listing is complete, awaits the deposit, and shows IBAN + reference', () => {
    const m = bankTransferEmail(base);
    expect(m.subject).toContain('ολοκληρώθηκε');
    expect(m.subject).toContain('αναμένεται η τραπεζική κατάθεση');
    expect(m.html).toContain('GR00 0000 0000 0000 0000 0000 000');
    expect(m.html).toContain('Στην αιτιολογία / στα σχόλια της κατάθεσης γράψτε');
    expect(m.html).toContain('Amira House &lt;Sithonia&gt;');   // escaped
    expect(m.html).not.toContain('<Sithonia>');
    expect(m.text).toContain('Στην αιτιολογία / στα σχόλια της κατάθεσης γράψτε: Amira House <Sithonia>');
    if (process.env.EMAIL_PREVIEW) fs.writeFileSync(process.env.EMAIL_PREVIEW, m.html);
  });

  it('renewal wording, and no IBAN configured', () => {
    const m = bankTransferEmail({ ...base, renewal: true, bank: { iban: '', beneficiary: '', bank: '', bic: '' } });
    expect(m.subject).toContain('Ανανέωση');
    expect(m.html).toContain('Θα επικοινωνήσουμε σύντομα');
    expect(m.text).not.toContain('IBAN');
  });
});
