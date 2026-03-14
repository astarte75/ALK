/**
 * Funds and investment platforms data for Contentful migration.
 * 3 platforms + 5 funds extracted from alkemiacapital-site.md.
 */

export interface InvestmentPlatformData {
  name: { 'it-IT': string; 'en-US': string }
  slug: string
  description: { 'it-IT': string; 'en-US': string }
  strategy: string
}

export interface FundData {
  name: { 'it-IT': string; 'en-US': string }
  slug: string
  description: { 'it-IT': string; 'en-US': string }
  strategy: string
  status: string
  fundSize: string
  investmentPeriod: string
  platformSlug: string
}

export const investmentPlatforms: InvestmentPlatformData[] = [
  {
    name: { 'it-IT': 'Private Equity', 'en-US': 'Private Equity' },
    slug: 'private-equity',
    description: {
      'it-IT': 'L\'approccio di Alkemia al Private Equity si concentra su investimenti in piccole e medie imprese con forte potenziale di sviluppo. Sosteniamo le aziende in fasi chiave di espansione, con un focus su operazioni di **buy-out**, **expansion capital** e **replacement capital**. Attraverso un coinvolgimento attivo nella gestione, forniamo supporto strategico e operativo, migliorando la governance e accelerando la creazione di valore sostenibile.',
      'en-US': 'Alkemia\'s approach to Private Equity focuses on investments in small and medium-sized enterprises with strong growth potential. We support companies at key expansion stages, with a focus on **buy-out**, **expansion capital**, and **replacement capital** operations. Through active management involvement, we provide strategic and operational support, improving governance and accelerating sustainable value creation.',
    },
    strategy: 'Private Equity',
  },
  {
    name: { 'it-IT': 'Venture Capital', 'en-US': 'Venture Capital' },
    slug: 'venture-capital',
    description: {
      'it-IT': 'L\'approccio di Alkemia al **Venture Capital** si focalizza su investimenti in startup e scale-up innovative, principalmente nei settori B2B tecnologici e digitali. Sosteniamo aziende ad alto potenziale di crescita, fornendo capitale e competenze strategiche per accelerare lo sviluppo e la scalabilita. Il nostro coinvolgimento si estende oltre il finanziamento, offrendo supporto attivo nella governance, nell\'espansione commerciale e nell\'accesso a network di partner strategici.',
      'en-US': 'Alkemia\'s **Venture Capital** approach focuses on investments in innovative startups and scale-ups, primarily in B2B technology and digital sectors. We support high-growth-potential companies by providing capital and strategic expertise to accelerate development and scalability. Our involvement extends beyond financing, offering active support in governance, commercial expansion, and access to strategic partner networks.',
    },
    strategy: 'Venture Capital',
  },
  {
    name: { 'it-IT': 'PIPE', 'en-US': 'PIPE' },
    slug: 'pipe',
    description: {
      'it-IT': 'L\'approccio di Alkemia al **PIPE** (Private Investments in Public Equity) mira a investire in societa pubbliche sottovalutate con un forte potenziale di crescita nei settori tecnologici e industriali. Offriamo capitale strategico per favorire l\'espansione e le operazioni di consolidamento, mantenendo un focus sull\'ottimizzazione della governance e sull\'incremento del valore a lungo termine.',
      'en-US': 'Alkemia\'s **PIPE** (Private Investments in Public Equity) approach targets undervalued public companies with strong growth potential in technology and industrial sectors. We provide strategic capital to support expansion and consolidation operations, with a focus on optimizing governance and increasing long-term value.',
    },
    strategy: 'PIPE',
  },
]

