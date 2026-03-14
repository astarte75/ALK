/**
 * Static page data for Contentful migration.
 * 5 pages with IT + EN content from alkemiacapital-site.md.
 */

export interface PageData {
  title: { 'it-IT': string; 'en-US': string }
  slug: string
  body: { 'it-IT': string; 'en-US': string }
  sections?: Record<string, unknown>
}

export const pages: PageData[] = [
  {
    title: { 'it-IT': 'Societa', 'en-US': 'Company' },
    slug: 'societa',
    body: {
      'it-IT': `## Chi Siamo

## Alkemia SGR S.p.A.

Alkemia SGR S.p.A. e una societa di gestione del risparmio specializzata nella creazione di valore sostenibile attraverso investimenti strategici in aziende con un forte potenziale di sviluppo.

Con oltre 12 anni di esperienza nel settore, Alkemia si distingue per la sua capacita di identificare e sviluppare opportunita di investimento che generano benefici duraturi per investitori, comunita locali e ambiente.

## Storia

### Fondazione (2005)

Fondata nel 2005, Alkemia ha gestito due fondi di Private Equity e un fondo Mezzanine, con un patrimonio gestito (AUM) di 270 milioni di euro, completando 19 operazioni di Private Equity e 10 investimenti Mezzanine.

### Carve-out (2017)

Nel dicembre 2017, Alkemia ha finalizzato un'importante operazione di carve-out con la creazione di un nuovo fondo da 40 milioni di euro.

### ALKEMIA SGR (2018)

Nel 2018, la societa ha cambiato nome in Alkemia SGR, riflettendo la nuova direzione strategica.

### Venture Capital (2023)

Nel 2023, Alkemia ha ampliato il proprio orizzonte di investimento con l'apertura al venture capital e il lancio di nuovi fondi tematici e PIPE.

### Nuova governance (2024)

Il 2024 vede l'ingresso di nuovi equity partner e l'arricchimento del board con nuovi consiglieri indipendenti.

## Mission

La missione di Alkemia e quella di diventare un **leader** di riferimento nel **mercato italiano** del **Lower-Mid Market**, supportando le piccole e medie imprese attraverso un'offerta completa di asset di investimento alternativi.

Alkemia si impegna a sostenere progetti di crescita sostenibile e a creare valore costante, mantenendo un forte legame con il territorio e perseguendo una logica di beneficio reciproco.

## Il Nostro Approccio

Alkemia adotta un approccio distintivo che combina presenza attiva sul territorio, profonda conoscenza dei settori nei quali investe e un network consolidato di relazioni con imprenditori e professionisti.

Grazie a un **deal flow proprietario**, Alkemia ha accesso privilegiato a opportunita di investimento di alto valore, operando come un **partner strategico** per le aziende in portafoglio.

## Valori

La governance di Alkemia e basata su principi di **trasparenza**, **integrita** e **responsabilita**.

Il nostro team di gestione, composto da professionisti con anni di esperienza nei settori del private equity, venture capital, finanza aziendale e gestione diretta di importanti societa, supporta le aziende nelle quali investiamo con una visione chiara e una dedizione costante all'eccellenza.

Alkemia integra criteri **ESG** (Environmental, Social, Governance) in tutte le sue decisioni di investimento, promuovendo pratiche sostenibili che contribuiscono positivamente all'ambiente e alla societa.`,
      'en-US': `## Who We Are

## Alkemia SGR S.p.A.

Alkemia SGR S.p.A. is an asset management company specialized in creating sustainable value through strategic investments in companies with strong strong growth potential.

With over 12 years of experience in the industry, Alkemia distinguishes itself by its ability to identify and cultivate investment opportunities that deliver long-term value for investors, local communities, and the environment.

## Our History

### Foundation (2005)

Founded in 2005, Alkemia has managed two Private Equity funds and one Mezzanine fund, with assets under management (AUM) of EUR 270 million, completing 19 Private Equity transactions and 10 Mezzanine investments.

### Carve-out (2017)

In December 2017, Alkemia completed a significant carve-out transaction with the creation of a new EUR 40 million fund.

### ALKEMIA SGR (2018)

In 2018, the company changed its name to Alkemia SGR, reflecting its new strategic direction.

### Venture Capital (2023)

In 2023, Alkemia expanded its investment horizon by entering the venture capital space and launching new thematic and PIPE funds.

### New Governance (2024)

In 2024, the company welcomes new equity partners and strengthens its board with the addition of new independent advisors.

## Mission

Alkemia's mission is to become a leading player in the Italian Lower-Mid Market, supporting small and medium-sized enterprises through a comprehensive offering of alternative investment assets.

Alkemia is committed to supporting sustainable growth projects and creating consistent value, maintaining a strong connection with the local community and pursuing a logic of mutual benefit.

## Our Approach

Alkemia adopts a distinctive approach that combines an active presence in the local market, deep industry knowledge in its areas of investment and a strong network of relationships with entrepreneurs and professionals.

Thanks to a **proprietary deal flow**, Alkemia has privileged access to high-value investment opportunities, acting as a **strategic partner** for portfolio companies.

## Our Values

Alkemia's governance is based on principles of **transparency**, **integrity**, and **accountability**.

Our management team, composed of professionals with years of experience in private equity, venture capital, corporate finance, and the direct management of leading companies, supports the businesses in which we invest with a clear vision and a constant dedication to excellence.

Alkemia integrates **ESG** (Environmental, Social, Governance) criteria into all its investment decisions, promoting sustainable practices that positively contribute to the environment and to the society.`,
    },
  },
  {
    title: { 'it-IT': 'Corporate Governance', 'en-US': 'Corporate Governance' },
    slug: 'corporate-governance',
    body: {
      'it-IT': `## Azionariato

Alkemia SGR S.p.A. e un operatore indipendente. I partner detengono tramite propri veicoli la totalita del capitale della SGR.

## Consiglio di Amministrazione

Il Consiglio di Amministrazione di Alkemia e composto da professionisti di alto profilo con una vasta esperienza nei settori del private equity, venture capital e finanza aziendale. Il CdA e responsabile della definizione delle strategie aziendali e della supervisione delle operazioni societarie.

Su 7 consiglieri, 3 sono **indipendenti**, tra cui il Presidente del CdA.

## Collegio Sindacale

Il Collegio Sindacale svolge una funzione di vigilanza e controllo, assicurando la conformita delle attivita aziendali alle normative e la correttezza della gestione economico-finanziaria.

## Funzioni di Controllo

Alkemia Capital SGR adotta un modello di controllo interno rigoroso, volto a garantire la conformita con gli standard regolamentari e la mitigazione dei rischi operativi.`,
      'en-US': `## Shareholding

Alkemia SGR S.p.A. is an independent operator. The partners fully own the SGR's capital through their respective vehicles.

## Board of Directors

The Board of Directors of Alkemia is composed of high-profile professionals with extensive experience in private equity, venture capital, and corporate finance. The Board is responsible for defining the company's strategies and overseeing corporate operations.

Out of 7 directors, 3 are **independent**, including the Chairman of the Board.

## Board of Statutory Auditors

The Board of Statutory Auditors performs a supervisory and control function, ensuring compliance with regulations and the accuracy of the company's economic and financial management.

## Control Functions

Alkemia Capital SGR adopts a rigorous internal control model, designed to ensure compliance with regulatory standards and effectively mitigate operational risks.`,
    },
    sections: {
      boardMembers: [
        { name: 'Prof. Avv. Paolo Benazzo', role: 'Presidente (Indipendente)', roleEn: 'Chairman (Independent)' },
        { name: 'Luca Duranti', role: 'Amministratore Delegato (CEO)', roleEn: 'Chief Executive Officer (CEO)' },
        { name: 'Robert Segatto', role: 'Consigliere', roleEn: 'Director' },
        { name: 'Simone Cremonini', role: 'Consigliere Delegato', roleEn: 'Executive Director' },
        { name: 'Giacomo Picchetto', role: 'Consigliere Delegato', roleEn: 'Executive Director' },
        { name: 'Sara Bertolini', role: 'Consigliere Indipendente', roleEn: 'Independent Director' },
        { name: 'Giorgio Ventura', role: 'Consigliere Indipendente', roleEn: 'Independent Director' },
      ],
      auditors: [
        { name: 'Carlo Tavormina', role: 'Presidente', roleEn: 'Chairman' },
        { name: 'Chiara Segala', role: 'Sindaco Effettivo', roleEn: 'Statutory Auditor' },
        { name: 'Daniele Bernardi', role: 'Sindaco Effettivo', roleEn: 'Statutory Auditor' },
      ],
      controlFunctions: [
        { name: 'PWC', role: 'Audit Firm' },
        { name: 'Francesco Marinelli', role: 'Compliance', detail: 'Comply Consulting S.r.l.' },
        { name: 'Prof. Avv. Paolo Benazzo', role: 'Anti-Money Laundering (AML)', detail: 'con esternalizzazione operativa a Comply Consulting' },
        { name: 'Angelo Bugane', role: 'Risk Management' },
        { name: 'Fabio Di Rosa', role: 'Internal Audit', detail: 'Regulatory Consulting S.r.l.' },
      ],
    },
  },
  {
    title: { 'it-IT': 'Sostenibilita', 'en-US': 'Sustainability' },
    slug: 'sostenibilita',
    body: {
      'it-IT': `## Integrare principi ambientali, sociali e di governance (ESG) nel processo di investimento

Alkemia Capital SGR S.p.A. riconosce l'importanza di integrare principi ambientali, sociali e di governance (ESG) nel processo di investimento, sebbene non abbia ancora formalmente aderito ai Principi per l'Investimento Responsabile (PRI) delle Nazioni Unite. Alkemia ha gia elaborato e adottato una **propria policy ESG**, con l'obiettivo di promuovere pratiche sostenibili.

## Il Nostro Impegno verso la Sostenibilita

Abbiamo sviluppato una policy ESG che guida le nostre decisioni di investimento e ci impegniamo a implementare queste pratiche nei nostri processi operativi. Crediamo che l'adozione di criteri ESG sia cruciale per creare valore duraturo non solo per i nostri investitori, ma anche per la societa nel suo insieme.

## Ambiente

Il nostro approccio alla sostenibilita si concentra sull'identificazione di opportunita di investimento che possano contribuire positivamente all'ambiente, alla societa e alla governance aziendale.

## Sociale

Sosteniamo il benessere delle persone e delle comunita locali, favorendo pratiche di lavoro equo e inclusione.

## Governance

Manteniamo alti standard di trasparenza e responsabilita nelle nostre operazioni e nelle aziende in cui investiamo.

## Sviluppo Futuro

Alkemia e impegnata a formalizzare il proprio impegno verso la sostenibilita. A partire dalla prima meta del 2025, prevediamo di aderire ufficialmente ai Principi per l'Investimento Responsabile (PRI) delle Nazioni Unite.`,
      'en-US': `## Integrating Environmental, Social, and Governance (ESG) Principles into the Investment Process

Alkemia Capital SGR S.p.A. recognizes the importance of integrating environmental, social, and governance (ESG) principles into the investment process, although it has not yet formally adhered to the United Nations Principles for Responsible Investment (PRI). Alkemia has already developed and adopted its **own ESG policy**, with the goal of promoting sustainable practices.

## Our Commitment to Sustainability

We have developed an ESG policy that guides our investment decisions and we are committed to implementing these practices in our operational processes. We believe that adopting ESG criteria is crucial to creating lasting value not only for our investors, but also for society as a whole.

## Environment

Our approach to sustainability focuses on identifying investment opportunities that can positively contribute to the environment, society, and corporate governance.

## Social

We support the well-being of people and local communities, promoting fair labor practices and inclusion.

## Governance

We maintain high standards of transparency and accountability in our operations and in the companies in which we invest.

## Future Development

Alkemia is committed to formalizing its commitment to sustainability. Starting in the first half of 2025, we plan to officially adhere to the United Nations Principles for Responsible Investment (PRI).`,
    },
  },
  {
    title: { 'it-IT': 'Contatti', 'en-US': 'Contact Us' },
    slug: 'contatti',
    body: {
      'it-IT': `## Le nostre sedi

Alkemia SGR S.p.A. opera da due sedi strategiche nel nord Italia, garantendo una presenza capillare sul territorio.

Per informazioni su investimenti, opportunita o richieste generali, non esitate a contattarci.`,
      'en-US': `## Our Offices

Alkemia SGR S.p.A. operates from two strategic offices in northern Italy, ensuring a strong local presence.

For information about investments, opportunities, or general inquiries, please do not hesitate to contact us.`,
    },
  },
  {
    title: { 'it-IT': 'Culture', 'en-US': 'Culture' },
    slug: 'culture',
    body: {
      'it-IT': `## La nostra cultura

In Alkemia crediamo che il capitale umano sia il motore del valore. Il nostro team e formato da professionisti con esperienze complementari nel private equity, venture capital, finanza aziendale e gestione diretta di importanti societa.

## Valori fondamentali

- **Eccellenza**: perseguiamo i piu alti standard in ogni attivita
- **Integrita**: operiamo con trasparenza e responsabilita
- **Collaborazione**: lavoriamo come un team coeso per raggiungere risultati straordinari
- **Innovazione**: abbracciamo il cambiamento e le nuove opportunita
- **Sostenibilita**: integriamo criteri ESG in tutte le nostre decisioni

## Il nostro approccio al lavoro

Una squadra composita e affiatata per accompagnare la crescita delle aziende partecipate e creare valore sostenibile nel lungo termine.`,
      'en-US': `## Our Culture

At Alkemia, we believe that human capital is the engine of value. Our team is composed of professionals with complementary experience in private equity, venture capital, corporate finance, and direct management of leading companies.

## Core Values

- **Excellence**: we pursue the highest standards in every activity
- **Integrity**: we operate with transparency and accountability
- **Collaboration**: we work as a cohesive team to achieve extraordinary results
- **Innovation**: we embrace change and new opportunities
- **Sustainability**: we integrate ESG criteria into all our decisions

## Our Approach to Work

A diverse and close-knit team to support the growth of portfolio companies and create sustainable value over the long term.`,
    },
  },
]
