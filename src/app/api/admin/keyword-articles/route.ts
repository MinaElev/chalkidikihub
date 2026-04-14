import { NextResponse } from 'next/server';
import { createAdminClient, createApiClient } from '@/lib/api-helpers';

export const maxDuration = 120;

async function getOpenAIKey(): Promise<string> {
  try {
    const supabase = createApiClient();
    const { data } = await supabase.from('site_settings').select('value').eq('key', 'openai_api_key').single();
    if (data?.value) return data.value;
  } catch {}
  return process.env.OPENAI_API_KEY || '';
}

async function callOpenAI(prompt: string, maxTokens: number = 6000): Promise<string> {
  const apiKey = await getOpenAIKey();
  if (!apiKey) throw new Error('OpenAI API key not configured');
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model: 'gpt-4o-mini', messages: [{ role: 'user', content: prompt }], max_tokens: maxTokens, temperature: 0.7 }),
  });
  if (!response.ok) throw new Error(`OpenAI error: ${response.status}`);
  const data = await response.json();
  return data.choices[0].message.content;
}

function slugify(text: string): string {
  return text.toLowerCase()
    .replace(/[άα]/g, 'a').replace(/[έε]/g, 'e').replace(/[ήη]/g, 'i').replace(/[ίι]/g, 'i')
    .replace(/[όο]/g, 'o').replace(/[ύυ]/g, 'y').replace(/[ώω]/g, 'o').replace(/[ς]/g, 's')
    .replace(/[σ]/g, 's').replace(/[δ]/g, 'd').replace(/[φ]/g, 'f').replace(/[γ]/g, 'g')
    .replace(/[ξ]/g, 'x').replace(/[κ]/g, 'k').replace(/[λ]/g, 'l').replace(/[μ]/g, 'm')
    .replace(/[ν]/g, 'n').replace(/[π]/g, 'p').replace(/[ρ]/g, 'r').replace(/[τ]/g, 't')
    .replace(/[θ]/g, 'th').replace(/[χ]/g, 'ch').replace(/[ψ]/g, 'ps').replace(/[ζ]/g, 'z')
    .replace(/[β]/g, 'v').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '');
}

