-- ============================================================
-- CTR-BOOST: blog meta updates based on GSC 28-day data
-- Run this in Supabase SQL Editor (Database → SQL Editor → New query)
-- All 7 locales updated per article.
-- ============================================================

-- ───────────────────────────────────────────────────────────
-- 1. best-beaches-shallow-water
--    GSC: EN 329 imp pos 8.3, EL 67 imp pos 9.78, DE 45 imp pos 9.76 — all zero clicks
--    Old EN: "Shallow Water Beaches in Halkidiki | Perfect for Kids"
--    New: leads with NUMBER, adds age-target + year for trust signal
-- ───────────────────────────────────────────────────────────
UPDATE blog_articles SET
  meta_title_el = '12 Παραλίες με Ρηχά Νερά στη Χαλκιδική — Ιδανικές για Παιδιά (2026)',
  meta_title_en = '12 Best Shallow Water Beaches in Halkidiki — Safe for Toddlers (2026)',
  meta_title_de = '12 Strände mit flachem Wasser in Chalkidiki — Ideal für Kinder (2026)',
  meta_title_bg = '12 Плажа с плитки води в Халкидики — Идеални за деца (2026)',
  meta_title_ru = '12 Пляжей с мелкой водой в Халкидиках — Безопасно для детей (2026)',
  meta_title_ro = '12 Plaje cu apă mică în Halkidiki — Sigure pentru copii (2026)',
  meta_title_sr = '12 Plaža sa plitkom vodom u Halkidikiju — Sigurne za decu (2026)',
  meta_description_el = '12 παραλίες της Χαλκιδικής με ρηχά, καθαρά νερά — ασφαλείς για μωρά και μικρά παιδιά. Με parking, ομπρέλες, ταβέρνες, χάρτες και tips.',
  meta_description_en = '12 Halkidiki beaches with shallow, crystal water — safe for toddlers and young kids. Parking, sunbeds, tavernas, maps & local tips inside.',
  meta_description_de = '12 Strände in Chalkidiki mit flachem, klarem Wasser — sicher für Kleinkinder. Parkplatz, Sonnenliegen, Tavernen, Karten & Insider-Tipps.',
  meta_description_bg = '12 плажа в Халкидики с плитки, кристални води — безопасни за бебета и малки деца. Паркинг, шезлонги, таверни, карти и съвети.',
  meta_description_ru = '12 пляжей Халкидиков с мелкой, чистой водой — безопасно для малышей. Парковка, шезлонги, таверны, карты и местные советы.',
  meta_description_ro = '12 plaje în Halkidiki cu apă mică, cristalină — sigure pentru bebeluși și copii mici. Parcare, șezlonguri, taverne, hărți și sfaturi.',
  meta_description_sr = '12 plaža u Halkidikiju sa plitkom, kristalnom vodom — sigurne za bebe i malu decu. Parking, ležaljke, taverne, mape i lokalni saveti.'
WHERE slug = 'best-beaches-shallow-water';

-- ───────────────────────────────────────────────────────────
-- 2. breakfast-spots-halkidiki
--    GSC: EN 51 imp pos 8.16, zero clicks
--    Old: "Where to Have Breakfast in Halkidiki - Top Picks"
-- ───────────────────────────────────────────────────────────
UPDATE blog_articles SET
  meta_title_el = '12 Καλύτερα Σπίτια Πρωινού στη Χαλκιδική — Μπουγάτσα, Brunch, Θέα (2026)',
  meta_title_en = '12 Best Breakfast Spots in Halkidiki — Bougatsa, Brunch, Sea Views (2026)',
  meta_title_de = '12 Beste Frühstücks-Locations in Chalkidiki — Bougatsa, Brunch, Meerblick (2026)',
  meta_title_bg = '12 Най-добри места за закуска в Халкидики — Бугаца, Бранч (2026)',
  meta_title_ru = '12 Лучших мест для завтрака в Халкидиках — Бугаца, Бранч (2026)',
  meta_title_ro = '12 Cele mai bune locuri pentru micul dejun în Halkidiki — Bougatsa, Brunch (2026)',
  meta_title_sr = '12 Najboljih mesta za doručak u Halkidikiju — Bougatsa, Brunch (2026)',
  meta_description_el = 'Από κλασική μπουγάτσα στον Πολύγυρο μέχρι brunch με θέα στη θάλασσα — 12 ιδανικά σπίτια πρωινού στη Χαλκιδική. Τιμές, ώρες, διευθύνσεις.',
  meta_description_en = 'From classic bougatsa in Polygyros to brunch with sea views — 12 standout breakfast spots across Halkidiki. Prices, opening hours, addresses inside.',
  meta_description_de = 'Von klassischer Bougatsa in Polygyros bis Brunch mit Meerblick — 12 herausragende Frühstückslokale in Chalkidiki. Preise, Öffnungszeiten, Adressen.',
  meta_description_bg = 'От класическа бугаца в Полигирос до бранч с гледка към морето — 12 най-добри места за закуска в Халкидики. Цени, часове, адреси.',
  meta_description_ru = 'От классической бугацы в Полигиросе до бранча с видом на море — 12 лучших мест для завтрака в Халкидиках. Цены, часы, адреса.',
  meta_description_ro = 'De la bougatsa clasică din Polygyros la brunch cu vedere la mare — 12 locuri excelente pentru micul dejun în Halkidiki. Prețuri, ore, adrese.',
  meta_description_sr = 'Od klasične bougatse u Polygyrosu do brunča sa pogledom na more — 12 izvanrednih mesta za doručak u Halkidikiju. Cene, radno vreme, adrese.'
