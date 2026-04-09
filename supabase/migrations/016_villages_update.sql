-- Clear existing villages and re-seed with correct list
DELETE FROM villages;

-- Kassandra
INSERT INTO villages (slug, area, name_el, name_en, latitude, longitude, sort_order) VALUES
('nea-potidaia', 'kassandra', 'Νέα Ποτίδαια', 'Nea Potidaia', 40.1975, 23.3353, 1),
('nea-fokaia', 'kassandra', 'Νέα Φώκαια', 'Nea Fokaia', 40.1408, 23.3917, 2),
('afytos', 'kassandra', 'Άφυτος', 'Afytos', 40.0675, 23.4297, 3),
('kallithea', 'kassandra', 'Καλλιθέα', 'Kallithea', 40.0439, 23.4194, 4),
('kriopigi', 'kassandra', 'Κρυοπηγή', 'Kriopigi', 40.0150, 23.4508, 5),
('polychrono', 'kassandra', 'Πολύχρονο', 'Polychrono', 39.9728, 23.5450, 6),
('hanioti', 'kassandra', 'Χανιώτη', 'Hanioti', 39.9367, 23.5178, 7),
('pefkohori', 'kassandra', 'Πευκοχώρι', 'Pefkohori', 39.9556, 23.6033, 8),
('paliouri', 'kassandra', 'Παλιούρι', 'Paliouri', 39.8833, 23.6667, 9),
('agia-paraskevi', 'kassandra', 'Αγία Παρασκευή', 'Agia Paraskevi', 39.9714, 23.4753, 10),
('loutra-agias-paraskevis', 'kassandra', 'Λουτρά Αγίας Παρασκευής', 'Loutra Agias Paraskevis', 39.9683, 23.4800, 11),
('nea-skioni', 'kassandra', 'Νέα Σκιώνη', 'Nea Skioni', 39.9167, 23.5000, 12),
('mola-kalyva', 'kassandra', 'Μόλα Καλύβα', 'Mola Kalyva', 40.0833, 23.4333, 13),
('siviri', 'kassandra', 'Σιβηρή', 'Siviri', 40.0489, 23.3439, 14),
('fourka', 'kassandra', 'Φούρκα', 'Fourka', 40.0564, 23.3278, 15),
('kalandra', 'kassandra', 'Καλάνδρα', 'Kalandra', 39.9222, 23.4556, 16),
('kassandrino', 'kassandra', 'Κασσανδρινό', 'Kassandrino', 40.0347, 23.4092, 17),
('posidi', 'kassandra', 'Ποσείδι', 'Posidi', 39.9333, 23.3833, 18),

-- Sithonia
('nikiti', 'sithonia', 'Νικήτη', 'Nikiti', 40.2158, 23.6708, 19),
('neos-marmaras', 'sithonia', 'Νέος Μαρμαράς', 'Neos Marmaras', 40.0931, 23.7703, 20),
('sarti', 'sithonia', 'Σάρτη', 'Sarti', 40.0833, 23.9667, 21),
('sikia', 'sithonia', 'Συκιά', 'Sikia', 40.0372, 23.9383, 22),
('metamorfosi', 'sithonia', 'Μεταμόρφωση', 'Metamorfosi', 40.2383, 23.6342, 23),
('agios-nikolaos', 'sithonia', 'Αγιος Νικόλαος', 'Agios Nikolaos', 40.1833, 23.7000, 24),
('pyrgadikia', 'sithonia', 'Πυργαδίκια', 'Pyrgadikia', 40.2778, 23.6222, 25),
('ormos-panagias', 'sithonia', 'Όρμος Παναγιάς', 'Ormos Panagias', 40.2333, 23.7167, 26),
('vourvourou', 'sithonia', 'Βουρβουρού', 'Vourvourou', 40.1833, 23.7667, 27),
('elia', 'sithonia', 'Ελιά', 'Elia', 40.0611, 23.7997, 28),
('parthenonas', 'sithonia', 'Παρθενώνας', 'Parthenonas', 40.1167, 23.7667, 29),
('planitsi', 'sithonia', 'Πλατανίτσι', 'Platanisti', 40.1500, 23.7833, 30),
('kalamitsi', 'sithonia', 'Καλαμίτσι', 'Kalamitsi', 40.0056, 23.9639, 31),
('porto-koufo', 'sithonia', 'Πόρτο Κουφό', 'Porto Koufo', 39.9667, 23.8833, 32),
('toroni', 'sithonia', 'Τορώνη', 'Toroni', 40.0000, 23.8833, 33),

-- Athos
('ierissos', 'athos', 'Ιερισσός', 'Ierissos', 40.3833, 23.8833, 34),
('nea-roda', 'athos', 'Νέα Ρόδα', 'Nea Roda', 40.3803, 23.9319, 35),
('ouranoupoli', 'athos', 'Ουρανούπολη', 'Ouranoupoli', 40.3264, 23.9786, 36),
('ammouliani', 'athos', 'Αμμουλιανή', 'Ammouliani', 40.3333, 23.9167, 37),
('tripiti', 'athos', 'Τρυπητή', 'Tripiti', 40.3553, 23.9128, 38),
('xiropotamo', 'athos', 'Ξηροπόταμο', 'Xiropotamo', 40.3667, 23.8500, 39);