export const funds: FundData[] = [
  {
    name: { 'it-IT': 'Amarone', 'en-US': 'Amarone' },
    slug: 'amarone',
    description: {
      'it-IT': 'Amarone e il FIA promosso da Alkemia volto a creare un polo di eccellenza nei **lubrificanti e grassi ad alte prestazioni** attraverso l\'investimento in **Pakelo**, storico marchio italiano riconosciuto per qualita e innovazione. Il fondo punta su sviluppo sostenibile, espansione internazionale e crescita per linee esterne, con l\'obiettivo di creare un gruppo di riferimento nel segmento premium.',
      'en-US': 'Amarone is the AIF promoted by Alkemia aimed at creating a center of excellence in **high-performance lubricants and greases** through investment in **Pakelo**, a historic Italian brand recognized for quality and innovation. The fund focuses on sustainable development, international expansion, and external growth to create a leading group in the premium segment.',
    },
    strategy: 'Private Equity',
    status: 'Fundraising',
    fundSize: '50M EUR',
    investmentPeriod: '2023-2026',
    platformSlug: 'private-equity',
  },
  {
    name: { 'it-IT': 'Alkemia Food Excellence I', 'en-US': 'Alkemia Food Excellence I' },
    slug: 'food-excellence-i',
    description: {
      'it-IT': 'Alkemia Food Excellence I e il FIA promosso da Alkemia volto a creare un **gruppo di riferimento nella pasta fresca e nella gastronomia di alta gamma**, valorizzando le eccellenze regionali italiane. Il fondo aggrega aziende familiari con marchi premium, puntando su qualita, sostenibilita e sviluppo nei mercati internazionali.',
      'en-US': 'Alkemia Food Excellence I is the AIF promoted by Alkemia aimed at creating a **leading group in premium fresh pasta and gastronomy**, enhancing Italian regional excellence. The fund aggregates family businesses with premium brands, focusing on quality, sustainability, and international market development.',
    },
    strategy: 'Private Equity',
    status: 'Fundraising',
    fundSize: '50M EUR',
    investmentPeriod: '2025-2027',
    platformSlug: 'private-equity',
  },
  {
    name: { 'it-IT': 'Alkemia Flexible Capital I', 'en-US': 'Alkemia Flexible Capital I' },
    slug: 'flexible-capital-i',
    description: {
      'it-IT': '**Alkemia Flexible Capital** e un FIA di **preferred equity** promosso da Alkemia per sostenere la crescita delle PMI italiane attraverso soluzioni di capitale flessibili. Il fondo investe in partecipazioni di minoranza in aziende solide e in settori strategici come energia rinnovabile, infrastrutture 5G e real estate, offrendo rendimenti attrattivi con un profilo di rischio mitigato. Con una forte attenzione ai criteri ESG, Flexible Capital I promuove uno sviluppo sostenibile.',
      'en-US': '**Alkemia Flexible Capital** is a **preferred equity** AIF promoted by Alkemia to support the growth of Italian SMEs through flexible capital solutions. The fund invests in minority stakes in solid companies in strategic sectors such as renewable energy, 5G infrastructure, and real estate, offering attractive returns with a mitigated risk profile. With strong attention to ESG criteria, Flexible Capital I promotes sustainable development.',
    },
    strategy: 'Hybrid Capital',
    status: 'Fundraising',
    fundSize: '100M EUR',
    investmentPeriod: '2025-2028',
    platformSlug: 'private-equity',
  },
  {
    name: { 'it-IT': 'Sinergia Venture Fund', 'en-US': 'Sinergia Venture Fund' },
    slug: 'sinergia-venture-fund',
    description: {
      'it-IT': 'Sinergia Venture Fund e un fondo di venture capital focalizzato su investimenti in startup e scaleup tecnologiche innovative nelle fasi Series A e Series B. Istituito nel primo trimestre del 2020, il fondo ha effettuato il primo closing a gennaio 2021, raccogliendo 30 milioni di euro. Il fondo predilige aziende con modelli di business scalabili, principalmente nei settori B2B o B2E, con focus su tecnologie come AI, IoT, Cloud, robotica e blockchain.',
      'en-US': 'Sinergia Venture Fund is a venture capital fund focused on investments in innovative technology startups and scale-ups at Series A and Series B stages. Established in Q1 2020, the fund completed its first closing in January 2021, raising EUR 30 million. The fund favors companies with scalable business models, primarily in B2B or B2E sectors, with a focus on technologies such as AI, IoT, Cloud, robotics, and blockchain.',
    },
    strategy: 'Venture Capital',
    status: 'Active',
    fundSize: '65M EUR',
    investmentPeriod: '2021-2025',
    platformSlug: 'venture-capital',
  },
  {
    name: { 'it-IT': 'Fondo PIPE', 'en-US': 'PIPE Fund' },
    slug: 'fondo-pipe',
    description: {
      'it-IT': 'Il fondo **PIPE** (Private Investment in Public Equity) e un fondo chiuso riservato, lanciato da Alkemia in collaborazione con Amber Capital Italia SGR nel novembre del 2023. Il fondo si focalizza su investimenti in aziende quotate con capitalizzazioni comprese tra i 50 ed i 500 milioni di euro, operanti in settori ad alto tasso di innovazione (telco, media, technology, energy-tech). L\'obiettivo e fornire capitale strategico per favorire l\'espansione e le operazioni di consolidamento.',
      'en-US': 'The **PIPE** (Private Investment in Public Equity) fund is a closed-end reserved fund, launched by Alkemia in collaboration with Amber Capital Italia SGR in November 2023. The fund focuses on investments in listed companies with market capitalizations between EUR 50 and 500 million, operating in high-innovation sectors (telco, media, technology, energy-tech). The objective is to provide strategic capital to support expansion and consolidation operations.',
    },
    strategy: 'PIPE',
    status: 'Active',
    fundSize: '100M EUR',
    investmentPeriod: '2024-2027',
    platformSlug: 'pipe',
  },
]
