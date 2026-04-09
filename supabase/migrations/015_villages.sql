-- Villages / Places table for SEO pages per village/town
CREATE TABLE villages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  area TEXT NOT NULL,
  name_el TEXT NOT NULL,
  name_en TEXT,
  name_de TEXT,
  name_bg TEXT,
  name_ru TEXT,
  name_ro TEXT,
  description_el TEXT,
  description_en TEXT,
  description_de TEXT,
  description_bg TEXT,
  description_ru TEXT,
  description_ro TEXT,
  latitude FLOAT,
  longitude FLOAT,
  image_url TEXT,
  image_alt TEXT,
  population INT,
  meta_title_el TEXT,
  meta_title_en TEXT,
  meta_title_de TEXT,
  meta_title_bg TEXT,
  meta_title_ru TEXT,
  meta_title_ro TEXT,
  meta_description_el TEXT,
  meta_description_en TEXT,
  meta_description_de TEXT,
  meta_description_bg TEXT,
  meta_description_ru TEXT,
  meta_description_ro TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE villages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Villages are publicly readable"
  ON villages FOR SELECT USING (true);

CREATE POLICY "Superadmins can manage villages"
  ON villages FOR ALL
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'superadmin')
  );

-- Seed villages
INSERT INTO villages (slug, area, name_el, name_en, latitude, longitude, sort_order) VALUES
-- Kassandra (west peninsula)
('hanioti', 'kassandra', 'Χανιώτη', 'Hanioti', 39.9367, 23.5178, 1),
('pefkohori', 'kassandra', 'Πευκοχώρι', 'Pefkohori', 39.9556, 23.6033, 2),
('kallithea', 'kassandra', 'Καλλιθέα', 'Kallithea', 40.0439, 23.4194, 3),
('kassandria', 'kassandra', 'Κασσανδρεία', 'Kassandria', 40.0475, 23.4075, 4),
('polychrono', 'kassandra', 'Πολύχρονο', 'Polychrono', 39.9728, 23.5450, 5),
('fourka', 'kassandra', 'Φούρκα', 'Fourka', 40.0564, 23.3278, 6),
('sani', 'kassandra', 'Σάνη', 'Sani', 40.0917, 23.3053, 7),
('afytos', 'kassandra', 'Αφύτος', 'Afytos', 40.0675, 23.4297, 8),
('kriopigi', 'kassandra', 'Κρυοπηγή', 'Kriopigi', 40.0150, 23.4508, 9),
('paliouri', 'kassandra', 'Παλιούρι', 'Paliouri', 39.8833, 23.6667, 10),
('posidi', 'kassandra', 'Ποσείδι', 'Posidi', 39.9333, 23.3833, 11),
('siviri', 'kassandra', 'Σιβηρή', 'Siviri', 40.0489, 23.3439, 12),
('nea-skioni', 'kassandra', 'Νέα Σκιώνη', 'Nea Skioni', 39.9167, 23.5000, 13),
('elani', 'kassandra', 'Ελάνη', 'Elani', 40.0578, 23.4583, 14),
-- Sithonia (middle peninsula)
('nikiti', 'sithonia', 'Νικήτη', 'Nikiti', 40.2158, 23.6708, 15),
('sarti', 'sithonia', 'Σάρτη', 'Sarti', 40.0833, 23.9667, 16),
('vourvourou', 'sithonia', 'Βουρβουρού', 'Vourvourou', 40.1833, 23.7667, 17),
('metamorfosi', 'sithonia', 'Μεταμόρφωση', 'Metamorfosi', 40.2383, 23.6342, 18),
('neos-marmaras', 'sithonia', 'Νέος Μαρμαράς', 'Neos Marmaras', 40.0931, 23.7703, 19),
('toroni', 'sithonia', 'Τορώνη', 'Toroni', 40.0000, 23.8833, 20),
('porto-koufo', 'sithonia', 'Πόρτο Κουφό', 'Porto Koufo', 39.9667, 23.8833, 21),
('kalamitsi', 'sithonia', 'Καλαμίτσι', 'Kalamitsi', 40.0056, 23.9639, 22),
('sikia', 'sithonia', 'Συκιά', 'Sikia', 40.0372, 23.9383, 23),
('agios-nikolaos', 'sithonia', 'Αγ. Νικόλαος', 'Agios Nikolaos', 40.1833, 23.7000, 24),
-- Athos (east peninsula)
('ierissos', 'athos', 'Ιερισσός', 'Ierissos', 40.3833, 23.8833, 25),
('ouranoupoli', 'athos', 'Ουρανούπολη', 'Ouranoupoli', 40.3264, 23.9786, 26),
('nea-roda', 'athos', 'Νέα Ρόδα', 'Nea Roda', 40.3803, 23.9319, 27),
('tripiti', 'athos', 'Τριπήτη', 'Tripiti', 40.3553, 23.9128, 28),
-- Mainland Halkidiki
('nea-moudania', 'mainland', 'Νέα Μουδανιά', 'Nea Moudania', 40.2444, 23.2833, 29),
('nea-potidaia', 'mainland', 'Νέα Ποτίδαια', 'Nea Potidaia', 40.1975, 23.3353, 30),
('ormylia', 'mainland', 'Ορμύλια', 'Ormylia', 40.2667, 23.5833, 31),
('polygyros', 'mainland', 'Πολύγυρος', 'Polygyros', 40.3750, 23.4378, 32),
('arnaia', 'mainland', 'Αρναία', 'Arnaia', 40.4833, 23.5833, 33),
('megali-panagia', 'mainland', 'Μεγάλη Παναγία', 'Megali Panagia', 40.4208, 23.6125, 34),
('stagira', 'mainland', 'Στάγειρα', 'Stagira', 40.5167, 23.7500, 35);