// 20 θεματικά article templates γύρω από τα bold keywords των χωριών
// Κάθε article αναφέρει 15-25 keywords φυσικά → AutoLinkedContent τα κάνει links
const KEYWORD_TOPICS = [
  {
    slug: 'oi-kalyteres-paralies-kassandras',
    category: 'beaches',
    promptEl: `Γράψε αναλυτικό άρθρο για τις καλύτερες παραλίες της Κασσάνδρας.
ΠΡΕΠΕΙ να αναφέρεις με φυσικό τρόπο μέσα στο κείμενο: Παραλία Καλλιθέας, Παραλία Ποσείδι, Παραλία Πευκοχωρίου, Παραλία Χρυσής Ακτής, Παραλία Σίβηρης, Παραλία Μόλα Καλύβα, Κρυφή Άμμος, Παραλία Κασσάνδρας, Παραλία Κασσανδρινό, Παραλία Σκάλας, Παραλία Αγίας Παρασκευής.
Ανέφερε τα χωριά: Καλλιθέα, Πευκοχώρι, Ποσείδι, Χανιώτη, Κρυοπηγή, Σιβηρή, Φούρκα, Παλιούρι, Νέα Φώκαια, Αγία Παρασκευή.
Πες για κάθε παραλία τι τη κάνει ξεχωριστή.`
  },
  {
    slug: 'oi-kalyteres-paralies-sithonias',
    category: 'beaches',
    promptEl: `Γράψε αναλυτικό άρθρο για τις καλύτερες παραλίες της Σιθωνίας.
ΠΡΕΠΕΙ να αναφέρεις: Καβουρότρυπες, Καλογριά, Καλαμίτσι, Παραλία Σάρτης, Παραλία Κάθισμα, Παραλία Τορώνης, Παραλία Μεταμόρφωσης, Παραλία Πλατανίτσι, Γομάτι, Αρμενιστής, Ακτή Παναγιάς.
Ανέφερε τα χωριά: Βουρβουρού, Σάρτη, Νέος Μαρμαράς, Νικήτη, Τορώνη, Συκιά, Πόρτο Κουφό, Μεταμόρφωση.
Πες για κάθε παραλία: τύπος άμμου, αν είναι οργανωμένη, ιδανική για ποιον.`
  },
  {
    slug: 'istorika-mnimeia-chalkidikis',
    category: 'culture',
    promptEl: `Γράψε άρθρο για τα ιστορικά μνημεία και αρχαιολογικούς χώρους της Χαλκιδικής.
ΠΡΕΠΕΙ να αναφέρεις: Αρχαία Στάγειρα, Αρχαία Ολύνθος, Αρχαία Τορώνη, Αρχαία Σίβη, Αριστοτέλη, Αριστοτέλειο Πάρκο, Αρχαίο Θέατρο, Αρχαιολογικό Μουσείο, Αρχαίο Λιμάνι, Αρχαίο Στάδιο, Κάστρο της Ουρανούπολης, Κάστρο του Παλαιόκαστρου, Πετρόχτιστο Κάστρο.
Ανέφερε τα χωριά: Στάγειρα, Ολυμπιάδα, Ουρανούπολη, Τορώνη, Παλαιόκαστρο, Πολύγυρος, Ιερισσός.
Για κάθε μνημείο: τι θα δεις, ώρες, πώς να πας.`
  },
  {
    slug: 'ekklisies-kai-monastiria-chalkidikis',
    category: 'culture',
    promptEl: `Γράψε άρθρο για τις πιο σημαντικές εκκλησίες και μοναστήρια της Χαλκιδικής.
ΠΡΕΠΕΙ να αναφέρεις: Μοναστήρι της Αγίας Αναστασίας, Μοναστήρι της Αγίας Άννας, Μοναστήρι της Παναγίας, Μοναστήρι του Αγίου Νικολάου, Μοναστήρι του Ταξιάρχη, Εκκλησία του Αγίου Νικολάου, Εκκλησία του Αγίου Γεωργίου, εκκλησία του Αγίου Δημητρίου, εκκλησία του Αγίου Στεφάνου.
Ανέφερε: Ιερισσός, Νέα Ρόδα, Νέος Μαρμαράς, Αρναία, Συκιά, Πολύγυρος, Βραστά.
Ιστορία, αρχιτεκτονική, πώς να τα επισκεφτείς.`
  },
  {
    slug: 'pezoporikoi-proorizmi-chalkidikis',
    category: 'activities',
    promptEl: `Γράψε αναλυτικό οδηγό πεζοπορίας στη Χαλκιδική.
ΠΡΕΠΕΙ να αναφέρεις: πεζοπορία, μονοπάτια πεζοπορίας, μονοπάτια, Πεζοπορικές διαδρομές, Όρους Χολομώντα, Εθνικό Πάρκο του Άθω, Πάρκο της Φύσης, ορεινών μονοπατιών, Εξερεύνηση της φύσης.
Ανέφερε τα χωριά: Παρθενώνας, Αρναία, Νεοχώρι, Ταξιάρχης, Στρατονίκη, Βουρβουρού, Ολυμπιάδα, Στάγειρα.
Δυσκολία, χρόνος, τι θα δεις σε κάθε διαδρομή.`
  },
  {
    slug: 'thalassia-spor-chalkidiki',
    category: 'activities',
    promptEl: `Γράψε οδηγό θαλάσσιων σπορ και υδάτινων δραστηριοτήτων στη Χαλκιδική.
ΠΡΕΠΕΙ να αναφέρεις: θαλάσσια σπορ, καταδύσεις, ποδηλασία, υπαίθριες δραστηριότητες.
Παραλίες: Καβουρότρυπες, Βουρβουρού, Αρμενιστής, Καλογριά, Ακτή Παναγιάς.
Χωριά: Βουρβουρού, Νικήτη, Νέος Μαρμαράς, Σάρτη, Πόρτο Κουφό.
Τι σπορ, πού, τιμές, εμπειρίες.`
  },
  {
    slug: 'gastronomikos-odigos-chalkidikis',
    category: 'food',
    promptEl: `Γράψε γαστρονομικό οδηγό Χαλκιδικής.
ΠΡΕΠΕΙ να αναφέρεις: τοπική κουζίνα, σουβλάκι, χταπόδι στη σχάρα, ψάρι, παραδοσιακές ταβέρνες, παραδοσιακά ταβερνάκια, παραδοσιακά καφενεία, κουζίνα, Τοπικές γεύσεις.
Χωριά: Νικήτη, Αρναία, Γαλάτιστα, Σάρτη, Βουρβουρού, Νέος Μαρμαράς, Παρθενώνας.
Τι να δοκιμάσεις, πού να πας, τοπικά προϊόντα.`
  },
  {
    slug: 'nyxterini-zoi-chalkidikis',
    category: 'guides',
    promptEl: `Γράψε οδηγό νυχτερινής ζωής στη Χαλκιδική.
ΠΡΕΠΕΙ να αναφέρεις: νυχτερινή ζωή, Ζωντανή νυχτερινή ζωή, ήσυχη νυχτερινή ζωή, χαλαρωτική ατμόσφαιρα.
Χωριά με ζωντανή νυχτερινή ζωή: Χανιώτη, Καλλιθέα, Πευκοχώρι, Νικήτη, Νέος Μαρμαράς, Σάρτη, Κασσανδρινό, Ουρανούπολη.
Χωριά με ήσυχη ατμόσφαιρα: Σανός, Βουρβουρού, Παρθενώνας, Αφυτος.
Πού να πας ανάλογα τι ψάχνεις.`
  },
  {
    slug: 'oi-kalyteres-paralies-gia-oikogeneies',
    category: 'tips',
    promptEl: `Γράψε οδηγό με τις καλύτερες οικογενειακές παραλίες στη Χαλκιδική.
ΠΡΕΠΕΙ να αναφέρεις: Παραλία Καλλιθέας, Παραλία Πευκοχωρίου, Παραλία Μόλα Καλύβα, Παραλία Ολυμπιάδας, Παραλία Μεταμόρφωσης, Παραλία Σημάντρας, Παραλία Ποσείδι, Παραλία Πορταριάς.
Χωριά: Καλλιθέα, Νέα Ποτίδαια, Νέα Μουδανιά, Μεταμόρφωση, Ποσείδι, Ολυμπιάδα, Πορταριά.
Ρηχά νερά, παιδικές χαρές, σκιά, parking, πρόσβαση.`
  },
  {
    slug: 'krymmena-diamantia-sithonias',
    category: 'tips',
    promptEl: `Γράψε άρθρο για τα κρυμμένα διαμάντια της Σιθωνίας.
ΠΡΕΠΕΙ να αναφέρεις: Καβουρότρυπες, Κρυφή Άμμος, Γομάτι, Τρυπητή, Παραλία Τρυπητής, Καλαμίτσι, Πόρτο Κουφό, Φάρο του Πόρτο Κουφό, παρθένες παραλίες.
Χωριά: Βουρβουρού, Τρυπητή, Συκιά, Πόρτο Κουφό, Τορώνη, Πάρτε Κουφό.
Πώς να βρεις μέρη που δεν ξέρει κανείς, μυστικά tips.`
  },
  {
    slug: 'paradosiaka-choria-kassandras',
    category: 'guides',
    promptEl: `Γράψε οδηγό για τα παραδοσιακά χωριά της Κασσάνδρας.
ΠΡΕΠΕΙ να αναφέρεις: Αγία Παρασκευή, Κασσανδρινό, Κρυοπηγή, Σιβηρή, Φούρκα, Παλιούρι, Νέα Σκιώνη, Νέα Φώκαια, Νέα Ποτίδαια, Λουτρά Αγίας Παρασκευής, Μόλα Καλύβα.
Keywords: ιαματικές πηγές, παράδοση, ιστορία, φύση.
Χαρακτήρας κάθε χωριού, τι να δεις, πού να φας.`
  },
  {
    slug: 'paradosiaka-choria-sithonias',
    category: 'guides',
    promptEl: `Γράψε οδηγό για τα παραδοσιακά χωριά της Σιθωνίας.
ΠΡΕΠΕΙ να αναφέρεις: Νικήτη, Νέος Μαρμαράς, Σάρτη, Βουρβουρού, Μεταμόρφωση, Τορώνη, Συκιά, Παρθενώνας, Ελιά, Πόρτο Κουφό, Όρμος Παναγιάς.
Keywords: Σιθωνία, Λιβροχίου, Παναγίας, παλιό λιμάνι.
Χαρακτήρας, παραλίες, φαγητό, ατμόσφαιρα.`
  },
  {
    slug: 'choria-voreiou-chalkidikis',
    category: 'guides',
    promptEl: `Γράψε οδηγό για τα χωριά της βόρειας/ενδοχώρας Χαλκιδικής.
ΠΡΕΠΕΙ να αναφέρεις: Αρναία, Πολύγυρος, Γαλάτιστα, Παλαιοχώρι, Νεοχώρι, Ταξιάρχης, Βραστά, Στάγειρα, Στρατονίκη.
Keywords: Λαογραφικό Μουσείο, Αρχαιολογικό Μουσείο, Πλατεία Δημαρχείου, Όρους Χολομώντα, βουνά.
Χωριά στα βουνά, αυθεντική Χαλκιδική.`
  },
  {
    slug: 'odigos-ouranoupolis-ammouliani',
    category: 'guides',
    promptEl: `Γράψε οδηγό για Ουρανούπολη και Αμμουλιανή.
ΠΡΕΠΕΙ να αναφέρεις: Ουρανούπολη, Αμμουλιανή, Νέα Ρόδα, Ιερισσός, Κάστρο της Ουρανούπολης, Λαογραφικό Μουσείο, Μοναστήρι της Αγίας Αναστασίας, Μοναστήρι της Αγίας Άννας, Αγίου Γεωργίου, Καραγάτσι.
Keywords: Εθνικό Πάρκο του Άθω, Αρχαιολογικό Μουσείο.
Πώς να πας, τι να δεις, εκδρομές, παραλίες.`
  },
  {
    slug: 'mouseia-chalkidikis',
    category: 'culture',
    promptEl: `Γράψε οδηγό για τα μουσεία της Χαλκιδικής.
ΠΡΕΠΕΙ να αναφέρεις: Αρχαιολογικό Μουσείο, Λαογραφικό Μουσείο, Μουσείο Πολυγύρου, τοπικό μουσείο, μουσεία.
Χωριά: Πολύγυρος, Αρναία, Ουρανούπολη, Ολυμπιάδα, Ξηροπόταμος.
Keywords: Αριστοτέλη, Αρχαία Στάγειρα, ιστορία, πολιτισμό.
Τι θα δεις σε κάθε μουσείο, ώρες, εισιτήριο.`
  },
  {
    slug: 'pote-na-episkefteis-ti-chalkidiki',
    category: 'tips',
    promptEl: `Γράψε οδηγό για την καλύτερη εποχή επίσκεψης στη Χαλκιδική.
ΠΡΕΠΕΙ να αναφέρεις: Μάιο έως Σεπτέμβριο, Απρίλιος και Οκτώβριος, Σεπτέμβριος και Οκτώβριος.
Χωριά: Χανιώτη, Καλλιθέα, Νικήτη, Σάρτη, Βουρβουρού, Ουρανούπολη.
Παραλίες: Καβουρότρυπες, Καλογριά, Παραλία Σάρτης.
Καιρός ανά μήνα, πλήθος, τιμές, εκδηλώσεις.`
  },
  {
    slug: 'gia-zeugaria-romantikes-apostaseis',
    category: 'tips',
    promptEl: `Γράψε οδηγό ρομαντικών αποδράσεων στη Χαλκιδική.
ΠΡΕΠΕΙ να αναφέρεις: μαγευτική θέα, χαλαρωτική ατμόσφαιρα, ηρεμία, φυσική ομορφιά, παρθένες παραλίες.
Παραλίες: Καβουρότρυπες, Κρυφή Άμμος, Γομάτι, Πόρτο Κουφό, Πλατανίτσι, Τρυπητή.
Χωριά: Παρθενώνας, Βουρβουρού, Αφυτος, Πόρτο Κουφό, Νέος Μαρμαράς.
Ηλιοβασιλέματα, δείπνα, μονοπάτια.`
  },
  {
    slug: 'paralies-choris-kosmo-chalkidiki',
    category: 'beaches',
    promptEl: `Γράψε οδηγό για ήσυχες παραλίες χωρίς κόσμο στη Χαλκιδική.
ΠΡΕΠΕΙ να αναφέρεις: παρθένες παραλίες, Κρυφή Άμμος, Γομάτι, Τρυπητή, Παραλία Τρυπητής, Καλαμίτσι, Πλατανίτσι, Παραλία Παλαιόκαστρου, Παραλία Στρατονίκης, παραλία Ξηροποτάμου, παραλία Συκιάς.
Χωριά: Τρυπητή, Πλατανίτσι, Παλαιόκαστρο, Στρατονίκη, Ξηροπόταμος, Συκιά.
Πώς να πας, τι να περιμένεις, tips πρόσβασης.`
  },
  {
    slug: 'laografika-mouseia-paradosi',
    category: 'culture',
    promptEl: `Γράψε για τη λαογραφική παράδοση και τα ήθη-έθιμα της Χαλκιδικής.
ΠΡΕΠΕΙ να αναφέρεις: παράδοση, παραδοσιακή του κουλτούρα, Λαογραφικό Μουσείο, τοπικό φεστιβάλ, πολιτισμό, ιστορία, φύση.
Χωριά: Αρναία, Γαλάτιστα, Νεοχώρι, Βραστά, Πολύγυρος, Σανός, Νέα Τρίγλια, Φλογητά.
Keywords: παραδοσιακά καφενεία, παραδοσιακές ταβέρνες, τοπική κουζίνα.
Φεστιβάλ, πανηγύρια, τοπικές γιορτές, ήθη και έθιμα.`
  },
  {
    slug: 'faroi-kai-limania-chalkidikis',
    category: 'guides',
    promptEl: `Γράψε οδηγό για τα λιμάνια και φάρους της Χαλκιδικής.
ΠΡΕΠΕΙ να αναφέρεις: Φάρο του Πόρτο Κουφό, Φάρο του Ποσειδίου, Λιμάνι, παλιό λιμάνι, Αρχαίο Λιμάνι.
Χωριά: Πόρτο Κουφό, Ποσείδι, Νέος Μαρμαράς, Νέα Μουδανιά, Αμμουλιανή, Ουρανούπολη, Ιερισσός.
Ιστορία κάθε λιμανιού, ηλιοβασιλέματα, αλιευτική παράδοση.`
  },
];

