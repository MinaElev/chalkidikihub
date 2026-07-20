# Roadmap: Χρέωση Καταχωρήσεων (Listing Billing)

**Απόφαση (2026-07-19):** Οι υπάρχουσες καταχωρήσεις μένουν **δωρεάν για πάντα** (grandfathered).
Χρέωση μόνο για νέες καταχωρήσεις μετά την ημερομηνία cutoff. Το grandfathering είναι
**ανά listing**, όχι ανά ιδιοκτήτη — νέο ακίνητο από παλιό ιδιοκτήτη πληρώνει κανονικά.

## Τιμολόγηση

| Tier | Τιμή/έτος/καταλύμα | Ποιοι | Τι περιλαμβάνει |
|---|---|---|---|
| Grandfathered | 0€ | Listings που υπάρχουν πριν το cutoff | Ό,τι έχουν σήμερα, για πάντα |
| Basic | 79€ | Νέες καταχωρήσεις | Καταχώρηση, reviews, φίλτρα |
| Premium | 149€ (launch offer 99€ 1ο έτος για grandfathered) | Όλοι (προαιρετικά) | + priority ranking, featured badge, αναλυτικά στατιστικά |

- Μοντέλο πληρωμής: **one-off ετήσια πληρωμή** μέσω Stripe Checkout (mode=payment), ΟΧΙ subscription.
  Σκεπτικό: ανανεώσεις ευθυγραμμισμένες με τη σεζόν (Μάρτιο), όχι στην επέτειο· οι μικροί
  ιδιοκτήτες δυσπιστούν στο auto-renew· έχουμε ήδη cron υποδομή για reminders.
- Πρώτο έτος: ισχύς μέχρι 31 Μαρτίου του επόμενου έτους (όχι pro-rata πολυπλοκότητα).

## Ανοιχτές αποφάσεις (πριν το Phase 1)

- [ ] Τελικές τιμές: με ή χωρίς ΦΠΑ 24%; Παραστατικά (λογιστής / Stripe Tax / invoicing provider);
- [ ] Ημερομηνία cutoff + ημερομηνία ανακοίνωσης "free forever αν μπεις μέχρι Χ"
- [ ] Last-minute deals: σήμερα διαθέσιμα σε όλους. Αν γίνουν Premium-only, οι grandfathered
      **χάνουν** feature — παραβιάζει το "κανείς δεν χάνει τίποτα". Πρόταση: deals μένουν free
      για grandfathered, Premium-only για νέους. (Ίδιο ερώτημα για monthly report analytics.)
- [ ] Τι γίνεται σε μη ανανέωση Basic: πρόταση grace period 30 μέρες → `archived` (301 στο /stay;)

---

## Phase 0 — Pre-launch marketing (πριν από κώδικα)

Η ανακοίνωση του cutoff είναι growth hack: *«Καταχωρηθείτε μέχρι [ημερομηνία], δωρεάν για πάντα»*.

- Email σε υπάρχοντες ιδιοκτήτες: επιβεβαίωση free-forever status (χτίζει goodwill)
- Δημόσια ανακοίνωση (site banner + FB μέσω Make.com) με deadline
- Ενημέρωση Όρων Χρήσης (`/terms`) με το pricing policy
- Νέα σελίδα `/pricing` (4 locales: el/en/de/ro)

**Στόχος:** κύμα νέων καταχωρήσεων πριν κλείσει το παράθυρο → inventory + SEO boost.

## Phase 1 — DB foundation

Migration `054_listing_billing.sql`:

- Στήλες στο `listings` (ή πίνακας `listing_billing`):
  - `billing_exempt boolean default false` — grandfathered flag
  - `plan text check (plan in ('free','basic','premium')) default 'free'`
  - `plan_status text check (plan_status in ('none','pending_payment','active','past_due','expired')) default 'none'`
  - `plan_expires_at timestamptz`
- Πίνακας `billing_payments` (audit log): listing_id, stripe_session_id, amount, plan, paid_at
- **Backfill την ημέρα cutoff:** `UPDATE listings SET billing_exempt = true` για όλα τα υπάρχοντα
- RLS: owner διαβάζει τα δικά του billing πεδία, γράφει μόνο ο service role (webhook/admin)

