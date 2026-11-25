import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { localeUrl } from '@/lib/seo/compat';
import { hreflangMap } from '@/lib/seo/site';

// hreflang alternates ship only the publicly promoted locales — hidden
// locales remain routable but excluded from search-engine signals.

const titles: Record<string, string> = {
  el: 'Πολιτική Απορρήτου',
  en: 'Privacy Policy',
  de: 'Datenschutz',
  bg: 'Политика за поверителност',
  ru: 'Политика конфиденциальности',
  ro: 'Politica de confidențialitate',
  sr: 'Politika privatnosti',
};

type Section = {
  heading: string;
  body: (string | { type: 'list'; items: string[] })[];
};

type PrivacyContent = {
  title: string;
  lastUpdated: string;
  sections: Section[];
};

const content: Record<string, PrivacyContent> = {
  sr: {"title":"Politika Privatnosti","lastUpdated":"Poslednje ažuriranje: Novembar 2026","sections":[{"heading":"1. Ko smo mi","body":["Vebsajt chalkidikihub.gr funkcioniše pod upravom Mina Elefteriadisa. Kontakt email: mnc@hotmail.gr"]},{"heading":"2. Koje podatke prikupljamo","body":["Prikupljamo samo podatke koje nam vi pružate:",{"type":"list","items":["Vlasnici: Ime, email, telefon, podaci o smeštaju","Posetioci: Ne prikupljamo lične podatke"]}]},{"heading":"3. Kako koristimo podatke","body":[{"type":"list","items":["Za funkcionisanje vašeg naloga","Za prikaz vaših oglasa","Za poboljšanje vebsajta"]},"Ne prodajemo, ne delimo i ne prenosimo vaše podatke trećim stranama."]},{"heading":"4. Skladištenje podataka","body":["Podaci se bezbedno skladište na Supabase (EU serveri). Lozinke su šifrovane i nisu dostupne nikome."]},{"heading":"5. Kolačići","body":["Koristimo dve kategorije kolačića:",{"type":"list","items":["Neophodni — prijava, jezičke postavke. Uvek aktivni.","Statistički (Google Analytics) — njegovi kolačići se aktiviraju samo uz vašu izričitu saglasnost. Ako odbijete, Google prima samo anonimne signale bez kolačića, koji vas ne identifikuju."]},"Pored toga, posete brojimo anonimno sopstvenim alatom, bez kolačića: koliko puta je svaka stranica otvorena, odakle je poseta došla (npr. Google), vrstu uređaja i klikove za kontakt (npr. poziv). Ne čuvamo IP adresu niti bilo šta što vas identifikuje — samo dnevne zbirove. Zato ovo brojanje obuhvata sve posetioce.","Možete promeniti svoje opcije u bilo kom trenutku putem cookie banera na dnu svake stranice."]},{"heading":"6. Vaša prava","body":["Imate pravo na:",{"type":"list","items":["Pristup vašim podacima","Ispravku netačnih podataka","Brisanje vašeg naloga","Izvoz vaših podataka"]},"Za bilo koji zahtev, kontaktirajte mnc@hotmail.gr"]},{"heading":"7. Izmene","body":["Možemo ažurirati ovu politiku. Datum na vrhu ove stranice će biti ažuriran."]}]},
  el: {
    title: 'Πολιτική Απορρήτου',
    lastUpdated: 'Τελευταία ενημέρωση: Νοέμβριος 2026',
    sections: [
      {
        heading: '1. Ποιοι είμαστε',
        body: [
          'Η ιστοσελίδα chalkidikihub.gr λειτουργεί από τον Μηνά Ελευθεριάδη. Email επικοινωνίας: mnc@hotmail.gr',
        ],
      },
      {
        heading: '2. Ποια δεδομένα συλλέγουμε',
        body: [
          'Συλλέγουμε μόνο τα δεδομένα που μας παρέχετε εσείς:',
          {
            type: 'list',
            items: [
              'Ιδιοκτήτες: Όνομα, email, τηλέφωνο, στοιχεία καταλύματος',
              'Επισκέπτες: Δεν συλλέγουμε προσωπικά δεδομένα',
            ],
          },
        ],
      },
      {
        heading: '3. Πώς χρησιμοποιούμε τα δεδομένα',
        body: [
          {
            type: 'list',
            items: [
              'Για τη λειτουργία του λογαριασμού σας',
              'Για την εμφάνιση των καταχωρήσεών σας',
              'Για τη βελτίωση της ιστοσελίδας',
            ],
          },
          'Δεν πουλάμε, δεν μοιραζόμαστε και δεν διαβιβάζουμε τα δεδομένα σας σε τρίτους.',
        ],
      },
      {
        heading: '4. Αποθήκευση δεδομένων',
        body: [
          'Τα δεδομένα αποθηκεύονται ασφαλώς στο Supabase (EU servers). Τα passwords κρυπτογραφούνται και δεν είναι προσβάσιμα σε κανέναν.',
        ],
      },
      {
        heading: '5. Cookies',
        body: [
          'Χρησιμοποιούμε δύο κατηγορίες cookies:',
          {
            type: 'list',
            items: [
              'Απαραίτητα — σύνδεση, προτίμηση γλώσσας. Πάντα ενεργά.',
              'Στατιστικά (Google Analytics) — τα cookies του ενεργοποιούνται μόνο μετά τη ρητή σου συναίνεση. Αν αρνηθείς, η Google λαμβάνει μόνο ανώνυμα σήματα χωρίς cookies, που δεν σε αναγνωρίζουν.',
            ],
          },
          'Επιπλέον, μετράμε ανώνυμα την επισκεψιμότητα με δικό μας εργαλείο, χωρίς cookies: πόσες φορές προβάλλεται κάθε σελίδα, από πού ήρθε η επίσκεψη (π.χ. Google), τον τύπο συσκευής και τα κλικ επικοινωνίας (π.χ. κλήση). Δεν αποθηκεύουμε διεύθυνση IP ή οποιοδήποτε στοιχείο σε αναγνωρίζει· κρατάμε μόνο ημερήσια σύνολα. Γι’ αυτό η μέτρηση αυτή αφορά όλους τους επισκέπτες.',
          'Μπορείς να αλλάξεις τις επιλογές σου ανά πάσα στιγμή μέσω του cookie banner στο κάτω μέρος κάθε σελίδας.',
        ],
      },
      {
        heading: '6. Τα δικαιώματά σας',
        body: [
          'Έχετε δικαίωμα:',
          {
            type: 'list',
            items: [
              'Πρόσβασης στα δεδομένα σας',
              'Διόρθωσης εσφαλμένων δεδομένων',
              'Διαγραφής του λογαριασμού σας',
              'Εξαγωγής των δεδομένων σας',
            ],
          },
          'Για οποιοδήποτε αίτημα, επικοινωνήστε στο mnc@hotmail.gr',
        ],
      },
      {
        heading: '7. Τροποποιήσεις',
        body: [
          'Ενδέχεται να ενημερώσουμε την παρούσα πολιτική. Θα ενημερωθεί η ημερομηνία στην κορυφή αυτής της σελίδας.',
        ],
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    lastUpdated: 'Last updated: November 2026',
    sections: [
      {
        heading: '1. Who we are',
        body: [
          'The website chalkidikihub.gr is operated by Minas Eleftheriadis. Contact email: mnc@hotmail.gr',
        ],
      },
      {
        heading: '2. What data we collect',
        body: [
          'We only collect data that you provide:',
          {
            type: 'list',
            items: [
              'Property owners: Name, email, phone, property details',
              'Visitors: We do not collect personal data',
            ],
          },
        ],
      },
      {
        heading: '3. How we use data',
        body: [
          {
            type: 'list',
            items: [
              'To operate your account',
              'To display your listings',
              'To improve the website',
            ],
          },
          'We do not sell, share or transfer your data to third parties.',
        ],
      },
      {
        heading: '4. Data storage',
        body: [
          'Data is stored securely on Supabase (EU servers). Passwords are encrypted and not accessible to anyone.',
        ],
      },
      {
        heading: '5. Cookies',
        body: [
          'We use two categories of cookies:',
          {
            type: 'list',
            items: [
              'Essential — login session and language preference. Always on.',
              'Analytics (Google Analytics) — its cookies are enabled only after your explicit consent. If you decline, Google receives only anonymous, cookieless signals that do not identify you.',
            ],
          },
          'We also count traffic anonymously with our own tool, without cookies: how often each page is viewed, where the visit came from (e.g. Google), the type of device and contact clicks (e.g. a call). We store no IP address or anything else that identifies you — only daily totals — so this count covers every visitor.',
          'You can change your choice at any time via the cookie banner at the bottom of every page.',
        ],
      },
      {
        heading: '6. Your rights',
        body: [
          'You have the right to:',
          {
            type: 'list',
            items: [
              'Access your data',
              'Correct inaccurate data',
              'Delete your account',
              'Export your data',
            ],
          },
          'For any request, contact mnc@hotmail.gr',
        ],
      },
      {
        heading: '7. Changes',
        body: [
          'We may update this policy. The date at the top of this page will be updated accordingly.',
        ],
      },
    ],
  },
  de: {
    title: 'Datenschutzrichtlinie',
    lastUpdated: 'Letzte Aktualisierung: November 2026',
    sections: [
      {
        heading: '1. Wer wir sind',
        body: [
          'Die Website chalkidikihub.gr wird von Minas Eleftheriadis betrieben. Kontakt-E-Mail: mnc@hotmail.gr',
        ],
      },
      {
        heading: '2. Welche Daten wir erheben',
        body: [
          'Wir erheben nur die Daten, die Sie uns zur Verfügung stellen:',
          {
            type: 'list',
            items: [
              'Eigentümer: Name, E-Mail, Telefon, Objektdetails',
              'Besucher: Wir erheben keine personenbezogenen Daten',
            ],
          },
        ],
      },
      {
        heading: '3. Wie wir Daten verwenden',
        body: [
          {
            type: 'list',
            items: [
              'Für den Betrieb Ihres Kontos',
              'Zur Anzeige Ihrer Einträge',
              'Zur Verbesserung der Website',
            ],
          },
          'Wir verkaufen, teilen oder übertragen Ihre Daten nicht an Dritte.',
        ],
      },
      {
        heading: '4. Datenspeicherung',
        body: [
          'Die Daten werden sicher auf Supabase (EU-Server) gespeichert. Passwörter werden verschlüsselt und sind für niemanden zugänglich.',
        ],
      },
      {
        heading: '5. Cookies',
        body: [
          'Wir verwenden zwei Kategorien von Cookies:',
          {
            type: 'list',
            items: [
              'Notwendig — Anmeldung und Spracheinstellung. Immer aktiv.',
              'Statistik (Google Analytics) — die Cookies werden nur nach ausdrücklicher Einwilligung gesetzt. Lehnen Sie ab, erhält Google nur anonyme Signale ohne Cookies, die Sie nicht identifizieren.',
            ],
          },
          'Zusätzlich zählen wir die Besuche anonym mit einem eigenen Werkzeug, ohne Cookies: wie oft jede Seite aufgerufen wird, woher der Besuch kam (z. B. Google), den Gerätetyp und Kontakt-Klicks (z. B. Anruf). Wir speichern keine IP-Adresse und nichts, was Sie identifiziert – nur Tagessummen. Daher umfasst diese Zählung alle Besucher.',
          'Sie können Ihre Auswahl jederzeit über das Cookie-Banner am unteren Rand jeder Seite ändern.',
        ],
      },
      {
        heading: '6. Ihre Rechte',
        body: [
          'Sie haben das Recht auf:',
          {
            type: 'list',
            items: [
              'Zugang zu Ihren Daten',
              'Berichtigung unrichtiger Daten',
              'Löschung Ihres Kontos',
              'Export Ihrer Daten',
            ],
          },
          'Für jede Anfrage kontaktieren Sie uns unter mnc@hotmail.gr',
        ],
      },
      {
        heading: '7. Änderungen',
        body: [
          'Wir können diese Richtlinie aktualisieren. Das Datum oben auf dieser Seite wird entsprechend aktualisiert.',
        ],
      },
    ],
  },
  bg: {
    title: 'Политика за поверителност',
    lastUpdated: 'Последна актуализация: Ноември 2026',
    sections: [
      {
        heading: '1. Кои сме ние',
        body: [
          'Уебсайтът chalkidikihub.gr се управлява от Минас Елефтериадис. Имейл за контакт: mnc@hotmail.gr',
        ],
      },
      {
        heading: '2. Какви данни събираме',
        body: [
          'Събираме само данните, които ни предоставяте:',
          {
            type: 'list',
            items: [
              'Собственици: Име, имейл, телефон, детайли за обекта',
              'Посетители: Не събираме лични данни',
            ],
          },
        ],
      },
      {
        heading: '3. Как използваме данните',
        body: [
          {
            type: 'list',
            items: [
              'За функционирането на вашия акаунт',
              'За показване на вашите обяви',
              'За подобряване на уебсайта',
            ],
          },
          'Не продаваме, не споделяме и не прехвърляме вашите данни на трети страни.',
        ],
      },
      {
        heading: '4. Съхранение на данни',
        body: [
          'Данните се съхраняват сигурно в Supabase (EU сървъри). Паролите са криптирани и не са достъпни за никого.',
        ],
      },
      {
        heading: '5. Бисквитки',
        body: [
          'Използваме две категории бисквитки:',
          {
            type: 'list',
            items: [
              'Необходими — сесия за вход и език. Винаги активни.',
              'Статистически (Google Analytics) — бисквитките му се активират само след изричното ви съгласие. Ако откажете, Google получава само анонимни сигнали без бисквитки, които не ви идентифицират.',
            ],
          },
          'Освен това броим посещенията анонимно със собствен инструмент, без бисквитки: колко пъти се отваря всяка страница, откъде е дошло посещението (напр. Google), вида устройство и кликванията за контакт (напр. обаждане). Не съхраняваме IP адрес или нещо друго, което ви идентифицира — само дневни суми. Затова това преброяване обхваща всички посетители.',
          'Можете да промените избора си по всяко време чрез банера за бисквитки в долната част на всяка страница.',
        ],
      },
      {
        heading: '6. Вашите права',
        body: [
          'Имате право на:',
          {
            type: 'list',
            items: [
              'Достъп до вашите данни',
              'Коригиране на неточни данни',
              'Изтриване на вашия акаунт',
              'Експортиране на вашите данни',
            ],
          },
          'За всяко запитване се свържете с нас на mnc@hotmail.gr',
        ],
      },
      {
        heading: '7. Промени',
        body: [
          'Може да актуализираме тази политика. Датата в горната част на тази страница ще бъде съответно актуализирана.',
        ],
      },
    ],
  },
  ru: {
    title: 'Политика конфиденциальности',
    lastUpdated: 'Последнее обновление: Ноябрь 2026',
    sections: [
      {
        heading: '1. Кто мы',
        body: [
          'Веб-сайт chalkidikihub.gr управляется Минасом Элефтериадисом. Контактный email: mnc@hotmail.gr',
        ],
      },
      {
        heading: '2. Какие данные мы собираем',
        body: [
          'Мы собираем только те данные, которые вы предоставляете:',
          {
            type: 'list',
            items: [
              'Владельцы: Имя, email, телефон, данные об объекте',
              'Посетители: Мы не собираем персональные данные',
            ],
          },
        ],
      },
      {
        heading: '3. Как мы используем данные',
        body: [
          {
            type: 'list',
            items: [
              'Для работы вашего аккаунта',
              'Для отображения ваших объявлений',
              'Для улучшения сайта',
            ],
          },
          'Мы не продаём, не передаём и не распространяем ваши данные третьим лицам.',
        ],
      },
      {
        heading: '4. Хранение данных',
        body: [
          'Данные надёжно хранятся на Supabase (серверы ЕС). Пароли зашифрованы и недоступны никому.',
        ],
      },
      {
        heading: '5. Файлы cookie',
        body: [
          'Мы используем две категории файлов cookie:',
          {
            type: 'list',
            items: [
              'Необходимые — сессия входа и язык. Всегда активны.',
              'Статистика (Google Analytics) — её cookies включаются только после вашего явного согласия. Если откажетесь, Google получает лишь анонимные сигналы без cookies, которые вас не идентифицируют.',
            ],
          },
          'Кроме того, мы анонимно считаем посещения собственным инструментом, без cookies: сколько раз открывается каждая страница, откуда пришёл посетитель (например, из Google), тип устройства и клики для связи (например, звонок). Мы не храним IP-адрес и ничего, что вас идентифицирует, — только суммы за день. Поэтому этот подсчёт охватывает всех посетителей.',
          'Вы можете изменить выбор в любое время через cookie-баннер внизу каждой страницы.',
        ],
      },
      {
        heading: '6. Ваши права',
        body: [
          'Вы имеете право на:',
          {
            type: 'list',
            items: [
              'Доступ к вашим данным',
              'Исправление неточных данных',
              'Удаление вашего аккаунта',
              'Экспорт ваших данных',
            ],
          },
          'По любому запросу свяжитесь с нами по адресу mnc@hotmail.gr',
        ],
      },
      {
        heading: '7. Изменения',
        body: [
          'Мы можем обновить эту политику. Дата в верхней части этой страницы будет соответственно обновлена.',
        ],
      },
    ],
  },
  ro: {
    title: 'Politica de confidentialitate',
    lastUpdated: 'Ultima actualizare: Noiembrie 2026',
    sections: [
      {
        heading: '1. Cine suntem',
        body: [
          'Site-ul web chalkidikihub.gr este operat de Minas Eleftheriadis. Email de contact: mnc@hotmail.gr',
        ],
      },
      {
        heading: '2. Ce date colectam',
        body: [
          'Colectam doar datele pe care ni le furnizati:',
          {
            type: 'list',
            items: [
              'Proprietari: Nume, email, telefon, detalii proprietate',
              'Vizitatori: Nu colectam date personale',
            ],
          },
        ],
      },
      {
        heading: '3. Cum folosim datele',
        body: [
          {
            type: 'list',
            items: [
              'Pentru operarea contului dumneavoastra',
              'Pentru afisarea anunturilor dumneavoastra',
              'Pentru imbunatatirea site-ului',
            ],
          },
          'Nu vindem, nu impartasim si nu transferam datele dumneavoastra catre terti.',
        ],
      },
      {
        heading: '4. Stocarea datelor',
        body: [
          'Datele sunt stocate in siguranta pe Supabase (servere UE). Parolele sunt criptate si nu sunt accesibile nimanui.',
        ],
      },
      {
        heading: '5. Cookie-uri',
        body: [
          'Folosim două categorii de cookie-uri:',
          {
            type: 'list',
            items: [
              'Esențiale — sesiune de autentificare și preferința de limbă. Întotdeauna active.',
              'Statistici (Google Analytics) — cookie-urile sale se activează doar după consimțământul explicit. Dacă refuzați, Google primește doar semnale anonime, fără cookie-uri, care nu vă identifică.',
            ],
          },
          'În plus, numărăm vizitele anonim cu un instrument propriu, fără cookie-uri: de câte ori este afișată fiecare pagină, de unde a venit vizita (de ex. Google), tipul de dispozitiv și clicurile de contact (de ex. un apel). Nu stocăm adresa IP sau orice altceva care vă identifică — doar totaluri zilnice. De aceea această numărare acoperă toți vizitatorii.',
          'Puteți schimba alegerea în orice moment prin banner-ul de cookie-uri din partea de jos a fiecărei pagini.',
        ],
      },
      {
        heading: '6. Drepturile dumneavoastra',
        body: [
          'Aveti dreptul la:',
          {
            type: 'list',
            items: [
              'Accesul la datele dumneavoastra',
              'Corectarea datelor inexacte',
              'Stergerea contului dumneavoastra',
              'Exportul datelor dumneavoastra',
            ],
          },
          'Pentru orice solicitare, contactati-ne la mnc@hotmail.gr',
        ],
      },
      {
        heading: '7. Modificari',
        body: [
          'Putem actualiza aceasta politica. Data din partea de sus a acestei pagini va fi actualizata corespunzator.',
        ],
      },
    ],
  },
};

type Props = { params: Promise<{ locale: string }> };

const DESCRIPTIONS: Record<string, string> = {
  el: 'Πώς συλλέγουμε, χρησιμοποιούμε και προστατεύουμε τα δεδομένα σας στο ChalkidikiHub. Πληροφορίες για cookies, Google Analytics και τα δικαιώματά σας.',
  en: 'How we collect, use and protect your data on ChalkidikiHub. Information about cookies, Google Analytics, and your rights under GDPR.',
  de: 'Wie wir Ihre Daten bei ChalkidikiHub erheben, nutzen und schützen. Informationen zu Cookies, Google Analytics und Ihren DSGVO-Rechten.',
  bg: 'Как събираме, използваме и защитаваме данните ви в ChalkidikiHub. Информация за бисквитки, Google Analytics и правата ви по GDPR.',
  ru: 'Как мы собираем, используем и защищаем ваши данные на ChalkidikiHub. Информация о cookies, Google Analytics и ваших правах по GDPR.',
  ro: 'Cum colectăm, folosim și protejăm datele dvs. pe ChalkidikiHub. Informații despre cookie-uri, Google Analytics și drepturile dvs. GDPR.',
  sr: 'Kako prikupljamo, koristimo i štitimo vaše podatke na ChalkidikiHub. Informacije o kolačićima, Google Analytics i vašim GDPR pravima.',
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
      canonical: localeUrl(locale, 'privacy'),
      languages: hreflangMap(`/privacy`),
    },
  };
}

export default async function PrivacyPage({ params }: Props) {
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