async function getUnsplashImage(query: string): Promise<{ url: string; alt: string }> {
  try {
    const supabase = createApiClient();
    const { data: setting } = await supabase.from('site_settings').select('value').eq('key', 'unsplash_api_key').single();
    const key = setting?.value || process.env.UNSPLASH_ACCESS_KEY;
    if (!key) return { url: '', alt: '' };

    const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`, {
      headers: { 'Authorization': `Client-ID ${key}` },
    });
    const data = await res.json();
    if (!data.results?.length) return { url: '', alt: '' };

    const photo = data.results[Math.floor(Math.random() * Math.min(data.results.length, 5))];
    // Trigger download as required by Unsplash
    fetch(photo.links.download_location, { headers: { 'Authorization': `Client-ID ${key}` } }).catch(() => {});
    return { url: photo.urls.regular, alt: photo.alt_description || query };
  } catch {
    return { url: '', alt: '' };
  }
}

export async function GET(request: Request) {
  // Return list of available topics and their status
  const url = new URL(request.url);
  const authHeader = url.searchParams.get('token') || request.headers.get('authorization')?.replace('Bearer ', '');
  if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createAdminClient();

  // Get existing articles
  const { data: existing } = await supabase.from('blog_articles').select('slug').like('slug', 'keyword-%');
  const existingSlugs = new Set((existing || []).map(a => a.slug));

  const topics = KEYWORD_TOPICS.map(t => ({
    slug: `keyword-${t.slug}`,
    category: t.category,
    exists: existingSlugs.has(`keyword-${t.slug}`),
  }));

  return NextResponse.json({
    total: topics.length,
    created: topics.filter(t => t.exists).length,
    remaining: topics.filter(t => !t.exists).length,
    topics,
  });
}

export async function POST(request: Request) {
  try {
    // Auth check
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabaseAuth = createApiClient();
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const adminDb = createAdminClient();
    const { data: profile } = await adminDb.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'superadmin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const { step = 1, topic_slug } = body;

    const supabase = createAdminClient();

    if (step === 1) {
      // Find next topic to generate
      let topicToGenerate = KEYWORD_TOPICS[0];

      if (topic_slug) {
        const found = KEYWORD_TOPICS.find(t => t.slug === topic_slug);
        if (!found) return NextResponse.json({ error: `Topic not found: ${topic_slug}` }, { status: 400 });
        topicToGenerate = found;
      } else {
        // Find first topic not yet created
        const { data: existing } = await supabase.from('blog_articles').select('slug').like('slug', 'keyword-%');
        const existingSlugs = new Set((existing || []).map(a => a.slug));

        const next = KEYWORD_TOPICS.find(t => !existingSlugs.has(`keyword-${t.slug}`));
        if (!next) return NextResponse.json({ error: 'Όλα τα keyword articles έχουν δημιουργηθεί!', allDone: true });
        topicToGenerate = next;
      }

      const articleSlug = `keyword-${topicToGenerate.slug}`;

      // Check if already exists
      const { data: existCheck } = await supabase.from('blog_articles').select('id').eq('slug', articleSlug).single();
      if (existCheck) return NextResponse.json({ error: `Υπάρχει ήδη: ${articleSlug}`, exists: true });

      // Generate Greek article
      const prompt = `Είσαι travel blogger που γράφει για τη Χαλκιδική. Γράψε ένα SEO-optimized άρθρο στα Ελληνικά.

${topicToGenerate.promptEl}

ΚΑΝΟΝΕΣ:
- 1000-1500 λέξεις
- Markdown format: ## για headings, **bold** για σημαντικές λέξεις, - για λίστες
- Γράψε σαν φίλος που μοιράζεται εμπειρίες, ΟΧΙ σαν Wikipedia
- ΟΛΕΣ οι τοποθεσίες (χωριά, παραλίες, μνημεία) πρέπει να αναφέρονται με το ακριβές ελληνικό τους όνομα
- ΜΗΝ βάζεις links ή URLs — τα links δημιουργούνται αυτόματα
- Intro paragraph πριν το πρώτο heading
- Κλείσε με section "Πρακτικές Πληροφορίες"

Return ONLY JSON:
{
  "title_el": "τίτλος ≤70 χαρακτήρες",
  "excerpt_el": "περίληψη ≤200 χαρακτήρες",
  "content_el": "full markdown article...",
  "read_time_min": 7,
  "tags": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "unsplash_query": "3-5 English words for image search"
}`;

      const result = await callOpenAI(prompt, 4000);
      const cleaned = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch {
        const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
        if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
        else throw new Error('Failed to parse AI response');
      }

      // Fetch image
      const image = await getUnsplashImage(parsed.unsplash_query || 'Halkidiki Greece beaches');

      // Insert as draft (Greek only)
      const { data: article, error: insertError } = await supabase.from('blog_articles').insert({
        slug: articleSlug,
        title_el: parsed.title_el,
        excerpt_el: parsed.excerpt_el,
        content_el: parsed.content_el,
        category: topicToGenerate.category,
        author: 'ChalkidikiHub',
        published_at: new Date().toISOString(),
        read_time_min: parsed.read_time_min || 7,
        tags: parsed.tags || [],
        image_url: image.url,
        image_alt: image.alt,
        // Empty translations — will be filled in step 2
        title_en: '', title_de: '', title_bg: '', title_ru: '', title_ro: '', title_sr: '',
        excerpt_en: '', excerpt_de: '', excerpt_bg: '', excerpt_ru: '', excerpt_ro: '', excerpt_sr: '',
        content_en: '', content_de: '', content_bg: '', content_ru: '', content_ro: '', content_sr: '',
        meta_title_el: '', meta_title_en: '', meta_title_de: '', meta_title_bg: '', meta_title_ru: '', meta_title_ro: '', meta_title_sr: '',
        meta_description_el: '', meta_description_en: '', meta_description_de: '', meta_description_bg: '', meta_description_ru: '', meta_description_ro: '', meta_description_sr: '',
      }).select('id').single();

      if (insertError) throw new Error(`Insert failed: ${insertError.message}`);

      return NextResponse.json({
        success: true,
        step: 1,
        article_id: article?.id,
        slug: articleSlug,
        title: parsed.title_el,
        category: topicToGenerate.category,
        wordCount: (parsed.content_el || '').split(/\s+/).length,
        hasImage: !!image.url,
        message: `Step 1 OK — τώρα κάλεσε step 2 για μεταφράσεις`,
      });
    }

    if (step === 2) {
      // Translate + SEO for existing article
      const { article_id } = body;
      if (!article_id) return NextResponse.json({ error: 'article_id required for step 2' }, { status: 400 });

      const { data: article } = await supabase.from('blog_articles')
        .select('id, title_el, excerpt_el, content_el, slug')
        .eq('id', article_id)
        .single();

      if (!article) return NextResponse.json({ error: 'Article not found' }, { status: 404 });

      // Translate title + excerpt + SEO in one call
      const seoPrompt = `Translate and generate SEO for a Halkidiki tourism article.

Greek title: "${article.title_el}"
Greek excerpt: "${article.excerpt_el}"

Translate title and excerpt to: English, German, Bulgarian, Russian, Romanian, Serbian.
Generate SEO meta_title (≤60 chars) and meta_description (≤155 chars) in ALL 7 languages (Greek + 6).
Generate image_alt in English.

Return ONLY JSON:
{
  "translations": {
    "title_en": "", "title_de": "", "title_bg": "", "title_ru": "", "title_ro": "", "title_sr": "",
    "excerpt_en": "", "excerpt_de": "", "excerpt_bg": "", "excerpt_ru": "", "excerpt_ro": "", "excerpt_sr": ""
  },
  "seo": {
    "meta_title_el": "", "meta_title_en": "", "meta_title_de": "", "meta_title_bg": "", "meta_title_ru": "", "meta_title_ro": "", "meta_title_sr": "",
    "meta_description_el": "", "meta_description_en": "", "meta_description_de": "", "meta_description_bg": "", "meta_description_ru": "", "meta_description_ro": "", "meta_description_sr": "",
    "image_alt": ""
  }
}`;

      const seoResult = await callOpenAI(seoPrompt, 3000);
      const seoClean = seoResult.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      let seoParsed;
      try { seoParsed = JSON.parse(seoClean); } catch {
        const m = seoClean.match(/\{[\s\S]*\}/);
        if (m) seoParsed = JSON.parse(m[0]);
        else throw new Error('Failed to parse SEO response');
      }

      // Translate content in 3 batches of 2 languages
      const LANG_NAMES: Record<string, string> = {
        en: 'English', de: 'German', bg: 'Bulgarian', ru: 'Russian', ro: 'Romanian', sr: 'Serbian'
      };
      const batches = [['en', 'de'], ['bg', 'ru'], ['ro', 'sr']];
      const contentTranslations: Record<string, string> = {};

      for (const batch of batches) {
        const langList = batch.map(l => LANG_NAMES[l]).join(' and ');
        const jsonFields = batch.map(l => `  "${l}": "full ${LANG_NAMES[l]} translation..."`).join(',\n');

        const contentPrompt = `You are a professional translator. Translate the following Greek text to ${langList}.
IMPORTANT: Translate the ENTIRE text completely. Do NOT summarize or shorten.
Keep the same formatting (## headings, **bold**, bullet points, line breaks).

Return ONLY a JSON object:
{
${jsonFields}
}

No markdown wrapping, no explanation.

Greek text to translate:
${article.content_el}`;

        const contentResult = await callOpenAI(contentPrompt, 8000);
        const contentClean = contentResult.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        let contentParsed;
        try { contentParsed = JSON.parse(contentClean); } catch {
          const m = contentClean.match(/\{[\s\S]*\}/);
          if (m) contentParsed = JSON.parse(m[0]);
          else throw new Error(`Failed to parse content translation for ${batch.join(',')}`);
        }
        Object.assign(contentTranslations, contentParsed);
      }

      // Update article with all translations + SEO
      const updateData: Record<string, string> = {};
      const trans = seoParsed.translations || {};
      const seo = seoParsed.seo || {};

      // Title + excerpt translations
      for (const lang of ['en', 'de', 'bg', 'ru', 'ro', 'sr']) {
        updateData[`title_${lang}`] = trans[`title_${lang}`] || '';
        updateData[`excerpt_${lang}`] = trans[`excerpt_${lang}`] || '';
        updateData[`content_${lang}`] = contentTranslations[lang] || '';
      }

      // SEO
      for (const lang of ['el', 'en', 'de', 'bg', 'ru', 'ro', 'sr']) {
        updateData[`meta_title_${lang}`] = seo[`meta_title_${lang}`] || '';
        updateData[`meta_description_${lang}`] = seo[`meta_description_${lang}`] || '';
      }
      if (seo.image_alt) updateData.image_alt = seo.image_alt;

      const { error: updateError } = await supabase
        .from('blog_articles')
        .update(updateData)
        .eq('id', article_id);

      if (updateError) throw new Error(`Update failed: ${updateError.message}`);

      return NextResponse.json({
        success: true,
        step: 2,
        slug: article.slug,
        title: article.title_el,
        languages: 7,
        message: 'Ολοκληρώθηκε! Μεταφράσεις + SEO σε 7 γλώσσες.',
      });
    }

    return NextResponse.json({ error: 'Invalid step (use 1 or 2)' }, { status: 400 });
  } catch (error) {
    const logClient = createApiClient();
    await logClient.from('activity_logs').insert({
      type: 'error', severity: 'error',
      message: 'Keyword article generation error',
      details: { error: (error as Error).message },
    });
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
