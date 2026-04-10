-- Monasteries table for Mount Athos
CREATE TABLE monasteries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  rank INT NOT NULL,
  founded INT,
  nation TEXT DEFAULT 'el',
  name_el TEXT NOT NULL, name_en TEXT, name_de TEXT, name_bg TEXT, name_ru TEXT, name_ro TEXT,
  description_el TEXT, description_en TEXT, description_de TEXT, description_bg TEXT, description_ru TEXT, description_ro TEXT,
  highlights_el TEXT, highlights_en TEXT, highlights_de TEXT, highlights_bg TEXT, highlights_ru TEXT, highlights_ro TEXT,
  latitude FLOAT, longitude FLOAT,
  image_url TEXT, image_alt TEXT,
  meta_title_el TEXT, meta_title_en TEXT, meta_title_de TEXT, meta_title_bg TEXT, meta_title_ru TEXT, meta_title_ro TEXT,
  meta_description_el TEXT, meta_description_en TEXT, meta_description_de TEXT, meta_description_bg TEXT, meta_description_ru TEXT, meta_description_ro TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE monasteries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Monasteries are publicly readable"
  ON monasteries FOR SELECT USING (true);

CREATE POLICY "Superadmins can manage monasteries"
  ON monasteries FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'superadmin'));

-- Seed 20 monasteries
INSERT INTO monasteries (slug, rank, founded, nation, name_el, name_en, latitude, longitude) VALUES
('megisti-lavra', 1, 963, 'el', 'Μεγίστης Λαύρας', 'Great Lavra', 40.1600, 24.3900),
('vatopedi', 2, 972, 'el', 'Βατοπαιδίου', 'Vatopedi', 40.3200, 24.2400),
('iviron', 3, 976, 'el', 'Ιβήρων', 'Iviron', 40.2700, 24.2600),
('chilandariou', 4, 1198, 'rs', 'Χιλανδαρίου', 'Chilandariou', 40.3500, 24.1700),
('dionysiou', 5, 1375, 'el', 'Διονυσίου', 'Dionysiou', 40.1700, 24.2800),
('koutloumousiou', 6, 1169, 'el', 'Κουτλουμουσίου', 'Koutloumousiou', 40.2650, 24.2150),
('pantokratoros', 7, 1363, 'el', 'Παντοκράτορος', 'Pantokratoros', 40.2900, 24.2700),
('xeropotamou', 8, 956, 'el', 'Ξηροποτάμου', 'Xeropotamou', 40.2400, 24.2100),
('zografou', 9, 971, 'bg', 'Ζωγράφου', 'Zografou', 40.3400, 24.1300),
('dochiariou', 10, 1045, 'el', 'Δοχειαρίου', 'Dochiariou', 40.2800, 24.1900),
('karakalou', 11, 1070, 'el', 'Καρακάλου', 'Karakalou', 40.2200, 24.2800),
('philotheou', 12, 992, 'el', 'Φιλοθέου', 'Philotheou', 40.2300, 24.2900),
('simonos-petras', 13, 1257, 'el', 'Σίμωνος Πέτρας', 'Simonos Petras', 40.2000, 24.2500),
('agiou-pavlou', 14, 934, 'el', 'Αγίου Παύλου', 'Agiou Pavlou', 40.1800, 24.2600),
('stavronikita', 15, 1541, 'el', 'Σταυρονικήτα', 'Stavronikita', 40.2500, 24.2700),
('xenofontos', 16, 998, 'el', 'Ξενοφώντος', 'Xenofontos', 40.2600, 24.2000),
('gregoriou', 17, 1345, 'el', 'Γρηγορίου', 'Gregoriou', 40.1900, 24.2700),
('esphigmenou', 18, 1001, 'el', 'Εσφιγμένου', 'Esphigmenou', 40.3300, 24.2200),
('agiou-panteleimonos', 19, 1169, 'ru', 'Αγίου Παντελεήμονος', 'Agiou Panteleimonos', 40.2700, 24.2000),
('konstamonitou', 20, 1080, 'el', 'Κωνσταμονίτου', 'Konstamonitou', 40.3100, 24.1400);
