import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { localeUrl } from '@/lib/seo';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://chalkidikihub.gr';
const LOCALES = ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr'] as const;

const titles: Record<string, string> = {
  el: 'Συντακτική Πολιτική',
  en: 'Editorial Policy',
  de: 'Redaktionsrichtlinien',
  bg: 'Редакционна политика',
  ru: 'Редакционная политика',
  ro: 'Politica Editorială',
  sr: 'Uređivačka politika',
};

type Section = {
  heading: string;
  body: (string | { type: 'list'; items: string[] })[];
};

type PolicyContent = {
  title: string;
  lastUpdated: string;
  sections: Section[];
};

const content: Record<string, PolicyContent> = {
  el: {
    title: 'Συντακτική Πολιτική',
    lastUpdated: 'Τελευταία ενημέρωση: Ιούνιος 2026',
    sections: [
      {
        heading: '1. Ποιοι είμαστε',
        body: [
          'Το ChalkidikiHub είναι ανεξάρτητο ταξιδιωτικό directory για τη Χαλκιδική, χτισμένο από Έλληνες με σκοπό να βοηθήσει επισκέπτες να βρουν αξιόπιστες πληροφορίες και να συνδέσει ιδιοκτήτες καταλυμάτων απευθείας με πελάτες — χωρίς προμήθειες.',
          'Το site λειτουργεί από τον Μηνά Ελευθεριάδη και τη συντακτική ομάδα του ChalkidikiHub. Email επικοινωνίας: mnc@hotmail.gr',
        ],
      },
      {
        heading: '2. Πώς γράφεται το περιεχόμενο',
        body: [
          'Όλο το περιεχόμενο του site (blog άρθρα, περιγραφές παραλιών, οδηγοί χωριών, καταλύματα, εστιατόρια) δημιουργείται από την συντακτική ομάδα του ChalkidikiHub: Έλληνες που έχουν επισκεφτεί τις περιοχές που περιγράφουμε, με βάση πραγματικές εμπειρίες και ντόπια γνώση.',
          'Η συγγραφή και επιμέλεια κάθε άρθρου ακολουθεί την παρακάτω διαδικασία:',
          {
            type: 'list',
            items: [
              'Έρευνα: επιτόπιες επισκέψεις, συνεντεύξεις με ντόπιους, αναφορά σε επίσημες πηγές',
              'Σύνταξη draft: συγγραφή πρώτου κειμένου από συντακτική ομάδα',
              'Human editorial review: κάθε άρθρο διαβάζεται, διορθώνεται και εγκρίνεται από άνθρωπο πριν δημοσιευθεί',
              'Συνεχής επαναξιολόγηση: ανανέωση πληροφοριών (τιμές, ωράρια, εποχικές αλλαγές) όταν απαιτείται',
            ],
          },
        ],
      },
      {
        heading: '3. Χρήση τεχνολογίας AI',
        body: [
          'Με πνεύμα διαφάνειας: χρησιμοποιούμε AI tools (όπως GPT-4 και Claude) ως εργαλεία βοήθειας σε ορισμένα στάδια της παραγωγής:',
          {
            type: 'list',
            items: [
              'Drafts: το AI μπορεί να βοηθήσει στην πρώτη σύνταξη ενός άρθρου, με βάση δομημένα στοιχεία (γεωγραφία, χαρακτηριστικά, τιμές)',
              'Μεταφράσεις: το αρχικό ελληνικό περιεχόμενο μεταφράζεται σε 6 γλώσσες (αγγλικά, γερμανικά, βουλγαρικά, σερβικά, ρουμανικά, ρωσικά) με AI translation tools',
              'Επιμέλεια: το AI μπορεί να προτείνει διορθώσεις στυλ, ορθογραφίας ή δομής',
            ],
          },
          'ΣΗΜΑΝΤΙΚΟ: Κάθε κείμενο που δημοσιεύεται έχει περάσει από human editorial review. Δεν δημοσιεύουμε ποτέ AI-generated περιεχόμενο χωρίς ανθρώπινη επιμέλεια και έγκριση.',
          'Σχετικά με τη χρήση AI, ακολουθούμε τις κατευθυντήριες γραμμές της Google για AI content (Φεβ. 2023): το AI χρησιμοποιείται ως εργαλείο για να βοηθήσει στην παραγωγή χρήσιμου περιεχομένου, όχι ως αυτόνομη μηχανή που παράγει περιεχόμενο για manipulation αλγορίθμων.',
        ],
      },
      {
        heading: '4. Πηγές και επαλήθευση',
        body: [
          'Πηγές που χρησιμοποιούμε για την επαλήθευση πληροφοριών:',
          {
            type: 'list',
            items: [
              'Επιτόπιες επισκέψεις και προσωπική εμπειρία της ομάδας',
              'Επίσημα ιστορικά αρχεία (ΥΠΠΟ, Δήμοι Χαλκιδικής, αρχαιολογικές υπηρεσίες)',
              'ΕΟΤ και επίσημες τουριστικές αρχές',
              'KTEL Χαλκιδικής για συγκοινωνιακές πληροφορίες',
              'Επίσημες ιστοσελίδες μονών (Άγιο Όρος, γυναικεία μοναστήρια)',
              'Open Meteo Marine API για ζωντανά δεδομένα θερμοκρασίας νερού',
              'Παραγωγοί τοπικών προϊόντων (ΠΟΠ ελιά Χαλκιδικής, ΠΓΕ μέλι κ.λπ.)',
            ],
          },
          'Όπου αναφέρουμε συγκεκριμένα νούμερα (αποστάσεις, τιμές, υψόμετρα, ώρες), προσπαθούμε να βασιζόμαστε σε επαληθεύσιμες πηγές. Όμως οι τιμές αλλάζουν ανά σεζόν — πάντα συστήνουμε επιβεβαίωση με τον τελικό πάροχο.',
        ],
      },
      {
        heading: '5. Επικαιροποίηση και διορθώσεις',
        body: [
          'Κάθε άρθρο εμφανίζει τις ημερομηνίες δημοσίευσης και τελευταίας ενημέρωσης. Επανεξετάζουμε το περιεχόμενο όταν:',
          {
            type: 'list',
            items: [
              'Αλλάζουν εποχικά δεδομένα (ωράρια, τιμές, σεζόν)',
              'Ένας αναγνώστης μας αναφέρει λάθος ή ξεπερασμένη πληροφορία',
              'Συμβαίνει σημαντική αλλαγή σε υποδομή (νέος δρόμος, αλλαγή υπηρεσίας)',
            ],
          },
          'Αν εντοπίσετε λάθος ή ξεπερασμένη πληροφορία, στείλτε μας email στο mnc@hotmail.gr. Δεσμευόμαστε να απαντήσουμε εντός 5 εργάσιμων ημερών και να διορθώσουμε επιβεβαιωμένα λάθη γρήγορα.',
        ],
      },
      {
        heading: '6. Διαφημίσεις, affiliates και 0% προμήθεια',
        body: [
          'Δηλώνουμε με σαφήνεια το επιχειρηματικό μοντέλο του ChalkidikiHub:',
          {
            type: 'list',
            items: [
              'Χρεώνουμε 0% προμήθεια στις κρατήσεις: οι ιδιοκτήτες καταλυμάτων δεν πληρώνουν τίποτα από κάθε κράτηση',
              'Δεν συμμετέχουμε σε affiliate προγράμματα Booking/Airbnb/Expedia',
              'Πιθανώς εμφανίζουμε διαφημίσεις (Google AdSense) ως εναλλακτική πηγή εσόδων — αυτές είναι σαφώς σημασμένες ως advertisements',
              'Δεν δεχόμαστε πληρωμένη τοποθέτηση ή sponsored content στις λίστες παραλιών/εστιατορίων/καταλυμάτων: όλες οι καταχωρήσεις είναι ισότιμες',
              'Δεν αλλάζουμε το ranking καταλυμάτων με βάση πληρωμές',
            ],
          },
          'Όταν αναφέρουμε συγκεκριμένο κατάλυμα, εστιατόριο ή υπηρεσία στο blog μας, αυτό γίνεται καθαρά βάσει της αξιολόγησης της συντακτικής ομάδας — δεν δεχόμαστε αμοιβή ή ωφελήματα για αναφορά.',
        ],
      },
      {
        heading: '7. Διαχωρισμός advertising από editorial',
        body: [
          'Διατηρούμε αυστηρό διαχωρισμό μεταξύ advertising (Google AdSense banners) και του εκδοτικού μας περιεχομένου:',
          {
            type: 'list',
            items: [
              'Τα ads εμφανίζονται σε καθορισμένες περιοχές της σελίδας με σαφή σήμανση',
              'Οι διαφημιστές δεν επηρεάζουν το περιεχόμενο των άρθρων',
              'Δεν εμφανίζονται sponsored articles ως κανονικό blog content',
            ],
          },
        ],
      },
      {
        heading: '8. Multilingual content',
        body: [
          'Το site διατίθεται σε 7 γλώσσες: ελληνικά (πρωτότυπη), αγγλικά, γερμανικά, βουλγαρικά, σερβικά, ρουμανικά, ρωσικά.',
          'Το αρχικό περιεχόμενο γράφεται στα ελληνικά. Οι μεταφράσεις σε άλλες γλώσσες δημιουργούνται με AI translation tools (GPT-4) από το ελληνικό master copy. Αυτό μας επιτρέπει να σερβίρουμε πελάτες από όλη τη Νοτιοανατολική Ευρώπη χωρίς να χρειαζόμαστε πλήρη πολυγλωσσική συντακτική ομάδα.',
          'Αν εντοπίσετε λάθος μετάφραση, παρακαλούμε επικοινωνήστε μαζί μας.',
        ],
      },
      {
        heading: '9. Επικοινωνία',
        body: [
          'Για ερωτήσεις, αναφορές λαθών, ή προτάσεις περιεχομένου, επικοινωνήστε μαζί μας στο mnc@hotmail.gr',
        ],
      },
    ],
  },
  en: {
    title: 'Editorial Policy',
    lastUpdated: 'Last updated: June 2026',
    sections: [
      {
        heading: '1. Who we are',
        body: [
          'ChalkidikiHub is an independent travel directory for Halkidiki, Greece, built by locals to help travellers find reliable information and to connect accommodation owners directly with guests — with zero commissions.',
          'The site is operated by Minas Eleftheriadis and the ChalkidikiHub editorial team. Contact email: mnc@hotmail.gr',
        ],
      },
      {
        heading: '2. How content is created',
        body: [
          'All content on the site (blog articles, beach descriptions, village guides, accommodations, restaurants) is produced by the ChalkidikiHub editorial team: Greeks who have personally visited the places we describe, based on real experience and local knowledge.',
          'Writing and editing follows this process:',
          {
            type: 'list',
            items: [
              'Research: on-site visits, interviews with locals, references to official sources',
              'Drafting: initial copy written by the editorial team',
              'Human editorial review: every article is read, corrected and approved by a human before publication',
              'Continuous review: information is refreshed (prices, hours, seasonal changes) as needed',
            ],
          },
        ],
      },
      {
        heading: '3. Use of AI technology',
        body: [
          'In the spirit of transparency: we use AI tools (such as GPT-4 and Claude) as assistive tools at certain stages of production:',
          {
            type: 'list',
            items: [
              'Drafts: AI may help with initial copy for an article, based on structured data (geography, features, prices)',
              'Translations: the original Greek content is translated into 6 languages (English, German, Bulgarian, Serbian, Romanian, Russian) using AI translation tools',
              'Editing: AI may suggest style, grammar or structure improvements',
            ],
          },
          'IMPORTANT: Every piece of content published has been through human editorial review. We never publish AI-generated content without human editing and approval.',
          'Regarding our AI use, we follow Google\'s guidelines for AI content (Feb 2023): AI is used as a tool to help produce useful content, not as an autonomous engine generating content to manipulate algorithms.',
        ],
      },
      {
        heading: '4. Sources and verification',
        body: [
          'Sources we use to verify information:',
          {
            type: 'list',
            items: [
              'On-site visits and personal experience of the team',
              'Official historical records (Greek Ministry of Culture, Halkidiki municipalities, archaeological services)',
              'Greek National Tourism Organization (EOT) and official tourist authorities',
              'KTEL Halkidiki for transport information',
              'Official monastery websites (Mount Athos, women\'s monasteries)',
              'Open Meteo Marine API for live sea temperature data',
              'Local producers (PDO Halkidiki olives, PGI honey, etc.)',
            ],
          },
          'Where we cite specific numbers (distances, prices, altitudes, hours), we try to rely on verifiable sources. However, prices vary seasonally — we always recommend confirming with the final provider.',
        ],
      },
      {
        heading: '5. Updates and corrections',
        body: [
          'Each article shows publication and last-updated dates. We review content when:',
          {
            type: 'list',
            items: [
              'Seasonal data changes (hours, prices, season-specific info)',
              'A reader reports an error or outdated information to us',
              'A significant infrastructure change occurs (new road, service change)',
            ],
          },
          'If you find an error or outdated information, please email us at mnc@hotmail.gr. We commit to replying within 5 business days and correcting confirmed errors promptly.',
        ],
      },
      {
        heading: '6. Advertising, affiliates and zero commission',
        body: [
          'We disclose ChalkidikiHub\'s business model clearly:',
          {
            type: 'list',
            items: [
              'We charge zero commission on bookings: accommodation owners pay nothing per booking',
              'We do not participate in Booking/Airbnb/Expedia affiliate programs',
              'We may display advertising (Google AdSense) as an alternative revenue source — these are clearly marked as advertisements',
              'We do not accept paid placement or sponsored content in our beach/restaurant/accommodation listings: all entries are equal',
              'We do not change accommodation ranking based on payments',
            ],
          },
          'When we mention a specific accommodation, restaurant or service on our blog, this is purely based on the editorial team\'s assessment — we do not accept payment or perks for mentions.',
        ],
      },
      {
        heading: '7. Separation of advertising from editorial',
        body: [
          'We maintain a strict separation between advertising (Google AdSense banners) and our editorial content:',
          {
            type: 'list',
            items: [
              'Ads appear in designated page areas with clear labeling',
              'Advertisers do not influence article content',
              'Sponsored articles do not appear as regular blog content',
            ],
          },
        ],
      },
      {
        heading: '8. Multilingual content',
        body: [
          'The site is available in 7 languages: Greek (original), English, German, Bulgarian, Serbian, Romanian, Russian.',
          'Original content is written in Greek. Translations into other languages are generated using AI translation tools (GPT-4) from the Greek master copy. This allows us to serve travellers from across Southeast Europe without maintaining a full multilingual editorial team.',
          'If you spot a translation error, please contact us.',
        ],
      },
      {
        heading: '9. Contact',
        body: [
          'For questions, error reports, or content suggestions, contact us at mnc@hotmail.gr',
        ],
      },
    ],
  },
  de: {
    title: 'Redaktionsrichtlinien',
    lastUpdated: 'Letzte Aktualisierung: Juni 2026',
    sections: [
      {
        heading: '1. Wer wir sind',
        body: [
          'ChalkidikiHub ist ein unabhängiges Reise-Verzeichnis für Chalkidiki, Griechenland, aufgebaut von Einheimischen, um Reisenden zuverlässige Informationen zu bieten und Unterkunftsbesitzer direkt mit Gästen zu verbinden — ohne Provisionen.',
          'Die Seite wird von Minas Eleftheriadis und dem Redaktionsteam von ChalkidikiHub betrieben. Kontakt: mnc@hotmail.gr',
        ],
      },
      {
        heading: '2. Wie Inhalte erstellt werden',
        body: [
          'Alle Inhalte (Blog-Artikel, Strandbeschreibungen, Dorfführer, Unterkünfte, Restaurants) werden vom ChalkidikiHub-Redaktionsteam erstellt: Griechen, die die beschriebenen Orte persönlich besucht haben, basierend auf realer Erfahrung und lokalem Wissen.',
          'Der Schreib- und Redaktionsprozess umfasst:',
          {
            type: 'list',
            items: [
              'Recherche: Vor-Ort-Besuche, Interviews mit Einheimischen, Bezug auf offizielle Quellen',
              'Erstentwurf: Erstfassung durch das Redaktionsteam',
              'Menschliche redaktionelle Prüfung: Jeder Artikel wird vor der Veröffentlichung von einem Menschen gelesen, korrigiert und freigegeben',
              'Kontinuierliche Überprüfung: Informationen (Preise, Öffnungszeiten, saisonale Änderungen) werden bei Bedarf aktualisiert',
            ],
          },
        ],
      },
      {
        heading: '3. Einsatz von KI-Technologie',
        body: [
          'Im Sinne der Transparenz: Wir verwenden KI-Tools (wie GPT-4 und Claude) als Hilfsmittel in bestimmten Produktionsphasen:',
          {
            type: 'list',
            items: [
              'Entwürfe: KI kann bei der Erstfassung eines Artikels helfen, basierend auf strukturierten Daten (Geographie, Merkmale, Preise)',
              'Übersetzungen: Der ursprüngliche griechische Inhalt wird mit KI-Übersetzungstools in 6 Sprachen übersetzt (Englisch, Deutsch, Bulgarisch, Serbisch, Rumänisch, Russisch)',
              'Bearbeitung: KI kann Stil-, Grammatik- oder Struktur-Verbesserungen vorschlagen',
            ],
          },
          'WICHTIG: Jeder veröffentlichte Inhalt wurde von einer menschlichen Redaktion geprüft. Wir veröffentlichen niemals KI-generierte Inhalte ohne menschliche Bearbeitung und Freigabe.',
          'Bezüglich unserer KI-Nutzung folgen wir den Google-Richtlinien für KI-Inhalte (Feb. 2023): KI wird als Werkzeug eingesetzt, um nützliche Inhalte zu erstellen, nicht als autonome Maschine zur Manipulation von Algorithmen.',
        ],
      },
      {
        heading: '4. Quellen und Verifizierung',
        body: [
          'Quellen, die wir zur Informationsprüfung verwenden:',
          {
            type: 'list',
            items: [
              'Vor-Ort-Besuche und persönliche Erfahrung des Teams',
              'Offizielle Aufzeichnungen (Griechisches Kulturministerium, Gemeinden Chalkidiki, Archäologische Dienste)',
              'Griechische Tourismusorganisation (EOT)',
              'KTEL Chalkidiki für Verkehrsinformationen',
              'Offizielle Websites der Klöster (Berg Athos, Frauenklöster)',
              'Open Meteo Marine API für Live-Daten zur Wassertemperatur',
              'Lokale Produzenten (g.U. Chalkidiki-Oliven, g.g.A. Honig usw.)',
            ],
          },
          'Bei spezifischen Zahlen (Entfernungen, Preise, Höhen, Öffnungszeiten) versuchen wir, uns auf überprüfbare Quellen zu stützen. Allerdings ändern sich Preise saisonbedingt — wir empfehlen immer, beim Anbieter zu bestätigen.',
        ],
      },
      {
        heading: '5. Aktualisierungen und Korrekturen',
        body: [
          'Jeder Artikel zeigt das Veröffentlichungsdatum und das Datum der letzten Aktualisierung. Wir überarbeiten Inhalte, wenn:',
          {
            type: 'list',
            items: [
              'Saisonale Daten sich ändern (Öffnungszeiten, Preise)',
              'Ein Leser uns einen Fehler oder veraltete Informationen meldet',
              'Eine bedeutende Änderung in der Infrastruktur stattfindet',
            ],
          },
          'Wenn Sie einen Fehler oder veraltete Informationen finden, senden Sie uns bitte eine E-Mail an mnc@hotmail.gr. Wir verpflichten uns, innerhalb von 5 Werktagen zu antworten und bestätigte Fehler zeitnah zu korrigieren.',
        ],
      },
      {
        heading: '6. Werbung, Affiliates und Null-Provision',
        body: [
          'Wir legen das Geschäftsmodell von ChalkidikiHub klar offen:',
          {
            type: 'list',
            items: [
              'Wir berechnen null Provision auf Buchungen: Unterkunftsbesitzer zahlen pro Buchung nichts',
              'Wir nehmen nicht an Affiliate-Programmen von Booking/Airbnb/Expedia teil',
              'Wir können Werbung anzeigen (Google AdSense) als alternative Einnahmequelle — diese sind klar als Anzeigen gekennzeichnet',
              'Wir akzeptieren keine bezahlten Platzierungen oder gesponserten Inhalte in unseren Strand-/Restaurant-/Unterkunfts-Verzeichnissen',
              'Wir ändern Unterkunfts-Rankings nicht basierend auf Zahlungen',
            ],
          },
          'Wenn wir eine bestimmte Unterkunft, ein Restaurant oder einen Service in unserem Blog erwähnen, basiert dies rein auf der Bewertung des Redaktionsteams.',
        ],
      },
      {
        heading: '7. Trennung von Werbung und Redaktion',
        body: [
          'Wir halten eine strikte Trennung zwischen Werbung (Google AdSense-Banner) und unseren redaktionellen Inhalten ein:',
          {
            type: 'list',
            items: [
              'Anzeigen erscheinen in dafür vorgesehenen Seitenbereichen mit klarer Kennzeichnung',
              'Werbetreibende beeinflussen den Inhalt der Artikel nicht',
              'Gesponserte Artikel erscheinen nicht als reguläre Blog-Inhalte',
            ],
          },
        ],
      },
      {
        heading: '8. Mehrsprachige Inhalte',
        body: [
          'Die Seite ist in 7 Sprachen verfügbar: Griechisch (Original), Englisch, Deutsch, Bulgarisch, Serbisch, Rumänisch, Russisch.',
          'Der ursprüngliche Inhalt wird auf Griechisch verfasst. Übersetzungen in andere Sprachen werden mit KI-Übersetzungstools (GPT-4) aus dem griechischen Master-Text erstellt. Damit können wir Reisende aus ganz Südosteuropa bedienen, ohne ein vollständiges mehrsprachiges Redaktionsteam zu unterhalten.',
          'Wenn Sie einen Übersetzungsfehler bemerken, kontaktieren Sie uns bitte.',
        ],
      },
      {
        heading: '9. Kontakt',
        body: [
          'Für Fragen, Fehlermeldungen oder Inhaltsvorschläge kontaktieren Sie uns unter mnc@hotmail.gr',
        ],
      },
    ],
  },
  bg: {
    title: 'Редакционна политика',
    lastUpdated: 'Последна актуализация: Юни 2026',
    sections: [
      {
        heading: '1. Кои сме ние',
        body: [
          'ChalkidikiHub е независим туристически указател за Халкидики, Гърция, изграден от местни жители, за да помогне на пътниците да намерят надеждна информация и да свърже собственици на настаняване директно с гости — без комисиони.',
          'Сайтът се поддържа от Минас Елефтериадис и редакционния екип на ChalkidikiHub. Контакт: mnc@hotmail.gr',
        ],
      },
      {
        heading: '2. Как се създава съдържанието',
        body: [
          'Цялото съдържание на сайта (статии в блога, описания на плажове, водачи за села, настанявания, ресторанти) се произвежда от редакционния екип на ChalkidikiHub: гърци, които лично са посетили описаните места, въз основа на реален опит и местно познание.',
          'Писането и редактирането следва тази процедура:',
          {
            type: 'list',
            items: [
              'Изследване: посещения на място, интервюта с местни жители, позоваване на официални източници',
              'Чернова: първоначално написване от редакционния екип',
              'Човешки редакторски преглед: всяка статия се чете, коригира и одобрява от човек преди публикуване',
              'Непрекъсната преоценка: информацията се обновява (цени, часове, сезонни промени) при необходимост',
            ],
          },
        ],
      },
      {
        heading: '3. Използване на AI технология',
        body: [
          'В духа на прозрачността: използваме AI инструменти (като GPT-4 и Claude) като помощни инструменти в определени етапи на производството:',
          {
            type: 'list',
            items: [
              'Чернови: AI може да помогне с първоначалния текст, базиран на структурирани данни',
              'Преводи: оригиналното гръцко съдържание се превежда на 6 езика чрез AI инструменти',
              'Редактиране: AI може да предложи подобрения в стила, граматиката или структурата',
            ],
          },
          'ВАЖНО: Всяко съдържание, което публикуваме, преминава през човешки редакторски преглед. Никога не публикуваме AI-генерирано съдържание без човешка редакция и одобрение.',
        ],
      },
      {
        heading: '4. Източници и проверка',
        body: [
          'Източници, които използваме за проверка на информацията:',
          {
            type: 'list',
            items: [
              'Посещения на място и личен опит на екипа',
              'Официални исторически записи (гръцко Министерство на културата, общини в Халкидики)',
              'Гръцка национална туристическа организация (EOT)',
              'KTEL Халкидики за транспортна информация',
              'Официални сайтове на манастирите (Атон, женски манастири)',
              'Open Meteo Marine API за данни в реално време',
              'Местни производители (PDO маслини от Халкидики, PGI мед и др.)',
            ],
          },
          'Когато цитираме конкретни числа (разстояния, цени, часове), се стремим да разчитаме на проверими източници. Цените обаче варират сезонно — винаги препоръчваме потвърждение с крайния доставчик.',
        ],
      },
      {
        heading: '5. Актуализации и корекции',
        body: [
          'Всяка статия показва датите на публикуване и последна актуализация. Преразглеждаме съдържанието когато:',
          {
            type: 'list',
            items: [
              'Сезонните данни се променят',
              'Читател ни съобщи за грешка или остаряла информация',
              'Настъпи значителна промяна в инфраструктурата',
            ],
          },
          'Ако намерите грешка или остаряла информация, моля изпратете ни имейл на mnc@hotmail.gr. Ангажираме се да отговорим в рамките на 5 работни дни.',
        ],
      },
      {
        heading: '6. Реклама, партньорски програми и 0% комисиона',
        body: [
          'Декларираме ясно бизнес модела на ChalkidikiHub:',
          {
            type: 'list',
            items: [
              'Таксуваме 0% комисиона за резервации',
              'Не участваме в партньорски програми на Booking/Airbnb/Expedia',
              'Можем да показваме реклами (Google AdSense) — те са ясно обозначени',
              'Не приемаме платено настаняване или спонсорирано съдържание',
              'Не променяме класирането на настаняванията въз основа на плащания',
            ],
          },
        ],
      },
      {
        heading: '7. Разделение на реклама и редакция',
        body: [
          'Поддържаме строго разделение между реклама (Google AdSense банери) и редакционно съдържание:',
          {
            type: 'list',
            items: [
              'Рекламите се показват в определени области с ясно обозначение',
              'Рекламодателите не влияят на съдържанието на статиите',
              'Спонсорирани статии не се показват като обикновено блог съдържание',
            ],
          },
        ],
      },
      {
        heading: '8. Многоезично съдържание',
        body: [
          'Сайтът е достъпен на 7 езика: гръцки (оригинал), английски, немски, български, сръбски, румънски, руски.',
          'Оригиналното съдържание се пише на гръцки. Преводите на други езици се генерират с AI преводачески инструменти (GPT-4) от гръцкия мастер копия.',
          'Ако забележите грешка в превода, моля свържете се с нас.',
        ],
      },
      {
        heading: '9. Контакт',
        body: [
          'За въпроси, доклади за грешки или предложения за съдържание, свържете се с нас на mnc@hotmail.gr',
        ],
      },
    ],
  },
  ru: {
    title: 'Редакционная политика',
    lastUpdated: 'Последнее обновление: Июнь 2026',
    sections: [
      {
        heading: '1. Кто мы',
        body: [
          'ChalkidikiHub — независимый туристический справочник по Халкидики, Греция, созданный местными жителями, чтобы помочь путешественникам найти надёжную информацию и связать владельцев жилья напрямую с гостями — без комиссий.',
          'Сайтом управляют Минас Элефтериадис и редакционная команда ChalkidikiHub. Контакт: mnc@hotmail.gr',
        ],
      },
      {
        heading: '2. Как создаётся контент',
        body: [
          'Весь контент сайта (статьи блога, описания пляжей, путеводители по деревням, жильё, рестораны) производится редакционной командой ChalkidikiHub: греками, которые лично посетили описанные места.',
          'Процесс создания и редактирования:',
          {
            type: 'list',
            items: [
              'Исследование: выезды на место, интервью с местными, ссылки на официальные источники',
              'Черновик: первоначальный текст пишется редакционной командой',
              'Человеческая редакторская проверка: каждая статья прочитывается, редактируется и утверждается человеком до публикации',
              'Регулярное обновление: информация обновляется при необходимости',
            ],
          },
        ],
      },
      {
        heading: '3. Использование AI-технологий',
        body: [
          'В духе прозрачности: мы используем AI-инструменты (такие как GPT-4 и Claude) как вспомогательные средства на определённых этапах:',
          {
            type: 'list',
            items: [
              'Черновики: AI может помочь с первоначальным текстом на основе структурированных данных',
              'Переводы: оригинальный греческий контент переводится на 6 языков с помощью AI',
              'Редактирование: AI может предлагать улучшения стиля, грамматики или структуры',
            ],
          },
          'ВАЖНО: каждый публикуемый материал проходит через человеческую редакторскую проверку. Мы никогда не публикуем AI-сгенерированный контент без человеческого редактирования и одобрения.',
        ],
      },
      {
        heading: '4. Источники и проверка',
        body: [
          'Источники, которые мы используем для проверки информации:',
          {
            type: 'list',
            items: [
              'Выезды на место и личный опыт команды',
              'Официальные исторические архивы (Минкульт Греции, муниципалитеты Халкидиков)',
              'Греческая туристическая организация (EOT)',
              'KTEL Халкидиков для транспортной информации',
              'Официальные сайты монастырей',
              'Open Meteo Marine API для актуальных данных',
              'Местные производители (PDO оливки, PGI мёд и т.д.)',
            ],
          },
          'Цены меняются сезонно — всегда рекомендуем подтвердить у конечного поставщика.',
        ],
      },
      {
        heading: '5. Обновления и исправления',
        body: [
          'Каждая статья показывает даты публикации и последнего обновления. Мы пересматриваем контент когда:',
          {
            type: 'list',
            items: [
              'Меняются сезонные данные',
              'Читатель сообщает об ошибке или устаревшей информации',
              'Происходят значительные изменения инфраструктуры',
            ],
          },
          'Если вы заметили ошибку, напишите нам на mnc@hotmail.gr. Отвечаем в течение 5 рабочих дней.',
        ],
      },
      {
        heading: '6. Реклама, партнёрство и 0% комиссии',
        body: [
          'Мы открыто раскрываем бизнес-модель ChalkidikiHub:',
          {
            type: 'list',
            items: [
              'Мы взимаем 0% комиссии за бронирования',
              'Мы не участвуем в партнёрских программах Booking/Airbnb/Expedia',
              'Мы можем показывать рекламу (Google AdSense) — она чётко помечена',
              'Мы не принимаем платное размещение или спонсорский контент',
              'Мы не меняем рейтинг жилья на основе платежей',
            ],
          },
        ],
      },
      {
        heading: '7. Разделение рекламы и редакции',
        body: [
          'Мы поддерживаем строгое разделение между рекламой и редакционным контентом:',
          {
            type: 'list',
            items: [
              'Рекламы появляются в специальных областях с чёткой маркировкой',
              'Рекламодатели не влияют на содержание статей',
              'Спонсорские статьи не показываются как обычный блог-контент',
            ],
          },
        ],
      },
      {
        heading: '8. Многоязычный контент',
        body: [
          'Сайт доступен на 7 языках: греческий (оригинал), английский, немецкий, болгарский, сербский, румынский, русский.',
          'Оригинальный контент пишется на греческом. Переводы создаются с помощью AI-инструментов (GPT-4) из греческой мастер-копии.',
          'Если заметите ошибку перевода, свяжитесь с нами.',
        ],
      },
      {
        heading: '9. Контакт',
        body: [
          'По вопросам, сообщениям об ошибках или предложениям контента — mnc@hotmail.gr',
        ],
      },
    ],
  },
  ro: {
    title: 'Politica Editorială',
    lastUpdated: 'Ultima actualizare: Iunie 2026',
    sections: [
      {
        heading: '1. Cine suntem',
        body: [
          'ChalkidikiHub este un director turistic independent pentru Halkidiki, Grecia, construit de localnici pentru a ajuta călătorii să găsească informații fiabile și pentru a conecta proprietarii de cazări direct cu oaspeții — fără comisioane.',
          'Site-ul este operat de Minas Eleftheriadis și echipa editorială ChalkidikiHub. Contact: mnc@hotmail.gr',
        ],
      },
      {
        heading: '2. Cum se creează conținutul',
        body: [
          'Tot conținutul site-ului (articole de blog, descrieri de plaje, ghiduri de sate, cazări, restaurante) este produs de echipa editorială ChalkidikiHub: greci care au vizitat personal locurile descrise.',
          'Procesul de scriere și editare:',
          {
            type: 'list',
            items: [
              'Cercetare: vizite la fața locului, interviuri cu localnici, referințe la surse oficiale',
              'Schiță: textul inițial este scris de echipa editorială',
              'Revizuire editorială umană: fiecare articol este citit, corectat și aprobat de un om înainte de publicare',
              'Reevaluare continuă: informațiile se actualizează când este necesar',
            ],
          },
        ],
      },
      {
        heading: '3. Utilizarea tehnologiei AI',
        body: [
          'În spiritul transparenței: folosim instrumente AI (precum GPT-4 și Claude) ca instrumente de asistență în anumite etape:',
          {
            type: 'list',
            items: [
              'Schițe: AI poate ajuta la textul inițial, pe baza datelor structurate',
              'Traduceri: conținutul original grecesc este tradus în 6 limbi cu instrumente AI',
              'Editare: AI poate sugera îmbunătățiri de stil, gramatică sau structură',
            ],
          },
          'IMPORTANT: Orice conținut publicat a trecut prin revizuire editorială umană. Nu publicăm niciodată conținut generat de AI fără editare și aprobare umană.',
        ],
      },
      {
        heading: '4. Surse și verificare',
        body: [
          'Surse pe care le folosim pentru verificarea informațiilor:',
          {
            type: 'list',
            items: [
              'Vizite la fața locului și experiența personală a echipei',
              'Arhive oficiale (Ministerul Culturii din Grecia, municipalitățile Halkidiki)',
              'Organizația Națională de Turism a Greciei (EOT)',
              'KTEL Halkidiki pentru informații de transport',
              'Site-urile oficiale ale mănăstirilor',
              'Open Meteo Marine API pentru date în timp real',
              'Producători locali (DOP măsline Halkidiki, IGP miere etc.)',
            ],
          },
          'Prețurile variază sezonier — recomandăm întotdeauna confirmarea cu furnizorul final.',
        ],
      },
      {
        heading: '5. Actualizări și corecții',
        body: [
          'Fiecare articol arată data publicării și data ultimei actualizări. Revizuim conținutul când:',
          {
            type: 'list',
            items: [
              'Datele sezoniere se schimbă',
              'Un cititor ne raportează o eroare sau informație învechită',
              'Are loc o schimbare semnificativă a infrastructurii',
            ],
          },
          'Dacă găsiți o eroare sau informații învechite, scrieți-ne la mnc@hotmail.gr. Răspundem în 5 zile lucrătoare.',
        ],
      },
      {
        heading: '6. Publicitate, afiliați și 0% comision',
        body: [
          'Declarăm clar modelul de afaceri ChalkidikiHub:',
          {
            type: 'list',
            items: [
              'Percepem 0% comision pe rezervări',
              'Nu participăm în programe de afiliere Booking/Airbnb/Expedia',
              'Putem afișa publicitate (Google AdSense) — marcată clar',
              'Nu acceptăm plasare plătită sau conținut sponsorizat în listele noastre',
              'Nu modificăm clasamentul cazărilor pe baza plăților',
            ],
          },
        ],
      },
      {
        heading: '7. Separarea publicității de redacție',
        body: [
          'Menținem o separare strictă între publicitate (bannere Google AdSense) și conținutul editorial:',
          {
            type: 'list',
            items: [
              'Anunțurile apar în zone desemnate cu marcare clară',
              'Agenții de publicitate nu influențează conținutul articolelor',
              'Articolele sponsorizate nu apar ca conținut obișnuit de blog',
            ],
          },
        ],
      },
      {
        heading: '8. Conținut multilingvistic',
        body: [
          'Site-ul este disponibil în 7 limbi: greacă (original), engleză, germană, bulgară, sârbă, română, rusă.',
          'Conținutul original este scris în greacă. Traducerile sunt generate cu instrumente AI (GPT-4) din copia master grecească.',
          'Dacă observați o eroare de traducere, vă rugăm să ne contactați.',
        ],
      },
      {
        heading: '9. Contact',
        body: [
          'Pentru întrebări, rapoarte de erori sau sugestii de conținut — mnc@hotmail.gr',
        ],
      },
    ],
  },
  sr: {
    title: 'Uređivačka politika',
    lastUpdated: 'Poslednje ažuriranje: Jun 2026',
    sections: [
      {
        heading: '1. Ko smo mi',
        body: [
          'ChalkidikiHub je nezavisni turistički direktorijum za Halkidiki, Grčka, izgrađen od strane lokalaca da pomogne putnicima da pronađu pouzdane informacije i da poveže vlasnike smeštaja direktno sa gostima — bez provizija.',
          'Sajt vode Minas Eleftheriadis i uređivački tim ChalkidikiHub. Kontakt: mnc@hotmail.gr',
        ],
      },
      {
        heading: '2. Kako se kreira sadržaj',
        body: [
          'Sav sadržaj sajta (blog članci, opisi plaža, vodiči za sela, smeštaji, restorani) proizvodi uređivački tim ChalkidikiHub-a: Grci koji su lično posetili opisana mesta.',
          'Proces pisanja i uređivanja:',
          {
            type: 'list',
            items: [
              'Istraživanje: posete na licu mesta, intervjui sa lokalcima, reference na zvanične izvore',
              'Nacrt: početni tekst piše uređivački tim',
              'Ljudska uređivačka provera: svaki članak se čita, ispravlja i odobrava od strane čoveka pre objavljivanja',
              'Kontinuirana ponovna procena: informacije se ažuriraju po potrebi',
            ],
          },
        ],
      },
      {
        heading: '3. Korišćenje AI tehnologije',
        body: [
          'U duhu transparentnosti: koristimo AI alate (poput GPT-4 i Claude) kao pomoćne alate u određenim fazama:',
          {
            type: 'list',
            items: [
              'Nacrti: AI može pomoći sa početnim tekstom na osnovu strukturiranih podataka',
              'Prevodi: originalni grčki sadržaj se prevodi na 6 jezika pomoću AI alata',
              'Uređivanje: AI može predložiti poboljšanja stila, gramatike ili strukture',
            ],
          },
          'VAŽNO: Svaki objavljeni sadržaj je prošao kroz ljudsku uređivačku proveru. Nikada ne objavljujemo AI-generirani sadržaj bez ljudskog uređivanja i odobrenja.',
        ],
      },
      {
        heading: '4. Izvori i provera',
        body: [
          'Izvori koje koristimo za proveru informacija:',
          {
            type: 'list',
            items: [
              'Posete na licu mesta i lično iskustvo tima',
              'Zvanični istorijski zapisi (grčko Ministarstvo kulture, opštine Halkidikija)',
              'Grčka turistička organizacija (EOT)',
              'KTEL Halkidiki za informacije o prevozu',
              'Zvanični sajtovi manastira',
              'Open Meteo Marine API za podatke u realnom vremenu',
              'Lokalni proizvođači (ZOI masline Halkidikija, ZGO med itd.)',
            ],
          },
          'Cene variraju sezonski — uvek preporučujemo potvrdu sa krajnjim pružaocem usluga.',
        ],
      },
      {
        heading: '5. Ažuriranja i ispravke',
        body: [
          'Svaki članak prikazuje datume objavljivanja i poslednjeg ažuriranja. Pregledamo sadržaj kada:',
          {
            type: 'list',
            items: [
              'Sezonski podaci se menjaju',
              'Čitalac nam prijavi grešku ili zastarele informacije',
              'Dogodi se značajna promena infrastrukture',
            ],
          },
          'Ako pronađete grešku, pišite nam na mnc@hotmail.gr. Odgovaramo u roku od 5 radnih dana.',
        ],
      },
      {
        heading: '6. Reklame, partneri i 0% provizija',
        body: [
          'Jasno otkrivamo poslovni model ChalkidikiHub-a:',
          {
            type: 'list',
            items: [
              'Naplaćujemo 0% provizije za rezervacije',
              'Ne učestvujemo u partnerskim programima Booking/Airbnb/Expedia',
              'Možemo prikazivati reklame (Google AdSense) — jasno označene',
              'Ne prihvatamo plaćeno plasiranje ili sponzorisani sadržaj',
              'Ne menjamo rang smeštaja na osnovu plaćanja',
            ],
          },
        ],
      },
      {
        heading: '7. Razdvajanje reklama od uređivačkog sadržaja',
        body: [
          'Održavamo strogo razdvajanje između reklama (Google AdSense baneri) i našeg uređivačkog sadržaja:',
          {
            type: 'list',
            items: [
              'Reklame se prikazuju u označenim oblastima sa jasnim oznakama',
              'Reklamne agencije ne utiču na sadržaj članaka',
              'Sponzorisani članci se ne prikazuju kao redovni blog sadržaj',
            ],
          },
        ],
      },
      {
        heading: '8. Višejezični sadržaj',
        body: [
          'Sajt je dostupan na 7 jezika: grčki (original), engleski, nemački, bugarski, srpski, rumunski, ruski.',
          'Originalni sadržaj se piše na grčkom. Prevodi se generišu pomoću AI alata (GPT-4) iz grčke master kopije.',
          'Ako primetite grešku u prevodu, molimo da nas kontaktirate.',
        ],
      },
      {
        heading: '9. Kontakt',
        body: [
          'Za pitanja, prijave grešaka ili predloge sadržaja — mnc@hotmail.gr',
        ],
      },
    ],
  },
};

