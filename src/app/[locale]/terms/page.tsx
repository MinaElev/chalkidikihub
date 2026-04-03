import { setRequestLocale } from 'next-intl/server';

type Section = {
  heading: string;
  body: (string | { type: 'list'; items: string[] })[];
};

type TermsContent = {
  title: string;
  lastUpdated: string;
  sections: Section[];
};

const content: Record<string, TermsContent> = {
  el: {
    title: 'Όροι Χρήσης',
    lastUpdated: 'Τελευταία ενημέρωση: Απρίλιος 2026',
    sections: [
      {
        heading: '1. Γενικά',
        body: [
          'Η ιστοσελίδα chalkidikihub.gr (εφεξής "ChalkidikiHub") δημιουργήθηκε και συντηρείται από τον Μηνά Ελευθεριάδη ως μη κερδοσκοπική πρωτοβουλία για την προβολή και προώθηση του τουρισμού στη Χαλκιδική.',
          'Η ιστοσελίδα δεν αποτελεί τουριστικό γραφείο, μεσιτικό γραφείο ή πλατφόρμα κρατήσεων. Λειτουργεί αποκλειστικά ως καταλόγος πληροφοριών για καταλύματα, παραλίες, εστιατόρια, αξιοθέατα και δραστηριότητες στη Χαλκιδική.',
        ],
      },
      {
        heading: '2. Μη κερδοσκοπικός χαρακτήρας',
        body: [
          'Το ChalkidikiHub είναι μη κερδοσκοπικού χαρακτήρα. Δεν χρεώνει τους ιδιοκτήτες καταλυμάτων για την καταχώρησή τους, ούτε τους επισκέπτες για τη χρήση της πλατφόρμας. Ενδέχεται μελλοντικά να εισαχθούν διαφημίσεις ή προαιρετικές υπηρεσίες για τη συντήρηση του site.',
        ],
      },
      {
        heading: '3. Περιεχόμενο & Καταχωρήσεις',
        body: [
          'Οι ιδιοκτήτες καταλυμάτων είναι αποκλειστικά υπεύθυνοι για την ακρίβεια των πληροφοριών που καταχωρούν (περιγραφές, φωτογραφίες, τιμές, στοιχεία επικοινωνίας). Το ChalkidikiHub δεν ελέγχει και δεν εγγυάται την ακρίβεια των καταχωρήσεων.',
          'Οι τιμές που εμφανίζονται είναι ενδεικτικές ("από...") και ενδέχεται να διαφέρουν ανάλογα με την εποχή, τη διαθεσιμότητα και τους όρους κράτησης.',
        ],
      },
      {
        heading: '4. Κρατήσεις & Συναλλαγές',
        body: [
          'Το ChalkidikiHub δεν διεκπεραιώνει κρατήσεις ή πληρωμές. Οι κρατήσεις γίνονται απευθείας μεταξύ του επισκέπτη και του ιδιοκτήτη, ή μέσω τρίτων πλατφορμών (Booking.com, Airbnb κλπ). Δεν φέρουμε καμία ευθύνη για τις συναλλαγές αυτές.',
        ],
      },
      {
        heading: '5. Αποποίηση ευθύνης',
        body: [
          'Το ChalkidikiHub δεν φέρει ευθύνη για:',
          {
            type: 'list',
            items: [
              'Την ακρίβεια, πληρότητα ή επικαιρότητα των πληροφοριών',
              'Την ποιότητα των καταλυμάτων, εστιατορίων ή υπηρεσιών',
              'Οποιαδήποτε ζημία προκύψει από τη χρήση της ιστοσελίδας',
              'Τη διαθεσιμότητα ή τις τιμές των καταλυμάτων',
              'Τις συναλλαγές μεταξύ χρηστών και ιδιοκτητών',
            ],
          },
        ],
      },
      {
        heading: '6. Λογαριασμοί χρηστών',
        body: [
          'Οι ιδιοκτήτες που δημιουργούν λογαριασμό είναι υπεύθυνοι για τη διατήρηση της ασφάλειας του λογαριασμού τους. Διατηρούμε το δικαίωμα να αφαιρέσουμε καταχωρήσεις ή λογαριασμούς που παραβιάζουν τους όρους χρήσης ή περιέχουν ψευδείς πληροφορίες.',
        ],
      },
      {
        heading: '7. Πνευματική ιδιοκτησία',
        body: [
          'Το περιεχόμενο της ιστοσελίδας (κείμενα, σχεδιασμός, λογότυπο) αποτελεί πνευματική ιδιοκτησία του Μηνά Ελευθεριάδη. Οι φωτογραφίες των καταλυμάτων ανήκουν στους αντίστοιχους ιδιοκτήτες.',
        ],
      },
      {
        heading: '8. Τροποποιήσεις',
        body: [
          'Διατηρούμε το δικαίωμα να τροποποιήσουμε τους παρόντες όρους ανά πάσα στιγμή. Η συνέχιση χρήσης της ιστοσελίδας μετά από τροποποίηση συνεπάγεται αποδοχή των νέων όρων.',
        ],
      },
      {
        heading: '9. Επικοινωνία',
        body: [
          'Για οποιαδήποτε ερώτηση σχετικά με τους όρους χρήσης, επικοινωνήστε μαζί μας στο: mnc@hotmail.gr',
        ],
      },
    ],
  },
  en: {
    title: 'Terms of Use',
    lastUpdated: 'Last updated: April 2026',
    sections: [
      {
        heading: '1. General',
        body: [
          'The website chalkidikihub.gr (hereinafter "ChalkidikiHub") was created and is maintained by Minas Eleftheriadis as a non-profit initiative for the promotion of tourism in Halkidiki, Greece.',
          'The website is not a travel agency, real estate agency or booking platform. It operates exclusively as an information directory for accommodations, beaches, restaurants, attractions and activities in Halkidiki.',
        ],
      },
      {
        heading: '2. Non-profit nature',
        body: [
          'ChalkidikiHub is non-profit. It does not charge property owners for listings or visitors for using the platform. Advertisements or optional services may be introduced in the future to maintain the site.',
        ],
      },
      {
        heading: '3. Content & Listings',
        body: [
          'Property owners are solely responsible for the accuracy of the information they submit (descriptions, photos, prices, contact details). ChalkidikiHub does not verify or guarantee the accuracy of listings.',
          'Prices shown are indicative ("from...") and may vary depending on the season, availability and booking terms.',
        ],
      },
      {
        heading: '4. Bookings & Transactions',
        body: [
          'ChalkidikiHub does not process bookings or payments. Bookings are made directly between the visitor and the owner, or through third-party platforms (Booking.com, Airbnb etc). We bear no responsibility for these transactions.',
        ],
      },
      {
        heading: '5. Disclaimer',
        body: [
          'ChalkidikiHub is not responsible for:',
          {
            type: 'list',
            items: [
              'The accuracy, completeness or timeliness of the information',
              'The quality of accommodations, restaurants or services',
              'Any damage resulting from use of the website',
              'Availability or prices of accommodations',
              'Transactions between users and property owners',
            ],
          },
        ],
      },
      {
        heading: '6. User accounts',
        body: [
          'Owners who create accounts are responsible for maintaining the security of their accounts. We reserve the right to remove listings or accounts that violate the terms of use or contain false information.',
        ],
      },
      {
        heading: '7. Intellectual property',
        body: [
          'The website content (texts, design, logo) is the intellectual property of Minas Eleftheriadis. Accommodation photos belong to their respective owners.',
        ],
      },
      {
        heading: '8. Modifications',
        body: [
          'We reserve the right to modify these terms at any time. Continued use of the website after modification implies acceptance of the new terms.',
        ],
      },
      {
        heading: '9. Contact',
        body: [
          'For any questions about the terms of use, contact us at: mnc@hotmail.gr',
        ],
      },
    ],
  },
  de: {
    title: 'Nutzungsbedingungen',
    lastUpdated: 'Letzte Aktualisierung: April 2026',
    sections: [
      {
        heading: '1. Allgemein',
        body: [
          'Die Website chalkidikihub.gr (im Folgenden "ChalkidikiHub") wurde von Minas Eleftheriadis als gemeinnützige Initiative zur Förderung des Tourismus in Chalkidiki, Griechenland, erstellt und wird von ihm betrieben.',
          'Die Website ist kein Reisebüro, keine Immobilienagentur und keine Buchungsplattform. Sie dient ausschließlich als Informationsverzeichnis für Unterkünfte, Strände, Restaurants, Sehenswürdigkeiten und Aktivitäten in Chalkidiki.',
        ],
      },
      {
        heading: '2. Gemeinnütziger Charakter',
        body: [
          'ChalkidikiHub ist gemeinnützig. Es werden keine Gebühren für Eigentümer oder Besucher erhoben. Zukünftig können Werbeanzeigen oder optionale Dienste zur Finanzierung der Website eingeführt werden.',
        ],
      },
      {
        heading: '3. Inhalte & Einträge',
        body: [
          'Eigentümer sind allein für die Richtigkeit ihrer Angaben verantwortlich (Beschreibungen, Fotos, Preise, Kontaktdaten). ChalkidikiHub überprüft oder garantiert die Richtigkeit der Einträge nicht.',
          'Die angezeigten Preise sind Richtwerte ("ab...") und können je nach Saison, Verfügbarkeit und Buchungsbedingungen variieren.',
        ],
      },
      {
        heading: '4. Buchungen & Transaktionen',
        body: [
          'ChalkidikiHub wickelt keine Buchungen oder Zahlungen ab. Buchungen erfolgen direkt zwischen dem Besucher und dem Eigentümer oder über Drittplattformen (Booking.com, Airbnb usw.). Wir übernehmen keine Verantwortung für diese Transaktionen.',
        ],
      },
      {
        heading: '5. Haftungsausschluss',
        body: [
          'ChalkidikiHub haftet nicht für:',
          {
            type: 'list',
            items: [
              'Die Genauigkeit, Vollständigkeit oder Aktualität der Informationen',
              'Die Qualität der Unterkünfte, Restaurants oder Dienstleistungen',
              'Schäden, die aus der Nutzung der Website entstehen',
              'Die Verfügbarkeit oder Preise der Unterkünfte',
              'Transaktionen zwischen Nutzern und Eigentümern',
            ],
          },
        ],
      },
      {
        heading: '6. Benutzerkonten',
        body: [
          'Eigentümer, die ein Konto erstellen, sind für die Sicherheit ihres Kontos verantwortlich. Wir behalten uns das Recht vor, Einträge oder Konten zu entfernen, die gegen die Nutzungsbedingungen verstoßen oder falsche Informationen enthalten.',
        ],
      },
      {
        heading: '7. Geistiges Eigentum',
        body: [
          'Die Inhalte der Website (Texte, Design, Logo) sind geistiges Eigentum von Minas Eleftheriadis. Fotos der Unterkünfte gehören den jeweiligen Eigentümern.',
        ],
      },
      {
        heading: '8. Änderungen',
        body: [
          'Wir behalten uns das Recht vor, diese Bedingungen jederzeit zu ändern. Die fortgesetzte Nutzung der Website nach einer Änderung gilt als Annahme der neuen Bedingungen.',
        ],
      },
      {
        heading: '9. Kontakt',
        body: [
          'Bei Fragen zu den Nutzungsbedingungen kontaktieren Sie uns unter: mnc@hotmail.gr',
        ],
      },
    ],
  },
  bg: {
    title: 'Условия за ползване',
    lastUpdated: 'Последна актуализация: Април 2026',
    sections: [
      {
        heading: '1. Общи положения',
        body: [
          'Уебсайтът chalkidikihub.gr (наричан по-долу "ChalkidikiHub") е създаден и се поддържа от Минас Елефтериадис като нестопанска инициатива за популяризиране на туризма в Халкидики, Гърция.',
          'Уебсайтът не е туристическа агенция, агенция за недвижими имоти или платформа за резервации. Той функционира изключително като информационен каталог за настаняване, плажове, ресторанти, забележителности и дейности в Халкидики.',
        ],
      },
      {
        heading: '2. Нестопански характер',
        body: [
          'ChalkidikiHub е с нестопанска цел. Не се начисляват такси за собственици или посетители. В бъдеще могат да бъдат въведени реклами или допълнителни услуги за поддръжка на сайта.',
        ],
      },
      {
        heading: '3. Съдържание и обяви',
        body: [
          'Собствениците на имоти носят цялата отговорност за точността на предоставената от тях информация (описания, снимки, цени, данни за контакт). ChalkidikiHub не проверява и не гарантира точността на обявите.',
          'Показаните цени са ориентировъчни ("от...") и могат да варират в зависимост от сезона, наличността и условията за резервация.',
        ],
      },
      {
        heading: '4. Резервации и транзакции',
        body: [
          'ChalkidikiHub не обработва резервации или плащания. Резервациите се правят директно между посетителя и собственика или чрез платформи на трети страни (Booking.com, Airbnb и др.). Не носим отговорност за тези транзакции.',
        ],
      },
      {
        heading: '5. Отказ от отговорност',
        body: [
          'ChalkidikiHub не носи отговорност за:',
          {
            type: 'list',
            items: [
              'Точността, пълнотата или актуалността на информацията',
              'Качеството на настаняването, ресторантите или услугите',
              'Каквито и да е щети, произтичащи от използването на уебсайта',
              'Наличността или цените на настаняването',
              'Транзакциите между потребители и собственици',
            ],
          },
        ],
      },
      {
        heading: '6. Потребителски акаунти',
        body: [
          'Собствениците, които създават акаунт, са отговорни за поддържане на сигурността на своя акаунт. Запазваме си правото да премахваме обяви или акаунти, които нарушават условията за ползване или съдържат невярна информация.',
        ],
      },
      {
        heading: '7. Интелектуална собственост',
        body: [
          'Съдържанието на уебсайта (текстове, дизайн, лого) е интелектуална собственост на Минас Елефтериадис. Снимките на обектите за настаняване принадлежат на съответните собственици.',
        ],
      },
      {
        heading: '8. Промени',
        body: [
          'Запазваме си правото да променяме тези условия по всяко време. Продължаването на използването на уебсайта след промяна означава приемане на новите условия.',
        ],
      },
      {
        heading: '9. Контакт',
        body: [
          'За всякакви въпроси относно условията за ползване се свържете с нас на: mnc@hotmail.gr',
        ],
      },
    ],
  },
  ru: {
    title: 'Условия использования',
    lastUpdated: 'Последнее обновление: Апрель 2026',
    sections: [
      {
        heading: '1. Общие положения',
        body: [
          'Веб-сайт chalkidikihub.gr (далее "ChalkidikiHub") создан и поддерживается Минасом Элефтериадисом как некоммерческая инициатива по продвижению туризма в Халкидики, Греция.',
          'Веб-сайт не является туристическим агентством, агентством недвижимости или платформой бронирования. Он функционирует исключительно как информационный каталог размещения, пляжей, ресторанов, достопримечательностей и развлечений в Халкидики.',
        ],
      },
      {
        heading: '2. Некоммерческий характер',
        body: [
          'ChalkidikiHub является некоммерческим проектом. Плата с владельцев объектов или посетителей не взимается. В будущем могут быть введены рекламные объявления или дополнительные услуги для поддержания сайта.',
        ],
      },
      {
        heading: '3. Контент и объявления',
        body: [
          'Владельцы объектов несут полную ответственность за точность предоставленной информации (описания, фотографии, цены, контактные данные). ChalkidikiHub не проверяет и не гарантирует точность объявлений.',
          'Указанные цены являются ориентировочными ("от...") и могут варьироваться в зависимости от сезона, доступности и условий бронирования.',
        ],
      },
      {
        heading: '4. Бронирования и транзакции',
        body: [
          'ChalkidikiHub не обрабатывает бронирования или платежи. Бронирования осуществляются напрямую между посетителем и владельцем или через сторонние платформы (Booking.com, Airbnb и др.). Мы не несём ответственности за эти транзакции.',
        ],
      },
      {
        heading: '5. Отказ от ответственности',
        body: [
          'ChalkidikiHub не несёт ответственности за:',
          {
            type: 'list',
            items: [
              'Точность, полноту или актуальность информации',
              'Качество размещения, ресторанов или услуг',
              'Любой ущерб, возникший в результате использования сайта',
              'Доступность или цены на размещение',
              'Транзакции между пользователями и владельцами',
            ],
          },
        ],
      },
      {
        heading: '6. Учётные записи пользователей',
        body: [
          'Владельцы, создающие учётную запись, несут ответственность за безопасность своего аккаунта. Мы оставляем за собой право удалять объявления или аккаунты, нарушающие условия использования или содержащие ложную информацию.',
        ],
      },
      {
        heading: '7. Интеллектуальная собственность',
        body: [
          'Содержимое сайта (тексты, дизайн, логотип) является интеллектуальной собственностью Минаса Элефтериадиса. Фотографии объектов размещения принадлежат их соответствующим владельцам.',
        ],
      },
      {
        heading: '8. Изменения',
        body: [
          'Мы оставляем за собой право изменять эти условия в любое время. Продолжение использования сайта после изменения означает принятие новых условий.',
        ],
      },
      {
        heading: '9. Контакт',
        body: [
          'По любым вопросам об условиях использования свяжитесь с нами по адресу: mnc@hotmail.gr',
        ],
      },
    ],
  },
  ro: {
    title: 'Termeni de utilizare',
    lastUpdated: 'Ultima actualizare: Aprilie 2026',
    sections: [
      {
        heading: '1. General',
        body: [
          'Site-ul web chalkidikihub.gr (denumit in continuare "ChalkidikiHub") a fost creat si este intretinut de Minas Eleftheriadis ca o initiativa non-profit pentru promovarea turismului in Halkidiki, Grecia.',
          'Site-ul nu este o agentie de turism, agentie imobiliara sau platforma de rezervari. Functioneaza exclusiv ca un director de informatii pentru cazare, plaje, restaurante, atractii si activitati in Halkidiki.',
        ],
      },
      {
        heading: '2. Caracter non-profit',
        body: [
          'ChalkidikiHub este non-profit. Nu se percep taxe pentru proprietari sau vizitatori. In viitor, pot fi introduse reclame sau servicii optionale pentru intretinerea site-ului.',
        ],
      },
      {
        heading: '3. Continut si anunturi',
        body: [
          'Proprietarii sunt singurii responsabili pentru exactitatea informatiilor furnizate (descrieri, fotografii, preturi, date de contact). ChalkidikiHub nu verifica si nu garanteaza exactitatea anunturilor.',
          'Preturile afisate sunt orientative ("de la...") si pot varia in functie de sezon, disponibilitate si conditiile de rezervare.',
        ],
      },
      {
        heading: '4. Rezervari si tranzactii',
        body: [
          'ChalkidikiHub nu proceseaza rezervari sau plati. Rezervarile se fac direct intre vizitator si proprietar sau prin platforme terte (Booking.com, Airbnb etc.). Nu ne asumam responsabilitatea pentru aceste tranzactii.',
        ],
      },
      {
        heading: '5. Declinarea responsabilitatii',
        body: [
          'ChalkidikiHub nu este responsabil pentru:',
          {
            type: 'list',
            items: [
              'Exactitatea, completitudinea sau actualitatea informatiilor',
              'Calitatea cazarii, restaurantelor sau serviciilor',
              'Orice daune rezultate din utilizarea site-ului',
              'Disponibilitatea sau preturile cazarii',
              'Tranzactiile intre utilizatori si proprietari',
            ],
          },
        ],
      },
      {
        heading: '6. Conturi de utilizator',
        body: [
          'Proprietarii care isi creeaza un cont sunt responsabili pentru mentinerea securitatii contului lor. Ne rezervam dreptul de a elimina anunturile sau conturile care incalca termenii de utilizare sau contin informatii false.',
        ],
      },
      {
        heading: '7. Proprietate intelectuala',
        body: [
          'Continutul site-ului (texte, design, logo) este proprietatea intelectuala a lui Minas Eleftheriadis. Fotografiile proprietatilor apartin proprietarilor respectivi.',
        ],
      },
      {
        heading: '8. Modificari',
        body: [
          'Ne rezervam dreptul de a modifica acesti termeni in orice moment. Continuarea utilizarii site-ului dupa modificare implica acceptarea noilor termeni.',
        ],
      },
      {
        heading: '9. Contact',
        body: [
          'Pentru orice intrebari referitoare la termenii de utilizare, contactati-ne la: mnc@hotmail.gr',
        ],
      },
    ],
  },
};

type Props = { params: Promise<{ locale: string }> };

export default async function TermsPage({ params }: Props) {
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
