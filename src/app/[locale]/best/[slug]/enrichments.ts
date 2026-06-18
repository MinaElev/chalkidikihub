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

  // ───────────────────────────────────────────────────────────────────
  'beach-bars': {
    intro: {
      el: '<p>Τα beach bars της Χαλκιδικής είναι από τα πιο εξελιγμένα στη βόρεια Ελλάδα. Πέρα από έναν απλό χώρο για cocktail κάτω από την ομπρέλα, πολλά λειτουργούν ως πλήρη day-to-night destinations: ξεκινούν με coffee και smoothies στις 9 το πρωί, σερβίρουν μεσημεριανό από καλά μενού, αλλάζουν σε beach party με DJs τα απογεύματα, και κλείνουν με sunset cocktails ή ολονύκτια events. Η Κασσάνδρα (κυρίως Καλλιθέα, Χανιώτη, Πευκοχώρι) έχει τα πιο πολυσύχναστα και κοσμοπολίτικα — η Σιθωνία (Βουρβουρού, Νικήτη) πιο χαλαρά αλλά εξίσου ποιοτικά. Αυτή η λίστα συγκεντρώνει τα beach bars με υψηλότερες αξιολογήσεις, βάσει εμπειρίας επισκεπτών μας.</p>',
      en: '<p>Halkidiki\'s beach bars are some of the most evolved in northern Greece. Beyond just a place for a cocktail under an umbrella, many run as full day-to-night destinations: opening with coffee and smoothies at 9 AM, serving solid lunch menus, switching to beach parties with DJs in the afternoon, and closing with sunset cocktails or late-night events. Kassandra (mainly Kallithea, Hanioti, Pefkochori) has the most popular, cosmopolitan venues — Sithonia (Vourvourou, Nikiti) is more relaxed but equally high quality. This list collects beach bars with the highest visitor ratings.</p>',
    },
    seasonal: {
      el: '<h2>Πότε να πας</h2><p><strong>Πρωί 9:00-12:00:</strong> Brunch + φρουτοχυμοί, ηρεμία, καλό για couples ή solo travelers. <strong>Μεσημέρι 13:00-16:00:</strong> Lunch, λίγος κόσμος. <strong>17:00-20:00:</strong> Cocktail hour με DJ, peak ατμόσφαιρας. <strong>20:00 και μετά:</strong> Είτε relax mode (Σιθωνία) είτε party mode (Κασσάνδρα Σαββατοκύριακα). <strong>Σεζόν:</strong> Μάιος-Σεπτέμβριος. Τα μεγαλύτερα beach clubs ανοίγουν Ιούνιο και κλείνουν στις 20-25 Σεπτεμβρίου.</p>',
      en: '<h2>When to visit</h2><p><strong>Morning 9:00-12:00:</strong> Brunch + fresh juices, quieter, good for couples or solo travellers. <strong>Midday 13:00-16:00:</strong> Lunch, fewer crowds. <strong>17:00-20:00:</strong> Cocktail hour with a DJ, peak atmosphere. <strong>20:00 onwards:</strong> Either relax mode (Sithonia) or party mode (Kassandra weekends). <strong>Season:</strong> May-September. The bigger beach clubs open in June and close around September 20-25.</p>',
    },
    tips: {
      el: '<h2>Συμβουλές</h2><ul><li><strong>Κράτηση sun bed:</strong> Στα δημοφιλή beach clubs (κυρίως Κασσάνδρα), online κράτηση 1-2 μέρες πριν για Σαββατοκύριακα. Premium σετ €30-60/μέρα για 2.</li><li><strong>Dress code:</strong> Καθαρό beachwear το μεσημέρι, smart casual μετά τις 19:00. Πολλά δεν αφήνουν φόρμα φλιπ-φλοπ μετά τις 21:00.</li><li><strong>Παιδιά:</strong> Πολλά beach bars είναι family-friendly μέχρι τις 18:00. Μετά γίνονται adult-only ατμόσφαιρας.</li><li><strong>Pricing:</strong> Cocktail €8-14, beer €5-7. Συνήθως service fee 10% περιλαμβάνεται.</li><li><strong>Δείτε επίσης:</strong> <a href="/best/romantic-restaurants">Ρομαντικά εστιατόρια</a> για μετά το beach bar dinner.</li></ul>',
      en: '<h2>Tips</h2><ul><li><strong>Sun-bed reservation:</strong> At popular beach clubs (mainly Kassandra), book online 1-2 days ahead for weekends. Premium sets €30-60/day for two.</li><li><strong>Dress code:</strong> Clean beachwear at midday, smart-casual after 19:00. Many won\'t let flip-flops in after 21:00.</li><li><strong>Kids:</strong> Many beach bars are family-friendly until 18:00. After that they shift to an adult-only vibe.</li><li><strong>Pricing:</strong> Cocktail €8-14, beer €5-7. A 10% service fee is usually included.</li><li><strong>See also:</strong> <a href="/best/romantic-restaurants">Romantic restaurants</a> for the post-beach-bar dinner.</li></ul>',
    },
    faqs: [
      {
        q: { el: 'Ποια είναι τα καλύτερα beach clubs στη Χαλκιδική;', en: 'Which are the best beach clubs in Halkidiki?' },
        a: { el: 'Στην <strong>Καλλιθέα</strong> τα Cabana, Coco Beach Bar. Στη <strong>Χανιώτη</strong> τα Caribbean, Plaja. Στη <strong>Σιθωνία</strong> πιο χαλαρά αλλά ποιοτικά (Vourvourou area). Δες όλες τις τοποθεσίες σε αυτή τη λίστα — οι πραγματικές αξιολογήσεις των επισκεπτών είναι ο καλύτερος οδηγός.', en: 'In <strong>Kallithea</strong>: Cabana, Coco Beach Bar. In <strong>Hanioti</strong>: Caribbean, Plaja. In <strong>Sithonia</strong> more chilled but high quality (Vourvourou area). Browse all the listings — actual visitor ratings are the best guide.' },
      },
      {
        q: { el: 'Πληρώνω είσοδο σε beach club;', en: 'Do I pay an entrance fee at a beach club?' },
        a: { el: 'Όχι entry fee σε καμία περίπτωση. Πληρώνεις για ξαπλώστρες/ομπρέλες και τις παραγγελίες σου. Σε ειδικά events ή Saturday parties μπορεί να ζητάνε reservation με minimum spend €40-80.', en: 'No entry fee in any case. You pay for loungers/umbrellas and your orders. For special events or Saturday parties, some venues require a reservation with a €40-80 minimum spend.' },
      },
      {
        q: { el: 'Πιο ωραίο Κασσάνδρα ή Σιθωνία για beach bars;', en: 'More fun: Kassandra or Sithonia for beach bars?' },
        a: { el: 'Διάλεξε <strong>Κασσάνδρα</strong> για high-energy, big-DJ atmosphere, parties. Διάλεξε <strong>Σιθωνία</strong> για χαλαρά cocktails, sunset, photography. Δες και τις <a href="/best/beaches-kassandra">καλύτερες παραλίες Κασσάνδρας</a> ή <a href="/best/beaches-sithonia">Σιθωνίας</a>.', en: 'Pick <strong>Kassandra</strong> for high-energy, big-DJ atmosphere and parties. Pick <strong>Sithonia</strong> for chilled cocktails, sunsets, photography. See the <a href="/best/beaches-kassandra">best beaches of Kassandra</a> or <a href="/best/beaches-sithonia">Sithonia</a>.' },
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  'romantic-restaurants': {
    intro: {
      el: '<p>Όταν ψάχνεις ρομαντικό δείπνο στη Χαλκιδική, ο σημαντικότερος παράγοντας είναι η <strong>θέα στη θάλασσα</strong> κατά το σούρουπο. Η ηπειρωτική γεωγραφία της Χαλκιδικής με τις τρεις χερσονήσους δημιουργεί φυσικά μοναδικά τοπία: εστιατόρια που κοιτάζουν τη μία χερσόνησο μπροστά τους ή τη μεγάλη λίμνη ανάμεσα στη Σιθωνία και τον Άθω. Αυτή η λίστα συγκεντρώνει εστιατόρια με προφίλ "sea view" από τη βάση μας — από κομψά rooftop restaurants σε boutique hotels μέχρι παραδοσιακές ταβέρνες σε γραφικά λιμανάκια. Όλα κερδίζουν πραγματικές αξιολογήσεις από couples που δοκίμασαν τις εμπειρίες αυτές.</p>',
      en: '<p>When you\'re looking for a romantic dinner in Halkidiki, the most important factor is the <strong>sea view at sunset</strong>. Halkidiki\'s mainland geography with three peninsulas creates uniquely framed landscapes: restaurants looking out at the next peninsula or at the large lagoon between Sithonia and Athos. This list collects restaurants tagged with "sea view" in our database — from elegant rooftop restaurants in boutique hotels to traditional tavernas in picturesque little harbours. All earn real ratings from couples who tried the experience.</p>',
    },
    seasonal: {
      el: '<h2>Πότε να κρατήσεις</h2><p><strong>Σούρουπο:</strong> Σε όλα τα sea-view εστιατόρια, κράτηση για 19:30-20:30 το καλοκαίρι — βλέπεις το ηλιοβασίλεμα. Σεπτέμβριο νωρίτερα (18:30-19:30). <strong>Νεκρή ώρα:</strong> 16:00-18:00 αν θες απόλυτη ησυχία και πιθανώς open-bar specials. <strong>Νύχτα κάτω από τα αστέρια:</strong> 21:30+ ιδανικό αν δεν θες ζέστη.</p>',
      en: '<h2>When to book</h2><p><strong>Sunset:</strong> At every sea-view restaurant, book for 19:30-20:30 in summer — you\'ll catch the sunset. In September, earlier (18:30-19:30). <strong>Quiet hour:</strong> 16:00-18:00 if you want total calm and possibly open-bar specials. <strong>Under the stars:</strong> 21:30+ ideal if you want to avoid the heat.</p>',
    },
    tips: {
      el: '<h2>Συμβουλές για ρομαντικό δείπνο</h2><ul><li><strong>Κράτηση εκ των προτέρων:</strong> 2-3 μέρες πριν για Σαββατοκύριακα Ιουλίου-Αυγούστου, ειδικά για θέσεις με την καλύτερη θέα.</li><li><strong>Ζητάς "outside terrace":</strong> Σε όσα έχουν επιλογές inside/outside, το terrace με sea view είναι το ζητούμενο.</li><li><strong>Bottle of wine:</strong> Επίλεξε ντόπιο λευκό (Μαλαγουζιά Σιθωνίας, Ασύρτικο Σαντορίνης) για να ταιριάζει με το ψάρι.</li><li><strong>Dress code:</strong> Smart casual συνήθως. Σε premium boutique restaurants συνιστάται πιο επιμελής.</li><li><strong>Special occasions:</strong> Ζητάς εκ των προτέρων για κάτι ξεχωριστό (κερί, λουλούδι στο τραπέζι, τούρτα γενεθλίων). Συνήθως δωρεάν.</li></ul>',
      en: '<h2>Tips for a romantic dinner</h2><ul><li><strong>Book ahead:</strong> 2-3 days in advance for July-August weekends, especially for the best-view tables.</li><li><strong>Ask for the outside terrace:</strong> At venues with inside/outside options, the terrace with sea view is what you want.</li><li><strong>Bottle of wine:</strong> Pick a local white (Sithonia Malagouzia, Santorini Assyrtiko) to match the fish.</li><li><strong>Dress code:</strong> Smart casual usually. Premium boutique restaurants prefer something more polished.</li><li><strong>Special occasions:</strong> Ask in advance for something extra (candle, flower on the table, birthday cake). Usually free.</li></ul>',
    },
    faqs: [
      {
        q: { el: 'Ποιο είναι το ρομαντικότερο εστιατόριο της Χαλκιδικής;', en: 'Which is the most romantic restaurant in Halkidiki?' },
        a: { el: 'Δύσκολο να ξεχωρίσει ένα. Στη <strong>Βουρβουρού</strong> εξαιρετική θέα προς τα νησάκια. Στη <strong>Σάνη Marina</strong> ελεγμένα γαστρονομικά εστιατόρια. Στην <strong>Ουρανούπολη</strong> θέα στο Άγιο Όρος. Δες όλα τα sea-view εστιατόρια σε αυτή τη λίστα.', en: 'Hard to pick just one. <strong>Vourvourou</strong> has stunning views over the islets. <strong>Sani Marina</strong> features curated gastro restaurants. <strong>Ouranoupoli</strong> has Mount Athos views. Browse all sea-view restaurants in this list.' },
      },
      {
        q: { el: 'Πόσο κοστίζει ρομαντικό δείπνο 2 ατόμων;', en: 'How much for a romantic dinner for two?' },
        a: { el: 'Mid-range: €60-100 (3-course + κρασί). Premium boutique: €100-180. Με ψάρι ολόκληρο ψυτό + premium κρασί: €150-250.', en: 'Mid-range: €60-100 (3-course + wine). Premium boutique: €100-180. With whole grilled fish + premium wine: €150-250.' },
      },
      {
        q: { el: 'Που υπάρχουν εστιατόρια με sunset θέα;', en: 'Where are restaurants with sunset views?' },
        a: { el: '<strong>Δυτική Χαλκιδική</strong> για ηλιοβασίλεμα (Ποσείδι, Καλλιθέα δυτικά). <strong>Σιθωνία ανατολική</strong> αν θες απόσταξη στο Άγιο Όρος αντί ηλιοβασιλέματος. <strong>Ουρανούπολη</strong> έχει και τα δύο μέσα από διαφορετικά εστιατόρια.', en: '<strong>Western Halkidiki</strong> for sunsets (Possidi, western Kallithea). <strong>Eastern Sithonia</strong> if you prefer Mount Athos views over sunset. <strong>Ouranoupoli</strong> offers both depending on the restaurant.' },
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  'traditional-tavernas': {
    intro: {
      el: '<p>Οι παραδοσιακές ταβέρνες της Χαλκιδικής είναι το αυθεντικό πρόσωπο της τοπικής γαστρονομίας — μακριά από τις τουριστικές beach restaurants, βαθιά στα γραφικά εσωτερικά χωριά. Παρθενώνας, Άφυτος, Καλαμίτσι, Πυργαδίκια, Καστρί. Σπιτικά μαγειρευτά, ψητά κρέατα στα κάρβουνα, ντόπιο τυρί, ψωμί ζυμωτό. Τιμές 30-50% κάτω από τη παραλιακή ζώνη. Πολλές διατηρούν την οικογενειακή λειτουργία 3 και 4 γενεών. Αυτή η λίστα συγκεντρώνει τις ταβέρνες που σταθερά εκπροσωπούν τη χαλκιδικιώτικη παράδοση με βάση τις αξιολογήσεις των επισκεπτών μας.</p>',
      en: '<p>Halkidiki\'s traditional tavernas are the authentic face of local gastronomy — far from tourist beach restaurants, deep in the picturesque inland villages. Parthenonas, Afytos, Kalamitsi, Pyrgadikia, Kastri. Home-cooked dishes, charcoal-grilled meats, local cheese, hand-kneaded bread. Prices 30-50% below the seafront zone. Many remain family-run across 3-4 generations. This list collects the tavernas that consistently represent Halkidiki tradition, based on visitor ratings.</p>',
    },
    seasonal: {
      el: '<h2>Πότε να πας</h2><p><strong>Όλο τον χρόνο:</strong> Σε αντίθεση με τις παραλιακές, οι παραδοσιακές ταβέρνες είναι ανοιχτές όλη χρονιά. <strong>Καλύτερη εμπειρία:</strong> Σεπτέμβριο-Οκτώβριο όταν φεύγει ο μαζικός τουρισμός — οι ντόπιοι επιστρέφουν, βλέπεις πραγματική ατμόσφαιρα. <strong>Άνοιξη:</strong> Φρέσκα τυριά, βότανα. Καλό timing για μεζέδες με ούζο. <strong>Δείπνο:</strong> 20:00-22:00 παραδοσιακά — οι Έλληνες τρώνε αργά.</p>',
      en: '<h2>When to visit</h2><p><strong>Year-round:</strong> Unlike beachside restaurants, traditional tavernas are open all year. <strong>Best experience:</strong> September-October when mass tourism leaves — locals return, you see the real atmosphere. <strong>Spring:</strong> Fresh cheeses, herbs. Great timing for meze with ouzo. <strong>Dinner:</strong> 20:00-22:00 traditionally — Greeks eat late.</p>',
    },
    tips: {
      el: '<h2>Συμβουλές για παραδοσιακή εμπειρία</h2><ul><li><strong>Άσε τον ιδιοκτήτη να σου προτείνει:</strong> "Τι έχεις σήμερα φρέσκο/καλό;" — τυπικός κανόνας. Παίρνεις πάντα το πιο νόστιμο της ημέρας.</li><li><strong>Μεζέδες:</strong> Παράγγειλε 4-6 για 2 άτομα: τυρί φέτα, ντομάτα, γεμιστά, κεφτεδάκια, τυροπιτάκια, ντόπιο σαλάμι. Συνοδεία ούζο ή ρακή.</li><li><strong>Κύριο:</strong> Σουβλάκι, μοσχαρίσιο σπαλομπριζόλα, αρνί παϊδάκια. Σπιτικά γεμιστά, μουσακάς.</li><li><strong>Επιδόρπιο:</strong> Σπιτικό γιαούρτι με μέλι. Φρεσκοτηγανισμένο λουκουμάδες.</li><li><strong>Πληρωμή:</strong> Συχνά μόνο μετρητά. Έχε €30-60 cash για 2 άτομα.</li><li><strong>Καλύτερα χωριά:</strong> Παρθενώνας (Σιθωνία), Άφυτος (Κασσάνδρα), Καλαμίτσι (Σιθωνία ανατολική), Πυργαδίκια (μεταξύ Σιθωνίας-Άθω).</li></ul>',
      en: '<h2>Tips for the traditional experience</h2><ul><li><strong>Let the owner suggest:</strong> "What\'s fresh / good today?" — a typical rule. You always get the tastiest dish of the day.</li><li><strong>Meze:</strong> Order 4-6 for two people: feta, tomatoes, stuffed vegetables, meatballs, tiropitakia, local salami. Pair with ouzo or raki.</li><li><strong>Main:</strong> Souvlaki, beef rib steak, lamb chops. Homemade stuffed vegetables, moussaka.</li><li><strong>Dessert:</strong> Homemade yogurt with honey. Fresh loukoumades.</li><li><strong>Payment:</strong> Often cash only. Bring €30-60 cash for two.</li><li><strong>Best villages:</strong> Parthenonas (Sithonia), Afytos (Kassandra), Kalamitsi (eastern Sithonia), Pyrgadikia (between Sithonia-Athos).</li></ul>',
    },
    faqs: [
      {
        q: { el: 'Σε ποιο χωριό να πάω για παραδοσιακή ταβέρνα;', en: 'Which village for a traditional taverna?' },
        a: { el: '<strong>Άφυτος</strong> για κλασική Κασσάνδρα εμπειρία με θέα. <strong>Παρθενώνας</strong> για ορεινή Σιθωνία. <strong>Καλαμίτσι</strong> για ψαρομεζέδες. <strong>Πυργαδίκια</strong> για παραθαλάσσια ταβέρνες με παράδοση. Βλέπε όλες τις τοποθεσίες σε αυτή τη λίστα.', en: '<strong>Afytos</strong> for a classic Kassandra experience with a view. <strong>Parthenonas</strong> for hillside Sithonia. <strong>Kalamitsi</strong> for fish meze. <strong>Pyrgadikia</strong> for seafront tavernas with tradition. See all locations in this list.' },
      },
      {
        q: { el: 'Είναι κατάλληλο για παιδιά;', en: 'Suitable for kids?' },
        a: { el: 'Ναι — οι ελληνικές ταβέρνες είναι extra φιλικές με παιδιά. Συνήθως ηγέτης οικογενειακή ατμόσφαιρα. Επιπλέον σνακς (πατάτες τηγανητές, τυρόπιτα), παγωτό από το ψυγείο.', en: 'Yes — Greek tavernas are extra kid-friendly. Family atmosphere is the norm. Easy snacks (fries, tyropita), ice cream from the fridge.' },
      },
      {
        q: { el: 'Πόσο κοστίζει 4-μελής οικογένεια;', en: 'How much for a family of four?' },
        a: { el: 'Παραδοσιακό δείπνο με 6 μεζέδες + 2 κύρια + κρασί + νερό για 4 άτομα: €45-80. Σαφώς πιο φθηνά από beach restaurants.', en: 'A traditional dinner with 6 meze + 2 mains + wine + water for 4 people: €45-80. Clearly cheaper than beach restaurants.' },
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  'restaurants-kassandra': {
    intro: {
      el: '<p>Η Κασσάνδρα έχει την πιο πυκνή γαστρονομική σκηνή της Χαλκιδικής — από διεθνή cuisine και sushi bars στις πιο τουριστικές περιοχές (Καλλιθέα, Σάνη, Χανιώτη), μέχρι παραδοσιακές ταβέρνες με ψαρομεζέδες στα παραδοσιακά χωριά (Άφυτος, Νέα Φώκαια). Αυτή η λίστα συγκεντρώνει τα εστιατόρια της Κασσάνδρας με τις υψηλότερες αξιολογήσεις, φιλτραρισμένα ανά κουζίνα. Είτε ψάχνεις χαλαρό μεσημεριανό beach lunch, είτε ρομαντικό δείπνο sunset, είτε αυθεντική greek experience — υπάρχει κατάλληλο εστιατόριο για σένα.</p>',
      en: '<p>Kassandra has Halkidiki\'s densest gastronomy scene — from international cuisine and sushi bars in the most touristy areas (Kallithea, Sani, Hanioti) to traditional tavernas with seafood meze in the historic villages (Afytos, Nea Fokaia). This list collects Kassandra\'s highest-rated restaurants, filterable by cuisine. Whether you\'re after a relaxed beach lunch, a romantic sunset dinner, or an authentic Greek experience — there\'s a restaurant for you.</p>',
    },
    seasonal: {
      el: '<h2>Πότε να κρατήσεις</h2><p><strong>Peak season (Ιούλιος-Αύγουστος):</strong> Κράτηση υποχρεωτική 2-3 μέρες πριν σε γνωστές μονάδες. Σαββατοκύριακα οι παραλιακές γεμίζουν 20:30-22:30. <strong>Σεπτέμβριος:</strong> Καλύτερη εμπειρία — σταθερά διαθέσιμα τραπέζια, χαλαρό σέρβις, ίδια ποιότητα. <strong>Μη-σεζόν (Νοέμβριος-Μάρτιος):</strong> Πολλές παραλιακές κλειστές, αλλά οι παραδοσιακές στο εσωτερικό (Άφυτος) ανοιχτές.</p>',
      en: '<h2>When to book</h2><p><strong>Peak season (July-August):</strong> Booking is essential 2-3 days ahead at popular venues. On weekends, beachfront tables fill up 20:30-22:30. <strong>September:</strong> Better experience — tables consistently available, relaxed service, same quality. <strong>Off-season (November-March):</strong> Many beachside spots closed, but inland traditional tavernas (Afytos) stay open.</p>',
    },
    tips: {
      el: '<h2>Που να φας ανά κατηγορία</h2><ul><li><strong>Beach lunch:</strong> Σάνη Marina, Καλλιθέα παραλιακά. Mid-range €25-40/άτομο.</li><li><strong>Sunset dinner:</strong> Άφυτος για χωριό + sea view. Δες <a href="/best/romantic-restaurants">ρομαντικά εστιατόρια</a>.</li><li><strong>Ψαρομεζέδες:</strong> Νέα Φώκαια λιμανάκι, Άφυτος ταβέρνες. Δες <a href="/best/seafood-restaurants">ψαροταβέρνες</a>.</li><li><strong>Παραδοσιακή ταβέρνα:</strong> Άφυτος εσωτερικό, παρόμοιες πιο φθηνές. Δες <a href="/best/traditional-tavernas">παραδοσιακές ταβέρνες</a>.</li><li><strong>International:</strong> Σάνη Marina έχει sushi, italian, asian fusion για όσους θέλουν αλλαγή.</li></ul>',
      en: '<h2>Where to eat by category</h2><ul><li><strong>Beach lunch:</strong> Sani Marina, Kallithea seafront. Mid-range €25-40/person.</li><li><strong>Sunset dinner:</strong> Afytos village with sea view. See <a href="/best/romantic-restaurants">romantic restaurants</a>.</li><li><strong>Seafood meze:</strong> Nea Fokaia harbour, Afytos tavernas. See <a href="/best/seafood-restaurants">seafood restaurants</a>.</li><li><strong>Traditional taverna:</strong> Inland Afytos, similar villages cheaper. See <a href="/best/traditional-tavernas">traditional tavernas</a>.</li><li><strong>International:</strong> Sani Marina has sushi, Italian, Asian fusion if you want a change.</li></ul>',
    },
    faqs: [
      {
        q: { el: 'Που να φάω καλύτερα στην Κασσάνδρα;', en: 'Where to eat best in Kassandra?' },
        a: { el: 'Εξαρτάται τι θες: <strong>Άφυτος</strong> για παραδοσιακό + θέα. <strong>Σάνη Marina</strong> για premium variety. <strong>Καλλιθέα παραλιακά</strong> για cosmopolitan. <strong>Νέα Φώκαια</strong> για authentic ψαρομεζέδες. Δες όλες σε αυτή τη λίστα.', en: 'Depends on what you want: <strong>Afytos</strong> for traditional + view. <strong>Sani Marina</strong> for premium variety. <strong>Kallithea seafront</strong> for cosmopolitan. <strong>Nea Fokaia</strong> for authentic seafood meze. See all in this list.' },
      },
      {
        q: { el: 'Πληρώνω more στα παραλιακά;', en: 'Do I pay more at the beachfront places?' },
        a: { el: 'Ναι, 20-40% παραπάνω από αντίστοιχης ποιότητας εστιατόρια στα χωριά εσωτερικά. Η θέα κοστίζει.', en: 'Yes, 20-40% more than equivalent-quality restaurants in inland villages. The view comes at a price.' },
      },
      {
        q: { el: 'Πιο φθηνά Κασσάνδρα ή Σιθωνία;', en: 'Cheaper: Kassandra or Sithonia?' },
        a: { el: '<strong>Σιθωνία:</strong> Λίγο πιο φθηνά γενικά (-10-15%) επειδή πιο λιγότερο τουριστικά αναπτυγμένη. Δες τα <a href="/best/restaurants-sithonia">εστιατόρια Σιθωνίας</a>.', en: '<strong>Sithonia:</strong> Slightly cheaper overall (-10-15%) because it\'s less touristically developed. See <a href="/best/restaurants-sithonia">Sithonia restaurants</a>.' },
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  'restaurants-sithonia': {
    intro: {
      el: '<p>Η γαστρονομική σκηνή της Σιθωνίας είναι πιο χαλαρή και φυσική από αυτή της Κασσάνδρας — λιγότερα διεθνή concept, περισσότερες ψαροταβέρνες σε γραφικά λιμανάκια και παραδοσιακές ταβέρνες στα ορεινά χωριά. Είναι ιδανική για όσους ψάχνουν αυθεντική ελληνική γαστρονομία χωρίς τον αναπτυγμένο τουριστικό χαρακτήρα. Από τα ψαρολίμανα του Πυργαδίκι και της Σάρτης, μέχρι τις παραδοσιακές ταβέρνες του Παρθενώνα και της Νικήτης — η Σιθωνία είναι το παράδειγμα της απλής, ποιοτικής ελληνικής εστίασης. Αυτή η λίστα συγκεντρώνει τα κορυφαία εστιατόρια της περιοχής.</p>',
      en: '<p>Sithonia\'s gastronomy scene is more relaxed and natural than Kassandra\'s — fewer international concepts, more seafood tavernas in picturesque harbours and traditional tavernas in mountain villages. Ideal for those wanting authentic Greek gastronomy without the developed tourist character. From the fishing harbours of Pyrgadikia and Sarti to the traditional tavernas of Parthenonas and Nikiti — Sithonia exemplifies simple, quality Greek dining. This list collects the area\'s top restaurants.</p>',
    },
    seasonal: {
      el: '<h2>Πότε να πας</h2><p><strong>Καλοκαίρι:</strong> Σαββατοκύριακα Ιουλίου-Αυγούστου, κράτηση συνιστάται. Καθημερινές παίρνεις τραπέζι εύκολα. <strong>Σεπτέμβριος:</strong> Ιδανικό — οι ντόπιοι επιστρέφουν στις παραδοσιακές. Χαλαρό σέρβις, μεγαλύτερη ποικιλία (ψάρια). <strong>Χειμώνας:</strong> Λιγοστές επιλογές, ταβέρνες χωριών εσωτερικού (Παρθενώνας) ανοιχτές. Ζεστή σόμπα, σπιτικό κρασί, χειμωνιάτικα μενού.</p>',
      en: '<h2>When to visit</h2><p><strong>Summer:</strong> July-August weekends, booking advised. Weekdays, getting a table is easy. <strong>September:</strong> Ideal — locals return to traditional tavernas. Relaxed service, more fish on the menu. <strong>Winter:</strong> Fewer options, but inland village tavernas (Parthenonas) stay open. Warm stove, house wine, winter menus.</p>',
    },
    tips: {
      el: '<h2>Συμβουλές για Σιθωνία γαστρονομία</h2><ul><li><strong>Πυργαδίκια:</strong> Παραθαλάσσιες ψαροταβέρνες, σχεδόν όλες ποιοτικές. Sunset δείπνο εξαιρετικό.</li><li><strong>Σάρτη:</strong> Παραλιακές ψαροταβέρνες με θέα Άθω. Φρέσκα ψάρια από καθημερινό ψάρεμα.</li><li><strong>Νικήτη παλιά:</strong> Πάνω από τη νέα Νικήτη — εστιατόρια με προδιάθεση στη γεωγραφική ιδιαιτερότητα του χωριού.</li><li><strong>Παρθενώνας:</strong> Ορεινό χωριό, παραδοσιακές ταβέρνες με κρέατα, τυριά, μεζέδες.</li><li><strong>Βουρβουρού:</strong> Πιο cosmopolitan, sea-view εστιατόρια με θέα στα νησάκια. Πιο pricey.</li><li><strong>Καλαμίτσι:</strong> Παραδοσιακό, ποιοτικά, σπιτικά γλυκά.</li></ul>',
      en: '<h2>Tips for Sithonia gastronomy</h2><ul><li><strong>Pyrgadikia:</strong> Seafront seafood tavernas, almost all high quality. Sunset dinner is exceptional.</li><li><strong>Sarti:</strong> Beachfront seafood tavernas with views of Mount Athos. Fresh fish from daily catch.</li><li><strong>Old Nikiti:</strong> Above new Nikiti — restaurants leaning into the village\'s geographic character.</li><li><strong>Parthenonas:</strong> Mountain village, traditional tavernas with meats, cheeses, meze.</li><li><strong>Vourvourou:</strong> More cosmopolitan, sea-view restaurants over the islets. Pricier.</li><li><strong>Kalamitsi:</strong> Traditional, high quality, homemade desserts.</li></ul>',
    },
    faqs: [
      {
        q: { el: 'Που να φάω καλύτερα στη Σιθωνία;', en: 'Where to eat best in Sithonia?' },
        a: { el: 'Για ψαρομεζέδες: <strong>Πυργαδίκια</strong> ή <strong>Σάρτη</strong>. Για παραδοσιακό: <strong>Παρθενώνας</strong> ή <strong>Καλαμίτσι</strong>. Για premium θέα: <strong>Βουρβουρού</strong>. Δες όλες σε αυτή τη λίστα φιλτραρισμένες κατά rating.', en: 'For seafood meze: <strong>Pyrgadikia</strong> or <strong>Sarti</strong>. For traditional: <strong>Parthenonas</strong> or <strong>Kalamitsi</strong>. For premium view: <strong>Vourvourou</strong>. See all in this list sorted by rating.' },
      },
      {
        q: { el: 'Σιθωνία vs Κασσάνδρα για φαγητό;', en: 'Sithonia vs Kassandra for food?' },
        a: { el: '<strong>Σιθωνία:</strong> Πιο αυθεντικό, φρέσκα ψαρικά, χαλαρή ατμόσφαιρα. <strong>Κασσάνδρα:</strong> Μεγαλύτερη ποικιλία, διεθνές cuisine, πιο πολυσύχναστα. Δες και τα <a href="/best/restaurants-kassandra">εστιατόρια Κασσάνδρας</a>.', en: '<strong>Sithonia:</strong> More authentic, fresh seafood, relaxed atmosphere. <strong>Kassandra:</strong> Wider variety, international cuisine, more crowded. See <a href="/best/restaurants-kassandra">Kassandra restaurants</a> too.' },
      },
      {
        q: { el: 'Είναι ανοιχτές οι ταβέρνες χειμώνα;', en: 'Are tavernas open in winter?' },
        a: { el: 'Στα παραθαλάσσια — όχι ή ελάχιστα. Στα εσωτερικά χωριά (Παρθενώνας, Καλαμίτσι) ναι, και έχουν ωραία χειμωνιάτικη ατμόσφαιρα με σόμπα.', en: 'Seafront — no or very few. Inland villages (Parthenonas, Kalamitsi) yes, with a nice winter atmosphere around the stove.' },
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  'free-beaches': {
    intro: {
      el: '<p>Ελεύθερες παραλίες — χωρίς ξαπλώστρες, χωρίς beach bar, χωρίς οργανωμένη λειτουργία. Στρώνεις την πετσέτα σου, βάζεις τη σκιά σου, και χαλαρώνεις χωρίς κανονικά να ξοδεύεις τίποτα. Στη Χαλκιδική, αυτές οι παραλίες είναι συνήθως ή απομονωμένες (Καβουρότρυπες, διαπόρου, μικρές παραλίες Σιθωνίας) ή απλώς λιγότερο διαφημισμένες. Πολλές έχουν τα καθαρότερα νερά και την πιο αυθεντική εμπειρία. Αυτή η λίστα συγκεντρώνει τις παραλίες που χαρακτηρίζονται "free" στη βάση μας — μπορείς να στρώσεις όπου θες, χωρίς πληρωμή.</p>',
      en: '<p>Free beaches — no loungers, no beach bar, no organised setup. Spread your towel, set up your shade, and relax without spending anything. In Halkidiki these beaches are usually either isolated (Kavourotrypes, Diaporos, small Sithonia beaches) or simply less advertised. Many have the cleanest water and most authentic experience. This list collects beaches tagged as "free" in our database — you can spread out anywhere without paying.</p>',
    },
    seasonal: {
      el: '<h2>Πότε να πας</h2><p><strong>Όλο τον χρόνο σχεδόν:</strong> Αυτές οι παραλίες δεν γεμίζουν ποτέ. Μόνη εξαίρεση: τα γνωστά Καβουρότρυπες/Orange Beach γεμίζουν 9-12 Σαββατοκύριακα Ιουλίου-Αυγούστου. <strong>Καλύτερη εποχή:</strong> Μάιος-Ιούνιος και Σεπτέμβριος-Οκτώβριος — έχεις την παραλία σχεδόν για εσάς. <strong>Ωραίος καιρός χωρίς κόσμο:</strong> Καθημερινές Σεπτεμβρίου είναι το απόλυτο sweet spot.</p>',
      en: '<h2>When to visit</h2><p><strong>Almost year-round:</strong> These beaches never really fill up. The only exception: the famous Kavourotrypes/Orange Beach fills up 9-12 on July-August weekends. <strong>Best season:</strong> May-June and September-October — you basically have the beach to yourself. <strong>Nice weather without crowds:</strong> September weekdays are the absolute sweet spot.</p>',
    },
    tips: {
      el: '<h2>Πρακτικές συμβουλές για ελεύθερες παραλίες</h2><ul><li><strong>Πάρε τα πάντα:</strong> Νερό (τουλάχιστον 2L/άτομο), σνακ, ομπρέλα, αντηλιακό. Δεν υπάρχει καντίνα.</li><li><strong>Καθαριότητα:</strong> Σακούλα για σκουπίδια — πάρε τα μαζί σου. Αυτές οι παραλίες διατηρούνται καθαρές γιατί οι επισκέπτες σέβονται.</li><li><strong>Parking:</strong> Σε ορισμένες (Καβουρότρυπες) είναι μακριά + 5-15\' περπάτημα. Παπούτσια κατάλληλα.</li><li><strong>Snorkeling:</strong> Οι ελεύθερες παραλίες έχουν συχνά τα καθαρότερα νερά. Δες τις <a href="/best/snorkeling-spots">καλύτερες snorkeling παραλίες</a>.</li><li><strong>Σκιά:</strong> Συνήθως πεύκα προσφέρουν φυσική σκιά — αλλά όχι παντού. Φέρε ομπρέλα ή tarp.</li><li><strong>Σήμα κινητού:</strong> Σε απομονωμένες περιοχές μπορεί να μην έχει — ενημέρωσε κάποιον πού πας.</li></ul>',
      en: '<h2>Practical tips for free beaches</h2><ul><li><strong>Bring everything:</strong> Water (at least 2L/person), snacks, umbrella, sunscreen. No canteen.</li><li><strong>Cleanliness:</strong> Pack a rubbish bag — take it with you. These beaches stay clean because visitors respect them.</li><li><strong>Parking:</strong> Some (Kavourotrypes) need a 5-15-min walk. Bring suitable shoes.</li><li><strong>Snorkelling:</strong> Free beaches often have the clearest water. See our <a href="/best/snorkeling-spots">best snorkelling beaches</a>.</li><li><strong>Shade:</strong> Pine trees usually provide natural shade — but not everywhere. Bring an umbrella or tarp.</li><li><strong>Mobile signal:</strong> May be patchy in isolated spots — tell someone where you\'re going.</li></ul>',
    },
    faqs: [
      {
        q: { el: 'Είναι όλες οι παραλίες Χαλκιδικής ελεύθερες;', en: 'Are all Halkidiki beaches free?' },
        a: { el: 'Νομικά ναι — όλες οι ακτές είναι δημόσιες στην Ελλάδα. Στην πράξη, οι "οργανωμένες" παραλίες έχουν ξαπλώστρες/ομπρέλες (€8-15 σετ/μέρα). Σε αυτή τη λίστα συγκεντρώνουμε τις πλήρως φυσικές, χωρίς οργανωμένη λειτουργία.', en: 'Legally yes — all coast is public in Greece. In practice, "organised" beaches have loungers/umbrellas (€8-15 set/day). This list collects fully natural beaches without organised facilities.' },
      },
      {
        q: { el: 'Πιο καλό για ησυχία ελεύθερες ή ήσυχες;', en: 'Better for peace: free or quiet beaches?' },
        a: { el: 'Πολλές <a href="/best/quiet-beaches">ήσυχες παραλίες</a> είναι ταυτόχρονα ελεύθερες. Διαφορά: "ελεύθερες" είναι χωρίς υποδομές. "Ήσυχες" είναι χωρίς πολυκοσμία (μπορεί να έχουν beach bar χωρίς να γεμίζουν).', en: 'Many <a href="/best/quiet-beaches">quiet beaches</a> are also free. Difference: "free" means no facilities. "Quiet" means no crowds (may have a beach bar that doesn\'t fill up).' },
      },
      {
        q: { el: 'Είναι ασφαλές να αφήσω πράγματα όταν κολυμπώ;', en: 'Is it safe to leave belongings while swimming?' },
        a: { el: 'Η Χαλκιδική έχει χαμηλό crime rate — οι κλοπές σε παραλίες είναι σπάνιες αλλά δεν εκμηδενίζονται. Άσε ομαδική τσάντα με 1 άτομο, ή έχε waterproof pouch με κινητό/χρήματα μαζί σου στο νερό.', en: 'Halkidiki has a low crime rate — beach thefts are rare but not zero. Leave a group bag with one person, or carry a waterproof pouch with phone/cash into the water.' },
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  'hiking-trails': {
    intro: {
      el: '<p>Η Χαλκιδική δεν είναι μόνο παραλίες — πίσω από την ακτογραμμή απλώνεται ένα πευκόδασος που καλύπτει σχεδόν όλο το εσωτερικό. Οι χερσόνησοι έχουν χαμηλά βουνά (Ίταμος στη Σιθωνία, Κασσάνδρα ορεινή), μονοπάτια προς ξωκλήσια, βυζαντινούς πύργους και κρυμμένα μικρά μπαλκόνια θέας. Το διασημότερο πεζοπορικό δίκτυο είναι το <strong>Aristotle Trail</strong> — οδική σήμανση που συνδέει χωριά της ορεινής Χαλκιδικής με μοναστήρια του Αγίου Όρους. Αυτή η λίστα συγκεντρώνει τις πεζοπορικές διαδρομές και τα ορεινά αξιοθέατα με τις υψηλότερες αξιολογήσεις.</p>',
      en: '<p>Halkidiki isn\'t only beaches — behind the coastline stretches a pine forest covering almost the entire inland. The peninsulas have low mountains (Itamos in Sithonia, mountainous Kassandra), trails to chapels, Byzantine towers and hidden viewpoints. The most famous hiking network is the <strong>Aristotle Trail</strong> — signed routes connecting mountain villages with Mount Athos monasteries. This list collects the highest-rated hiking routes and mountain attractions.</p>',
    },
    seasonal: {
      el: '<h2>Πότε να πεζοπορήσεις</h2><p><strong>Άνοιξη (Μάιος-Ιούνιος):</strong> Η ιδανική εποχή — δροσερός καιρός, λουλουδιασμένο τοπίο, καθαρή ορατότητα. <strong>Φθινόπωρο (Σεπτέμβριος-Νοέμβριος):</strong> Εξαιρετικά — χρώματα φύλλων, καμία βροχή, λιγότερος κόσμος. <strong>Καλοκαίρι (Ιούλιος-Αύγουστος):</strong> Πεζοπορία πρωί 7-10 ή αργά απόγευμα 17-19 — μεσημέρι 35°C+ επικίνδυνο. <strong>Χειμώνας:</strong> Δροσερά πρωινά, σπάνιο χιόνι στις κορυφές, καλύτερη ορατότητα.</p>',
      en: '<h2>When to hike</h2><p><strong>Spring (May-June):</strong> Ideal — cool weather, blooming landscape, clear visibility. <strong>Autumn (September-November):</strong> Excellent — autumn colours, no rain, fewer people. <strong>Summer (July-August):</strong> Hike morning 7-10 or late afternoon 17-19 — midday 35°C+ is dangerous. <strong>Winter:</strong> Cool mornings, rare snow on peaks, best visibility.</p>',
    },
    tips: {
      el: '<h2>Συμβουλές για πεζοπορία στη Χαλκιδική</h2><ul><li><strong>Νερό:</strong> 2L/άτομο τουλάχιστον. Πηγές νερού υπάρχουν αλλά σπάνια.</li><li><strong>Παπούτσια:</strong> Πεζοπορικά παπούτσια με grip. Tα μονοπάτια έχουν πέτρες και βρύα.</li><li><strong>Aristotle Trail:</strong> Σηματοδοτημένο, χωρισμένο σε στάδια. Πλήρης διάβαση 2-3 ημέρες με διανυκτερεύσεις σε χωριά.</li><li><strong>Πιστοί δρομολόγια:</strong> Όχι offline maps μόνο — οι σηματοδοτήσεις είναι αξιόπιστες αλλά κάνε download χάρτη πριν.</li><li><strong>Σήμα κινητού:</strong> Αδύναμο σε ορεινά. Πες σε κάποιον πού πας.</li><li><strong>Φίδια:</strong> Σπάνια αλλά υπάρχουν. Μην σηκώνεις πέτρες, ψηλά παπούτσια.</li><li><strong>Συνδυασμός με beaches:</strong> Πρωινή πεζοπορία + μεσημέρι παραλία = ιδανικό. Δες τις <a href="/best/beaches-sithonia">παραλίες Σιθωνίας</a>.</li></ul>',
      en: '<h2>Hiking tips for Halkidiki</h2><ul><li><strong>Water:</strong> At least 2L/person. Water sources exist but rare.</li><li><strong>Shoes:</strong> Hiking shoes with grip. Trails have rocks and moss.</li><li><strong>Aristotle Trail:</strong> Signed, divided into stages. Full crossing 2-3 days with overnight stops in villages.</li><li><strong>Trusted routes:</strong> Not offline maps only — signage is reliable but download a map beforehand.</li><li><strong>Mobile signal:</strong> Weak in the mountains. Tell someone where you\'re going.</li><li><strong>Snakes:</strong> Rare but exist. Don\'t lift rocks, wear ankle-high shoes.</li><li><strong>Combine with beaches:</strong> Morning hike + afternoon swim = ideal. See <a href="/best/beaches-sithonia">Sithonia beaches</a>.</li></ul>',
    },
    faqs: [
      {
        q: { el: 'Είναι το Aristotle Trail κατάλληλο για αρχάριους;', en: 'Is the Aristotle Trail suitable for beginners?' },
        a: { el: 'Ναι, σε στάδια. Είναι χωρισμένο σε τμήματα 8-15 χλμ που ξεπερνιούνται σε 3-5 ώρες. Κάνε ένα στάδιο σαν day hike. Φάση 2-3 ημερών χρειάζεται μέτρια φυσική κατάσταση.', en: 'Yes, in stages. It\'s divided into 8-15 km sections finishable in 3-5 hours. Do one stage as a day hike. The full 2-3 day trek needs moderate fitness.' },
      },
      {
        q: { el: 'Που να μείνω για πεζοπορία;', en: 'Where to stay for hiking?' },
        a: { el: 'Παραδοσιακά χωριά της Σιθωνίας (Παρθενώνας, Νεοχώρι) ή της Κασσάνδρας ορεινής. <a href="/listings">Δες διαθέσιμα καταλύματα</a> στη βάση μας.', en: 'Traditional Sithonia villages (Parthenonas, Neochori) or mountain Kassandra. <a href="/listings">Check available accommodation</a>.' },
      },
      {
        q: { el: 'Χρειάζομαι οδηγό;', en: 'Do I need a guide?' },
        a: { el: 'Όχι για βασικές διαδρομές με καλή σήμανση. Για διέλευση Αγίου Όρους από τα μοναστήρια προαπαιτεί διαμονητήριο και τοπικό οδηγό.', en: 'Not for the basic well-signed routes. For Mount Athos monastery crossings, a diamonitirion permit and local guide are required.' },
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  'water-sports': {
    intro: {
      el: '<p>Η ακτογραμμή της Χαλκιδικής, με 550 χλμ και τρεις χερσονήσους που δημιουργούν μικρές προστατευμένες ζώνες, είναι ιδανική για water sports. Τα beach clubs της Κασσάνδρας προσφέρουν jet ski, parasailing, banana boat. Η Σιθωνία είναι παράδεισος για SUP, kayak, snorkeling, scuba diving — λόγω της προστατευμένης γεωγραφίας με μικρά νησάκια και κόλπους. Στη Βουρβουρού και τα γύρω νησάκια κάνεις windsurfing και sailing. Αυτή η λίστα συγκεντρώνει τα κέντρα water sports και τις δραστηριότητες με τις υψηλότερες αξιολογήσεις.</p>',
      en: '<p>Halkidiki\'s coastline, with 550 km and three peninsulas creating small protected zones, is ideal for water sports. Kassandra\'s beach clubs offer jet skis, parasailing, banana boats. Sithonia is a paradise for SUP, kayak, snorkelling, scuba diving — thanks to its sheltered geography with small islets and bays. In Vourvourou and the surrounding islets you can do windsurfing and sailing. This list collects the highest-rated water sports centres and activities.</p>',
    },
    seasonal: {
      el: '<h2>Πότε να κάνεις water sports</h2><p><strong>Καλοκαίρι (Ιούνιος-Σεπτέμβριος):</strong> Όλες οι δραστηριότητες λειτουργούν. Καλύτερο σερφ, kite, windsurf με τους ετήσιους ανέμους ιδίως στη βορεινή Σιθωνία. <strong>Άνοιξη/Φθινόπωρο:</strong> Sailing και SUP εξαιρετικά, λιγότερος κόσμος, καλύτερες τιμές. <strong>Καλύτερη ώρα μέρας:</strong> Πρωί 9-12 για ηρεμία, απόγευμα 16-18 για άνεμο.</p>',
      en: '<h2>When to do water sports</h2><p><strong>Summer (June-September):</strong> All activities operate. Best surf, kite, windsurf with seasonal winds, especially on northern Sithonia. <strong>Spring/Autumn:</strong> Sailing and SUP are excellent, fewer crowds, better prices. <strong>Best time of day:</strong> Morning 9-12 for calm, afternoon 16-18 for wind.</p>',
    },
    tips: {
      el: '<h2>Συμβουλές για water sports</h2><ul><li><strong>Κράτηση 1 μέρα πριν:</strong> Τα νοίκια εξοπλισμού γεμίζουν Σαββατοκύριακα. Online ή τηλεφωνική.</li><li><strong>Τιμές 2026:</strong> SUP €15-25/ώρα, jet ski €60-100/15min, parasailing €40-60/άτομο, scuba intro €70-100, kayak €15-25/ώρα.</li><li><strong>Ασφάλεια:</strong> Βεβαιώσου ότι το νοίκι έχει licensed instructors. Ζητάς συμβόλαιο.</li><li><strong>Snorkeling:</strong> Δες τις <a href="/best/snorkeling-spots">καλύτερες παραλίες snorkeling</a> για free αντίστοιχα.</li><li><strong>Sailing:</strong> Day cruises από Νέο Μαρμαρά ή Πόρτο Κουφό — €50-100/άτομο για 4-6 ώρες με γεύμα.</li><li><strong>Scuba diving:</strong> Καλύτερα κέντρα σε Νέο Μαρμαρά και Καλιθέα. Βυθίσματα 10-25m, καθαρότητα 15-25m.</li></ul>',
      en: '<h2>Water sports tips</h2><ul><li><strong>Book 1 day ahead:</strong> Equipment rentals fill up on weekends. Online or by phone.</li><li><strong>2026 prices:</strong> SUP €15-25/hour, jet ski €60-100/15min, parasailing €40-60/person, scuba intro €70-100, kayak €15-25/hour.</li><li><strong>Safety:</strong> Make sure the rental has licensed instructors. Ask for a contract.</li><li><strong>Snorkelling:</strong> See our <a href="/best/snorkeling-spots">best snorkelling beaches</a> for free alternatives.</li><li><strong>Sailing:</strong> Day cruises from Neos Marmaras or Porto Koufo — €50-100/person for 4-6 hours with lunch.</li><li><strong>Scuba diving:</strong> Best centres in Neos Marmaras and Kalithea. 10-25m dives, 15-25m visibility.</li></ul>',
    },
    faqs: [
      {
        q: { el: 'Που να κάνω scuba diving;', en: 'Where to go scuba diving?' },
        a: { el: 'Καλύτερα κέντρα: <strong>Νέος Μαρμαράς</strong> και <strong>Καλιθέα</strong>. Όλα τα κέντρα είναι PADI certified. Intro dive για αρχάριους €70-100.', en: 'Best centres: <strong>Neos Marmaras</strong> and <strong>Kallithea</strong>. All are PADI certified. Intro dive for beginners €70-100.' },
      },
      {
        q: { el: 'Κατάλληλο για παιδιά;', en: 'Suitable for kids?' },
        a: { el: 'SUP, kayak, banana boat από 6 ετών με συνοδό. Jet ski από 16 ετών με ενήλικα οδηγό. Scuba από 10 ετών (μόνο Discover Scuba).', en: 'SUP, kayak, banana boat from age 6 with adult. Jet ski from age 16 with adult driver. Scuba from age 10 (Discover Scuba only).' },
      },
      {
        q: { el: 'Που να κάνω SUP/kayak με ηρεμία;', en: 'Where for relaxed SUP/kayak?' },
        a: { el: '<strong>Βουρβουρού</strong> — προστατευμένος κόλπος με μικρά νησάκια ιδανικά για εξερεύνηση. <strong>Πόρτο Κουφό</strong> — μικρός φυσικός κόλπος, ήρεμη θάλασσα.', en: '<strong>Vourvourou</strong> — sheltered bay with small islets ideal for exploring. <strong>Porto Koufo</strong> — small natural bay, calm water.' },
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  'historical-sites': {
    intro: {
      el: '<p>Η Χαλκιδική κατοικείται συνεχώς από την προϊστορική εποχή και είναι ο γενέτειρος τόπος του <strong>Αριστοτέλη</strong> (Στάγειρα) και του <strong>Αλέξανδρου του Μεγάλου</strong> (γέννηση στις Αιγές αλλά μεγάλωμα στη γραμμή Χαλκιδικής). Η περιοχή έχει αρχαιολογικά ίχνη από ελληνιστική εποχή, βυζαντινούς πύργους από τους Σταυροφόρους, και μοναστήρια του Αγίου Όρους από τον 10ο αιώνα. Η <strong>Πετράλωνα</strong> είναι από τις σημαντικότερες παλαιολιθικές θέσεις της Ευρώπης (ηλικία ευρημάτων 200.000+ έτη). Αυτή η λίστα συγκεντρώνει τα κορυφαία ιστορικά μνημεία και αξιοθέατα.</p>',
      en: '<p>Halkidiki has been continuously inhabited since prehistoric times and is the birthplace of <strong>Aristotle</strong> (Stagira) and where <strong>Alexander the Great</strong> grew up. The region has archaeological remains from the Hellenistic era, Byzantine towers from the Crusaders, and Mount Athos monasteries from the 10th century. <strong>Petralona</strong> is one of Europe\'s most important Palaeolithic sites (200,000+ year-old finds). This list collects the top historical monuments and attractions.</p>',
    },
    seasonal: {
      el: '<h2>Πότε να επισκεφτείς</h2><p><strong>Άνοιξη και φθινόπωρο:</strong> Ιδανικά — δροσερός καιρός, λιγότερος κόσμος, καλύτερες ώρες ορατότητας. <strong>Καλοκαίρι:</strong> Επισκέψεις πρωί 9-12 πριν τη ζέστη. <strong>Χειμώνας:</strong> Πολλά αρχαιολογικά ανοιχτά αλλά με μειωμένο ωράριο.</p>',
      en: '<h2>When to visit</h2><p><strong>Spring and autumn:</strong> Ideal — cool weather, fewer crowds, better visibility. <strong>Summer:</strong> Visit morning 9-12 before the heat. <strong>Winter:</strong> Many archaeological sites are open but with reduced hours.</p>',
    },
    tips: {
      el: '<h2>Συμβουλές για ιστορικές επισκέψεις</h2><ul><li><strong>Είσοδοι:</strong> Συνήθως €4-8/άτομο. Παιδιά και ηλικιωμένοι έχουν εκπτώσεις.</li><li><strong>Πετράλωνα:</strong> Συνδυασμός σπηλιάς + Μουσείου Παλαιολιθικού. 2-3 ώρες επίσκεψης.</li><li><strong>Στάγειρα (γενέτειρα Αριστοτέλη):</strong> Αρχαιολογικός χώρος + θεματικό πάρκο. Καλό για παιδιά που μαθαίνουν.</li><li><strong>Άγιο Όρος:</strong> Άνδρες μόνο με διαμονητήριο. Γυναίκες κάνουν κρουαζιέρα από Ουρανούπολη — βλέπουν τα μοναστήρια από τη θάλασσα.</li><li><strong>Πύργος Προσφορίου (Ουρανούπολη):</strong> Βυζαντινός πύργος 14ου αιώνα. Δωρεάν επίσκεψη εξωτερικού, μουσείο μέσα.</li><li><strong>Συνδυασμός:</strong> Πρωινό αρχαιολογικό + μεσημέρι παραλία είναι ιδανική ροή.</li></ul>',
      en: '<h2>Historical visit tips</h2><ul><li><strong>Entry fees:</strong> Usually €4-8/person. Discounts for children and seniors.</li><li><strong>Petralona:</strong> Combined cave + Palaeolithic Museum visit. 2-3 hours.</li><li><strong>Stagira (Aristotle\'s birthplace):</strong> Archaeological site + theme park. Great for learning kids.</li><li><strong>Mount Athos:</strong> Men only, with a diamonitirion permit. Women take a cruise from Ouranoupoli — see the monasteries from the sea.</li><li><strong>Prosforion Tower (Ouranoupoli):</strong> 14th-century Byzantine tower. Free exterior visit, museum inside.</li><li><strong>Combine:</strong> Morning archaeology + afternoon beach is the ideal flow.</li></ul>',
    },
    faqs: [
      {
        q: { el: 'Είναι αξίζει η επίσκεψη στην Πετράλωνα;', en: 'Is Petralona worth visiting?' },
        a: { el: 'Ναι, ιδιαίτερα. Η σπηλιά είναι ένα από τα σημαντικότερα παλαιολιθικά ευρήματα της Ευρώπης. Καλό και για παιδιά. Είσοδος €8, μέρα 9-17.', en: 'Yes, very much. The cave is one of Europe\'s most important Palaeolithic finds. Great for kids too. Entry €8, hours 9-17.' },
      },
      {
        q: { el: 'Μπορώ να επισκεφτώ το Άγιο Όρος;', en: 'Can I visit Mount Athos?' },
        a: { el: 'Άνδρες ναι με διαμονητήριο (κρατηση 6 μήνες πριν, €25/μέρα). Γυναίκες όχι — απαγορεύεται η είσοδος εδώ και αιώνες. Όμως οι κρουαζιέρες από Ουρανούπολη πλησιάζουν 500m από την ακτή.', en: 'Men yes, with a diamonitirion (book 6 months ahead, €25/day). Women no — entry has been forbidden for centuries. But cruises from Ouranoupoli approach within 500m of the coast.' },
      },
      {
        q: { el: 'Που είναι τα Στάγειρα;', en: 'Where is Stagira?' },
        a: { el: 'Στη βορειοανατολική Χαλκιδική, κοντά στη σύγχρονη Στρατώνι. Το αρχαιολογικό πάρκο έχει αρχαία ερείπια + θεματικό πάρκο για παιδιά αφιερωμένο στον Αριστοτέλη.', en: 'In northeastern Halkidiki, near modern Stratoni. The archaeological park has ancient ruins + a kids\' theme park dedicated to Aristotle.' },
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  'snorkeling-spots': {
    intro: {
      el: '<p>Η Χαλκιδική, ιδίως η Σιθωνία, είναι από τους καλύτερους προορισμούς snorkeling στη βόρεια Ελλάδα. Τα νερά είναι ιδιαίτερα διαυγή (15-25m visibility τις περισσότερες μέρες), η ακτογραμμή έχει πλήθος μικρών κόλπων με βραχώδεις βυθούς που φιλοξενούν θαλάσσια ζωή, και οι περισσότερες παραλίες είναι προσβάσιμες χωρίς βάρκα. Δεν χρειάζεσαι εξοπλισμό πέρα από μάσκα και αναπνευστήρα — που μπορείς να αγοράσεις από οποιαδήποτε supermarket για €15-25. Αυτή η λίστα συγκεντρώνει τις παραλίες με τα καλύτερα snorkeling spots.</p>',
      en: '<p>Halkidiki, especially Sithonia, is one of northern Greece\'s top snorkelling destinations. The water is particularly clear (15-25m visibility on most days), the coastline has many small bays with rocky bottoms hosting marine life, and most beaches are accessible without a boat. You don\'t need equipment beyond a mask and snorkel — buy them at any supermarket for €15-25. This list collects beaches with the best snorkelling spots.</p>',
    },
    seasonal: {
      el: '<h2>Πότε να snorkeleάρεις</h2><p><strong>Καλύτερη ορατότητα:</strong> Σεπτέμβριος-Οκτώβριος (έως 25m). Καλοκαίρι 15-20m λόγω αλγών. <strong>Καλύτερη θερμοκρασία νερού:</strong> Αύγουστος-Σεπτέμβριος (25-26°C). <strong>Καλύτερη ώρα:</strong> Πρωί 8-11 πριν τον αέρα και την ανατάραξη του νερού. <strong>Αποφυγή:</strong> Μετά από μπόρα — αυξάνεται η θολούρα για 24-48h.</p>',
      en: '<h2>When to snorkel</h2><p><strong>Best visibility:</strong> September-October (up to 25m). Summer 15-20m due to algae. <strong>Best water temperature:</strong> August-September (25-26°C). <strong>Best time of day:</strong> Morning 8-11 before wind stirs the water. <strong>Avoid:</strong> After a storm — turbidity stays for 24-48h.</p>',
    },
    tips: {
      el: '<h2>Συμβουλές για snorkeling</h2><ul><li><strong>Εξοπλισμός:</strong> Μάσκα + snorkel + παπούτσια ρηχών νερών. Δεν χρειάζονται πτερύγια αν είσαι σε ρηχά (1-3m).</li><li><strong>Καλύτερα spots:</strong> Βραχώδεις άκρες κόλπων με μικρά "παράθυρα" από το open sea — εκεί συγκεντρώνονται τα ψάρια.</li><li><strong>Τι θα δεις:</strong> Συνεχώς — βρώμικα (sea bream), σαρπες, λαβράκια. Σπάνια — χταπόδια, οκταπόδια, αχινούς. Πολύ σπάνια — μέδουσες.</li><li><strong>Ασφάλεια:</strong> Ποτέ μόνος. Ομόρευσε με snorkeling buddy.</li><li><strong>Sun protection:</strong> Reef-safe αντηλιακό. Καλύπτεις την πλάτη με rash guard — καίγεται.</li><li><strong>Συνδυασμός με water sports:</strong> Δες τα <a href="/best/water-sports">water sports</a> για guided tours.</li></ul>',
      en: '<h2>Snorkelling tips</h2><ul><li><strong>Gear:</strong> Mask + snorkel + water shoes. Fins aren\'t needed in the shallows (1-3m).</li><li><strong>Best spots:</strong> Rocky edges of bays with small openings to the open sea — that\'s where fish gather.</li><li><strong>What you\'ll see:</strong> Common — sea bream, salpa, sea bass. Rare — octopus, sea urchins. Very rare — jellyfish.</li><li><strong>Safety:</strong> Never alone. Pair up with a snorkelling buddy.</li><li><strong>Sun protection:</strong> Reef-safe sunscreen. Cover your back with a rash guard — it burns.</li><li><strong>Combine with water sports:</strong> See our <a href="/best/water-sports">water sports</a> page for guided tours.</li></ul>',
    },
    faqs: [
      {
        q: { el: 'Που είναι τα καλύτερα νερά για snorkeling;', en: 'Where is the best water for snorkelling?' },
        a: { el: '<strong>Σιθωνία</strong> γενικά — δες <a href="/best/beaches-sithonia">όλες τις παραλίες Σιθωνίας</a>. Συγκεκριμένα: Διάπορος, Καρύδι, Φάβα, Λιμανάκι (Blue Lagoon).', en: '<strong>Sithonia</strong> overall — see <a href="/best/beaches-sithonia">all Sithonia beaches</a>. Specifically: Diaporos, Karydi, Fava, Limanaki (Blue Lagoon).' },
      },
      {
        q: { el: 'Υπάρχουν επικίνδυνα ζώα στο νερό;', en: 'Are there dangerous animals in the water?' },
        a: { el: 'Όχι ουσιαστικά. Σπάνια μέδουσες τον Αύγουστο. Δεν υπάρχουν επικίνδυνα ψάρια ή καρχαρίες στις ακτές της Χαλκιδικής.', en: 'Essentially no. Rare jellyfish in August. No dangerous fish or sharks along Halkidiki\'s coast.' },
      },
      {
        q: { el: 'Χρειάζομαι δίπλωμα/εκπαίδευση;', en: 'Do I need certification/training?' },
        a: { el: 'Όχι για βασικό snorkeling. Είναι ασφαλές για όποιον μπορεί να κολυμπήσει. Για scuba diving βλέπε <a href="/best/water-sports">water sports</a>.', en: 'No for basic snorkelling. Safe for anyone who can swim. For scuba diving see <a href="/best/water-sports">water sports</a>.' },
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  'instagram-spots': {
    intro: {
      el: '<p>Η Χαλκιδική, με τις τρεις χερσονήσους, τα τυρκουάζ νερά, τα ξωκλήσια στους λόφους και τα γραφικά λιμανάκια, είναι ένας πραγματικός θησαυρός για photographers και Instagram creators. Από τις χαρακτηριστικές <strong>Καβουρότρυπες (Orange Beach)</strong> με τους πορτοκαλί βραχώδεις σχηματισμούς, μέχρι την <strong>Παραλία Ποσειδίου</strong> με τη μοναδική γλώσσα γης και τον φάρο, η περιοχή έχει αρκετά iconic σημεία για να γεμίσεις ένα ολόκληρο Instagram archive. Αυτή η λίστα συγκεντρώνει τα πιο φωτογενή spots — από τα διάσημα μέχρι μυστικά που λίγοι ξέρουν.</p>',
      en: '<p>Halkidiki, with its three peninsulas, turquoise water, hillside chapels and picturesque little harbours, is a real treasure for photographers and Instagram creators. From the iconic <strong>Kavourotrypes (Orange Beach)</strong> with its orange rock formations to <strong>Possidi Beach</strong> with its unique sand spit and lighthouse, the area has enough iconic spots to fill an entire Instagram archive. This list collects the most photogenic spots — from the famous to little-known secrets.</p>',
    },
    seasonal: {
      el: '<h2>Πότε για τις καλύτερες φωτογραφίες</h2><p><strong>Golden hour:</strong> 30 λεπτά μετά την ανατολή και 30 λεπτά πριν τη δύση — το μαλακό φως κάνει τα νερά να ακτινοβολούν. <strong>Καλοκαίρι:</strong> Μέγιστη φωτεινότητα, καθαρά νερά. <strong>Φθινόπωρο:</strong> Καλύτερα χρώματα, αδειασμένες παραλίες — τέλειο για landscape photography. <strong>Καλύτερη ώρα παραλίας:</strong> 7-9 το πρωί χωρίς κόσμο. Μετά τις 11 γεμίζει.</p>',
      en: '<h2>When for the best shots</h2><p><strong>Golden hour:</strong> 30 minutes after sunrise and 30 minutes before sunset — soft light makes the water glow. <strong>Summer:</strong> Maximum brightness, clear water. <strong>Autumn:</strong> Better colours, empty beaches — perfect for landscape photography. <strong>Best beach time:</strong> 7-9 AM with no crowds. After 11 it fills up.</p>',
    },
    tips: {
      el: '<h2>Συμβουλές για φωτογράφιση</h2><ul><li><strong>Εξοπλισμός:</strong> Drone (επιτρέπεται με άδεια), wide-angle lens για beaches, polarizer για νερά. Mobile camera με filter απόλυτα επαρκής.</li><li><strong>Iconic spots:</strong> Φάρος Ποσειδίου, Καβουρότρυπες, Πύργος Προσφορίου (Ουρανούπολη), Άφυτος παλαιό χωριό, Βουρβουρού.</li><li><strong>Drone:</strong> Άδεια απαιτείται για εμπορική χρήση. Προσωπική χρήση επιτρέπεται κάτω από 120m. Όχι πάνω από κόσμο.</li><li><strong>Αποφυγή:</strong> Μην ενοχλείς ντόπιους ή ταβέρνες ζητώντας να βγάλεις stories. Ζητάς πρώτα.</li><li><strong>Sunset shots:</strong> Δυτική Χαλκιδική (Ποσείδι, δυτική Καλλιθέα) — όχι ανατολικά πόδια.</li><li><strong>Combine:</strong> Δες τις <a href="/best/beaches-sithonia">παραλίες Σιθωνίας</a> για photogenic επιλογές.</li></ul>',
      en: '<h2>Photography tips</h2><ul><li><strong>Gear:</strong> Drone (permitted with license), wide-angle for beaches, polariser for water. A mobile camera with filters is plenty.</li><li><strong>Iconic spots:</strong> Possidi lighthouse, Kavourotrypes, Prosforion Tower (Ouranoupoli), old Afytos village, Vourvourou.</li><li><strong>Drone:</strong> Permit required for commercial use. Personal use allowed below 120m. Not over people.</li><li><strong>Etiquette:</strong> Don\'t bother locals or tavernas asking to shoot stories. Ask first.</li><li><strong>Sunset shots:</strong> Western Halkidiki (Possidi, western Kallithea) — not the eastern legs.</li><li><strong>Combine:</strong> See our <a href="/best/beaches-sithonia">Sithonia beaches</a> for photogenic picks.</li></ul>',
    },
    faqs: [
      {
        q: { el: 'Ποιο είναι το πιο iconic Instagram spot;', en: 'What\'s the most iconic Instagram spot?' },
        a: { el: '<strong>Καβουρότρυπες (Orange Beach)</strong> στη Σιθωνία — οι πορτοκαλί βράχοι + τυρκουάζ νερά είναι signature shot Χαλκιδικής. Δεύτερο: <strong>Φάρος Ποσειδίου</strong> με τη γλώσσα γης από drone.', en: '<strong>Kavourotrypes (Orange Beach)</strong> in Sithonia — orange rocks + turquoise water is Halkidiki\'s signature shot. Second: <strong>Possidi lighthouse</strong> with the sand spit shot from a drone.' },
      },
      {
        q: { el: 'Επιτρέπεται το drone στις παραλίες;', en: 'Are drones allowed at beaches?' },
        a: { el: 'Ναι για προσωπική χρήση κάτω από 120m. Όχι πάνω από κόσμο. Εμπορική χρήση απαιτεί άδεια. Σε στρατιωτικές ζώνες (κοντά σύνορα) απαγορεύεται.', en: 'Yes for personal use below 120m. Not over people. Commercial use requires a permit. Forbidden in military zones (near borders).' },
      },
      {
        q: { el: 'Που για sunset shots;', en: 'Where for sunset shots?' },
        a: { el: '<strong>Ποσείδι</strong> — δυτική Κασσάνδρα, ηλιοβασίλεμα πάνω από τη γλώσσα γης. <strong>Δυτική Καλλιθέα</strong>. Σιθωνία δυτική (Πόρτο Κουφό). Φωτογραφία κατά της ανατολής/δύσης κάνει νερά να αστράφτουν.', en: '<strong>Possidi</strong> — western Kassandra, sunset over the sand spit. <strong>Western Kallithea</strong>. Western Sithonia (Porto Koufo). Shooting into the sunset makes the water sparkle.' },
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  'kids-activities': {
    intro: {
      el: '<p>Η Χαλκιδική είναι από τους πιο family-friendly προορισμούς της Ελλάδας — δεν είναι μόνο παραλίες με ρηχά νερά (δες τις <a href="/best/family-beaches">οικογενειακές παραλίες</a>), αλλά και ποικιλία δραστηριοτήτων για παιδιά κάθε ηλικίας. Από water parks και adventure parks, μέχρι θεματικά μουσεία και ζωολογικά πάρκα. Πολλά καταλύματα έχουν kids clubs και mini disco. Αυτή η λίστα συγκεντρώνει τις δραστηριότητες που σταθερά κερδίζουν θετικά reviews από οικογένειες.</p>',
      en: '<p>Halkidiki is one of Greece\'s most family-friendly destinations — not just shallow-water beaches (see our <a href="/best/family-beaches">family beaches</a>), but a variety of activities for kids of every age. From water parks and adventure parks to themed museums and zoos. Many accommodations have kids clubs and mini discos. This list collects activities that consistently earn positive reviews from families.</p>',
    },
    seasonal: {
      el: '<h2>Πότε να πας με παιδιά</h2><p><strong>Ιούνιος:</strong> Ιδανικό — όλες οι δραστηριότητες ανοιχτές, λίγος κόσμος, καιρός 28-30°C. <strong>Ιούλιος-Αύγουστος:</strong> Peak, χρειάζεται κράτηση. Καλό για kids clubs καταλυμάτων. <strong>Σεπτέμβριος:</strong> Καλύτερες τιμές, λιγότερος κόσμος, αλλά μερικά κλείνουν στα τέλη του μήνα.</p>',
      en: '<h2>When to visit with kids</h2><p><strong>June:</strong> Ideal — all activities open, fewer crowds, weather 28-30°C. <strong>July-August:</strong> Peak, needs booking. Great for accommodation kids clubs. <strong>September:</strong> Better prices, fewer crowds, but some close at end of month.</p>',
    },
    tips: {
      el: '<h2>Συμβουλές για διακοπές με παιδιά</h2><ul><li><strong>Σχεδιασμός:</strong> Πρωί παραλία (ρηχά + λιγότερη ζέστη) + απόγευμα δραστηριότητα + βραδινό φαγητό στις 19:00 (όχι 22:00 ελληνικό style).</li><li><strong>Kids equipment:</strong> Βραχιολάκι/σαμπρέλα, καπέλα, αντηλιακό SPF 50, φουσκωτό για μωρά.</li><li><strong>Water park:</strong> Aqualand Water Fun Park στη Νέα Πλάγια — μεγαλύτερο της περιοχής. Εισιτήριο €20-30/άτομο.</li><li><strong>Καταλύματα με kids club:</strong> Πολλά resorts στην Κασσάνδρα (Σάνη, Πευκοχώρι) έχουν επαγγελματικά kids clubs, mini disco, παιδικές πισίνες.</li><li><strong>Παραδοσιακή ταβέρνα:</strong> Δοκίμασε <a href="/best/traditional-tavernas">παραδοσιακές ταβέρνες</a> — οι Έλληνες είναι extra φιλικοί με παιδιά.</li><li><strong>Παιδικά μενού:</strong> Σχεδόν παντού. Συνήθως πατάτες/τυρόπιτα/σπαγγέτι.</li></ul>',
      en: '<h2>Tips for a kids holiday</h2><ul><li><strong>Plan:</strong> Morning beach (shallow + less heat) + afternoon activity + 19:00 dinner (not 22:00 Greek style).</li><li><strong>Kids equipment:</strong> Armband/float, hats, SPF 50 sunscreen, baby float.</li><li><strong>Water park:</strong> Aqualand Water Fun Park in Nea Plagia — largest in the region. Ticket €20-30/person.</li><li><strong>Kids-club accommodation:</strong> Many Kassandra resorts (Sani, Pefkochori) have proper kids clubs, mini disco, kid pools.</li><li><strong>Traditional taverna:</strong> Try our <a href="/best/traditional-tavernas">traditional tavernas</a> — Greeks are extra kid-friendly.</li><li><strong>Kids menus:</strong> Almost everywhere. Usually fries/tyropita/pasta.</li></ul>',
    },
    faqs: [
      {
        q: { el: 'Υπάρχει water park κοντά;', en: 'Is there a water park nearby?' },
        a: { el: '<strong>Aqualand Water Fun Park</strong> στη Νέα Πλάγια είναι το μεγαλύτερο. Εισιτήριο €25-30/ενήλικα, €18-20/παιδί. Ανοιχτό Ιούνιος-Σεπτέμβριος.', en: '<strong>Aqualand Water Fun Park</strong> in Nea Plagia is the biggest. Ticket €25-30/adult, €18-20/child. Open June-September.' },
      },
      {
        q: { el: 'Πιο κατάλληλη χερσόνησος για παιδιά;', en: 'Best peninsula for kids?' },
        a: { el: '<strong>Κασσάνδρα</strong> — πιο αναπτυγμένη, καλύτερες υποδομές, kids clubs, water park κοντά. <strong>Σιθωνία</strong> πιο ήρεμη αλλά λιγότερες δομές για παιδιά.', en: '<strong>Kassandra</strong> — more developed, better facilities, kids clubs, water park nearby. <strong>Sithonia</strong> is calmer but has fewer kid-specific facilities.' },
      },
      {
        q: { el: 'Είναι ασφαλή τα νερά για μωρά;', en: 'Is the water safe for babies?' },
        a: { el: 'Ναι, στις <a href="/best/family-beaches">οικογενειακές παραλίες</a> με ρηχό βυθό. Σάνη Marina, Σιβηρή, Νέα Φώκαια έχουν 20-30m ρηχής ζώνης.', en: 'Yes, on our <a href="/best/family-beaches">family beaches</a> with shallow bottoms. Sani Marina, Siviri, Nea Fokaia have 20-30m of shallows.' },
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  'romantic-getaways': {
    intro: {
      el: '<p>Η Χαλκιδική είναι ιδανική για romantic getaways χωρίς να θυσιάζεις την πρόσβαση — σε αντίθεση με τα νησιά που χρειάζονται ferry, εδώ μπαίνεις και βγαίνεις με αυτοκίνητο. Boutique hotels με sea-view σουίτες, ιδιωτικές παραλίες, sunset δείπνα, spa treatments σε resorts — όλα διαθέσιμα. Τα πιο ρομαντικά spots: <strong>Σιθωνία</strong> για φυσικό romance (παραλίες, sunset σε Vourvourou), <strong>Άφυτος</strong> για χαριτωμένο παραδοσιακό χωριό με sea view, <strong>Ουρανούπολη</strong> για μυστικιστική απόσταξη του Άθω. Αυτή η λίστα συγκεντρώνει τα κορυφαία επιλογές για ζευγάρια και honeymooners.</p>',
      en: '<p>Halkidiki is ideal for romantic getaways without sacrificing access — unlike Greek islands needing a ferry, here you drive in and out. Boutique hotels with sea-view suites, private beaches, sunset dinners, spa treatments at resorts — all available. The most romantic spots: <strong>Sithonia</strong> for natural romance (beaches, Vourvourou sunset), <strong>Afytos</strong> for a charming traditional village with sea view, <strong>Ouranoupoli</strong> for mystical Mount Athos vibes. This list collects the top picks for couples and honeymooners.</p>',
    },
    seasonal: {
      el: '<h2>Πότε για romantic break</h2><p><strong>Μάιος-Ιούνιος:</strong> Ιδανικό — δροσερά απογεύματα, λουλούδια ανθίζουν, λίγος κόσμος, καλές τιμές. <strong>Σεπτέμβριος:</strong> Equally ideal — ζεστή θάλασσα, λιγότερος κόσμος, sunset δείπνα στα terraces. <strong>Καλοκαίρι:</strong> Pricey, busy. <strong>Χειμώνας:</strong> Cosy alternative — fireplace cabins, παραδοσιακά χωριά με fireplaces, λιγότερα ανοιχτά εστιατόρια.</p>',
      en: '<h2>When for a romantic break</h2><p><strong>May-June:</strong> Ideal — cool afternoons, flowers blooming, fewer crowds, better prices. <strong>September:</strong> Equally ideal — warm sea, fewer crowds, sunset dinners on terraces. <strong>Summer:</strong> Pricey, busy. <strong>Winter:</strong> Cosy alternative — fireplace cabins, traditional villages, but fewer open restaurants.</p>',
    },
    tips: {
      el: '<h2>Συμβουλές για ζευγάρια</h2><ul><li><strong>Κράτηση 3-6 μήνες πριν:</strong> Τα κορυφαία boutique hotels (Νέος Μαρμαράς, Σάνη, Άφυτος) γεμίζουν νωρίς για peak season.</li><li><strong>Επιπλέον επιλογές:</strong> Σε resorts (Σάνη, Ekies) μπορείς να ζητήσεις champagne welcome, rose petals, special dinner — δωρεάν συνήθως.</li><li><strong>Day trips:</strong> Day cruise από Νέο Μαρμαρά (€80-150/couple για 4-6 ώρες με γεύμα). Sunset cruise από Ουρανούπολη.</li><li><strong>Δείπνα:</strong> Δες <a href="/best/romantic-restaurants">ρομαντικά εστιατόρια</a> για sunset views.</li><li><strong>Spa:</strong> Πολλά resorts έχουν couples treatments. Mediterranean massage €70-150.</li><li><strong>Off the beaten path:</strong> Πιο ρομαντική εμπειρία: μικρό boutique guest house σε παραδοσιακό χωριό αντί για mega resort.</li></ul>',
      en: '<h2>Couples tips</h2><ul><li><strong>Book 3-6 months ahead:</strong> Top boutique hotels (Neos Marmaras, Sani, Afytos) fill up early for peak season.</li><li><strong>Extras:</strong> At resorts (Sani, Ekies) you can request champagne welcome, rose petals, special dinner — usually free.</li><li><strong>Day trips:</strong> Day cruise from Neos Marmaras (€80-150/couple for 4-6 hours with lunch). Sunset cruise from Ouranoupoli.</li><li><strong>Dinners:</strong> See our <a href="/best/romantic-restaurants">romantic restaurants</a> for sunset views.</li><li><strong>Spa:</strong> Many resorts have couples treatments. Mediterranean massage €70-150.</li><li><strong>Off the beaten path:</strong> A small boutique guest house in a traditional village is more romantic than a mega resort.</li></ul>',
    },
    faqs: [
      {
        q: { el: 'Καλύτερο μέρος για honeymoon;', en: 'Best for a honeymoon?' },
        a: { el: '<strong>Σιθωνία</strong> για φυσικά απομονωμένη εμπειρία — boutique hotels με sea view, ιδιωτικές παραλίες. <strong>Σάνη/Καλλιθέα</strong> Κασσάνδρας για 5* luxury experience.', en: '<strong>Sithonia</strong> for naturally secluded experience — boutique hotels with sea views, private beaches. <strong>Sani/Kallithea</strong> in Kassandra for 5* luxury experience.' },
      },
      {
        q: { el: 'Κόστος για 7 βραδινά honeymoon;', en: 'Cost for a 7-night honeymoon?' },
        a: { el: '<strong>Mid-luxury:</strong> €1500-3000/couple για 7 βραδιές με δείπνα. <strong>Premium:</strong> €3000-6000+ σε resorts όπως Σάνη ή Ekies.', en: '<strong>Mid-luxury:</strong> €1500-3000/couple for 7 nights with dinners. <strong>Premium:</strong> €3000-6000+ at resorts like Sani or Ekies.' },
      },
      {
        q: { el: 'Υπάρχουν private beaches;', en: 'Are there private beaches?' },
        a: { el: 'Νομικά όχι — όλες οι ακτές είναι δημόσιες. Στην πράξη, resorts όπως η Σάνη έχουν παραλίες που λειτουργούν "ιδιωτικά" λόγω αποκλειστικής πρόσβασης από το hotel.', en: 'Legally no — all coast is public. In practice, resorts like Sani have beaches that operate "privately" thanks to exclusive hotel access.' },
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  'luxury-hotels': {
    intro: {
      el: '<p>Η Χαλκιδική φιλοξενεί μερικά από τα πιο αναγνωρισμένα luxury resorts της Ελλάδας — Σάνη Resort, Ikos Resorts, Eagles Palace, Ekies All Senses. Δεν είναι μόνο μεγάλα ξενοδοχεία, είναι ολοκληρωμένες εμπειρίες με ιδιωτικές παραλίες, fine dining εστιατόρια, spa centers, kids clubs επαγγελματικού επιπέδου και activities. Οι περισσότερα από αυτά συγκεντρώνονται στη <strong>δυτική Κασσάνδρα</strong> (Σάνη, Καλλιθέα) και ορισμένα boutique στη <strong>Σιθωνία</strong> (Νέος Μαρμαράς, Βουρβουρού). Αυτή η λίστα συγκεντρώνει τις premium επιλογές καταλύματος που σταθερά κερδίζουν 5* αξιολογήσεις.</p>',
      en: '<p>Halkidiki hosts some of Greece\'s most recognised luxury resorts — Sani Resort, Ikos Resorts, Eagles Palace, Ekies All Senses. Not just big hotels — they\'re complete experiences with private beaches, fine-dining restaurants, spa centres, professional kids clubs and activities. Most are concentrated in <strong>western Kassandra</strong> (Sani, Kallithea), with some boutique options in <strong>Sithonia</strong> (Neos Marmaras, Vourvourou). This list collects premium accommodation that consistently earns 5* ratings.</p>',
    },
    seasonal: {
      el: '<h2>Πότε να κρατήσεις</h2><p><strong>Peak season (Ιούλιος-Αύγουστος):</strong> Κρατήσεις 6-12 μήνες πριν για τα top resorts. <strong>Shoulder (Μάιος-Ιούνιος, Σεπτέμβριος):</strong> Καλύτερη value — όλες οι υπηρεσίες ανοιχτές, τιμές 20-30% κάτω. <strong>Σεπτέμβριος:</strong> sweet spot για honeymoon — λιγότερα παιδιά, ζεστή θάλασσα. <strong>Off-season (Νοέμβριος-Μάρτιος):</strong> Πολλά κλειστά, εκτός από Σάνη και κάποια all-year.</p>',
      en: '<h2>When to book</h2><p><strong>Peak season (July-August):</strong> Book 6-12 months ahead at top resorts. <strong>Shoulder (May-June, September):</strong> Best value — all services open, prices 20-30% lower. <strong>September:</strong> Sweet spot for honeymoon — fewer kids, warm sea. <strong>Off-season (November-March):</strong> Many closed except Sani and a few year-round operators.</p>',
    },
    tips: {
      el: '<h2>Συμβουλές για luxury stay</h2><ul><li><strong>All-inclusive vs B&B:</strong> Στα μεγάλα resorts (Ikos) το all-inclusive είναι value γιατί περιλαμβάνει premium φαγητά. Σε boutique hotels (Ekies) προτίμα B&B και βγες σε ταβέρνες.</li><li><strong>Sea view vs garden view:</strong> Διαφορά €50-150/βράδυ. Άξιο για sunset views ή Άγιο Όρος (Ουρανούπολη).</li><li><strong>Suite upgrade:</strong> Στο check-in συνήθως υπάρχει διαθεσιμότητα. Πληρωμή €100-300 extra για suite με ιδιωτική πισίνα.</li><li><strong>Spa:</strong> Couples ritual €150-300. Κράτηση 1-2 μέρες πριν.</li><li><strong>Excursions:</strong> Όλα τα resorts προσφέρουν private day cruises, helicopter tours σε Άγιο Όρος, fine dining specials.</li><li><strong>Loyalty:</strong> Σε επανεπίσκεψη πάντα ζητάς upgrade ή welcome amenity.</li></ul>',
      en: '<h2>Luxury stay tips</h2><ul><li><strong>All-inclusive vs B&B:</strong> At big resorts (Ikos) all-inclusive is great value because it includes premium dining. At boutique hotels (Ekies) prefer B&B and go out to tavernas.</li><li><strong>Sea view vs garden view:</strong> €50-150/night difference. Worth it for sunsets or Mount Athos (Ouranoupoli).</li><li><strong>Suite upgrade:</strong> Often available at check-in. Pay €100-300 extra for a suite with private pool.</li><li><strong>Spa:</strong> Couples ritual €150-300. Book 1-2 days ahead.</li><li><strong>Excursions:</strong> All resorts offer private day cruises, helicopter tours to Mount Athos, fine-dining specials.</li><li><strong>Loyalty:</strong> On a return visit always ask for an upgrade or welcome amenity.</li></ul>',
    },
    faqs: [
      {
        q: { el: 'Καλύτερο luxury resort της Χαλκιδικής;', en: 'Best luxury resort in Halkidiki?' },
        a: { el: 'Δύσκολη επιλογή — <strong>Σάνη Resort</strong> για variety, <strong>Ikos Olivia</strong> για premium all-inclusive, <strong>Eagles Palace</strong> για location στην Ουρανούπολη, <strong>Ekies All Senses</strong> για boutique experience στη Σιθωνία. Όλα στην λίστα.', en: 'Tough call — <strong>Sani Resort</strong> for variety, <strong>Ikos Olivia</strong> for premium all-inclusive, <strong>Eagles Palace</strong> for Ouranoupoli location, <strong>Ekies All Senses</strong> for boutique Sithonia experience. All in the list.' },
      },
      {
        q: { el: 'Κόστος ανά βράδυ;', en: 'Cost per night?' },
        a: { el: '<strong>Mid-luxury (4*):</strong> €200-400/βράδυ peak season. <strong>Premium (5*):</strong> €400-800. <strong>Suite με ιδιωτική πισίνα:</strong> €800-2500. Σεπτέμβριος -30%.', en: '<strong>Mid-luxury (4*):</strong> €200-400/night peak season. <strong>Premium (5*):</strong> €400-800. <strong>Suite with private pool:</strong> €800-2500. -30% in September.' },
      },
      {
        q: { el: 'Καλύτερη χερσόνησος για luxury;', en: 'Best peninsula for luxury?' },
        a: { el: '<strong>Κασσάνδρα</strong> για variety και υποδομές (Σάνη, Καλλιθέα). <strong>Άθως</strong> για μυστηριώδη εμπειρία (Ουρανούπολη). <strong>Σιθωνία</strong> για boutique και ησυχία.', en: '<strong>Kassandra</strong> for variety and facilities (Sani, Kallithea). <strong>Athos</strong> for mystical experience (Ouranoupoli). <strong>Sithonia</strong> for boutique and quiet.' },
      },
    ],
  },

  // ───────────────────────────────────────────────────────────────────
  'camping-spots': {
    intro: {
      el: '<p>Η Χαλκιδική έχει μερικά από τα καλύτερα οργανωμένα campings της Ελλάδας — με την ιδιαιτερότητα ότι πολλά βρίσκονται κατευθείαν δίπλα σε υπέροχες παραλίες με πευκοδάσος, χωρίς να χρειάζεσαι μετακίνηση. Από beachfront σε <strong>Κασσάνδρα</strong> (Πευκοχώρι, Καλλιθέα), μέχρι πιο φυσικά σε <strong>Σιθωνία</strong> (Παραλία Άρμενιστής, Καλαμίτσι) και <strong>Άθως</strong> (Ουρανούπολη). Οι περισσότερες έχουν πισίνες, εστιατόρια, μίνι-μάρκετ. Αυτή η λίστα συγκεντρώνει τα top-rated camping spots — ιδανικά για budget-friendly οικογενειακές διακοπές ή road trip με trailer.</p>',
      en: '<p>Halkidiki has some of Greece\'s best organised campsites — with the bonus that many sit directly next to stunning beaches with pine forest, no need to travel. From beachfront in <strong>Kassandra</strong> (Pefkochori, Kallithea) to more natural in <strong>Sithonia</strong> (Armenistis Beach, Kalamitsi) and <strong>Athos</strong> (Ouranoupoli). Most have pools, restaurants, mini-markets. This list collects top-rated camping spots — ideal for budget family holidays or trailer road trips.</p>',
    },
    seasonal: {
      el: '<h2>Πότε να κάνεις camping</h2><p><strong>Ιούνιος-Σεπτέμβριος:</strong> Main season — όλα ανοιχτά, καλύτερα προϊόντα. <strong>Πιο μετά:</strong> Λίγα μένουν ανοιχτά (Καλαμίτσι, Άρμενιστής σε Σιθωνία). <strong>Χειμώνας:</strong> Camping κλειστά. <strong>Καλύτερη ώρα στήσιμο:</strong> Νωρίς πρωί όταν φτάνεις. Πιάνεις το καλύτερο spot.</p>',
      en: '<h2>When to camp</h2><p><strong>June-September:</strong> Main season — all open, best offerings. <strong>Beyond:</strong> A few stay open (Kalamitsi, Armenistis in Sithonia). <strong>Winter:</strong> Campsites closed. <strong>Best pitch time:</strong> Early morning on arrival. You get the best spot.</p>',
    },
    tips: {
      el: '<h2>Συμβουλές για camping</h2><ul><li><strong>Κράτηση:</strong> Online ή τηλεφωνική 1-2 βδομάδες πριν για peak season. Στις πιο γνωστές γεμίζει.</li><li><strong>Τιμές 2026:</strong> Σκηνή €15-25/βράδυ + €5-10/άτομο. Caravan €25-40/βράδυ. Bungalow €60-120/βράδυ.</li><li><strong>Εξοπλισμός:</strong> Πάρε σκηνή με αντοχή στον αέρα (μερικά campings σε εκτεθειμένες παραλίες). Σλίπινγκ μπαγκ, στρώμα.</li><li><strong>Φαγητό:</strong> Πολλά campings έχουν εστιατόριο/καντίνα. Mini market για supplies. BBQ συχνά επιτρέπεται.</li><li><strong>Beach access:</strong> Άμεση από όλα τα campings — αυτό είναι το πλεονέκτημα. Δες τις <a href="/best/family-beaches">οικογενειακές παραλίες</a> για κοντινές επιλογές.</li><li><strong>Παροχές:</strong> Wifi συχνά δωρεάν (slow στις πιο φυσικές). Ντουζ, πλυντήρια ρούχων, παιδική χαρά.</li></ul>',
      en: '<h2>Camping tips</h2><ul><li><strong>Reservation:</strong> Online or phone 1-2 weeks ahead for peak season. The most famous ones fill up.</li><li><strong>2026 prices:</strong> Tent €15-25/night + €5-10/person. Caravan €25-40/night. Bungalow €60-120/night.</li><li><strong>Gear:</strong> Bring a wind-resistant tent (some sites are on exposed beaches). Sleeping bag, mat.</li><li><strong>Food:</strong> Many campsites have a restaurant/canteen. Mini market for supplies. BBQ usually allowed.</li><li><strong>Beach access:</strong> Direct from all campsites — that\'s the perk. See our <a href="/best/family-beaches">family beaches</a> for nearby options.</li><li><strong>Amenities:</strong> Wi-Fi often free (slow at the more natural ones). Showers, laundry, playground.</li></ul>',
    },
    faqs: [
      {
        q: { el: 'Καλύτερο camping στη Χαλκιδική;', en: 'Best camping in Halkidiki?' },
        a: { el: '<strong>Camping Sithonia</strong> (Σιθωνία) για φυσικό setting και άμεση πρόσβαση παραλία. <strong>Camping Armenistis</strong> για ωραίο sandy beach. <strong>Camping Pefkochori</strong> (Κασσάνδρα) για υποδομές. Δες όλα τα locations στην λίστα.', en: '<strong>Camping Sithonia</strong> (Sithonia) for natural setting and direct beach access. <strong>Camping Armenistis</strong> for a nice sandy beach. <strong>Camping Pefkochori</strong> (Kassandra) for facilities. See all locations in the list.' },
      },
      {
        q: { el: 'Δέχονται caravans;', en: 'Do they accept caravans?' },
        a: { el: 'Ναι σχεδόν παντού. Έχουν specific spots για caravan και motorhome με ηλεκτρισμό. Τιμή 30-50% παραπάνω από σκηνή.', en: 'Yes, almost everywhere. They have specific caravan and motorhome spots with electricity. 30-50% more than a tent pitch.' },
      },
      {
        q: { el: 'Κατάλληλο για παιδιά;', en: 'Suitable for kids?' },
        a: { el: 'Πολύ. Όλα τα μεγάλα campings έχουν παιδικές χαρές, πισίνες με ρηχό κομμάτι, animation, snack bars. Πολλά παιδιά κάνουν φίλους.', en: 'Very much. All major campsites have playgrounds, pools with shallow sections, animation, snack bars. Lots of kids make friends.' },
      },
    ],
  },
};