type Props = { params: Promise<{ locale: string }> };

const DESCRIPTIONS: Record<string, string> = {
  el: 'Πώς γράφεται το περιεχόμενο του ChalkidikiHub: συντακτική ομάδα, διαδικασία επιμέλειας, χρήση AI tools, πηγές, διορθώσεις και διαφάνεια.',
  en: 'How ChalkidikiHub content is created: editorial team, review process, transparent AI tool use, sources, corrections and advertising disclosure.',
  de: 'Wie ChalkidikiHub-Inhalte erstellt werden: Redaktionsteam, Prüfprozess, transparente KI-Nutzung, Quellen, Korrekturen und Werbeoffenlegung.',
  bg: 'Как се създава съдържанието на ChalkidikiHub: редакционен екип, процес на проверка, прозрачно използване на AI, източници, корекции.',
  ru: 'Как создаётся контент ChalkidikiHub: редакционная команда, процесс проверки, прозрачное использование AI, источники, исправления.',
  ro: 'Cum se creează conținutul ChalkidikiHub: echipa editorială, procesul de revizuire, utilizarea transparentă a AI, surse, corecții.',
  sr: 'Kako se kreira sadržaj ChalkidikiHub-a: uređivački tim, proces provere, transparentno korišćenje AI, izvori, ispravke.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const title = titles[locale] || titles.en;
  const desc = DESCRIPTIONS[locale] || DESCRIPTIONS.en;
  return {
    title,
    description: desc,
    openGraph: { title, description: desc, type: 'website', locale, siteName: 'Chalkidiki Hub' },
    twitter: { card: 'summary', title, description: desc },
    alternates: {
      canonical: localeUrl(locale, 'editorial-policy'),
      languages: {
        ...Object.fromEntries(LOCALES.map(l => [l, localeUrl(l, 'editorial-policy')])),
        'x-default': localeUrl('el', 'editorial-policy'),
      },
    },
  };
}

export default async function EditorialPolicyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const c = content[locale] || content.en;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{c.title}</h1>

      <div className="prose prose-gray max-w-none space-y-6 text-gray-600">
        <p className="text-sm text-gray-400">{c.lastUpdated}</p>

        {c.sections.map((section, i) => (
          <div key={i}>
            <h2 className="text-xl font-semibold text-gray-900">{section.heading}</h2>
            {section.body.map((item, j) =>
              typeof item === 'string' ? (
                item.includes('mnc@hotmail.gr') ? (
                  <p key={j}>
                    {item.replace('mnc@hotmail.gr', '')}{' '}
                    <a href="mailto:mnc@hotmail.gr" className="text-primary-600 hover:underline">
                      mnc@hotmail.gr
                    </a>
                  </p>
                ) : (
                  <p key={j}>{item}</p>
                )
              ) : (
                <ul key={j} className="list-disc pl-6 space-y-1">
                  {item.items.map((li, k) => (
                    <li key={k}>{li}</li>
                  ))}
                </ul>
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
