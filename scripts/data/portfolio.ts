/**
 * Portfolio company data for Contentful migration.
 * 18 companies extracted from alkemiacapital-site.md with IT + EN content.
 */

export interface PortfolioCompanyData {
  name: { 'it-IT': string; 'en-US': string }
  slug: string
  shortDescription: { 'it-IT': string; 'en-US': string }
  description?: { 'it-IT': string; 'en-US': string }
  sector: string
  investmentType: string
  year: number
  logoUrl: string
  website: string
  featured: boolean
  sortOrder: number
}

export const portfolioCompanies: PortfolioCompanyData[] = [
  {
    name: { 'it-IT': 'Agricooltur', 'en-US': 'Agricooltur' },
    slug: 'agricooltur',
    shortDescription: {
      'it-IT': 'Innovazione aeroponica per un\'agricoltura sostenibile e senza suolo',
      'en-US': 'Pioneering aeroponic innovation for sustainable, soil-free agriculture',
    },
    description: {
      'it-IT': '**Agricooltur** e una startup italiana fondata nel 2018, specializzata nella progettazione e sviluppo di sistemi per la **coltivazione aeroponica**, una tecnica innovativa che permette di coltivare piante senza l\'uso del suolo, in un ambiente controllato. Questo metodo consente un risparmio idrico fino al 98% rispetto alle tecniche tradizionali e riduce significativamente l\'uso di fertilizzanti. L\'azienda offre soluzioni modulari per diverse esigenze, collaborando con partner come Carrefour per introdurre prodotti aeroponici nella grande distribuzione.\n\nNel febbraio 2023, Agricooltur ha concluso un round di investimento Serie A da **5 milioni di euro**, guidato da **Sinergia Venture Fund** come lead investor. Questo finanziamento mira a supportare la crescita dell\'azienda, ampliando la sua presenza sia a livello nazionale che internazionale.',
      'en-US': '**Agricooltur** is an Italian startup founded in 2018, specializing in the design and development of **aeroponic cultivation** systems, an innovative technique that enables soil-free plant growth in a controlled environment. This method saves up to 98% of water compared to traditional techniques and significantly reduces fertilizer usage. The company offers modular solutions for diverse needs, partnering with retailers like Carrefour to bring aeroponic products to mass distribution.\n\nIn February 2023, Agricooltur closed a Series A investment round of **EUR 5 million**, led by **Sinergia Venture Fund** as lead investor. This funding supports the company\'s growth, expanding its presence both nationally and internationally.',
    },
    sector: 'Agri-tech',
    investmentType: 'Venture Capital',
    year: 2023,
    logoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/02/Agricooltur_logo.png',
    website: 'https://www.agricooltur.it/',
    featured: false,
    sortOrder: 1,
  },
  {
    name: { 'it-IT': 'Casta Diva Group', 'en-US': 'Casta Diva Group' },
    slug: 'casta-diva-group',
    shortDescription: {
      'it-IT': 'Multinazionale italiana leader nella comunicazione e nella produzione di eventi e contenuti digitali',
      'en-US': 'Italian multinational leader in communications, event production, and digital content',
    },
    description: {
      'it-IT': 'Casta Diva Group e una multinazionale italiana specializzata nel settore della comunicazione, nella produzione di film pubblicitari, contenuti digitali ed eventi dal vivo. Fondata nel 2005, ha ampliato la sua presenza a livello globale, operando in quattro continenti con sedi in 15 citta, consolidando la sua posizione nel settore. La societa e quotata sul mercato Euronext Growth Milan di Borsa Italiana.\n\nNel novembre 2025, il fondo PIPE gestito da Alkemia Capital ha acquisito una partecipazione del 10,07% in Casta Diva Group, seguita dall\'acquisizione del ramo eventi di Prodea Group S.p.A. nel gennaio 2026.',
      'en-US': 'Casta Diva Group is an Italian multinational specializing in communications, advertising film production, digital content, and live events. Founded in 2005, it has expanded its presence globally, operating across four continents with offices in 15 cities. The company is listed on Euronext Growth Milan.\n\nIn November 2025, the PIPE fund managed by Alkemia Capital acquired a 10.07% stake in Casta Diva Group, followed by the acquisition of Prodea Group S.p.A.\'s events division in January 2026.',
    },
    sector: 'Digital Services',
    investmentType: 'PIPE',
    year: 2026,
    logoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2026/03/casta-diva-group-logo.jpg',
    website: 'https://www.castadivagroup.com/',
    featured: false,
    sortOrder: 2,
  },
  {
    name: { 'it-IT': 'Circle Group', 'en-US': 'Circle Group' },
    slug: 'circle-group',
    shortDescription: {
      'it-IT': 'Multinazionale specializzata nella digitalizzazione dei processi portuali e della logistica intermodale',
      'en-US': 'Multinational specializing in the digitalization of port processes and intermodal logistics',
    },
    sector: 'ICT',
    investmentType: 'PIPE',
    year: 2026,
    logoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2026/03/logo-color-x2.webp',
    website: '',
    featured: false,
    sortOrder: 3,
  },
  {
    name: { 'it-IT': 'Codemotion', 'en-US': 'Codemotion' },
    slug: 'codemotion',
    shortDescription: {
      'it-IT': 'La piattaforma che connette, forma e ispira la piu grande community di sviluppatori in Europa',
      'en-US': 'A platform connecting, educating, and inspiring Europe\'s largest developer community',
    },
    description: {
      'it-IT': '**Codemotion** e una piattaforma digitale che supporta la piu grande **community di sviluppatori** in Europa, con oltre 250.000 professionisti attivi. Offre contenuti ed eventi di aggiornamento e formazione, opportunita di carriera e networking, e una rete di oltre 300 aziende e startup interessate ad assumere talenti tech.\n\nNel febbraio 2023, Codemotion ha concluso un round di investimento da **8 milioni di euro**, guidato da **Sinergia Venture Fund**, con la partecipazione di partner italiani e internazionali. L\'investimento consente a Codemotion di potenziare lo sviluppo della piattaforma e proseguire nel suo percorso di crescita.',
      'en-US': '**Codemotion** is a digital platform supporting Europe\'s largest **developer community**, with over 250,000 active professionals. It offers training content and events, career opportunities, networking, and a network of over 300 companies and startups seeking tech talent.\n\nIn February 2023, Codemotion closed an **EUR 8 million** investment round led by **Sinergia Venture Fund**, with participation from Italian and international partners. The investment enables Codemotion to strengthen platform development and continue its growth trajectory.',
    },
    sector: 'ICT',
    investmentType: 'Venture Capital',
    year: 2023,
    logoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/02/codemotion-logo-blu-orange.png',
    website: 'https://www.codemotion.com/',
    featured: false,
    sortOrder: 4,
  },
  {
    name: { 'it-IT': 'Contents', 'en-US': 'Contents' },
    slug: 'contents',
    shortDescription: {
      'it-IT': 'Piattaforma SaaS B2B per la creazione di contenuti multilingua e multiformato',
      'en-US': 'A B2B SaaS platform for creating multilingual, multi-format content for enterprises',
    },
    description: {
      'it-IT': '**Contents.com** e una piattaforma **SaaS** che utilizza l\'**intelligenza artificiale** per orchestrare la creazione e gestione di **contenuti multilingua** per medie e grandi aziende. Fondata nel 2020, ha rapidamente ampliato la propria presenza internazionale, servendo clienti in Europa, America Latina, Nord America e Asia.\n\nNel marzo 2021, ha chiuso un round di investimento Series A da **5 milioni di euro**, guidato da **Sinergia Venture Fund**. Nel gennaio 2024, Contents.com ha raccolto ulteriori **16 milioni di dollari** in un round Serie B guidato da Sinergia Venture Fund e Thomson Reuters Ventures.',
      'en-US': '**Contents.com** is a **SaaS** platform leveraging **artificial intelligence** to orchestrate the creation and management of **multilingual content** for medium and large enterprises. Founded in 2020, it has rapidly expanded its international footprint, serving clients across Europe, Latin America, North America, and Asia.\n\nIn March 2021, it closed a Series A round of **EUR 5 million** led by **Sinergia Venture Fund**. In January 2024, Contents.com raised an additional **USD 16 million** in a Series B round led by Sinergia Venture Fund and Thomson Reuters Ventures.',
    },
    sector: 'ICT',
    investmentType: 'Venture Capital',
    year: 2021,
    logoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2024/12/contents-logo.png',
    website: 'https://www.contents.com/',
    featured: true,
    sortOrder: 5,
  },
  {
    name: { 'it-IT': 'Convivio', 'en-US': 'Convivio' },
    slug: 'convivio',
    shortDescription: {
      'it-IT': 'Polo industriale di riferimento nel settore della pasta fresca e dei piatti pronti di alta qualita',
      'en-US': 'Leading industrial hub in premium fresh pasta and ready meals',
    },
    description: {
      'it-IT': 'Alkemia Capital, tramite il fondo **Alkemia Food Excellence I**, ha promosso la nascita di **Convivio**, una nuova holding operativa italiana. L\'obiettivo e creare un polo di riferimento nel settore della pasta fresca e della gastronomia premium, consolidando le migliori realta produttive del Made in Italy.\n\nIn questa prima fase, Alkemia ha acquisito il 100% di cinque aziende d\'eccellenza regionale: Valsugana Sapori, Parmachef, Casanova Food, Pastificio Cecchin e Poggiolini, che insieme generano circa 27 milioni di euro di fatturato.',
      'en-US': 'Through its **Alkemia Food Excellence I** fund, Alkemia Capital created **Convivio**, a new Italian operating holding company. The goal is to establish a leading hub in the premium fresh pasta and gastronomy sector, consolidating the finest Made in Italy producers.\n\nIn this initial phase, Alkemia acquired 100% of five regional centers of excellence: Valsugana Sapori, Parmachef, Casanova Food, Pastificio Cecchin, and Poggiolini, which together generate approximately EUR 27 million in revenue.',
    },
    sector: 'Food & Beverage',
    investmentType: 'Private Equity',
    year: 2025,
    logoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/09/S3726_CONVIVIO_LOGO_IT-1.jpg',
    website: '',
    featured: true,
    sortOrder: 6,
  },
  {
    name: { 'it-IT': 'DHH', 'en-US': 'DHH' },
    slug: 'dhh',
    shortDescription: {
      'it-IT': 'Soluzioni di cloud computing e hosting per il mercato europeo',
      'en-US': 'Pan-European cloud infrastructure and hosting provider',
    },
    description: {
      'it-IT': '**DHH S.p.A.** (Dominion Hosting Holding) e una societa italiana specializzata nella fornitura di servizi di **cloud computing** e **hosting** per il mercato europeo. Fondata nel 2015, ha ampliato la sua presenza attraverso acquisizioni strategiche in Italia, Slovenia, Croazia, Serbia e Svizzera. La societa e quotata sul mercato Euronext Growth Milan.\n\nNel maggio 2024, il fondo **PIPE** gestito da **Alkemia SGR**, in collaborazione con **Amber Capital Italia SGR**, ha acquisito una partecipazione del 4,73% in DHH.',
      'en-US': '**DHH S.p.A.** (Dominion Hosting Holding) is an Italian company specializing in **cloud computing** and **hosting** services for the European market. Founded in 2015, it has expanded through strategic acquisitions in Italy, Slovenia, Croatia, Serbia, and Switzerland. The company is listed on Euronext Growth Milan.\n\nIn May 2024, the **PIPE** fund managed by **Alkemia SGR**, in collaboration with **Amber Capital Italia SGR**, acquired a 4.73% stake in DHH.',
    },
    sector: 'ICT',
    investmentType: 'PIPE',
    year: 2024,
    logoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2024/12/DHH_logo.webp',
    website: 'https://www.dhh.international/',
    featured: false,
    sortOrder: 7,
  },
  {
    name: { 'it-IT': 'Ermes Browser Security', 'en-US': 'Ermes Browser Security' },
    slug: 'ermes-browser-security',
    shortDescription: {
      'it-IT': 'Protezione avanzata dei dispositivi aziendali contro le minacce informatiche',
      'en-US': 'Advanced protection for enterprise devices against cyber threats',
    },
    description: {
      'it-IT': 'Ermes Cyber Security, fondata nel 2018 come spin-off del Politecnico di Torino, e una scale-up italiana specializzata nella protezione della navigazione web aziendale attraverso soluzioni basate su **intelligenza artificiale**. Nel giugno 2023, ha chiuso la prima tranche di un round di investimento Series A, raccogliendo 3,0 milioni di euro con **Sinergia Venture Fund** come lead investor.\n\nErmes e l\'unica realta italiana selezionata da **Gartner** nella top 100 delle organizzazioni che utilizzano l\'intelligenza artificiale per difendersi dagli attacchi informatici. La sua tecnologia protegge oltre 30.000 utenti ed e adottata da clienti come KPMG, Carrefour e Reale Mutua.',
      'en-US': 'Ermes Cyber Security, founded in 2018 as a spin-off of Politecnico di Torino, is an Italian scale-up specializing in enterprise web browsing protection through **AI-based** solutions. In June 2023, it closed the first tranche of a Series A investment round, raising EUR 3.0 million with **Sinergia Venture Fund** as lead investor.\n\nErmes is the only Italian company selected by **Gartner** in the top 100 organizations using artificial intelligence for cyber defense. Its technology protects over 30,000 users and is adopted by clients such as KPMG, Carrefour, and Reale Mutua.',
    },
    sector: 'Cybersecurity',
    investmentType: 'Venture Capital',
    year: 2023,
    logoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2024/10/ermes-logo-1.png',
    website: 'https://www.ermes.company/',
    featured: true,
    sortOrder: 8,
  },
  {
    name: { 'it-IT': 'Glickon', 'en-US': 'Glickon' },
    slug: 'glickon',
    shortDescription: {
      'it-IT': 'Piattaforma di data intelligence per talent acquisition, employee engagement e organizational network analysis',
      'en-US': 'AI-powered Talent Intelligence platform transforming employee and candidate feedback into actionable insights',
    },
    description: {
      'it-IT': '**Glickon** e una piattaforma di **data intelligence** che combina **intelligenza artificiale** e l\'analisi dei dati per ottimizzare i processi di **talent acquisition**, **employee engagement** e **organizational network analysis**. Fondata nel 2014, ha sviluppato soluzioni innovative per migliorare l\'esperienza dei candidati e dei dipendenti.\n\nNel maggio 2022, Glickon ha annunciato un round di investimento Series A con **3 milioni di euro** sottoscritti da **Sinergia Venture Fund** come lead investor. Nell\'aprile 2023, Glickon ha acquisito **Teamsight**, una startup italiana specializzata in people analytics.',
      'en-US': '**Glickon** is a **data intelligence** platform combining **artificial intelligence** and data analytics to optimize **talent acquisition**, **employee engagement**, and **organizational network analysis** processes. Founded in 2014, it has developed innovative solutions to enhance candidate and employee experience.\n\nIn May 2022, Glickon announced a Series A investment round with **EUR 3 million** subscribed by **Sinergia Venture Fund** as lead investor. In April 2023, Glickon acquired **Teamsight**, an Italian startup specializing in people analytics.',
    },
    sector: 'HR Tech',
    investmentType: 'Venture Capital',
    year: 2022,
    logoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2024/12/glickon_logo.png',
    website: 'https://it.glickon.com/',
    featured: false,
    sortOrder: 9,
  },
  {
    name: { 'it-IT': 'Hlpy', 'en-US': 'Hlpy' },
    slug: 'hlpy',
    shortDescription: {
      'it-IT': 'Innovazione nell\'assistenza stradale con soluzioni digitali avanzate',
      'en-US': 'Digital innovation in roadside assistance with advanced solutions',
    },
    sector: 'Mobility',
    investmentType: 'Venture Capital',
    year: 2022,
    logoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2024/10/hlpy-logo-1.png',
    website: 'https://hlpy.co',
    featured: false,
    sortOrder: 10,
  },
  {
    name: { 'it-IT': 'Izertis S.A.', 'en-US': 'Izertis S.A.' },
    slug: 'izertis',
    shortDescription: {
      'it-IT': 'Societa multinazionale di consulenza tecnologica, specializzata nella trasformazione digitale',
      'en-US': 'Multinational technology consulting firm specializing in digital transformation',
    },
    sector: 'ICT',
    investmentType: 'PIPE',
    year: 2026,
    logoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2026/03/Logo-izertis.png',
    website: '',
    featured: false,
    sortOrder: 11,
  },
  {
    name: { 'it-IT': 'Pakelo Motor Oil', 'en-US': 'Pakelo Motor Oil' },
    slug: 'pakelo-motor-oil',
    shortDescription: {
      'it-IT': 'Azienda italiana leader nel settore dei lubrificanti ad alte prestazioni',
      'en-US': 'Italian leader in high-performance lubricants',
    },
    sector: 'Other',
    investmentType: 'Private Equity',
    year: 2023,
    logoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/02/PAKELO-logo.png',
    website: '',
    featured: false,
    sortOrder: 12,
  },
  {
    name: { 'it-IT': 'Redelfi Energy', 'en-US': 'Redelfi Energy' },
    slug: 'redelfi-energy',
    shortDescription: {
      'it-IT': 'Sviluppatore di sistemi di accumulo di energia elettrica a batteria (BESS)',
      'en-US': 'Developer of Battery Energy Storage Systems (BESS)',
    },
    sector: 'Other',
    investmentType: 'PIPE',
    year: 2025,
    logoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/05/redelfi_page-0001-e1747297922314.jpg',
    website: '',
    featured: false,
    sortOrder: 13,
  },
  {
    name: { 'it-IT': 'Soplaya', 'en-US': 'Soplaya' },
    slug: 'soplaya',
    shortDescription: {
      'it-IT': 'Marketplace B2B che connette direttamente chef e ristoratori con produttori locali',
      'en-US': 'B2B marketplace connecting chefs and restaurants directly with local producers',
    },
    sector: 'Food & Beverage',
    investmentType: 'Venture Capital',
    year: 2023,
    logoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/02/logo-rosso-1024x263-soplaya.png',
    website: '',
    featured: false,
    sortOrder: 14,
  },
  {
    name: { 'it-IT': 'Sys-Dat', 'en-US': 'Sys-Dat' },
    slug: 'sys-dat',
    shortDescription: {
      'it-IT': 'Leader nell\'ICT con soluzioni software verticali per la gestione aziendale',
      'en-US': 'ICT leader with vertical software solutions for enterprise management',
    },
    sector: 'ICT',
    investmentType: 'PIPE',
    year: 2024,
    logoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2024/10/sys-dat-group-logo-1.png',
    website: '',
    featured: false,
    sortOrder: 15,
  },
  {
    name: { 'it-IT': 'Tecno Group', 'en-US': 'Tecno Group' },
    slug: 'tecno-group',
    shortDescription: {
      'it-IT': 'Piattaforme proprietarie e consulenza strategica per digitalizzazione, compliance ESG e innovazione sostenibile',
      'en-US': 'Proprietary platforms and strategic consulting for digitalization, ESG compliance, and sustainable innovation',
    },
    sector: 'Digital Services',
    investmentType: 'PIPE',
    year: 2025,
    logoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/09/206ded1d-17b7-4ce7-88a1-25a9364c2984.png',
    website: '',
    featured: false,
    sortOrder: 16,
  },
  {
    name: { 'it-IT': 'TXT eSolutions', 'en-US': 'TXT eSolutions' },
    slug: 'txt-esolutions',
    shortDescription: {
      'it-IT': 'Soluzioni software enterprise',
      'en-US': 'Enterprise software solutions',
    },
    sector: 'ICT',
    investmentType: 'PIPE',
    year: 2023,
    logoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2025/02/Logo-TXT_colore_RGB-scaled-1.webp',
    website: '',
    featured: false,
    sortOrder: 17,
  },
  {
    name: { 'it-IT': '4Gift', 'en-US': '4Gift' },
    slug: '4gift',
    shortDescription: {
      'it-IT': 'Piattaforma tecnologica per inviare regali in modo innovativo dagli e-commerce dei brand partner',
      'en-US': 'Tech platform enabling innovative gift-sending directly from partner brand e-commerce stores',
    },
    description: {
      'it-IT': '4Gift e una piattaforma tecnologica che consente agli utenti di inviare regali in modo innovativo e personalizzato direttamente dagli e-commerce dei brand partner. Fondata nel 2015, ha attirato l\'interesse di grandi player digitali, tra cui **eBay**, che nel 2016 ha acquisito una partecipazione del 10%.\n\nNel dicembre 2021, 4Gift ha chiuso un round di investimento Serie A guidato da **Sinergia Venture Fund** per potenziare il team ed accelerare il percorso di crescita. Attiva dal 2020 sugli e-commerce USA di selezionati brand del lusso, 4Gift risponde all\'esigenza crescente di acquistare online regali, che rappresentano oltre il 40% del mercato globale del lusso.',
      'en-US': '4Gift is a tech platform enabling users to send gifts in an innovative and personalized way directly from partner brand e-commerce stores. Founded in 2015, it attracted the interest of major digital players, including **eBay**, which acquired a 10% stake in 2016.\n\nIn December 2021, 4Gift closed a Series A investment round led by **Sinergia Venture Fund** to strengthen the team and accelerate growth. Active since 2020 on US e-commerce platforms of selected luxury brands, 4Gift addresses the growing demand for online gift purchases, which represent over 40% of the global luxury market.',
    },
    sector: 'Digital Services',
    investmentType: 'Venture Capital',
    year: 2021,
    logoUrl: 'https://www.alkemiacapital.com/wp-content/uploads/2024/12/4Gift_logo.avif',
    website: 'https://www.4gift.com/',
    featured: false,
    sortOrder: 18,
  },
]
