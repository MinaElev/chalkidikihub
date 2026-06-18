// Editorial enrichment content for high-priority /best/[slug] pages.
//
// The thin "title + 1-line description + items grid" render in page.tsx works
// fine for utility pages, but the top-volume programmatic pages (best beaches
// per peninsula, family beaches, quiet beaches, seafood restaurants) need
// long-form content to rank for their target queries. This file holds the
// hand-written intro / seasonal context / tips / FAQ overrides keyed by guide
// slug; page.tsx renders the sections only for slugs that have an entry here,
// so the rest of the site stays unchanged.
//
// Each block is HTML. Internal links are encouraged — they push PageRank to
// detail pages and other /best/ guides.

type L = Record<string, string>;

export interface BestGuideEnrichment {
  /** Long-form intro paragraph(s), rendered after the hero. ~500-800 chars. */
  intro?: L;
  /** "How we picked" — editorial criteria block. ~300-500 chars. */
  criteria?: L;
  /** Seasonal / timing guidance specific to the category. ~300-500 chars. */
  seasonal?: L;
  /** Practical tips bulleted list (HTML <ul>). */
  tips?: L;
  /** Custom Q&A overriding the auto-generated FAQ from faq-generators. */
  faqs?: {
    q: L;
    a: L;
  }[];
}

