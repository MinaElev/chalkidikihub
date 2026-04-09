-- Dynamic business/cuisine types managed by admin
CREATE TABLE IF NOT EXISTS business_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_el TEXT NOT NULL,
  name_en TEXT DEFAULT '',
  name_de TEXT DEFAULT '',
  name_bg TEXT DEFAULT '',
  name_ru TEXT DEFAULT '',
  name_ro TEXT DEFAULT '',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE business_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read business_types" ON business_types FOR SELECT USING (true);
CREATE POLICY "Superadmin manage business_types" ON business_types FOR ALL
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'superadmin'));

-- Seed existing 14 types
INSERT INTO business_types (slug, name_el, name_en, name_de, name_bg, name_ru, name_ro, sort_order) VALUES
  ('seafood', 'Θαλασσινά', 'Seafood', 'Meeresfrüchte', 'Морски дарове', 'Морепродукты', 'Fructe de mare', 1),
  ('traditional', 'Παραδοσιακή', 'Traditional', 'Traditionell', 'Традиционна', 'Традиционная', 'Tradițional', 2),
  ('grill', 'Ψησταριά', 'Grill', 'Grill', 'Скара', 'Гриль', 'Grătar', 3),
  ('mediterranean', 'Μεσογειακή', 'Mediterranean', 'Mediterran', 'Средиземноморска', 'Средиземноморская', 'Mediteraneean', 4),
  ('pizza', 'Πίτσα', 'Pizza', 'Pizza', 'Пица', 'Пицца', 'Pizza', 5),
  ('cafe', 'Καφέ', 'Café', 'Café', 'Кафе', 'Кафе', 'Cafea', 6),
  ('fineDining', 'Fine dining', 'Fine Dining', 'Fine Dining', 'Фино хранене', 'Высокая кухня', 'Fine Dining', 7),
  ('streetFood', 'Street food', 'Street Food', 'Street Food', 'Улична храна', 'Стрит-фуд', 'Street Food', 8),
  ('beachBar', 'Beach Bar', 'Beach Bar', 'Beach Bar', 'Бийч бар', 'Бич-бар', 'Beach Bar', 9),
  ('bar', 'Μπαρ', 'Bar', 'Bar', 'Бар', 'Бар', 'Bar', 10),
  ('cocktailBar', 'Cocktail Bar', 'Cocktail Bar', 'Cocktail Bar', 'Коктейл бар', 'Коктейль-бар', 'Cocktail Bar', 11),
  ('brunch', 'Brunch', 'Brunch', 'Brunch', 'Бранч', 'Бранч', 'Brunch', 12),
  ('cafeBar', 'Καφέ-Μπαρ', 'Café-Bar', 'Café-Bar', 'Кафе-бар', 'Кафе-бар', 'Café-Bar', 13),
  ('bakery', 'Φούρνος', 'Bakery', 'Bäckerei', 'Пекарна', 'Пекарня', 'Brutărie', 14)
ON CONFLICT (slug) DO NOTHING;
