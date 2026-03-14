/**
 * News article data for Contentful migration.
 * Extracted from alkemiacapital-site.md. Dates converted DD/MM/YYYY -> ISO.
 */

export interface NewsArticleData {
  title: { 'it-IT': string; 'en-US': string }
  slug: string
  date: string
  category: string
  excerpt: { 'it-IT': string; 'en-US': string }
  body?: { 'it-IT': string; 'en-US': string }
  imageUrl: string
  externalUrl: string
}

export const newsArticles: NewsArticleData[] = [
  {
    title: {
      'it-IT': 'Circle, Alkemia Capital entra nel capitale per accelerare il piano al 2029',
      'en-US': 'Circle: Alkemia Capital Enters Equity to Accelerate the 2029 Plan',
    },
    slug: 'circle-alkemia-entra-nel-capitale',
    date: '2026-03-11',
    category: 'News',
    excerpt: {
      'it-IT': 'Alkemia, attraverso il fondo PIPE, e entrata nel capitale di Circle Group con l\'obiettivo di sostenerne e accelerarne il piano di sviluppo al 2029.',
      'en-US': 'Alkemia, through its PIPE fund, has entered Circle Group\'s equity to support and accelerate its development plan through 2029.',
    },
    body: {
      'it-IT': 'Alkemia, attraverso il fondo PIPE, e entrata nel capitale di Circle Group con l\'obiettivo di sostenerne e accelerarne il piano di sviluppo al 2029. L\'operazione rafforza il percorso di crescita della societa, attiva nella digitalizzazione della logistica e nei processi legati al Green Deal, ambiti sempre piu centrali per l\'evoluzione delle infrastrutture e delle supply chain europee.\n\nCome ha dichiarato il Managing Partner Giacomo Picchetto: "Circle e una realta che incarna perfettamente la tesi d\'investimento del nostro fondo PIPE focalizzato su eccellenze quotate ad alto tasso di innovazione."',
      'en-US': 'Alkemia, through its PIPE fund, has entered Circle Group\'s equity to support and accelerate its development plan through 2029. The operation strengthens the company\'s growth path, active in logistics digitalization and Green Deal processes, areas increasingly central to the evolution of European infrastructure and supply chains.\n\nAs Managing Partner Giacomo Picchetto stated: "Circle perfectly embodies the investment thesis of our PIPE fund focused on listed excellence with high innovation."',
    },
    imageUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2026/03/Circle-screen-1024x683.png',
    externalUrl: 'https://www.alkemiacapital.com/circle-alkemia-entra-nel-capitale/',
  },
  {
    title: {
      'it-IT': 'Contents, il Qatar investe per la prima volta in Italia nella scale-up per il marketing digitale',
      'en-US': 'Contents: Qatar Makes First Italian Investment in Digital Marketing Scale-up with 7M Funding Round',
    },
    slug: 'contents-qatar-investe-round-7-milioni',
    date: '2026-02-23',
    category: 'News',
    excerpt: {
      'it-IT': 'Il round di Contents, con l\'ingresso per la prima volta in Italia di un fondo sovrano come Qatar Development Bank, rappresenta un momento di svolta per l\'ecosistema dell\'innovazione.',
      'en-US': 'The Contents funding round, marking the first entry into Italy of a sovereign wealth fund like Qatar Development Bank, represents a turning point for the innovation ecosystem.',
    },
    body: {
      'it-IT': '"Il round di Contents, con l\'ingresso per la prima volta in Italia di un fondo sovrano come Qatar Development Bank, rappresenta un momento di svolta per il nostro ecosistema dell\'innovazione. E la conferma che il mercato italiano puo attrarre capitali globali verso progetti tecnologici capaci di rispondere alle sfide competitive internazionali."\n\nSimone Cremonini, Managing Partner',
      'en-US': '"The Contents funding round, with Qatar Development Bank\'s first entry into Italy, represents a turning point for our innovation ecosystem. It confirms that the Italian market can attract global capital toward technology projects capable of meeting international competitive challenges."\n\nSimone Cremonini, Managing Partner',
    },
    imageUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2026/02/Contents_page-0001-1-1024x724.jpg',
    externalUrl: 'https://www.alkemiacapital.com/contents-il-qatar-investe-per-la-prima-volta-in-italia-nella-scale-up-per-il-marketing-digitale-che-chiude-un-round-da-7-milioni/',
  },
  {
    title: {
      'it-IT': 'Integrazione strutturale dei fattori ESG nella governance di Alkemia',
      'en-US': 'Structural Integration of ESG Factors in Alkemia\'s Governance',
    },
    slug: 'integrazione-esg-governance',
    date: '2026-01-22',
    category: 'Insights',
    excerpt: {
      'it-IT': 'Abbiamo scelto di integrare in modo strutturale i fattori ESG all\'interno della nostra governance, perche riteniamo che sostenibilita e performance di lungo periodo siano inscindibili.',
      'en-US': 'We chose to structurally integrate ESG factors into our governance because we believe sustainability and long-term performance are inseparable.',
    },
    imageUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2026/01/WhatsApp-Image-2026-01-27-at-17.43.18-1024x551.jpeg',
    externalUrl: 'https://www.alkemiacapital.com/abbiamo-scelto-di-integrare-in-modo-strutturale-i-fattori-esg-allinterno-della-nostra-governance-perche-riteniamo-che-sostenibilita-e-performance-di-lungo-periodo-siano-ormai-inscindibili/',
  },
  {
    title: {
      'it-IT': 'Alkemia Capital Investor Day',
      'en-US': 'Alkemia Capital Investor Day',
    },
    slug: 'alkemia-capital-investor-day',
    date: '2025-11-06',
    category: 'Events',
    excerpt: {
      'it-IT': 'Il primo Investor Day di Alkemia: un\'occasione di ascolto e di visione sul futuro delle imprese italiane e il ruolo del capitale privato.',
      'en-US': 'Alkemia\'s first Investor Day: a moment of listening and vision on the future of Italian enterprises and the role of private capital.',
    },
    imageUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/11/0X4A0266-1024x683.jpg',
    externalUrl: 'https://www.alkemiacapital.com/alkemia-capital-investor-day/',
  },
  {
    title: {
      'it-IT': 'Alkemia Capital partecipa al THF Annual US Stakeholders\' Meeting',
      'en-US': 'Alkemia Capital Participates in the THF Annual US Stakeholders\' Meeting',
    },
    slug: 'thf-us-stakeholders-meeting',
    date: '2025-10-16',
    category: 'Events',
    excerpt: {
      'it-IT': 'Partecipazione del Managing Partner Simone Cremonini al meeting per la collaborazione transatlantica sull\'innovazione a Washington D.C.',
      'en-US': 'Managing Partner Simone Cremonini participated in the transatlantic innovation collaboration meeting in Washington D.C.',
    },
    imageUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/10/WhatsApp-Image-2025-10-22-at-17.48.31-824x1024.jpeg',
    externalUrl: 'https://www.alkemiacapital.com/alkemia-capital-partecipa-alliniziativa-per-la-collaborazione-transatlantica-sullinnovazione/',
  },
  {
    title: {
      'it-IT': 'Convivio S.p.A: nasce il polo nazionale per la pasta fresca d\'eccellenza',
      'en-US': 'Convivio S.p.A: Italy\'s National Hub for Premium Fresh Pasta Is Born',
    },
    slug: 'convivio-polo-pasta-fresca',
    date: '2025-09-15',
    category: 'News',
    excerpt: {
      'it-IT': 'Nasce Convivio S.p.A., la holding operativa promossa da Alkemia attraverso il fondo Food Excellence I, che riunisce cinque aziende d\'eccellenza della pasta fresca.',
      'en-US': 'Convivio S.p.A. is born, the operating holding company promoted by Alkemia through Food Excellence I, uniting five premium fresh pasta companies.',
    },
    imageUrl: '',
    externalUrl: 'https://www.alkemiacapital.com/convivio-s-p-a-nasce-il-polo-nazionale-italiano-per-la-pasta-fresca-e-i-piatti-pronti-deccellenza-promosso-da-alkemia-capital/',
  },
  {
    title: {
      'it-IT': 'Tecno S.p.A. e ora una societa quotata',
      'en-US': 'Tecno S.p.A. Is Now a Listed Company',
    },
    slug: 'tecno-societa-quotata',
    date: '2025-09-01',
    category: 'News',
    excerpt: {
      'it-IT': 'Alkemia supporta come lead investor la quotazione di Tecno Group, realta che coniuga sostenibilita, tecnologia e scalabilita internazionale.',
      'en-US': 'Alkemia supports Tecno Group\'s listing as lead investor, a company combining sustainability, technology, and international scalability.',
    },
    imageUrl: '',
    externalUrl: 'https://www.alkemiacapital.com/tecno-s-p-a-e-ora-una-societa-quotata/',
  },
  {
    title: {
      'it-IT': 'Presentazione XII Rapporto Investitori Istituzionali Italiani',
      'en-US': 'Presentation of the 12th Italian Institutional Investors Report',
    },
    slug: 'rapporto-investitori-istituzionali',
    date: '2025-09-10',
    category: 'Events',
    excerpt: {
      'it-IT': 'Il Managing Partner Giacomo Picchetto interviene al convegno di presentazione del XII Rapporto sugli investitori istituzionali italiani a Palazzo Mezzanotte.',
      'en-US': 'Managing Partner Giacomo Picchetto speaks at the presentation of the 12th Report on Italian institutional investors at Palazzo Mezzanotte.',
    },
    imageUrl: '',
    externalUrl: 'https://www.alkemiacapital.com/managing-partner-giacomo-picchetto-interverra-al-convegno/',
  },
  {
    title: {
      'it-IT': 'Redelfi tra le societa ad alta crescita dell\'Euronext Growth Milan',
      'en-US': 'Redelfi Among High-Growth Companies on Euronext Growth Milan',
    },
    slug: 'redelfi-growth-milan',
    date: '2025-07-15',
    category: 'News',
    excerpt: {
      'it-IT': 'Redelfi, partecipata del fondo PIPE, e entrata nella classifica di Milano Finanza tra le 100 aziende italiane a maggiore crescita su Euronext Growth Milan.',
      'en-US': 'Redelfi, a PIPE fund portfolio company, has entered Milano Finanza\'s ranking of the top 100 fastest-growing Italian companies on Euronext Growth Milan.',
    },
    imageUrl: '',
    externalUrl: 'https://www.alkemiacapital.com/redelfi-growth-milan-milano-finanza/',
  },
  {
    title: {
      'it-IT': 'Ermes Browser Security al GITEX EUROPE di Berlino',
      'en-US': 'Ermes Browser Security at GITEX EUROPE in Berlin',
    },
    slug: 'ermes-gitex-europe-berlin',
    date: '2025-06-01',
    category: 'News',
    excerpt: {
      'it-IT': 'Ermes Browser Security partecipera al GITEX EUROPE di Berlino, un traguardo che sottolinea la crescita e lo sviluppo internazionale di questa eccellenza italiana.',
      'en-US': 'Ermes Browser Security will participate in GITEX EUROPE in Berlin, a milestone underscoring the growth and international development of this Italian excellence.',
    },
    imageUrl: '',
    externalUrl: 'https://www.alkemiacapital.com/ermes-browser-security-keeps-growing-and-were-heading-to-gitex-europe-in-berlin/',
  },
  {
    title: {
      'it-IT': 'What Venture Capital Firms Look For When Investing in Language AI',
      'en-US': 'What Venture Capital Firms Look For When Investing in Language AI',
    },
    slug: 'vc-investing-language-ai-slatorcon',
    date: '2025-05-15',
    category: 'Insights',
    excerpt: {
      'it-IT': 'Il Managing Partner Simone Cremonini illustra il modello operativo di Alkemia allo SlatorCon 2025, la conferenza globale su AI e servizi linguistici.',
      'en-US': 'Managing Partner Simone Cremonini illustrates Alkemia\'s operating model at SlatorCon 2025, the leading global conference on AI and language services.',
    },
    imageUrl: '',
    externalUrl: 'https://www.alkemiacapital.com/what-venture-capital-firms-look-for-when-investing-in-language-ai/',
  },
  {
    title: {
      'it-IT': 'Previdenza e strategie di investimento nel venture capital',
      'en-US': 'Pension Funds and Venture Capital Investment Strategies',
    },
    slug: 'previdenza-strategie-venture-capital',
    date: '2025-04-01',
    category: 'Events',
    excerpt: {
      'it-IT': 'Il Managing Partner Simone Cremonini interviene al convegno sul venture capital e gli investitori istituzionali alla Camera dei Deputati.',
      'en-US': 'Managing Partner Simone Cremonini speaks at the venture capital and institutional investors conference at the Italian Parliament.',
    },
    imageUrl: '',
    externalUrl: 'https://www.alkemiacapital.com/previdenza-e-strategie-di-investimento-nel-venture-capital/',
  },
  {
    title: {
      'it-IT': 'Alkemia al Monaco International Investment Forum 2025',
      'en-US': 'Alkemia at the Monaco International Investment Forum 2025',
    },
    slug: 'alkemia-monaco-miif-2025',
    date: '2025-03-14',
    category: 'Events',
    excerpt: {
      'it-IT': 'Il team di Alkemia ha partecipato al Monaco International Investment Forum, un\'importante occasione di confronto tra investitori istituzionali e fondi di investimento.',
      'en-US': 'The Alkemia team participated in the Monaco International Investment Forum, a key event for institutional investors and investment funds.',
    },
    imageUrl: '',
    externalUrl: 'https://www.alkemiacapital.com/alkemia-capital-montecarlo-miif2025/',
  },
  {
    title: {
      'it-IT': 'Alkemia Capital inaugura una nuova fase di crescita: nuovi soci e nuovi fondi',
      'en-US': 'Alkemia Capital Opens a New Growth Phase: New Partners and New Funds',
    },
    slug: 'alkemia-nuova-fase-crescita',
    date: '2025-02-05',
    category: 'News',
    excerpt: {
      'it-IT': 'Alkemia annuncia l\'ingresso di due nuovi soci, Simone Cremonini e Giacomo Picchetto, e il lancio di nuovi fondi di venture capital, PIPE e private equity tematici.',
      'en-US': 'Alkemia announces the entry of two new partners, Simone Cremonini and Giacomo Picchetto, and the launch of new venture capital, PIPE, and thematic private equity funds.',
    },
    imageUrl: '',
    externalUrl: 'https://www.alkemiacapital.com/alkemia-capital-inaugura-una-nuova-fase-di-crescita-nuovi-soci-nel-capitale-e-nuovi-fondi/',
  },
  {
    title: {
      'it-IT': 'Alkemia rafforza la "boutique" degli investimenti corporate',
      'en-US': 'Alkemia Strengthens Its Corporate Investment "Boutique"',
    },
    slug: 'alkemia-rafforza-boutique-investimenti',
    date: '2025-02-01',
    category: 'News',
    excerpt: {
      'it-IT': 'QN Economia racconta Alkemia come una realta multiasset che investe con successo nelle PMI italiane, con oltre 200 milioni di euro di asset gestiti.',
      'en-US': 'QN Economia profiles Alkemia as a multi-asset firm successfully investing in Italian SMEs, with over EUR 200 million in assets under management.',
    },
    imageUrl: '',
    externalUrl: 'https://www.alkemiacapital.com/alkemia-rafforza-la-boutique-degli-investimenti-corporate/',
  },
  {
    title: {
      'it-IT': 'Alkemia: la burocrazia penalizza i fondi italiani',
      'en-US': 'Alkemia: Bureaucracy Penalizes Italian Funds. Innovation Requires More Courage',
    },
    slug: 'alkemia-burocrazia-fondi-italiani',
    date: '2025-01-15',
    category: 'Insights',
    excerpt: {
      'it-IT': 'Giacomo Picchetto e Simone Cremonini raccontano a La Stampa la visione sull\'attuale scenario finanziario italiano e le sfide del mercato dei private market.',
      'en-US': 'Giacomo Picchetto and Simone Cremonini share with La Stampa their vision on Italy\'s financial landscape and the challenges of the private market.',
    },
    imageUrl: '',
    externalUrl: 'https://www.alkemiacapital.com/alkemia-la-burocrazia-penalizza-i-fondi-italiani-per-fare-innovazione-serve-piu-coraggio/',
  },
  {
    title: {
      'it-IT': 'Alkemia Capital, due nuovi soci e ingresso nei private markets. AUM a 200 milioni',
      'en-US': 'Alkemia Capital: Two New Partners and Entry Into Private Markets. AUM Reaches 200 Million',
    },
    slug: 'alkemia-nuovi-soci-aum-200-milioni',
    date: '2025-01-10',
    category: 'News',
    excerpt: {
      'it-IT': 'Il 2025 sara per Alkemia un anno ambizioso: ufficializzato l\'ingresso di 2 nuovi azionisti, Simone Cremonini e Giacomo Picchetto, con AUM che raggiungono circa 200 milioni di euro.',
      'en-US': '2025 will be an ambitious year for Alkemia: the entry of 2 new shareholders, Simone Cremonini and Giacomo Picchetto, is formalized, with AUM reaching approximately EUR 200 million.',
    },
    imageUrl: '',
    externalUrl: 'https://www.alkemiacapital.com/alkemia-capital-due-nuovi-soci-e-ingresso-nei-private-markets-aum-a-200-milioni/',
  },
]