export const ENRICHMENTS: Record<string, BestGuideEnrichment> = {
  // ───────────────────────────────────────────────────────────────────
  'beaches-kassandra': {
    intro: {
      el: '<p>Η Κασσάνδρα είναι το πρώτο και πιο προσβάσιμο από τα τρία πόδια της Χαλκιδικής — μόλις μία ώρα από τη Θεσσαλονίκη. Έχει μερικές από τις πιο οργανωμένες, φωτογενείς και κοσμοπολίτικες παραλίες της βόρειας Ελλάδας: από μεγάλες αμμώδεις εκτάσεις με beach bars και ξαπλώστρες μέχρι ήσυχους όρμους που μένουν σχετικά απάτητοι ακόμη και τον Αύγουστο. Η ανατολική και η δυτική ακτή έχουν διαφορετικό χαρακτήρα — το ανατολικό προστατεύεται από τους ετήσιους ανέμους, το δυτικό προσφέρει εντυπωσιακό ηλιοβασίλεμα. Αυτή η λίστα συγκεντρώνει τις παραλίες που σταθερά ανεβαίνουν στις προτιμήσεις των επισκεπτών μας, με βάση αξιολογήσεις, διαθέσιμες υποδομές και ποιότητα νερού.</p>',
      en: '<p>Kassandra is the first and most accessible of Halkidiki\'s three legs — just an hour from Thessaloniki. It has some of the most organised, photogenic and cosmopolitan beaches in northern Greece: long sandy stretches with beach bars and sun loungers, plus quiet bays that stay relatively unspoiled even in August. The east and west coasts have different characters — the east is sheltered from the seasonal winds, the west offers spectacular sunsets. This list collects the beaches that consistently top our visitors\' preferences, based on ratings, available facilities and water quality.</p>',
    },
    seasonal: {
      el: '<h2>Πότε να πας</h2><p><strong>Ιούνιος:</strong> ιδανικός — θάλασσα 22-24°C, λίγος κόσμος, full υπηρεσίες ανοιχτές. <strong>Ιούλιος-Αύγουστος:</strong> peak — γέμισμα μετά τις 10:30, κράτηση beach bar συνιστάται. <strong>Σεπτέμβριος:</strong> το αγαπημένο των ντόπιων — ζεστή θάλασσα (25°C), αδειασμένες παραλίες μετά τις 7 του μήνα. Δείτε τον <a href="/blog/halkidiki-september-guide">πλήρη οδηγό Σεπτεμβρίου</a>.</p>',
      en: '<h2>When to visit</h2><p><strong>June:</strong> ideal — sea 22-24°C, fewer crowds, full services open. <strong>July-August:</strong> peak — beaches fill up after 10:30, beach-bar reservations recommended. <strong>September:</strong> the locals\' favourite — warm sea (25°C), empty beaches after the 7th. See our <a href="/blog/halkidiki-september-guide">full September guide</a>.</p>',
    },
    tips: {
      el: '<h2>Συμβουλές επί τόπου</h2><ul><li><strong>Νωρίς το πρωί:</strong> Στις πιο γνωστές (Καλλιθέα, Σάνη, Χανιώτη), ξαπλώστρες πιάνονται 9:00-10:00. Φτάσε νωρίς ή πάρε δικό σου σετ.</li><li><strong>Parking:</strong> Σαββατοκύριακα Ιουλίου-Αυγούστου, παρκάρισμα είναι το πρόβλημα. Σε Καλλιθέα και Πευκοχώρι χρειάζεσαι patience.</li><li><strong>Πιο ήσυχες επιλογές:</strong> Δες τις <a href="/best/quiet-beaches">ήσυχες παραλίες της Χαλκιδικής</a> για αποφυγή πλήθους.</li><li><strong>Φαγητό:</strong> Φάε στα παραδοσιακά χωριά εσωτερικά (Άφυτος, Πευκοχώρι παλιό) αντί για beach restaurants — καλύτερη ποιότητα.</li><li><strong>Από Βαλκάνια οδικώς:</strong> Δες τους <a href="/from">οδηγούς πρόσβασης ανά πόλη</a>.</li></ul>',
      en: '<h2>On-site tips</h2><ul><li><strong>Early morning:</strong> At the most famous beaches (Kallithea, Sani, Hanioti) loungers go between 9:00 and 10:00. Arrive early or bring your own kit.</li><li><strong>Parking:</strong> July-August weekends, parking is the bottleneck. In Kallithea and Pefkochori, plan for patience.</li><li><strong>Quieter alternatives:</strong> See our list of <a href="/best/quiet-beaches">Halkidiki\'s quiet beaches</a> for crowd-free options.</li><li><strong>Food:</strong> Eat in the traditional inland villages (Afytos, old Pefkochori) rather than beach restaurants — better quality.</li><li><strong>Coming from the Balkans by car:</strong> See our <a href="/from">access guides by city</a>.</li></ul>',
    },
    faqs: [
      {
        q: { el: 'Ποια είναι η ωραιότερη παραλία της Κασσάνδρας;', en: 'Which is the most beautiful beach in Kassandra?' },
        a: { el: 'Το <strong>Ποσείδι</strong> με τον χαρακτηριστικό φάρο και τη γλώσσα γης ξεχωρίζει για φωτογενή ομορφιά. Η <strong>Σάνη</strong> ξεχωρίζει για οργανωμένη υποδομή και ποιότητα. Η <strong>Καλλιθέα</strong> για νυχτερινή ζωή και beach clubs. Δες όλες σε αυτή τη λίστα και διάλεξε με βάση τι αναζητάς.', en: '<strong>Possidi</strong> with its iconic lighthouse and sand spit stands out for photogenic beauty. <strong>Sani</strong> for organised facilities and quality. <strong>Kallithea</strong> for nightlife and beach clubs. Browse them all in this list and choose by what you\'re after.' },
      },
      {
        q: { el: 'Είναι οι παραλίες της Κασσάνδρας κατάλληλες για παιδιά;', en: 'Are Kassandra\'s beaches suitable for kids?' },
        a: { el: 'Ναι, πολλές. Η <strong>Σιβηρή</strong> και η <strong>Νέα Φώκαια</strong> έχουν ιδιαίτερα ρηχά νερά. Δες τις <a href="/best/family-beaches">οικογενειακές παραλίες</a> για πλήρη λίστα φιλτραρισμένη με κριτήριο τη ρηχή ζώνη.', en: 'Yes, many of them. <strong>Siviri</strong> and <strong>Nea Fokaia</strong> have especially shallow water. See our <a href="/best/family-beaches">family beaches</a> page for a full list filtered by shallow-water criteria.' },
      },
      {
        q: { el: 'Είναι ελεύθερη η πρόσβαση στις παραλίες;', en: 'Are the beaches free to access?' },
        a: { el: 'Ναι, σε όλες τις δημόσιες παραλίες η πρόσβαση είναι ελεύθερη. Πληρώνεις μόνο για ξαπλώστρες/ομπρέλες αν θες (€8-15 set/μέρα συνήθως). Δες τις <a href="/best/free-beaches">ελεύθερες παραλίες</a> για επιλογές χωρίς οργανωμένες υπηρεσίες.', en: 'Yes — public access is free everywhere. You only pay for sun loungers/umbrellas if you want them (typically €8-15 for a set/day). See our <a href="/best/free-beaches">free beaches</a> page for options without organised facilities.' },
      },
      {
        q: { el: 'Πόσο μακριά είναι η Κασσάνδρα από τη Θεσσαλονίκη;', en: 'How far is Kassandra from Thessaloniki?' },
        a: { el: 'Περίπου 100 χλμ (~1 ώρα 15 λεπτά οδικώς) από το αεροδρόμιο SKG. Η Σάνη και η Νέα Ποτίδαια είναι οι πιο κοντινές παραλίες (~75 χλμ). Δες τον <a href="/from/thessaloniki">οδηγό μετακίνησης από Θεσσαλονίκη</a>.', en: 'About 100 km (~1h 15min driving) from SKG airport. Sani and Nea Potidaia are the closest beaches (~75 km). See our <a href="/from/thessaloniki">guide from Thessaloniki</a>.' },
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  'beaches-sithonia': {
    intro: {
      el: '<p>Η Σιθωνία, το μεσαίο πόδι της Χαλκιδικής, είναι ίσως ο πιο φωτογενής προορισμός παραλιών στη βόρεια Ελλάδα. Σε αντίθεση με την αναπτυγμένη Κασσάνδρα, εδώ το πευκόδασος φτάνει πολλές φορές μέχρι την άμμο, οι παραλίες είναι μικρότερες αλλά πιο εξωτικές, και οι αποχρώσεις του νερού — από βαθύ τυρκουάζ μέχρι ζαφειρένιο μπλε — θυμίζουν Κυκλάδες. Παραλίες όπως οι Καβουρότρυπες (Orange Beach), <a href="/beaches/fava-beach-sithonia">Φάβα</a>, Καρύδι και Πλατανίτσι έχουν γίνει Instagram benchmarks. Αυτή η λίστα συγκεντρώνει τις παραλίες που ξεχωρίζουν με βάση αξιολογήσεις, χαρακτηριστικά (ρηχή ζώνη, οργάνωση, snorkeling) και τη φυσική τους ομορφιά.</p>',
      en: '<p>Sithonia, the middle leg of Halkidiki, is arguably the most photogenic beach destination in northern Greece. Unlike the developed Kassandra, here pine forest often reaches the sand, beaches are smaller but more exotic, and the colour of the water — from deep turquoise to sapphire blue — feels Cycladic. Beaches like Kavourotrypes (Orange Beach), <a href="/beaches/fava-beach-sithonia">Fava</a>, Karydi and Platanitsi have become Instagram benchmarks. This list collects the beaches that stand out based on ratings, features (shallow water, organisation, snorkelling) and natural beauty.</p>',
    },
    seasonal: {
      el: '<h2>Πότε να πας</h2><p><strong>Ιούνιος:</strong> sweet spot — θάλασσα 22-24°C, λίγος κόσμος ακόμα. <strong>Ιούλιος-Αύγουστος:</strong> πολυσύχναστο σε γνωστές παραλίες (Καβουρότρυπες, Φάβα), τα μικρά parking γεμίζουν 9-10. Καλό να φτάσεις νωρίς ή να βρεις λιγότερο γνωστές. <strong>Σεπτέμβριος:</strong> ιδανικός — αδειάζουν δραματικά μετά τις 5-7 του μήνα, νερό ακόμα 24°C. <a href="/blog/halkidiki-september-guide">Πλήρης οδηγός Σεπτεμβρίου</a>.</p>',
      en: '<h2>When to visit</h2><p><strong>June:</strong> the sweet spot — sea 22-24°C, still few crowds. <strong>July-August:</strong> busy at the famous beaches (Kavourotrypes, Fava), small car parks fill up 9-10. Aim to arrive early or pick lesser-known options. <strong>September:</strong> ideal — beaches empty out dramatically after the 5-7th, water still 24°C. <a href="/blog/halkidiki-september-guide">Full September guide</a>.</p>',
    },
    tips: {
      el: '<h2>Συμβουλές επί τόπου</h2><ul><li><strong>Καβουρότρυπες/Orange:</strong> Parking μακριά + ~15\' περπάτημα. Φέρε αρκετό νερό και σνακ — δεν έχει καντίνα.</li><li><strong>Snorkeling:</strong> Η Σιθωνία είναι από τις καλύτερες περιοχές για snorkeling στη Χαλκιδική. Δες τις <a href="/best/snorkeling-spots">καλύτερες παραλίες snorkeling</a>.</li><li><strong>Σκιά:</strong> Σε φυσικές παραλίες δεν υπάρχει — φέρε ομπρέλα.</li><li><strong>Πρόσβαση:</strong> Από Νικήτη η ανατολική ακτή χρειάζεται 30-45\' οδήγηση. Από Σάρτη ή Καλαμίτσι, πιο γρήγορα.</li><li><strong>Νυχτερινό φαγητό:</strong> Στα παραδοσιακά χωριά Καλαμίτσι, Παρθενώνας — όχι στις παραλίες.</li></ul>',
      en: '<h2>On-site tips</h2><ul><li><strong>Kavourotrypes/Orange:</strong> Parking is far + ~15-min walk. Bring plenty of water and snacks — no canteen.</li><li><strong>Snorkelling:</strong> Sithonia is one of Halkidiki\'s best areas for snorkelling. See our <a href="/best/snorkeling-spots">best snorkelling beaches</a>.</li><li><strong>Shade:</strong> Natural beaches have none — bring your own umbrella.</li><li><strong>Access:</strong> From Nikiti the east coast takes 30-45 min of driving. From Sarti or Kalamitsi, it\'s quicker.</li><li><strong>Dinner:</strong> Eat in traditional villages — Kalamitsi, Parthenonas — not at the beach.</li></ul>',
    },
    faqs: [
      {
        q: { el: 'Ποια είναι η ομορφότερη παραλία της Σιθωνίας;', en: 'Which is the most beautiful beach in Sithonia?' },
        a: { el: 'Οι <strong>Καβουρότρυπες (Orange Beach)</strong> έχουν τη μεγαλύτερη Instagram φήμη με τους πορτοκαλί βραχώδεις σχηματισμούς. Η <strong>Καρύδι</strong> και η <strong>Φάβα</strong> ακολουθούν με τυρκουάζ νερά και λευκή άμμο. Δες όλες σε αυτή τη λίστα.', en: '<strong>Kavourotrypes (Orange Beach)</strong> has the biggest Instagram reputation with its orange rock formations. <strong>Karydi</strong> and <strong>Fava</strong> follow with turquoise water and white sand. Browse them all in this list.' },
      },
      {
        q: { el: 'Σιθωνία ή Κασσάνδρα — ποια ταιριάζει σε μένα;', en: 'Sithonia or Kassandra — which fits me?' },
        a: { el: 'Διάλεξε <strong>Σιθωνία</strong> αν θες φυσικές, φωτογενείς παραλίες, πεύκα δίπλα στη θάλασσα και πιο ήσυχη ατμόσφαιρα. Διάλεξε <strong>Κασσάνδρα</strong> αν θες οργανωμένες παραλίες, beach clubs, νυχτερινή ζωή και ευκολότερη πρόσβαση. Δες τη <a href="/best/beaches-kassandra">λίστα παραλιών Κασσάνδρας</a> για σύγκριση.', en: 'Pick <strong>Sithonia</strong> if you want natural, photogenic beaches with pine forest by the sea and a quieter vibe. Pick <strong>Kassandra</strong> if you want organised beaches, beach clubs, nightlife and easier access. See the <a href="/best/beaches-kassandra">Kassandra beaches list</a> for comparison.' },
      },
      {
        q: { el: 'Χρειάζεται 4x4 για να φτάσω;', en: 'Do I need a 4x4 to reach them?' },
        a: { el: 'Όχι. Όλες οι παραλίες σε αυτή τη λίστα είναι προσβάσιμες με κανονικό αυτοκίνητο. Σε ορισμένες (Καβουρότρυπες, Καρύδι) έχει χωμάτινο δρόμο στα τελευταία χιλιόμετρα αλλά καλά συντηρημένο.', en: 'No. All beaches in this list are accessible with a regular car. A few (Kavourotrypes, Karydi) have a dirt road for the last kilometre but it\'s well maintained.' },
      },
      {
        q: { el: 'Πού να μείνω για εύκολη πρόσβαση στις καλύτερες παραλίες;', en: 'Where to stay for easy beach access?' },
        a: { el: '<strong>Νικήτη</strong> για κεντρική πρόσβαση και στις δύο ακτές. <strong>Σάρτη</strong> ή <strong>Καλαμίτσι</strong> για να είσαι κοντά στις ανατολικές παραλίες. <strong>Νέος Μαρμαράς</strong> ή <strong>Βουρβουρού</strong> για τη δυτική. Δες τα <a href="/listings">διαθέσιμα καταλύματα</a>.', en: '<strong>Nikiti</strong> for central access to both coasts. <strong>Sarti</strong> or <strong>Kalamitsi</strong> to be near the east. <strong>Neos Marmaras</strong> or <strong>Vourvourou</strong> for the west. See <a href="/listings">available accommodation</a>.' },
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  'family-beaches': {
    intro: {
      el: '<p>Με μικρά παιδιά μια παραλία δεν επιλέγεται μόνο από ομορφιά — επιλέγεται από <strong>ασφάλεια</strong>. Ρηχή ζώνη που εκτείνεται τουλάχιστον 20-30 μέτρα από την ακτή, χωρίς ξαφνικές βαθιές περιοχές. Άμμος που μπορούν να περπατήσουν χωρίς να πληγωθούν. Υπηρεσίες όπως ντουζ, lifeguard, ξαπλώστρες με ομπρέλα για να γλιτώσεις από τον ήλιο των 12. Σκιά για τη σιέστα. Αυτή η λίστα συγκεντρώνει τις παραλίες της Χαλκιδικής που έχουν χαρακτηριστικό shallowWater από τη βάση μας — δηλαδή έχουν επιβεβαιωθεί ως ασφαλείς για μικρά παιδιά — και προστίθενται κατά rating.</p>',
      en: '<p>With small children a beach isn\'t picked just for looks — it\'s picked for <strong>safety</strong>. A shallow zone stretching at least 20-30 metres from shore, with no sudden drops. Sand they can walk on without hurting themselves. Services like showers, lifeguards, loungers with umbrellas so you can escape the noon sun. Shade for the afternoon nap. This list collects Halkidiki beaches tagged with shallowWater in our database — confirmed safe for small children — sorted by rating.</p>',
    },
    seasonal: {
      el: '<h2>Πότε να πας με παιδιά</h2><p><strong>Ιούνιος:</strong> το καλύτερο — θάλασσα 22-24°C, ζεσταίνεται γρήγορα στο ρηχό. Λίγος κόσμος. <strong>Σεπτέμβριος:</strong> εξίσου καλός — νερό ακόμα ζεστό, σαφώς λιγότερος κόσμος, καλύτερες τιμές. <strong>Αύγουστος:</strong> προσοχή — πολυκοσμία, ξαπλώστρες πιάνονται νωρίς, οι αργές χιλιάδες αγγίζουν το όριο των παιδικών αντοχών. Πρωινό 8-12 πρωτότυπη επιλογή.</p>',
      en: '<h2>When to visit with kids</h2><p><strong>June:</strong> the best — sea 22-24°C, warms up fast in the shallows. Few crowds. <strong>September:</strong> equally good — water still warm, much smaller crowds, better prices. <strong>August:</strong> caution — high temperatures and crowds push the limits of small children. A morning swim 8-12 is the smart move.</p>',
    },
    tips: {
      el: '<h2>Συμβουλές για οικογένειες</h2><ul><li><strong>Πρωινό slot:</strong> Φτάσε 8:30-9:00. Σιγουρεύεις ξαπλώστρα με σκιά, παίρνεις τα κρύα νερά πριν γεμίσει.</li><li><strong>Παιδικός εξοπλισμός:</strong> Φέρε σαμπρέλα/βραχιολάκι, χονδρό αντηλιακό (SPF 50+), καπέλο. Φουσκωτά για το κλιμακούμενο σερφάρισμα — προαιρετικά.</li><li><strong>Lifeguard:</strong> Σε οργανωμένες παραλίες (Σάνη, Καλλιθέα, Χανιώτη). Στις φυσικές (Σιθωνία) δεν υπάρχει — απαιτεί επίβλεψη.</li><li><strong>Φαγητό:</strong> Έχε snacks και νερό — δεν περιμένεις παιδί 4 ετών για 30\' fish meal με ορθανοιχτό 35°C.</li><li><strong>Εναλλακτικά:</strong> Αν θες λιγότερο πλήθος, δες τις <a href="/best/quiet-beaches">ήσυχες παραλίες</a>.</li></ul>',
      en: '<h2>Tips for families</h2><ul><li><strong>Morning slot:</strong> Arrive 8:30-9:00. You lock in a shaded lounger and get the cooler water before the crowds.</li><li><strong>Kid kit:</strong> Bring floats/armbands, thick sunscreen (SPF 50+), hats. Inflatables for graduated splashing — optional.</li><li><strong>Lifeguard:</strong> Available on organised beaches (Sani, Kallithea, Hanioti). On natural ones (Sithonia) there\'s none — supervision required.</li><li><strong>Food:</strong> Pack snacks and water — don\'t expect a 4-year-old to sit through a 30-min fish meal at 35°C.</li><li><strong>Alternatives:</strong> For smaller crowds, see our <a href="/best/quiet-beaches">quiet beaches</a> list.</li></ul>',
    },
    faqs: [
      {
        q: { el: 'Σε ποια παραλία να πάμε με μωρό 1-2 ετών;', en: 'Best beach with a 1-2 year old baby?' },
        a: { el: 'Επιλέξτε παραλία με <strong>ρηχή ζώνη + σκιά + lifeguard + κοντινό parking</strong>. Η <strong>Σάνη Marina</strong>, η <strong>Σιβηρή</strong> και η <strong>Νέα Φώκαια</strong> πληρούν όλα. Αποφύγετε χωμάτινες προσβάσεις και απόμακρες παραλίες.', en: 'Choose a beach with <strong>shallow zone + shade + lifeguard + nearby parking</strong>. <strong>Sani Marina</strong>, <strong>Siviri</strong> and <strong>Nea Fokaia</strong> tick all boxes. Avoid dirt-road approaches and remote beaches.' },
      },
      {
        q: { el: 'Υπάρχουν φιλικά για άτομα με αναπηρία;', en: 'Are there beaches accessible for disabled visitors?' },
        a: { el: 'Ναι — οι περισσότερες οργανωμένες παραλίες (Σάνη, Καλλιθέα, Μυκονιάτικα) έχουν Disabled Access. Συμπεριλαμβάνουν seatrac (αυτόματο μηχανισμό για είσοδο στο νερό σε αναπηρικό αμαξίδιο) σε αρκετές.', en: 'Yes — most organised beaches (Sani, Kallithea, Mykoniatika) offer disabled access. Several include a seatrac (an automated lift for entering the water in a wheelchair).' },
      },
      {
        q: { el: 'Πόσο κοστίζει για 4μελή οικογένεια;', en: 'How much for a family of 4?' },
        a: { el: '<strong>Beach set</strong> (ξαπλώστρες + ομπρέλα): €15-25/μέρα στις πιο γνωστές. <strong>Φαγητό μεσημεριανό</strong>: €40-70 για 4 σε beach restaurant, €30-50 σε ταβέρνα στο χωριό. <strong>Σνακ/παγωτό</strong>: €15-20. Σύνολο μέρας: €70-130 για 4 άτομα.', en: '<strong>Beach set</strong> (loungers + umbrella): €15-25/day at the famous beaches. <strong>Lunch</strong>: €40-70 for 4 at a beach restaurant, €30-50 at a village taverna. <strong>Snacks/ice cream</strong>: €15-20. Total day: €70-130 for four.' },
      },
      {
        q: { el: 'Είναι ασφαλή τα νερά για κολύμπι παιδιών;', en: 'Is the water safe for children to swim in?' },
        a: { el: 'Ναι — η Χαλκιδική έχει πάνω από 100 Γαλάζιες Σημαίες, που πιστοποιούν ποιότητα νερού και ασφάλεια. Οι παραλίες αυτής της λίστας έχουν ρηχή ζώνη επιβεβαιωμένη από τα OSM tags. Πάντα προσέχεις τα παιδιά σου ασχέτως ποιότητας νερού.', en: 'Yes — Halkidiki has over 100 Blue Flag beaches, certifying water quality and safety. The beaches in this list have shallow zones confirmed via OSM tags. Always supervise children regardless of water quality.' },
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  'quiet-beaches': {
    intro: {
      el: '<p>Όχι όλοι αναζητούν τη Καλλιθέα τον Αύγουστο. Για κάποιους, οι διακοπές σημαίνει αποσύνδεση: παραλία χωρίς μουσική, χωρίς ξαπλώστρες, χωρίς ώρα έναρξης πανηγυριού. Η Χαλκιδική έχει πολλές τέτοιες παραλίες — απλώς δεν είναι αυτές που εμφανίζονται στις τουριστικές διαφημίσεις. Αυτή η λίστα συγκεντρώνει ελεύθερες παραλίες χωρίς οργανωμένη υποδομή ή με ελάχιστη — μερικές απομονωμένες (Καβουρότρυπες, Διάπορος), άλλες απλώς λιγότερο διαφημισμένες (Τσούκα, Καρύδι Δυτική). Όλες χαρακτηρίζονται \'free\' στη βάση μας, που σημαίνει ότι μπορείς να στρώσεις πετσέτα όπου θες.</p>',
      en: '<p>Not everyone is looking for Kallithea in August. For some people, holidays mean disconnection: a beach without music, without sun loungers, without a fixed start time for the party. Halkidiki has many such beaches — they just don\'t show up in tourist ads. This list gathers free, unorganised beaches — some isolated (Kavourotrypes, Diaporos), others simply less advertised (Tsouka, west Karydi). All are tagged \'free\' in our database, meaning you can spread a towel anywhere.</p>',
    },
    seasonal: {
      el: '<h2>Πότε να πας</h2><p><strong>Όλο το χρόνο εκτός peak weekends:</strong> Αυτές οι παραλίες δεν γεμίζουν ποτέ. Η μόνη εξαίρεση: Σαββατοκύριακα Ιουλίου-Αυγούστου σε όσες πλησίον γνωστών τοποθεσιών. <strong>Sweet spot:</strong> Μάιος-Ιούνιος και Σεπτέμβριος-Οκτώβριος — έχεις την παραλία σχεδόν για σένα.</p>',
      en: '<h2>When to visit</h2><p><strong>Any time except peak weekends:</strong> These beaches never really get busy. The only exception: July-August weekends for those near famous spots. <strong>Sweet spot:</strong> May-June and September-October — you basically have the beach to yourself.</p>',
    },
    tips: {
      el: '<h2>Συμβουλές για ήσυχες παραλίες</h2><ul><li><strong>Πάρε όλα μαζί:</strong> Νερό, σνακ, ομπρέλα, πετσέτες, αντηλιακό. Δεν θα βρεις καντίνα.</li><li><strong>Σκουπίδια μαζί σου:</strong> Πάρε σακούλα. Αυτές οι παραλίες παραμένουν καθαρές γιατί οι επισκέπτες σέβονται τον χώρο.</li><li><strong>Πάρκαρε σωστά:</strong> Σε κάποιες (Καβουρότρυπες) είναι μακριά + περπάτημα. Παπούτσια κατάλληλα.</li><li><strong>Σήμα κινητού:</strong> Σε απομονωμένες περιοχές μπορεί να μην έχει — ενημέρωσε κάποιον πού πας.</li><li><strong>Snorkeling bonus:</strong> Οι ήσυχες παραλίες έχουν τα πιο διαυγή νερά. Δες τις <a href="/best/snorkeling-spots">καλύτερες παραλίες snorkeling</a>.</li></ul>',
      en: '<h2>Tips for quiet beaches</h2><ul><li><strong>Bring everything:</strong> Water, snacks, umbrella, towels, sunscreen. There\'s no canteen.</li><li><strong>Pack your rubbish out:</strong> Bring a bag. These beaches stay clean because visitors respect them.</li><li><strong>Park sensibly:</strong> Some (Kavourotrypes) need a long walk. Wear suitable shoes.</li><li><strong>Mobile signal:</strong> Patchy in isolated areas — tell someone where you\'re going.</li><li><strong>Snorkelling bonus:</strong> Quiet beaches have the clearest water. See our <a href="/best/snorkeling-spots">best snorkelling beaches</a>.</li></ul>',
    },
    faqs: [
      {
        q: { el: 'Πώς ξεχωρίζω μια "ήσυχη" παραλία στη Χαλκιδική;', en: 'How do I spot a "quiet" beach in Halkidiki?' },
        a: { el: 'Ψάχνεις χωρίς beach bar visible, χωρίς γραμμές ξαπλώστρες, με χωμάτινο δρόμο τα τελευταία 500m. Συνήθως στις πιο απομακρυσμένες περιοχές της Σιθωνίας ή στη δυτική Κασσάνδρα.', en: 'Look for no visible beach bar, no rows of loungers, and a dirt road for the last 500m. Usually in the more remote parts of Sithonia or west Kassandra.' },
      },
      {
        q: { el: 'Είναι ασφαλές να μείνω μόνος/η σε απομονωμένη παραλία;', en: 'Is it safe to be alone at an isolated beach?' },
        a: { el: 'Ναι, η Χαλκιδική έχει χαμηλό crime rate. Προσοχή κανονικά: μην αφήσεις πορτοφόλι ή τηλέφωνο μόνο όταν κολυμπάς — όπως οπουδήποτε στον κόσμο.', en: 'Yes, Halkidiki has a low crime rate. Standard caution applies: don\'t leave a wallet or phone unattended while swimming — same as anywhere.' },
      },
      {
        q: { el: 'Υπάρχουν φυσιοκρατικές (nudist) παραλίες;', en: 'Are there naturist (nudist) beaches?' },
        a: { el: 'Ναι — η <strong>Μυκονιάτικα</strong> στην Κασσάνδρα έχει επίσημη ζώνη γυμνιστών. Σε αρκετές απομονωμένες παραλίες της Σιθωνίας τοπική ανοχή.', en: 'Yes — <strong>Mykoniatika</strong> in Kassandra has an official nudist zone. Several isolated Sithonia beaches have informal local tolerance.' },
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  'seafood-restaurants': {
    intro: {
      el: '<p>Η Χαλκιδική, με 550 χλμ ακτογραμμής, έχει εξαιρετική παράδοση στα ψαρικά. Οι περισσότερες ταβέρνες σερβίρουν φρέσκο ψάρι από τοπικές αλιείες (κυρίως Νέα Μουδανιά, Σάρτη, Πυργαδίκια), τοπικά μύδια Καλλίστης και χταπόδι ψημένο στα κάρβουνα. Αυτή η λίστα συγκεντρώνει τις ψαροταβέρνες με τις υψηλότερες αξιολογήσεις από επισκέπτες — από εγκαταστάσεις στο λιμάνι μέχρι παραδοσιακές ταβέρνες σε χωριά. Πολλές από αυτές δεν είναι σε beachfront prime locations — αξίζει η οδήγηση.</p>',
      en: '<p>Halkidiki, with 550 km of coastline, has an outstanding seafood tradition. Most tavernas serve fresh fish from local fisheries (mostly Nea Moudania, Sarti, Pyrgadikia), local Kallisti mussels, and charcoal-grilled octopus. This list collects the seafood restaurants with the highest visitor ratings — from harbour-front establishments to traditional tavernas in inland villages. Many aren\'t at beachfront prime locations — the drive is worth it.</p>',
    },
    seasonal: {
      el: '<h2>Πότε να πας</h2><p><strong>Φρέσκα ψάρια όλη χρονιά</strong> — αλλά καλύτερη ποικιλία Απρίλιο-Οκτώβριο όταν λειτουργούν όλες οι αλιείες. <strong>Σεπτέμβριος-Οκτώβριος:</strong> ιδανικός — οι τιμές πέφτουν 10-20% μετά τη σεζόν, ποιότητα ίδια. <strong>Αύγουστος Σαββατοκύριακα:</strong> κράτηση συνιστάται 1-2 ημέρες πριν, ειδικά για ώρες 21:00-22:30.</p>',
      en: '<h2>When to visit</h2><p><strong>Fresh fish year-round</strong> — but the best variety is April-October when all fisheries operate. <strong>September-October:</strong> ideal — prices drop 10-20% after the season, quality identical. <strong>August weekends:</strong> book 1-2 days ahead, especially for 21:00-22:30 slots.</p>',
    },
    tips: {
      el: '<h2>Συμβουλές για ψαροφαγία</h2><ul><li><strong>Φρέσκο vs κατεψυγμένο:</strong> Ρώτα ρητά "fresh ή frozen?". Καλές ταβέρνες απαντούν ειλικρινά. Το φρέσκο τιμολογείται με το κιλό, το κατεψυγμένο με τη μερίδα.</li><li><strong>Τιμή ψαριού:</strong> €35-60/κιλό για φρέσκο. Διάλεγε ολόκληρο ψάρι και ζύγισέ το μαζί με τον σερβιτόρο.</li><li><strong>Μύδια:</strong> Από τα μύδια Καλλίστης, τοπική παραγωγή — εξαιρετική ποιότητα. Δοκίμασε αχνιστά ή κρασάτα.</li><li><strong>Χταπόδι ψητό:</strong> Σχεδόν παντού καλό. Καλά ψημένο πρέπει να είναι τραγανό απ\'έξω, μαλακό μέσα.</li><li><strong>Συνοδευτικά:</strong> Με ψάρι ντόπιο λευκό κρασί (Μαλαγουζιά, Ασύρτικο Σιθωνίας) ή τσίπουρο.</li><li><strong>Καλύτερες περιοχές για ψαροφαγία:</strong> Νέα Μουδανιά, Πυργαδίκια, Σάρτη, Ποσείδι.</li></ul>',
      en: '<h2>Seafood-eating tips</h2><ul><li><strong>Fresh vs frozen:</strong> Ask explicitly "fresh or frozen?". Good tavernas answer honestly. Fresh is priced per kilo, frozen per portion.</li><li><strong>Fish price:</strong> €35-60/kg for fresh. Pick a whole fish and weigh it with the waiter.</li><li><strong>Mussels:</strong> From Kallisti mussel farms, local production — excellent quality. Try them steamed or wine-braised.</li><li><strong>Grilled octopus:</strong> Almost always good. Properly grilled means crispy outside, tender inside.</li><li><strong>Pairings:</strong> Local white wine (Malagouzia, Sithonia Assyrtiko) or tsipouro with fish.</li><li><strong>Best seafood areas:</strong> Nea Moudania, Pyrgadikia, Sarti, Possidi.</li></ul>',
    },
    faqs: [
      {
        q: { el: 'Πόσο κοστίζει ένα γεύμα για 2 άτομα;', en: 'How much does a meal for 2 cost?' },
        a: { el: 'Με <strong>ορεκτικά + ένα ψάρι ~600g + κρασί</strong> για 2 άτομα: €60-100 σε ταβέρνα μέσης κατηγορίας, €80-130 σε premium. Με χταπόδι/καλαμάρι/μύδια: €40-70.', en: 'With <strong>starters + one ~600g fish + wine</strong> for 2 people: €60-100 at a mid-range taverna, €80-130 at a premium one. With octopus/squid/mussels: €40-70.' },
      },
      {
        q: { el: 'Πού να φάω φρέσκα ψάρια στη Σιθωνία;', en: 'Where to eat fresh fish in Sithonia?' },
        a: { el: '<strong>Σάρτη</strong> για ψαροταβέρνες στο λιμανάκι. <strong>Πυργαδίκια</strong> για παραδοσιακές καλόγουστες ταβέρνες με θέα. <strong>Βουρβουρού</strong> για πιο cosmopolitan επιλογές. Δες όλες σε αυτή τη λίστα.', en: '<strong>Sarti</strong> for harbourside seafood tavernas. <strong>Pyrgadikia</strong> for traditional, well-priced tavernas with a view. <strong>Vourvourou</strong> for more cosmopolitan options. See them all in this list.' },
      },
      {
        q: { el: 'Είναι όλα τα ψάρια ντόπια;', en: 'Are all fish local?' },
        a: { el: 'Όχι όλα. Τοπικά: τσιπούρα, λαβράκι, κουτσομούρα, σαρδέλα, μύδια Καλλίστης. Συχνά εισαγόμενο: σολομός, αχινός, μπακαλιάρος. Καλές ταβέρνες σημειώνουν την προέλευση στο μενού.', en: 'No, not all of them. Local: sea bream, sea bass, red mullet, sardine, Kallisti mussels. Often imported: salmon, sea urchin, cod. Good tavernas label provenance on the menu.' },
      },
      {
        q: { el: 'Χρειάζομαι κράτηση;', en: 'Do I need a reservation?' },
        a: { el: 'Σε peak season (Ιούλιος-Αύγουστος) Σαββατοκύριακα ναι, ειδικά για παραθαλάσσιες θέσεις σε γνωστές ταβέρνες. Λοιπές ημέρες/μήνες συνήθως όχι.', en: 'In peak season (July-August) weekends yes, especially for seafront tables at popular tavernas. Other days/months usually not.' },
      },
    ],
  },
};