## Phase 2 — Payment flow

- `POST /api/billing/checkout` — δημιουργεί Stripe Checkout session (mode=payment,
  metadata: `listing_id`, `plan`, `kind='listing_billing'`). Reuse του `stripeFetch` από
  `src/lib/pms/stripe.ts` — **στο platform account**, όχι Connect.
- Επέκταση του υπάρχοντος `/api/stripe/webhook`: στο `checkout.session.completed`
  διάκριση με `metadata.kind` — αν `listing_billing` → set `plan`, `plan_status='active'`,
  `plan_expires_at`, insert στο `billing_payments`, email επιβεβαίωσης (Resend).
- **Gate στο publish flow:** νέο listing → admin approval (υπάρχον `pending` flow) →
  αντί για άμεσο publish, `plan_status='pending_payment'` + email με payment link →
  webhook κάνει το publish. Ο admin κρατά quality control ΠΡΙΝ ζητηθούν χρήματα.
- Admin override: κουμπί "comp" (δωρεάν ενεργοποίηση) για ειδικές περιπτώσεις.

## Phase 3 — UI

- Dashboard: σελίδα `dashboard/billing` — τρέχον plan, λήξη, ιστορικό πληρωμών, CTA upgrade σε Premium
- `dashboard/listings/new`: ενημέρωση flow με τα βήματα (υποβολή → έγκριση → πληρωμή → live)
- Δημόσια `/pricing` σελίδα (από Phase 0, τώρα με λειτουργικά CTAs)
- Admin: billing overview (ποιος πλήρωσε τι, λήξεις, MRR-ish σύνοψη)

## Phase 4 — Premium features

- **Priority ranking:** premium listings πρώτα στα αποτελέσματα area/search (τροποποίηση
  στα queries του `src/lib/data.ts` — δευτερεύον sort key)
- **Badge** "Featured" στο ListingCard + listing page
- **Analytics gate:** το monthly report email (Phase 2 του owner-report project) στέλνει
  full version στους Premium, teaser στους υπόλοιπους — τα δύο projects κουμπώνουν εδώ
- Last-minute deals gating σύμφωνα με την απόφαση στο "Ανοιχτές αποφάσεις"

## Phase 5 — Renewals lifecycle

- Cron `/api/cron/billing-reminders` (πρότυπο τα υπάρχοντα crons στο `vercel.json`):
  - 60 & 30 & 7 μέρες πριν το `plan_expires_at`: reminder email με payment link
  - Μετά τη λήξη: `past_due`, grace period 30 μέρες
  - Μετά το grace: Basic → `archived` (unpublish), Premium → υποβιβασμός σε Basic behavior
- Όλες οι ανανεώσεις λήγουν 31 Μαρτίου → μία περίοδος ανανεώσεων τον χρόνο, προβλέψιμη

## Phase 6 — Launch & παρακολούθηση

- Deploy (χειροκίνητα `npx vercel --prod --yes` — δεν κάνει auto-deploy)
- Stripe: δημιουργία products/prices στο dashboard, webhook event live test
- E2E test: νέα καταχώρηση → approval → πληρωμή (test mode) → publish → email
- Metrics: conversion rate νέων υποβολών, Premium take-rate στους grandfathered

## Σειρά υλοποίησης / εξαρτήσεις

```
Phase 0 (marketing) ──┐ τρέχει παράλληλα, ΠΡΙΝ το cutoff
Phase 1 (DB) → Phase 2 (payments) → Phase 3 (UI) → Phase 6 (launch)
Phase 4 (premium features) → μπορεί και μετά το launch
Phase 5 (renewals) → deadline: πριν τον πρώτο Μάρτιο, όχι πριν το launch
```

Το κρίσιμο μονοπάτι είναι 1→2→3→6. Τα Phase 4/5 δεν μπλοκάρουν το go-live:
μπορείς να πουλάς Basic από την πρώτη μέρα και να προσθέσεις τα Premium perks
στις εβδομάδες μετά (οι πρώτοι Premium αγοράζουν την υπόσχεση + το priority ranking).
