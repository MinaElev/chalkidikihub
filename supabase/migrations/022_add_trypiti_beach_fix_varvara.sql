-- Add Trypiti beach (GSC shows users searching for "τρυπητη χαλκιδικη")
INSERT INTO beaches (
  slug, name_el, name_en, name_de, name_bg, name_ru, name_ro, name_sr,
  description_el, description_en, description_de, description_bg, description_ru, description_ro, description_sr,
  area, location_name, latitude, longitude, features, rating, reviews_count, image_url
) VALUES (
  'trypiti-athos',
  'Τρυπητή', 'Trypiti', 'Trypiti', 'Трипити', 'Трипити', 'Trypiti', 'Tripiti',
  'Η παραλία **Τρυπητή** βρίσκεται στη χερσόνησο του **Άθω**, στη **Χαλκιδική**. Πρόκειται για μια εντυπωσιακή παραλία με κρυστάλλινα νερά και βραχώδεις σχηματισμούς. Το όνομά της προέρχεται από τους χαρακτηριστικούς τρυπητούς βράχους που σχηματίζουν φυσικές αψίδες. Η παραλία είναι ελεύθερη και ιδανική για όσους αναζητούν ήρεμη φυσική ομορφιά μακριά από τον συνωστισμό. Τα νερά είναι βαθιά τιρκουάζ και ο βυθός βραχώδης. Προσβάσιμη με αυτοκίνητο, υπάρχει χώρος στάθμευσης κοντά.',
  '**Trypiti** beach is located on the **Athos** peninsula in **Halkidiki**. It is a stunning beach with crystal-clear waters and rocky formations. Its name comes from the characteristic pierced rocks that form natural arches. The beach is free and ideal for those seeking peaceful natural beauty away from crowds. The waters are deep turquoise and the seabed is rocky. Accessible by car with parking nearby.',
  'Der Strand **Trypiti** befindet sich auf der **Athos**-Halbinsel in **Chalkidiki**. Es ist ein atemberaubender Strand mit kristallklarem Wasser und Felsformationen. Sein Name kommt von den charakteristischen durchbohrten Felsen, die natürliche Bögen bilden. Der Strand ist frei und ideal für alle, die ruhige natürliche Schönheit abseits der Massen suchen.',
  'Плажът **Трипити** се намира на полуостров **Атон** в **Халкидики**. Това е зашеметяващ плаж с кристално чисти води и скални формации. Името му идва от характерните пробити скали, които образуват естествени арки. Плажът е свободен и идеален за търсещите спокойна природна красота.',
  'Пляж **Трипити** расположен на полуострове **Афон** в **Халкидиках**. Это потрясающий пляж с кристально чистой водой и скальными образованиями. Его название происходит от характерных пробитых скал, образующих естественные арки. Пляж свободный и идеальный для тех, кто ищет спокойную природную красоту.',
  'Plaja **Trypiti** se află pe peninsula **Athos** din **Halkidiki**. Este o plajă uimitoare cu ape cristal-limpezi și formațiuni stâncoase. Numele său provine de la stâncile perforate care formează arcuri naturale. Plaja este liberă și ideală pentru cei care caută frumusețe naturală liniștită.',
  'Plaža **Tripiti** se nalazi na poluostrvu **Atos** u **Halkidikiju**. To je zadivljujuća plaža sa kristalno čistom vodom i stenovitim formacijama. Ime potiče od karakterističnih probušenih stena koje formiraju prirodne lukove. Plaža je slobodna i idealna za one koji traže mirnu prirodnu lepotu.',
  'athos', 'Τρυπητή, Άθως', 40.364727, 23.918309,
  '{"pebble","free","parking"}',
  4.5, 0, ''
) ON CONFLICT (slug) DO NOTHING;

-- Fix Varvara village: name_en should be "Varvara" not "Barbara" (SEO: users search "varvara halkidiki")
UPDATE villages SET name_en = 'Varvara' WHERE slug = 'varvara' AND name_en = 'Barbara';