WHERE slug = 'breakfast-spots-halkidiki';

-- ───────────────────────────────────────────────────────────
-- 3. odigos-gia-neohori — BUG FIX
--    /en/blog/odigos-gia-neohori currently shows GREEK title because
--    meta_title_en is empty/null (falls back to title_el).
--    Fixing all 7 locales while we're here.
-- ───────────────────────────────────────────────────────────
UPDATE blog_articles SET
  meta_title_el = 'Νεοχώρι Χαλκιδικής — Πλήρης Οδηγός 2026 (Παραλίες, Ταβέρνες, Διαμονή)',
  meta_title_en = 'Neohori Halkidiki — Complete 2026 Travel Guide (Beaches, Tavernas, Stay)',
  meta_title_de = 'Neohori Chalkidiki — Kompletter Reiseführer 2026 (Strände, Tavernen)',
  meta_title_bg = 'Неохори Халкидики — Пълен пътеводител 2026 (Плажове, Таверни)',
  meta_title_ru = 'Неохори Халкидики — Полный путеводитель 2026 (Пляжи, Таверны)',
  meta_title_ro = 'Neohori Halkidiki — Ghid complet 2026 (Plaje, Taverne, Cazare)',
  meta_title_sr = 'Neohori Halkidiki — Kompletan vodič 2026 (Plaže, Taverne)',
  meta_description_el = 'Όλα για το Νεοχώρι Χαλκιδικής: παραλίες κοντά, ταβέρνες, καταλύματα, πώς θα φτάσεις, χάρτης. Ενημερωμένο 2026.',
  meta_description_en = 'Everything about Neohori, Halkidiki: nearby beaches, tavernas, accommodation, how to get there, map. Updated for 2026.',
  meta_description_de = 'Alles über Neohori, Chalkidiki: nahe Strände, Tavernen, Unterkünfte, Anreise, Karte. Aktualisiert für 2026.',
  meta_description_bg = 'Всичко за Неохори, Халкидики: близки плажове, таверни, настаняване, как да стигнете, карта. Актуализирано 2026.',
  meta_description_ru = 'Всё о Неохори, Халкидики: ближайшие пляжи, таверны, жильё, как добраться, карта. Обновлено на 2026.',
  meta_description_ro = 'Tot despre Neohori, Halkidiki: plaje apropiate, taverne, cazare, cum ajungi, hartă. Actualizat 2026.',
  meta_description_sr = 'Sve o Neohori, Halkidiki: obližnje plaže, taverne, smeštaj, kako stići, mapa. Ažurirano za 2026.'
WHERE slug = 'odigos-gia-neohori';

-- ───────────────────────────────────────────────────────────
-- After running: call the revalidate endpoint to flush the blog cache
-- so the new titles go live immediately (no 10-hour wait):
--
--   curl -X POST -H "Content-Type: application/json" \
--        -d '{"type":"blog"}' \
--        https://chalkidikihub.gr/api/revalidate
-- ───────────────────────────────────────────────────────────
